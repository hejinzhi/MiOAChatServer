var Chat = require('../lib/mongo').Chat;

module.exports = {
    // 注册一个用户
    create: function create(chat) {
        return User.create(chat).exec();
    },
    // 通过ID获得聊天信息
    getUserByName: function getUserById(id) {
        return User.findOne({
            _id: id
        }).exec();
    },

    // // 通过用户id 和 文章ID 更新用户信息
    // updateDetailById: function updateDetailById(accountName, data) {
    //     return User.update({
    //         accountName: accountName
    //     }, {
    //         $set: data
    //     }).exec();
    // },
};
