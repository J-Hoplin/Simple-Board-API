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
        const result = await component.authJoin(req);
        return res.status(200).json(
            util.messageWithData("OK",{
                id : result.id
            })
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
        req.user = await component.authLogin(req)
        // Middleware extend pattern
        generateToken(req,res,next);
    }catch(err){
        next(err)
    }
})

/**
 * Verify user email dedication
 */
router.post('/dedicate-email',async(req,res,next) => {
    try{
        // True if user email already exist
        const result = await component.authDedicateEmail(req);
        return res.status(200).json(
            util.commonMessage(result)
        )
    }catch(err){
        next(err)
    }
})

/**
 * Verify user nickname dedication
 */
router.post('/dedicate-nickname',async(req,res,next) => {
    try{
        const result = await component.authDedicateEmail(req);
        return res.status(200).json(
            util.commonMessage(result)
        )
    }catch(err){
        next(err)
    }
})

/**
 * Withdraw user
 */
router.post('/withdraw',verifyToken,async (req,res,next) => {
    try{
        await component.authWithdraw(req)
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err)
    }
})

router.post('/token',async (req,res,next) => {
    try{
        req.user = await component.authToken(req);
        await generateToken(req,res,next);
    }catch(err){
        next(err)
    }
})

module.exports = router;