const sequelize = require('../database')
const {DataTypes} = require('sequelize')

const User = sequelize.define(
    'user',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        email:{type:DataTypes.STRING, unique:true},
        password:{type:DataTypes.STRING},
        role:{type:DataTypes.STRING, defaultValue:'user'},
        img:{type:DataTypes.STRING, allowNull:true},
        name:{type:DataTypes.STRING, allowNull:false},
        lastname:{type:DataTypes.STRING, allowNull:false},
        phone:{type:DataTypes.STRING, allowNull:false, unique:true},
        delivery_info:{type:DataTypes.STRING, allowNull:true}
    }
)

const Product = sequelize.define(
    'product',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        name:{type:DataTypes.STRING, unique:true, allowNull:false},
        price:{type:DataTypes.INTEGER, allowNull:false},
        disc_price:{type:DataTypes.INTEGER},
        rating:{type:DataTypes.INTEGER, defaultValue:0},
        img:{type:DataTypes.STRING, allowNull:false},
        description:{type:DataTypes.STRING, allowNull:false},
        quantity:{type:DataTypes.INTEGER, defaultValue:0},
        //category
    }
)

const Category = sequelize.define(
    'category',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        name:{type:DataTypes.STRING, allowNull: false, unique:true},
        parentId:{
            type:DataTypes.INTEGER,
            allowNull: true,
            references: {
            model: 'categories',
            key: 'id',
            },
        },
        level: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
    }
)

const Brand = sequelize.define(
    'brand',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        name:{type:DataTypes.STRING, unique:true}
    }
)
const Cart = sequelize.define(
    'cart',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        total:{type:DataTypes.INTEGER}
        //user_id
    }
)
const CartItem = sequelize.define(
    'cart_item',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        quantity:{type:DataTypes.INTEGER}
        //product_id
        //cart_id
    }
)

const Wishlist = sequelize.define(
    'wishlist',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        //product_id
        //user_id
    }
)

const Review = sequelize.define(
    'review',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        rate:{type:DataTypes.INTEGER, allowNull:false},
        comment:{type:DataTypes.STRING}
        //product_id
        //user_id
    }
)

const ProductFeatures = sequelize.define(
    'product_features',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        name:{type:DataTypes.STRING, allowNull:false},
        description:{type:DataTypes.STRING, allowNull:false}
    }
)

User.hasOne(Cart)
Cart.belongsTo(User)
User.hasOne(Wishlist)
Wishlist.belongsTo(User)
User.hasMany(Review)
Review.belongsTo(User)
Cart.hasMany(CartItem)
CartItem.belongsTo(Cart)
Category.hasMany(Product)
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
Product.belongsTo(Category)
Brand.hasMany(Product)
Product.belongsTo(Brand)
Product.hasMany(Review)
Review.belongsTo(Product)
Product.hasMany(CartItem)
CartItem.belongsTo(Product)
Product.hasMany(ProductFeatures)
ProductFeatures.belongsTo(Product)

const WishlistProduct = sequelize.define('wishlist_product',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
    }
)

Wishlist.belongsToMany(Product, { through: WishlistProduct});
Product.belongsToMany(Wishlist, { through: WishlistProduct});

const BrandCategory = sequelize.define('brand_category',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
    }
)
Brand.belongsToMany(Category, { through: BrandCategory});
Category.belongsToMany(Brand, { through: BrandCategory});

module.exports = {
    User,
    Product,
    Cart,
    CartItem,
    Wishlist,
    Category,
    Review,
    ProductFeatures,
    Brand,
    WishlistProduct,
    BrandCategory
}

