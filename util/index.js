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

exports.arrayComparison = (arr1,arr2) => {
    if(arr1.length === arr2.length){
        return arr1.every(x => {
            return arr2.includes(x)
        });
    }
    return false;
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