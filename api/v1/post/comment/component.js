const { BadRequest } = require('../../../../Exceptions');
const Codes = require('../../../../Codes');
const { Post, Comment, User } = require('../../../../models');

const checkActionScope = async (userid, commentid) => {
    const commentAuthor = await Comment.findByPk(commentid);
    const user = await User.findByPk(userid);
    // If user id and post author id match or if user is admin -> true
    return userid === commentAuthor.authorId || user.role === 'admin'
        ? true
        : false;
};

/**
 * 
 * req.postId is from middleware embedPostID in post/index.js
 */

const checkPostExist = async (id) => {
    const checkPost = await Post.findByPk(id);
    if (!checkPost) {
        return false;
    }
    return true;
};

const checkUserExist = async (id) => {
    const checkUser = await User.findOne({
        where: {
            id
        }
    });
    if (!checkUser) {
        return false;
    }
    return true;
};

const checkCommentExist = async (id) => {
    const checkComment = await Comment.findOne({
        where: {
            id
        }
    });

    if (!checkComment) {
        return false;
    }
    return true;
};

// ID is post's id
exports.commentGet = async (req) => {
    if (!await checkPostExist(req.postId)) {
        throw new BadRequest(Codes.POST_NOT_FOUND);
    }
    return await Comment.findAll({
        where: {
            postId: req.postId
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });
};

// ID is post's id
exports.commentPost = async (req) => {
    const postId = req.postId;
    // From body
    const {
        content
    } = req.body;

    const {
        id: authorId,
    } = req.decoded;

    if (!await checkPostExist(postId)) {
        throw new BadRequest(Codes.POST_NOT_FOUND);
    }

    if (!await checkUserExist(authorId)) {
        throw new BadRequest(Codes.USER_NOT_EXIST);
    }

    return await Comment.create({
        content,
        authorId,
        postId
    });
};

// ID is comment's ID
exports.commentPatch = async (req) => {
    const postId = req.postId;
    const {
        id: commentId,
        content
    } = req.body;
    const {
        id: userId,
    } = req.decoded;

    if (!await checkActionScope(userId, commentId)) {
        throw new BadRequest(Codes.FORBIDDEN_API);
    }

    if (!await checkCommentExist(commentId)) {
        throw new BadRequest(Codes.COMMENT_NOT_FOUND);
    }

    if (!await checkPostExist(postId, commentId)) {
        throw new BadRequest(Codes.POST_NOT_FOUND);
    }

    return await Comment.update(
        {
            content
        }, {
        where: {
            id: commentId
        }
    });
};

exports.commentDelete = async (req) => {
    const postId = req.postId;
    const {
        id: commentId,
    } = req.body;
    const {
        id: userId,
    } = req.decoded;

    if (!await checkActionScope(userId, commentId)) {
        throw new BadRequest(Codes.FORBIDDEN_API);
    }

    if (!await checkCommentExist(commentId)) {
        throw new BadRequest(Codes.COMMENT_NOT_FOUND);
    }

    if (!await checkPostExist(postId)) {
        throw new BadRequest(Codes.POST_NOT_FOUND);
    }

    return await Comment.destroy({
        where: {
            id: commentId
        }
    });
};