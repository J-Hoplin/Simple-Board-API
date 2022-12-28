// message with code
const format = (message,code=200) => {
    return {
        code,
        message
    }
}

/**
 * Common Codes
 */
const SUCCESS = "OK"
const FAIL = "FAIL"
exports.OK = format(SUCCESS)

/**
 * Message with error code
 */

// Commons Message
exports.DEPRECATED_API = format("This API has been deprecated",410)

// User
exports.USER_ALREADY_EXIST = format("User already exist",400)
exports.USER_FAIL_ENROLL = format("Fail to enroll user",500)
exports.USER_NOT_EXIST = format("User not exist",400)
exports.USER_PASSWORD_UNMATCHED = format("Password not matched",400)
exports.USER_WITHDRAW_FAIL = format("Something went wrong while user withdraw",500)

// JWT Related Message
exports.JWT_GENERATE_SUCCESS = format(SUCCESS)
exports.JWT_TOKEN_EXPIRE = format("Token expired",10000)
exports.JWT_INVALID_TOKEN = format("Invalid token")