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

exports.userGetIDWithNickname = async(req) => {
    const {
        nickname
    } = req.query
    const user = await User.findOne({
        attributes : ['id'],
        where : {
            nickname
        }
    })
    if(!user){
        throw new BadRequest(Codes.USER_NOT_EXIST)
    }
    return user;
}

exports.userInfo = async(req) => {
    const {
        id
    } = req.query
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
}

exports.userList = async(req) => {
    let {
        offset,
        limit
    } = req.query;
    // If offset or limit not typed
    limit = parseInt(limit) || parseInt(process.env.DEFAULT_LIMIT);
    offset = parseInt(offset) || parseInt(process.env.DEFAULT_OFFSET);
    const users = await User.findAll({
        limit,
        offset
    })
    return {
        lenght : users.length,
        users
    }
}

exports.userLevelUp = async(req) => {
    let {
        id
    } = req.body;
    const user = await User.findOne({
        where : {
            id
        }
    })
    // If user not exis
    if(!user){
        throw new BadRequest(Codes.USER_NOT_EXIST)
    }
    // If max level, resave to max level, else new level
    const newlevel = parsetInt(user.level) + 1
    if(!checkUserLevelAvailable(newlevel)){
        throw new BadRequest(Codes.USER_LEVEL_RANGE_UNAVAILABLE)
    }
    user.set({
        level : newlevel.toString()
    })
    await user.save();
    return user;
}

exports.userLevelDown = async(req) => {
    let {
        id
    } = req.body
    const user = await User.findOne({
        where : {
            id
        }
    })
    // If user not exist
    if(!user){
        throw new BadRequest(Codes.USER_NOT_EXIST);
    }
    const newlevel = parseInt(user.level) - 1
    if(!checkUserLevelAvailable(newlevel)){
        throw new BadRequest(Codes.USER_LEVEL_RANGE_UNAVAILABLE)
    }
    user.set({
        level : newlevel.toString()
    })
    await user.save();
    return user
}

exports.userEdit = async(req) => {
    let {
        id,
        password,
        nickname,
        changedPassword,
        birth
    } = req.body

    // Check changed nickname exist

    const checkNickname = await User.findOne({
        where: {
            id: {
                [Op.not] : id
            },
            nickname
        }
    })
    if(checkNickname){
        throw new BadRequest(Codes.USER_NICKNAME_OR_EMAIL_EXIST)
    }
    
    // Find user
    const user = await User.findOne({
        attributes : ["password","nickname","birth"],
        where : {
            id
        }
    })
    // If user not exist
    if(!user){
        throw new BadRequest(Codes.USER_NOT_EXIST)
    }
    // If password is unmatched
    if(!await bcrypt.compare(password,user.password)){
        throw new BadRequest(Codes.USER_PASSWORD_UNMATCHED)
    }
    // Encrypt user's password if changed password typed
    const hasedPassword = changedPassword ? await bcrypt.hash(changedPassword,parseInt(process.env.ENCRYPT_COUNT)) : password;
    nickname = nickname ? nickname : user.nickname
    birth = birth ? birth : user.birth
    // update user
    await User.update({
        password : hasedPassword,
        nickname,
        birth
    },{
        where : {
            id
        }
    })
    return true
}

exports.userCheckPassword = async (req) => {
    // Get password from body
    const {
        id,
        password
    } = req.body

    // Get user
    const user = await User.findOne({
        attributes : ["password"],
        where : {
            id
        }
    })

    // If user not exist
    if(!user){
        throw new BadRequest(Codes.USER_NOT_EXIST)
    }
    // Verify password
    const pwverify = await bcrypt.compare(password,user.password);
    console.log(password)
    return pwverify ? true : false
}