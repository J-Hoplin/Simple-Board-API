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

const userLevels = User.getAttributes().level.values.map(x => {
    return parseInt(x)
});

const checkUserLevelAvailable = (level) => {
    return userLevels.includes(level)
}

exports.userInfo = async(req) => {
    try{
        const {
            id
        } = req.decoded
        const user = await User.findOne({
            where : {
                id
            }
        })
        // If user not exist
        if(!user){
            throw new BadRequest(Codes.USER_NOT_EXIST)
        }
        return {
            "id" : user.id,
            "email" : user.email,
            "nickname" : user.nickname,
            "role" : user.role,
            "level" : user.level,
            "gender" : user.gender,
            "birth" : user.birth
        }
    }catch(err){
        throw QueryFailed(Codes.ETERNAL_QUERY_ERROR)
    }
}

exports.userList = async(req) => {
    try{
        let {
            offset,
            limit
        } = req.query;
        // If offset or limit not typed
        offset = offset || process.env.DEFAULT_OFFSET;
        limit = limit || process.env.DEFAULT_LIMIT; 
        const users = await User.findAll({
            limit,
            offset
        })
        return {
            lenght : users.length,
            users
        }
    }catch(err){
        throw QueryFailed(Codes.ETERNAL_QUERY_ERROR)
    }
}

exports.userLevelUp = async(req) => {
    try{
        let {
            id,
            level
        } = req.body;
        const user = await User.findOne({
            where : {
                id
            }
        })
        // If max level, resave to max level, else new level
        const newlevel = parsetInt(user.level) + 1
        if(!checkUserLevelAvailable(newlevel)){
            throw BadRequest(Codes.USER_LEVEL_RANGE_UNAVAILABLE)
        }
        user.set({
            level : newlevel.toString()
        })
        await user.save();
        return user;
    }catch(err){
        throw QueryFailed(Codes.ETERNAL_QUERY_ERROR)
    }
}

exports.userLevelDown = async(req) => {
    try{
        let {
            id,
            level
        } = req.body
        const user = await User.findOne({
            where : {
                id
            }
        })
        const newlevel = parseInt(user.level) - 1
        if(!checkUserLevelAvailable(newlevel)){
            throw BadRequest(Codes.USER_LEVEL_RANGE_UNAVAILABLE)
        }
        user.set({
            level : newlevel.toString()
        })
        await user.save();
        return user
    }catch(err){
        throw QueryFailed(Codes.ETERNAL_QUERY_ERROR)
    }
}

exports.userEdit = async(req) => {
    try{
        const {
            password,
            nickname,
            birth
        } = req.body
        const {
            id
        } = req.decoded
        await User.update({
            password,
            nickname,
            birth
        },{
            where : {
                id
            }
        })
        return true
    }catch(err){
        throw QueryFailed(Codes.ETERNAL_QUERY_ERROR)
    }
}