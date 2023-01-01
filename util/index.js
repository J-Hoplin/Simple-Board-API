const ms = require('ms')

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

exports.flattenArgs = function flattenArgs(args){
    return args.reduce((acc,cur) => {
        if(Array.isArray(cur)){
            return acc.concat(flattenArgs(cur));
        }
        return acc.concat(cur)
    },new Array())
}

exports.convertToSecond = (time) => {
    return ms(time) / 1000
}