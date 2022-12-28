const jwt = require('jsonwebtoken');
const { JWT_GENERATE_SUCCESS } = require('../Codes');
const { Codes, commonMessage, messageWithToken } = require('../util')

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

exports.generateToken = (req,res,next) => {
    const token = jwt.sign(
        {
            id : req.user.id
        },
        process.env.JWT_SECRET
        ,{
            expiresIn: '5m',
            issuer : process.env.ISSUER
        }
    );
    return res.status(JWT_GENERATE_SUCCESS.code).json(
        messageWithToken(JWT_GENERATE_SUCCESS.message,token)
    )
}