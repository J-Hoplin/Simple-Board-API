const Sequelize = require('sequelize')

class Hashtag extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title : {
                type : Sequelize.STRING(30),
                allowNull : false
            }
        },{
            sequelize,
            modelName : 'Hashtag',
            tableName : 'hashtags',
            timestamps : false,
            paranoid : false,
            underscored : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }
    static associate(db){
        db.Hashtag.belongsToMany(db.Post, {
            through : 'Post_Hashtag'
        })
    }
}

module.exports = Hashtag