var express = require('express');
var router = express.Router();

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

router.get('/', function(req, res, next) {

  res.json({isPass:true});
});
// 在线用户
var onlineUsers = {};
// 当前在线人数
var onlineCount = 0;

io.on('connection', function(socket) {
    console.log('新用户已上线！');
    socket.on('login', function(obj) {
        // 将新加入用户的唯一标识当作socket的名称
        socket.name = obj.userid;
        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //在线人数+1
            onlineCount++;
        }
        // 向所有客户端广播用户加入
        io.emit('login', {
            onlineUsers: onlineUsers,
            onlineCount: onlineCount,
            user: obj
        });
        console.log(obj.username + '加入聊天室');
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
        io.emit('message'+'66', obj);
        console.log(obj.username + '说：' + obj.content);
    })

    // 服务器时间同步
    function tick(){
      var now = new Date().toUTCString();
      io.emit('time', now);
    }

    setInterval(tick, 1000);
})

module.exports = router;
