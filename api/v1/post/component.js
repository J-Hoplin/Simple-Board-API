const {
    BadRequest,
} = require('../../../Exceptions');
const Codes = require('../../../Codes');
const {
    User,
    Post,
    Hashtag,
    Comment,
    PostHashtag
} = require('../../../models');
const util = require('../../../util');
const { v4 } = require('uuid');


const post_types = Post.getAttributes().type.values.map(x => x);

const checkActionScope = async (userid, postid) => {
    const postAuthor = await Post.findByPk(postid);
    const user = await User.findByPk(userid);
    // If user id and post author id match or if user is admin -> true
    return userid === postAuthor.authorId || user.role === 'admin'
        ? true
        : false;
};

const checkAuthorMatch = async (id, postId) => {
    const postInfo = await Post.findOne({
        attributes: ['authorId'],
        raw: true,
        where: {
            id: postId
        }
    });
    const {
        authorId
    } = postInfo;
    return id === authorId;
};

exports.postListsAll = async (req) => {
    let {
        limit,
        offset
    } = req.query;

    // Value from ENV variable is type of string
    // Require to convert to integer
    limit = parseInt(limit) || parseInt(process.env.DEFAULT_LIMIT);
    offset = parseInt(offset) || parseInt(process.env.DEFAULT_OFFSET);

    const posts = await Post.findAll({
        attributes: ['id', 'title', 'authorId', 'type', 'createdAt'],
        limit,
        offset,
        order: [
            ['createdAt', 'ASC']
        ],
        include: [
            {
                model: Hashtag
            },
            {
                model: Comment
            }
        ]
    });
    return posts;
};

exports.postUserListsAll = async (req) => {
    let {
        limit,
        offset
    } = req.query;
    let {
        id
    } = req.params;

    limit = parseInt(limit) || parseInt(process.env.DEFAULT_LIMIT);
    offset = parseInt(offset) || parseInt(process.env.DEFAULT_OFFSET);
    const posts = await Post.findAll({
        limit,
        offset,
        attributes: ['id', 'title', 'authorId', 'type', 'createdAt'],
        where: {
            authorId: id
        },
        order: [
            ['createdAt', 'ASC']
        ],
        include: [
            {
                model: Hashtag
            },
            {
                model: Comment
            }
        ]
    });
    return posts;
};

exports.postId = async (req) => {
    const {
        id
    } = req.params;
    const post = await Post.findOne({
        where: {
            id
        },
        include: [
            {
                model: Hashtag
            },
            {
                model: Comment
            }
        ]
    });
    // If post not found
    if (!post) {
        throw new BadRequest(Codes.POST_NOT_FOUND);
    }
    return post;
};

exports.post = async (req) => {
    let {
        title,
        content,
        type,
        hashtags
    } = req.body;
    const {
        id
    } = req.decoded;

    // Check user exist
    const checkUser = await User.findOne({
        where: {
            id
        }
    });
    if (!checkUser) {
        throw new BadRequest(Codes.USER_NOT_EXIST);
    }

    const postId = v4();
    const previous_hashtags = await Hashtag.findAll({
        attributes: ['title']
    });
    // filter hastag title's data
    const filterHashtags = previous_hashtags
        .map(x => {
            return x.title;
        });
    // filter hastag list that is not exist in db
    const userHashtags = hashtags.filter(x => {
        return !(filterHashtags.includes(x));
    });
    // Check post type. If it's invalid, set default as free
    // make type as lowercase string
    type = type.toLowerCase();
    if (!post_types.includes(type)) {
        type = 'free';
    }
    // notice, admin type is only available to admin role user
    if ((type !== 'free') && (checkUser.role !== 'admin')) {
        throw new BadRequest(Codes.FORBIDDEN_API);
    }

    // Create Post
    await Post.create({
        id: postId,
        title,
        content,
        authorId: id,
        type
    });

    // Create hashtags that is new
    await Promise.allSettled(
        userHashtags.map(x => {
            return (async () => {
                await Hashtag.create({
                    title: x
                });
            })();
        })
    );

    // Get hashtags id

    /**
     * Sequelize Promise는 dataValues라는곳 안에 데이터를 넣는다
     * 만약 이를 무시하고 싶은 경우 raw : true를 넣어준다
     * https://stackoverflow.com/questions/50536056/sequelize-query-returning-strange-models
     */
    let hashtagIds = await Promise.allSettled(
        hashtags.map(x => {
            return (async () => {
                return await Hashtag.findOne(
                    {
                        attributes: ['id'],
                        raw: true,
                        where: {
                            title: x
                        }
                    }
                );
            })();
        })
    );
    hashtagIds = hashtagIds
        .filter(x => {
            const { status } = x;
            return status === "fulfilled" ? true : false;
        })
        .map(x => {
            return x.value.id;
        });
    // Create M : N bridge row
    await Promise.allSettled(
        hashtagIds.map(x => {
            return (async () => {
                await PostHashtag.create({
                    PostId: postId,
                    HashtagId: x
                });
            })();
        })
    );
    return postId;
};

exports.postEdit = async (req) => {
    let {
        id: postId,
        title,
        content,
        hashtags
    } = req.body;
    const {
        id: userId,
    } = req.decoded;
    if (!await checkActionScope(userId, postId)) {
        throw new BadRequest(Codes.FORBIDDEN_API);
    }

    hashtags = hashtags || new Array();
    const postInfo = await Post.findOne({
        attributes: ['title', 'content'],
        where: {
            id: postId
        },
        include: [{
            model: Hashtag
        }]
    });
    if (!postInfo) {
        throw new BadRequest(Codes.POST_NOT_FOUND);
    }

    const hashtagMapper = {};
    const previousHashtags = postInfo.Hashtags.map(x => {
        hashtagMapper[x.title] = x.id;
    });

    // title and content
    const editList = {};
    title !== postInfo.title ? editList.title = title : true;
    content !== postInfo.content ? editList.content = content : true;
    await Post.update(
        editList,
        {
            where: {
                id: postId
            }
        }
    );

    // If hashtag edited
    if (!util.arrayComparison(hashtags, previousHashtags)) {
        await PostHashtag.destroy({
            where: {
                PostId: postId
            }
        });
        // filter new tags
        let newTags = hashtags.filter(x => {
            return !Object.keys(editList).includes(x);
        });

        // Generate tags. If already exist, it will be ignored
        await Promise.allSettled(newTags.map(x => {
            return (async () => {
                await Hashtag.create({
                    title: x
                });
            })();
        }));

        // Get tags ID
        let hashtagsIds = await Hashtag.findAll({
            where: {
                title: hashtags
            }
        });
        hashtagsIds = hashtagsIds.map(x => x.id);
        await Promise.allSettled(hashtagsIds.map(x => {
            return (async () => {
                await PostHashtag.create({
                    PostId: postId,
                    HashtagId: x
                });
            })();
        }));
    }
    return true;
};

exports.postDelete = async (req) => {
    const {
        id: postId
    } = req.body;

    const {
        id: userId,
    } = req.decoded;

    if (!await checkActionScope(userId, postId)) {
        throw new BadRequest(Codes.FORBIDDEN_API);
    }

    const checkPost = await Post.findOne({
        where: {
            postId
        }
    });

    // If post not exist
    if (!checkPost) {
        throw new BadRequest(Codes.POST_NOT_FOUND);
    }

    return await Post.destroy({
        where: {
            postId
        }
    });
};