const sequelize = require('../database')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

const User = sequelize.define(
    'user',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        email:{type:DataTypes.STRING, unique:true, allowNull:false},
        password:{type:DataTypes.STRING, allowNull:false},
        role:{type:DataTypes.STRING, defaultValue:'user'},
        img:{type:DataTypes.STRING, allowNull:true},
        name:{type:DataTypes.STRING, allowNull:false},
        lastname:{type:DataTypes.STRING, allowNull:false},
        phone:{type:DataTypes.STRING, allowNull:false, unique:true},
        delivery_info:{type:DataTypes.STRING, allowNull:true}
    }, {
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, 5);
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 5);
                }
            },
        },
    }
)
User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Product = sequelize.define(
    'product',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        name:{type:DataTypes.STRING, unique:true, allowNull:false},
        price:{type:DataTypes.INTEGER, allowNull:false},
        disc_price:{type:DataTypes.INTEGER},
        img:{type:DataTypes.STRING, allowNull:false},
        description:{type:DataTypes.TEXT, allowNull:false},
        quantity:{type:DataTypes.INTEGER, defaultValue:0},
        //category
    }
)
const Post = sequelize.define(
    'post',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        title:{type:DataTypes.STRING, unique:true, allowNull:false},
        preview:{type:DataTypes.STRING, allowNull:false},
        content:{type:DataTypes.TEXT, allowNull:false},
        //data_created
    }
)
const Author = sequelize.define(
    'author',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        name:{type:DataTypes.STRING,allowNull:false},
        lastname:{type:DataTypes.STRING,  allowNull:false},
        occupation:{type:DataTypes.STRING, allowNull:false},
        workplace:{type:DataTypes.STRING, allowNull:false},
        sity:{type:DataTypes.STRING, allowNull:true},
        //data_created
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
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true}
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

const Wishlist = sequelize.define(
    'wishlist',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        //userId
        //productId
    }
)

User.belongsToMany(Product, { through: Wishlist});
Product.belongsToMany(User, { through: Wishlist});

const PostAuthor = sequelize.define('post_author',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
    }
)

Post.belongsToMany(Author, { through: PostAuthor});
Author.belongsToMany(Post, { through: PostAuthor});

const Bookmarks = sequelize.define(
    'bookmarks',
    {
        id:{type:DataTypes.INTEGER, unique:true, primaryKey:true, autoIncrement:true},
        //userId
        //PostId
    }
)

User.belongsToMany(Post, { through: Bookmarks});
Post.belongsToMany(User, { through: Bookmarks});

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
    Category,
    Review,
    ProductFeatures,
    Brand,
    Post,
    Author,
    PostAuthor,
    Wishlist,
    Bookmarks,
    BrandCategory
}

