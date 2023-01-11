const Sequelize = require('sequelize')

class Hashtag extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title : {
                type : Sequelize.STRING(30),
                allowNull : false,
                unique : true
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
            through : 'PostHashtag',
            onDelete: "cascade"
        })
    }
}

module.exports = Hashtag