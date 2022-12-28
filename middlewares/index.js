const common= require('./common')
const jwt = require('./jwtauth')

module.exports = {
    ...common,
    ...jwt
}