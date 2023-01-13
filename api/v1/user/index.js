const Router = require('express').Router
// JWT middlewares
const {
    verifyToken,
    checkUserRole,
    deprecated
} = require('../../../middlewares')
const component = require('./component')
const util = require('../../../util')

const router = Router();

const adminOnly = ['admin']
const adminNuser = ['admin','user']

/**
 * Get user information
 */

router.get('/get',async(req,res,next) => {
    try{
        const user = await component.userGetIDWithNickname(req);
        return res.status(200).send(
            util.messageWithData("OK",user)
        )
    }catch(err){
        next(err);
    }
})

router.get('/info',verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        const user = await component.userInfo(req);
        return res.status(200).send(
            util.messageWithData("OK",user)
        )
    }catch(err){
        next(err)
    }
})

/**
 * Get user list
 * 
 * Only admin
 */
router.get('/list',verifyToken,checkUserRole(adminNuser),async (req,res,next) => {
    try{
        const users = await component.userList(req);
        return res.status(200).send(
            util.messageWithData("OK",users)
        )
    }catch(err){
        next(err)
    }
})

/**
 * User level up
 */
router.patch('/levelup',verifyToken,checkUserRole(adminOnly),async(req,res,next) => {
    try{
        const result = await component.userLevelUp(req);
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err)
    }
})

router.patch('/leveldown',verifyToken,checkUserRole(adminOnly),async (req,res,next) => {
    try{
        const result = await component.userLevelDown(req);
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err)
    }
})


/**
 * User info edit
 * 
 * Only field of password, nickname, birth are able to change
 */
router.put('/edit',verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        await component.userEdit(req);
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err)
    }
})

router.post('/checkpassword',deprecated,verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        const result = await component.userCheckPassword(req)
        return res.status(200).json(
            util.commonMessage(result)
        )
    }catch(err){
        next(err)
    }
})


module.exports = router