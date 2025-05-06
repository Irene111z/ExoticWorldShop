const product_repository = require('../repositories/product_repository')
const uuid = require('uuid')
const path = require('path')
const { Op } = require('sequelize');
const streamifier = require('streamifier');
const { cloudinary } = require('../utils/cloudinary');

function extractPublicId(url) {
    try {
        const parts = url.split('/');
        const fileWithExtension = parts[parts.length - 1];
        const publicId = fileWithExtension.split('.')[0];
        return 'products/' + publicId;
    } catch (e) {
        return null;
    }
}
async function uploadToCloudinary(fileBuffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'products'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
}

class ProductService {

    async createProduct(data, files) {
        const {
            name, price, disc_price, description, quantity, categoryId, brandId, productFeatures
        } = data;

        const finalDiscPrice = disc_price ? Number(disc_price) : null;
        const product = await product_repository.createProduct({
            name, price, disc_price: finalDiscPrice, description, quantity, categoryId, brandId
        });

        if (files?.images) {
            const images = Array.isArray(files.images) ? files.images : [files.images];

            const uploadPromises = images.map((file, index) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const uploadStream = () => {
                            return new Promise((resolve, reject) => {
                                const stream = cloudinary.uploader.upload_stream(
                                    {
                                        folder: 'products',
                                        resource_type: 'image'
                                    },
                                    (error, result) => {
                                        if (error) reject(error);
                                        else resolve(result);
                                    }
                                );
                                streamifier.createReadStream(file.data).pipe(stream);
                            });
                        };

                        const result = await uploadStream();

                        await product_repository.addProductImage({
                            productId: product.id,
                            img: result.secure_url,
                            isPreview: index === Number(data.previewImageIndex)
                        });

                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            });

            await Promise.all(uploadPromises);
        }

        // Додавання характеристик
        if (productFeatures) {
            const features = JSON.parse(productFeatures);
            const featurePromises = features.map(feature =>
                product_repository.addProductFeature({
                    name: feature.name,
                    description: feature.description,
                    productId: product.id
                })
            );

            await Promise.all(featurePromises);
        }

        return product;
    }
    async deleteProduct(id) {
        const product = await product_repository.getProduct(id);
    
        if (!product) {
            throw new Error("Товару не існує");
        }
    
        const images = product.images || [];
    
        // Видаляємо фото з Cloudinary
        const deletePromises = images.map(image => {
            const publicId = extractPublicId(image.img);
            if (publicId) {
                return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            }
            return Promise.resolve();
        });
    
        await Promise.all(deletePromises);
    
        // Видаляємо товар (всередині також видаляються картинки та характеристики)
        await product_repository.deleteProduct(id);
    }
        async getAllProducts(query) {
        const { brandId, categoryId } = query;
        const limit = Number(query.limit) || 12;
        const page = Number(query.page) || 1;
        const offset = page * limit - limit

        let filter = {};
        if (brandId) filter.brandId = brandId

        if (categoryId) {
            const subcategoryIds = await product_repository.getSubcategories(categoryId);
            filter.categoryId = { [Op.in]: [categoryId, ...subcategoryIds] }
        }

        return await product_repository.getAllProducts(filter, limit, offset)
    }
    async getProduct(id) {
        try {
            const product = await product_repository.getProduct(id);  // Викликаємо репозиторій для отримання продукту

            if (!product) {
                throw new Error("Товар не знайдено");
            }

            // Обчислюємо середній рейтинг продукту
            const ratings = product.reviews.map(r => r.rate);
            const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

            return {
                ...product.toJSON(),
                averageRating: parseFloat(avgRating.toFixed(2)),
            };
        } catch (error) {
            throw new Error("Помилка при отриманні продукту: " + error.message);
        }
    }
    async changeProduct(id, data, files) {
        const product = await product_repository.getProduct(id);
        if (!product) throw new Error("Товар не знайдено");

        const {
            oldImages,
            productFeatures,
            previewImageIndex,
            images,
            ...productFields
        } = data;

        await product_repository.updateProductFields(id, productFields);

        if (oldImages) {
            const oldImgs = JSON.parse(oldImages);
            const currentImgs = await product_repository.getProductImages(id);

            for (const img of currentImgs) {
                if (!oldImgs.find(o => o.img === img.img)) {
                    const publicId = extractPublicId(img.img);
                    if (publicId) {
                        try {
                            await cloudinary.uploader.destroy(publicId);
                        } catch (e) {
                            console.warn("Cloudinary delete failed:", publicId);
                        }
                    }
                    await product_repository.deleteProductImage(img.id);
                }
            }

            await product_repository.clearPreviewFlags(id);
            const preview = oldImgs.find(img => img.isPreview);
            if (preview) {
                await product_repository.setPreviewImage(preview.img);
            }
        }

        if (files?.images) {
            const imagesArray = Array.isArray(files.images) ? files.images : [files.images];

            for (let i = 0; i < imagesArray.length; i++) {
                const file = imagesArray[i];
                const uploaded = await uploadToCloudinary(file.data);

                await product_repository.addProductImage({
                    productId: id,
                    img: uploaded.secure_url,
                    isPreview: Number(previewImageIndex) === i
                });
            }
        }

        if (productFeatures) {
            const parsed = JSON.parse(productFeatures);
            await product_repository.replaceProductFeatures(id, parsed);
        }

        return product_repository.getProduct(id);
    }
    async searchProductByName(query) {
        const { name, limit = 12, page = 1 } = query
        const offset = page * limit - limit
        return await product_repository.searchByName(name, limit, offset)

    }
    async getProductReviews(productId) {
        const product = await product_repository.getProductById(productId)
        if (!product) {
            throw new Error("Товар не знайдено")
        }
        return await product_repository.getProductReviews(productId)
    }
    async createProductReview(userId, productId, data) {
        const product = await product_repository.getProductById(productId)
        if (!product) {
            throw new Error("Товар не знайдено")
        }
        const hasReviewed = await product_repository.hasUserReviewedProduct(userId, productId)
        if (hasReviewed) {
            throw new Error("Ви вже залишали відгук для цього товару")
        }
        const { rate, comment } = data
        if (!rate) {
            throw new Error("Оцінка товару обов'язкова для залишення відгуку")
        }
        if (rate > 5 || rate < 1) {
            throw new Error("Оцінка товару обов'язкова (1-5)")
        }
        return await product_repository.createProductReview({ userId, productId, rate, comment })
    }
    async deleteProductReview(userId, reviewId) {
        const review = await product_repository.getReviewById(reviewId)
        if (!review) {
            throw new Error("Відгук не знайдено")
        }
        if (userId !== review.userId) {
            throw new Error("Недостатньо прав для видалення чужого відгуку")
        }
        return await product_repository.deleteProductReview(review)
    }
    async findProductByReviewId(reviewId) {
        return await product_repository.findProductByReviewId(reviewId)
    }
}

module.exports = new ProductService();