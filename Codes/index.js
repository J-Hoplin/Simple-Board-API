// message with code
const format = (message, code = 200) => {
    return {
        code,
        message
    };
};

/**
 * Common Codes
 */
const SUCCESS = "OK";
const FAIL = "FAIL";
exports.OK = format(SUCCESS);

/**
 * Message with error code
 */

// Commons Message
exports.DEPRECATED_API = format("This API has been deprecated", 410);
exports.BLOCKED_API = format("This API has been blocked", 403); // For api development
exports.FORBIDDEN_API = format("Forbidden Reqest", 403);
exports.UNAUTHORIZED = format("Unauthorized user or request", 401);
exports.LOGIC_ERROR = format("API logic error", 500);
exports.ONLY_AVAILABLE_IN_DEVELOPMENT = format("This api is only available in development mode", 403);

// Query Failed
exports.ETERNAL_QUERY_ERROR = format("Query run failed. Check Database Connection", 500);

// User
exports.USER_ALREADY_EXIST = format("User already exist", 400);
exports.USER_FAIL_ENROLL = format("Fail to enroll user",);
exports.USER_NOT_EXIST = format("User not exist", 400);
exports.USER_NICKNAME_OR_EMAIL_EXIST = format("User nickname or email already exist", 400);
exports.USER_PASSWORD_UNMATCHED = format("Password not matched", 400);
exports.USER_WITHDRAW_FAIL = format("Something went wrong while user withdraw", 500);
exports.USER_LEVEL_RANGE_UNAVAILABLE = format("User level range unavailable", 400);

// Posts
exports.POST_NOT_FOUND = format("Post with ID not found", 400);
exports.POST_INVALID_AUTHOR = format("Invalid post's author ID", 400);
exports.POST_ID_NOT_GIVEN = format("Post ID not given", 400);

//Comments
exports.COMMENT_NOT_FOUND = format("Comment not found", 400);

// JWT Related Message
exports.JWT_GENERATE_SUCCESS = format(SUCCESS);
exports.JWT_TOKEN_EXPIRE = format("Token expired", 419);
exports.JWT_INVALID_TOKEN = format("Invalid token", 403);