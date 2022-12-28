const Router = require('express').Router

// JWT middlewares
const {
    verifyToken,
    generateToken
} = require('../../../middlewares')
const component = require('./component')
const util = require('../../../util')

const router = Router();

/**
 * Enroll user
 */
router.post('/join',async (req,res,next) => {
    try{
        await component.userJoin(req);
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err);
    }
})

/**
 * Login
 */
router.post('/login',async (req,res,next) => {
    try{
        req.user = await component.userLogin(req)
        // Middleware extend pattern
        generateToken(req,res,next);
    }catch(err){
        next(err)
    }
})

/**
 * Withdraw user
 */
router.post('/withdraw',verifyToken,async (req,res,next) => {
    try{
        await component.userWithdraw(req)
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err)
    }
})

module.exports = router;