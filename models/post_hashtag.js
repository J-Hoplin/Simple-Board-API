const Sequelize = require('sequelize')

class PostHashtag extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id : {
                type : Sequelize.BIGINT,
                primaryKey: true,
                allowNull : false,
                autoIncrement : true
            } 
        },{
            sequelize,
            modelName : 'PostHashtag',
            tableName : 'posthashtag',
            timestamps : false,
            paranoid : false,
            underscored : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }

    static associate(db){}
}

module.exports = PostHashtag