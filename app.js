const express = require('express')
const logger = require('morgan')
const util = require('./util')
const dotenv = require('dotenv')

dotenv.config()
// Router point
const api = require('./routes')
const app = express();
app.set('port',process.env.PORT || 6000);

// Sequelize
const { sequelize } = require('./models')
sequelize.sync({
    // Prevent re-genration of table, per server initialized
    force : true 
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
    express.json(),
    express.urlencoded({
        extended: true
    })
)

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