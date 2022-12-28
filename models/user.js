const Sequelize = require('sequelize');

class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id : {
                // set user id as UUID
                type : Sequelize.UUID,
                primaryKey : true,
                allowNull : false
            },
            password : {
                // Will be encrypted type string
                type : Sequelize.STRING(300),
                allowNull : false
            },
            email : {
                // User's name
                type : Sequelize.STRING(50),
                allowNull : false,
                unique : true
            },
            nickname : {
                // Nicknaem should be uniqe
                type : Sequelize.STRING(200),
                allowNull: false,
                unique : true
            },
            role : {
                // User's Role type : admin or user
                // Sequelize Enumeration : https://sequelize.org/docs/v6/other-topics/other-data-types/#enums
                type : Sequelize.ENUM,
                values : ['admin','user'],
                allowNull : false
            },
            level : {
                type : Sequelize.INTEGER,
                values : Array.from({ length : 5 }, (v,i) => {
                    i + 1
                }),
                allowNull : false
            },
            gender : {
                // Gender of user
                type : Sequelize.ENUM,
                values : ['male','female'],
                allowNull: false
            },
            birth : {
                // User's birth. DATEONLY : Date without time
                type : Sequelize.DATEONLY,
                allowNull : false
            }
        },{
            sequelize,
            modelName : 'User',
            tableName : 'users',
            timestamps : true,
            paranoid : false,
            underscored : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        })
    }

    static associate(db){
        // User - Post : 1 : N
        db.User.hasMany(db.Post);
    }
}

module.exports = User;