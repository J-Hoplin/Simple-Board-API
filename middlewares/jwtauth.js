const jwt = require('jsonwebtoken');
const { Codes, commonMessage, messageWithToken, convertToSecond } = require('../util')
const redis = require('redis')

let redisClient = redis.createClient({
    legacyMode : true
})

redisClient.on('connect',() => {
    console.log("Redis connection success")
})

redisClient.on('error',() => {
    console.error(`Redis error : ${err}`)
})

redisClient.connect().then();
redisClient = redisClient.v4

exports.verifyToken = (req,res,next) => {
    try{
        /**
         * Verify token
         * 
         * Token will be payloaded in req object's header, authorization
         * 
         * .verify() method will return decoded payload data
         * docs : https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
         */
        req.decoded = jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
        next();
    }catch(err){
        // JWT Possible Errors : https://github.com/auth0/node-jsonwebtoken#errors--codes
        
        // If token expired
        if(err.name === 'TokenExpiredError'){
            return res.status(Codes.JWT_TOKEN_EXPIRE.code).json(
                commonMessage(Codes.JWT_TOKEN_EXPIRE.message)
            )
        }
        return res.status(Codes.JWT_INVALID_TOKEN.code).json(
            commonMessage(Codes.JWT_INVALID_TOKEN.message)
        )
    }
}

exports.generateToken = async (req,res,next) => {
    const id = req.user.id
    const token = jwt.sign(
        {
            id
        },
        process.env.JWT_SECRET
        ,{
            expiresIn: process.env.JWT_EXPIRE,
            issuer : process.env.ISSUER
        }
    );
    const refreshToken = jwt.sign(
        {},
        process.env.JWT_SECRET
        ,{
            expiresIn: process.env.JWT_REFRESH_EXPIRE,
            issuer : process.env.ISSUER
        }
    )
    // save refresh token to Redis
    // use convertToSecond() util function(define in util.js) for converting to second.
    await redisClient.setEx(
        id,
        convertToSecond(process.env.JWT_REFRESH_EXPIRE),
        refreshToken
    )
    return res.status(Codes.JWT_GENERATE_SUCCESS.code).json(
        messageWithToken(Codes.JWT_GENERATE_SUCCESS.message,token)
    )
}