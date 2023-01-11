const Sequelize = require('sequelize')

const mode = process.env.MODE
const config = require('../config/config.json')[mode]

// Models
const User = require('./user')
const Post = require('./post')
const Hashtag = require('./hashtag')
const Comment = require('./comment')
const PostHashtag = require('./post_hashtag')

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
db.PostHashtag = PostHashtag

// Model configuration
User.init(sequelize);
PostHashtag.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Comment.init(sequelize);


User.associate(db);
PostHashtag.associate(db);
Post.associate(db);
Hashtag.associate(db);
Comment.associate(db);


module.exports = db;