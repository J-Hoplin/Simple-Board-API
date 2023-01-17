const {
    BadRequest,
    QueryFailed
} = require('../../../Exceptions')
const Codes = require('../../../Codes')
// User model
const {
    User
} = require('../../../models')
const {v4} = require('uuid')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')

const roles = User.getAttributes().role.values

exports.authJoin = async (req) => {
    let {
        password,
        email,
        nickname,
        gender,
        role,
        birth
    } = req.body
    const user = await User.findOne({
        where : {
            [Op.or] : [
                {
                    nickname
                },  
                {
                    email
                }
            ]
        }
    })
    if(user){
        throw new BadRequest(Codes.USER_NICKNAME_OR_EMAIL_EXIST)
    }
    role = roles.includes(role) ? role : 'user';
    const hashpwd = await bcrypt.hash(password,parseInt(process.env.ENCRYPT_COUNT));
    return await User.create({
        id : v4(),
        password : hashpwd,
        email,
        nickname,
        role,
        level : 1,
        gender,
        birth
    })
}

exports.authLogin = async (req) => {
    const {
        email,
        password
    } = req.body;
    const user = await User.findOne({
        where : {
            email
        }
    })
    if(!user){
        throw new BadRequest(Codes.USER_NOT_EXIST)
    }
    if(!await bcrypt.compare(password,user.password)){
        throw new BadRequest(Codes.USER_PASSWORD_UNMATCHED);
    }
    return user
}

exports.authDedicateEmail = async (req) => {
    const {
        email
    } = req.body
    const checkUserExist = await User.findOne({
        where: {
            email
        }
    })
    return Boolean(checkUserExist)
}

exports.authDedicateNickname = async(req) => {
    const {
        nickname
    } = req.body
    const checkUserExist = await User.findOne({
        where : {
            nickname
        }
    })
    return Boolean(checkUserExist)
}

exports.authWithdraw = async(req) => {
    const {
        password
    } = req.body;
    const {
        id
    } = req.decoded
    const user = await User.findOne({
        where : {
            id
        }
    })
    if(!await bcrypt.compare(password,user.password)){
        throw new BadRequest(Codes.USER_PASSWORD_UNMATCHED);
    }
    return await User.destroy({
        where : {
            id
        }
    })
}

exports.authToken = async(req) => {
    const {
        id
    } = req.body
    const user = await User.findOne({
        where : {
            id
        }
    })
    if(!user){
        throw new BadRequest(Codes.USER_NOT_EXIST)
    }
    return user
}