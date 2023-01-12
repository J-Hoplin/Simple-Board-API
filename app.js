const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const util = require('./util')
const dotenv = require('dotenv')
const YAML = require('yamljs')
const swaggerUI = require('swagger-ui-express')
const path = require('path')

dotenv.config()
// Router point
const api = require('./api')
const app = express();
app.set('port',process.env.PORT || 6000);

// Load Swagger Spec
const swaggerSpec = YAML.load(path.join(__dirname,'/docs/docs.yml'));

// Sequelize
const { sequelize } = require('./models')
sequelize.sync({
    // Prevent re-genration of table, per server initialized
    force : false
})
.then(() => {
    console.log("Database connection success");
})
.catch(err => {
    console.error(err.message || "Fail to make database connection");
    // If database connection fail -> close server
    process.exit(1)
})

app.use(
    cors(),
    express.json(),
    express.urlencoded({
        extended: false
    }),
    process.env.MODE === 'development'
    ? logger('dev')
    : logger('combined')
)

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec))
// Enroll router
app.use('/api',api)

// Ping
app.get('/ping',(req,res) => {
    return res.status(200).json(
        util.commonMessage("OK")
    )
})

// Router found fail middleware
app.use((req,res,next) => {
    const error = new Error(`${req.method} ${req.route} router not found`);
    error.code = 404;
    next(error)
})

// Exception middleware
app.use((err,req,res,next) => {
    return res.status(err.code || 500).json(
        util.commonMessage(`${err.name || "Server Exception"} : ${err.message || "Server error"}`)
    )
})

module.exports = app