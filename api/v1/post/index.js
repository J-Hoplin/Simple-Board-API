const Router = require('express').Router
const {
    verifyToken,
    checkUserRole
} = require('../../../middlewares')
const component = require('./component')
const util = require('../../../util')


const router = Router();
const adminOnly = ['admin']
const adminNuser = ['admin','user']

router.get('/list',async(req,res,next) => {
    try{
        const posts = await component.postListsAll(req);
        return res.status(200).json(
            util.messageWithData("OK",posts)
        )
    }catch(err){
        console.error(err)
        next(err)
    }
})

router.get('/list/:id',async(req,res,next) => {
    try{
        const posts = await component.postUserListsAll(req);
        return res.status(200).json(
            util.messageWithData("OK",posts)
        )
    }catch(err){
        console.error(err)
        next(err)
    }
})

router.get('/:id',async(req,res,next) => {
    try{
        const postId = await component.postId(req);
        return res.status(200).json(
            util.messageWithData("OK",postId)
        )
    }catch(err){
        console.error(err)
        next(err)
    }
})

router.post('/',verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        const postId = await component.post(req);
        return res.status(200).json(
            util.messageWithData("OK",postId)
        )
    }catch(err){
        console.error(err)
        next(err)
    }
})

router.put('/edit',verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        const result = await component.postEdit(req);
        return res.status(200).json(
            util.messageWithData("OK",result)
        )
    }catch(err){
        console.error(err)
        next(err);
    }
})

router.delete('/delete',verifyToken,checkUserRole(adminNuser),async(req,res,next) => {
    try{
        await component.postDelete(req);
        return res.status(200).json(
            util.commonMessage("OK")
        )
    }catch(err){
        console.error(err)
        next(err);
    }
})

module.exports = router;