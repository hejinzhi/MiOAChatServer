var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var message = require('./controllers/message');
var request = require('./lib/request');
var cryptoJS = require('./lib/crypto');
var config = require('./config/default');
var util = require('./lib/util');

http.listen(3388, function () {
    console.log('Server starting on port 3701')
})

// 在线用户
var onlineUsers = {};
// 当前在线人数
var onlineCount = 0;
var messages = [];

message.getAllOutlineMessages().then(data => {
    messages = data;
});

// 20分钟同步一次
setInterval(async() => {
    console.log('同步推送消息....');
    await syncPushMessage();
}, 1000 * 60 * 20);


// console.log('同步推送消息....');
// syncPushMessage();



io.on('connection', async function (socket) {
    console.log('新用户已上线！')
    socket.on('getOutlineMessages', async function (obj) {
        let username = obj.username;
        let msgs = await message.getOutlineMessageByUsername(username);
        for (let i = 0; i < msgs.length; i++) {
            // 返回回来的EXTRA栏位是字符，要把它转换成Object
            if (msgs[i].EXTRA) {
                msgs[i].EXTRA = JSON.parse(msgs[i].EXTRA);
            }

        }
        io.emit('OutlineMessages_' + username, msgs || []);
    });

    //监听用户退出
    socket.on('disconnect', function () {
        //将退出的用户从在线列表中删除
        // if (onlineUsers.hasOwnProperty(socket.name)) {
        //     // 退出用户的信息
        //     var obj = {
        //         userid: socket.name,
        //         username: onlineUsers[socket.name]
        //     }

        //     // 删除
        //     delete onlineUsers[socket.name]
        //     onlineCount--;
        //     io.emit('logout', {
        //         onlineUsers: onlineUsers,
        //         onlineCount: onlineCount,
        //         user: obj
        //     });
        //     console.log(obj.username + '退出了聊天室');
        // }
    });
    // 监听用户发布聊天内容
    socket.on('message', async function (obj) {
        let msg = await message.addMessage(obj);
        messages.push(msg);
        io.emit('message_' + obj.TO_USER_NAME, msg);
    });

    socket.on('status', function (obj) {
        io.emit('status', obj);
    });

    socket.on('received', async function (obj) {
        console.log(1, obj);
        if (obj && obj.length > 0) {
            for (let i = 0; i < obj.length; i++) {
                let index = -1;
                for (let j = 0; j < messages.length; j++) {
                    if (messages[j].ID === obj[i]) {
                        index = j;
                        break;
                    }
                }
                if (index > -1) {
                    messages.splice(index, 1);
                }
                await message.updateMessage(obj[i]);
            }
        }
    });
});

//从oracle数据库把消息同步到MySQL数据库
async function syncPushMessage() {
    let unSendMsg = await request.get(config.url + 'IPQA/GetPushMessage?sendFlag=N&company_id=MSL');
    let unSendMsgIds = unSendMsg.map((value, index) => value.ID);
    let msgs = util.getMsgs(unSendMsg, false);
    for (let i = 0; i < msgs.length; i++) {
        let message1 = {
            TO_USER_NAME: msgs[i].TO_USER_NAME,
            FROM_USER_NAME: msgs[i].FROM_USER_NAME,
            OWNER: msgs[i].TO_USER_NAME,
            CONTENT: msgs[i].CONTENT,
            CONTENT_TYPE: msgs[i].CONTENT_TYPE,
            TIME: msgs[i].TIME,
            TYPE: msgs[i].EXTRA.type || '',
            UNREAD: 'Y',
            EXTRA: JSON.stringify(msgs[i].EXTRA),
            CHILD_TYPE: '',
            IMAGE_HEIGHT: 0,
            IMAGE_WIDTH: 0,
            DURATION: 0,
            VOUNREAD: ''
        }
        let msg = await message.addMessage(message1);
        //todo 把oracle上的消息更改为已读
        msg.EXTRA = msgs[i].EXTRA;
        messages.push(msg);
        io.emit('message_' + msgs[i].TO_USER_NAME, msg);
    }
    // 把oracle的数据更新为已发送
    await request.put(config.url + 'IPQA/UpdatePushMessage', unSendMsgIds);
}