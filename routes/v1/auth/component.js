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

exports.userJoin = async (req) => {
    const {
        password,
        email,
        nickname,
        gender,
        birth
    } = req.body
    const user = await User.findOne({
        where : {
            email
        }
    })
    if(user){
        throw new BadRequest(Codes.USER_ALREADY_EXIST)
    }
    const hashpwd = await bcrypt.hash(password,12);
    try{
        return await User.create({
            id : v4(),
            password : hashpwd,
            email,
            nickname,
            role : "user",
            level : 1,
            gender,
            birth
        })
    }catch(err){
        throw QueryFailed(Codes.USER_FAIL_ENROLL);
    }
}

exports.userLogin = async (req) => {
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

exports.userWithdraw = async(req) => {
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
    try{
        return await User.destroy({
            where : {
                id
            }
        })
    }catch(err){
        throw QueryFailed(Codes.USER_WITHDRAW_FAIL);
    }
    
}