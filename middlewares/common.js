const { commonMessage,Codes } = require('../util')

exports.deprecated = (req,res) => {
    return res.status(Codes.DEPRECATED_API.code).json(
        commonMessage(Codes.DEPRECATED_API.message)
    )
}