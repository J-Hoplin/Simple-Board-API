const jwt = require('jsonwebtoken');
const { Codes, commonMessage, messageWithToken, convertToSecond } = require('../util');
const redis = require('redis');
const { host, port } = require("../config/redisconfig.json");
const {
    User
} = require('../models');

let redisClient = redis.createClient({
    socket: {
        host,
        port
    },
    legacyMode: true
});

redisClient.on('connect', () => {
    console.log("Redis connection success");
});

redisClient.on('error', (err) => {
    console.error(`Redis error : ${err}`);
});

redisClient.connect().then();
redisClient = redisClient.v4;


exports.verifyToken = (req, res, next) => {
    try {
        /**
         * Verify token
         * 
         * Token will be payloaded in req object's header, authorization
         * 
         * .verify() method will return decoded payload data
         * docs : https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
         */
        req.decoded = jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.JWT_SECRET
        );
        next();
    } catch (err) {
        // JWT Possible Errors : https://github.com/auth0/node-jsonwebtoken#errors--codes
        // If token expired
        if (err.name === 'TokenExpiredError') {
            return res.status(Codes.JWT_TOKEN_EXPIRE.code).json(
                commonMessage(Codes.JWT_TOKEN_EXPIRE.message)
            );
        }
        return res.status(Codes.JWT_INVALID_TOKEN.code).json(
            commonMessage(Codes.JWT_INVALID_TOKEN.message)
        );
    }
};

exports.generateToken = async (req, res) => {
    const id = req.user.id;
    const idExist = await User.findOne({
        where: {
            id
        }
    });
    if (!idExist) {
        return res.status(Codes.UNAUTHORIZED.code).json(
            commonMessage(Codes.UNAUTHORIZED.message)
        );
    }

    const token = jwt.sign(
        {
            id
        },
        process.env.JWT_SECRET
        , {
            expiresIn: process.env.JWT_EXPIRE,
            issuer: process.env.ISSUER
        }
    );

    const refreshToken = jwt.sign(
        {},
        process.env.JWT_SECRET
        , {
            expiresIn: process.env.JWT_REFRESH_EXPIRE,
            issuer: process.env.ISSUER
        }
    );
    // save refresh token to Redis
    // use convertToSecond() util function(define in util.js) for converting to second.
    await redisClient.setEx(
        id,
        convertToSecond(process.env.JWT_REFRESH_EXPIRE),
        refreshToken
    );
    return res.status(Codes.JWT_GENERATE_SUCCESS.code).json(
        messageWithToken(Codes.JWT_GENERATE_SUCCESS.message, token)
    );
};

exports.logout = async (req, res, next) => {
    try {
        const {
            id
        } = req.decoded;
        // Delete user id key in redis
        await redisClient.del(id);
        return res.status(Codes.OK.code).json(
            commonMessage(Codes.OK.message)
        );
    } catch (err) {
        next(err);
    }
};

exports.refreshTokenPreprocess = async (req, res, next) => {
    try {
        const payload = jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.JWT_SECRET,
        );
        const refreshToken = await redisClient.get(payload.id);
        req.refresh = {
            id: payload.id,
            token: refreshToken
        };
        next();
        // return refreshTokenVerifyAndRegenerate(payload.id,refreshToken)
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // Extract JWT token with ignoring time expiration
            const payload = jwt.verify(
                req.headers.authorization.split(" ")[1],
                process.env.JWT_SECRET,
                {
                    ignoreExpiration: true
                }
            );
            // If nothing in decode value
            if (!payload) {
                return res.status(Codes.FORBIDDEN_API.code).json(
                    commonMessage(Codes.FORBIDDEN_API.message)
                );
            }
            const refreshToken = await redisClient.get(payload.id);
            req.refresh = {
                id: payload.id,
                token: refreshToken
            };
            next();
            // return refreshTokenVerifyAndRegenerate(payload.id,refreshToken)
        }
        else {
            return res.status(Codes.JWT_INVALID_TOKEN.code).json(
                commonMessage(Codes.JWT_INVALID_TOKEN.message)
            );
        }
    }
};

exports.refreshTokenVerifyAndRegenerate = (req, res) => {
    const {
        id,
        token
    } = req.refresh;
    // If token is none
    if (!token) {
        return res.status(Codes.JWT_TOKEN_EXPIRE.code).json(
            commonMessage(Codes.JWT_TOKEN_EXPIRE.message)
        );
    }
    try {
        // verify refresh token integration with secret key
        jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        // If refresh token validation success generate new token
        const newtoken = jwt.sign(
            {
                id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE,
                issuer: process.env.ISSUER
            }
        );
        return res.status(Codes.JWT_GENERATE_SUCCESS.code).json(
            messageWithToken(Codes.JWT_GENERATE_SUCCESS.message, newtoken)
        );
    } catch (err) {
        // Fail to verify integration of token
        return res.status(Codes.JWT_INVALID_TOKEN.code).json(
            commonMessage(Codes.JWT_INVALID_TOKEN.message)
        );
    }
};