const { User } = require('../models')
const { 
    commonMessage,
    flattenArgs 
} = require('../util')
const {
    BadRequest,
    ForbiddenRequest
} = require('../Exceptions')
const Codes = require('../Codes')

exports.apiBlocked = (req,res) => {
    return res.status(Codes.FORBIDDEN_API.code).json(
        commonMessage(Codes.FORBIDDEN_API.message)
    )
}

exports.deprecated = (req,res) => {
    return res.status(Codes.DEPRECATED_API.code).json(
        commonMessage(Codes.DEPRECATED_API.message)
    )
}

// This should be after verifytoken 
exports.checkUserRole = (roles) => {
    return async (req,res,next) => {
        // req.decoded will be added from verifyJWT middleware 
        const {
            id
        } = req.decoded
        const user = await User.findOne({
            attributes: ["role"],
            where : {
                id
            }
        })
        if(!user){
            return res.status(Codes.USER_NOT_EXIST.code).json(
                commonMessage(Codes.USER_NOT_EXIST.message)
            );
        }
        if(!roles.includes(user.role)){
            return res.status(Codes.FORBIDDEN_API.code).json(
                commonMessage(Codes.FORBIDDEN_API.message)
            );
        }
        next();
    }
}