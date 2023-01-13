const Router = require('express').Router
const auth = require('./auth')
const user = require('./user')
const post = require('./post')

const router = Router();
router.use('/auth',auth);
router.use('/user',user);
router.use('/post',post)

module.exports = router