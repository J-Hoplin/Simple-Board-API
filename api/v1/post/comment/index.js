const Router = require('express').Router
const { verifyToken, checkUserRole } = require('../../../../middlewares')
const component = require('./component')
const util = require('../../../../util')

const router = Router();
const adminOnly = ['admin']
const adminNuser = ['admin','user']

router.route('/')
.get(async(req,res,next) => {
    try{
        const comments = await component.commentGet(req);
        return res.status(200).json(
            util.messageWithData("OK",comments)
        )
    }catch(err){
        next(err);
    }
})
.post(verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        await component.commentPost(req);
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err);
    }
})
.patch(verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        await component.commentPatch(req);
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err)
    }
})
.delete(verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        await component.commentDelete(req);
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        next(err)
    }
})

module.exports = router;