const Sequelize = require('sequelize')

class Comment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            content : {
                type : Sequelize.TEXT,
                allowNull : false
            },
            authorId : {
                type : Sequelize.UUID,
                allowNull : false
            }
        },{
            sequelize,
            modelName : 'Comment',
            tableName : 'comments',
            timestamps : true,
            paranoid : false,
            underscored : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }

    static associate(db){
        db.Comment.belongsTo(db.Post,{
            foreignKey : 'postId',
            targetKey : 'id',
            onDelete: "cascade"
        })
        db.Comment.belongsTo(db.User,{
            foreignKey : 'authorId',
            targetKey : 'id',
            onDelete: "cascade"
        })
    }
}

module.exports = Comment;