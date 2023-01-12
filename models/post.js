const Sequelize = require('sequelize')

class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id : {
                type : Sequelize.UUID,
                primaryKey: true,
                allowNull : false
            },
            title : {
                type : Sequelize.STRING(100),
                allowNull : false
            },
            content : {
                type : Sequelize.TEXT,
                allowNull : false
            },
            createdAt: {
                // Order by time, ASC, DESC를 위해 카멜케이스가 아닌 스네이크 케이스로 필드 정의
                field: 'created_at',
                type: Sequelize.DATE,
                allowNull : false
            },
            updatedAt: {
                field: 'updated_at',
                type: Sequelize.DATE,
                allowNull : false
            },
            type : {
                type : Sequelize.ENUM,
                values : ["free","notice","admin"],
                allowNull : false,
            }
        },{
            sequelize,
            modelName : 'Post',
            tableName : 'posts',
            timestamps : true,
            paranoid : false,
            underscored : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }
    static associate(db){
        db.Post.belongsTo(db.User,{
            foreignKey : 'authorId',
            targetKey : 'id',
            onDelete: "cascade"
        });
        db.Post.belongsToMany(db.Hashtag, {
            through : 'PostHashtag',
            onDelete: "cascade"
        })
        db.Post.hasMany(db.Comment, {
            foreignKey : 'postId',
            sourceKey : 'id',
            onDelete: 'cascade'
        })
    }
}

module.exports = Post