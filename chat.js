var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var message = require('./controllers/message');

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

io.on('connection', async function (socket) {
    console.log('新用户已上线！')

    socket.on('getOutlineMessages', async function (obj) {
        let username = obj.username;
        let msgs = await message.getOutlineMessageByUsername(username);
        io.emit('OutlineMessages_' + username, msgs || []);

    });

    //监听用户退出
    socket.on('disconnect', function () {
            //将退出的用户从在线列表中删除
            if (onlineUsers.hasOwnProperty(socket.name)) {
                // 退出用户的信息
                var obj = {
                    userid: socket.name,
                    username: onlineUsers[socket.name]
                }

                // 删除
                delete onlineUsers[socket.name]
                onlineCount--;
                io.emit('logout', {
                    onlineUsers: onlineUsers,
                    onlineCount: onlineCount,
                    user: obj
                });
                console.log(obj.username + '退出了聊天室');
            }
        })
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
                    await message.updateMessage(obj[i]);
                }

            }
        }
    });



    function reSend() {
        for (let prop in messages) {
            if (messages[prop] > 0) {
                io.emit('hasOutlineMes' + prop, true);
            }
        }
    }
    // 服务器时间同步
    function tick() {
        var now = new Date().toUTCString();
        io.emit('time', now);
    }

    // setInterval(tick, 1000);
    // setInterval(reSend, 5000);
})