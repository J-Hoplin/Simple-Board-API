const Router = require('express').Router;
const v1 = require('./v1');

const router = Router();
router.use('/v1', v1);

module.exports = router;