exports.Codes = {...require('../Codes')}

exports.commonMessage = (msg) => {
    return {
        msg 
    }
}

exports.messageWithToken = (msg,token) => {
    return {
        msg,
        token
    }
}

exports.messageWithData = (msg,data) => {
    return {
        msg,
        data
    }
}