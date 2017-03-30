var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

http.listen(3701, function() {
    console.log('Server starting on port 3701')
})

// 在线用户
var onlineUsers = {};
// 当前在线人数
var onlineCount = 0;
var messages = [];
io.on('connection', function(socket) {
    console.log('新用户已上线！')
    socket.on('login', function(obj) {
        console.log(obj);
        let id = obj.id;
        let username = obj.name;
        let unSendMes = messages.filter(function(mes) {
            return mes.toId = id;
        });
        io.emit('OutlineMessages' + id, unSendMes || []);
        console.log(username + '加入聊天室');
    })

    //监听用户退出
    socket.on('disconnect', function() {
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
    socket.on('message', function(obj) {
        obj.time = Date.parse(new Date());
        messages.push(obj);
        if(messages[obj.toId]){
          messages[obj.toId]++;
        }else{
          messages[obj.toId]= 1;
        }
        console.log(messages[obj.toId])
        io.emit('message' + obj.toId, obj);
        io.emit('message' + obj.fromId, obj);
        console.log(obj.name + '说：' + obj.content);
    });

    socket.on('status', function(obj) {
        io.emit('status', obj);
    });

    socket.on('received', function(obj) {
      messages[obj.toId]--;
        if (messages && messages.length > 0) {
            if (obj.length > 0) {
                for (let i = 0; i < obj.length; i++) {
                    messages = messages.filter(function(allmes) {
                        return allmes.id != obj[i].id && allmes.id != obj[i].time;
                    });
                }
            } else {
                messages = messages.filter(function(allmes) {
                    return allmes.id != obj.id && allmes.id != obj.time;
                });
            }
        }
        console.log(obj.content);
    });

    function reSend() {
        for(let prop in messages){
          if(messages[prop]>0) {
            io.emit('hasOutlineMes'+prop, true);
          }
        }
    }
    // 服务器时间同步
    function tick() {
        var now = new Date().toUTCString();
        io.emit('time', now);
    }

    setInterval(tick, 1000);
    setInterval(reSend, 5000);
})
