const Sequelize = require('sequelize')

const mode = process.env.MODE
const config = require('../config/config.json')[mode]

// Models
const User = require('./user')
const Post = require('./post')
const Hashtag = require('./hashtag')
const Comment = require('./comment')

// Make RDBMS connection pool
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// Model & Sequelize objects 
const db = {}
db.sequelize = sequelize
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag
db.Comment = Comment

// Model configuration
User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Comment.associate(db);

module.exports = db;