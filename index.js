var express = require('express');
var cors = require('cors');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');
var sha1 = require('sha1');
var bodyParser = require('body-parser');
var _jwt =  require('express-jwt');

var jwt = require('jsonwebtoken');
var http = require('http').Server(app);
var io = require('socket.io')(http);

jwt.sign({ foo: 'bar' }, 'cert');
// var qr = require('qr-image');
// var qr_svg = qr.image('yuanwen.yang', { type: 'svg' });
// qr_svg.pipe(fs.createWriteStream('public/user/qrCode/yuanwen.yang.svg'));
var app = express();

// var UserModel = require('./models/users');

// user = {
//     accountName: 'hansan.wu',
//     password: sha1('456abc'),
//     name: "吴汉三",
//     photo: "user/photo/hansan.wu.jpg",
//     secDim: "user/qrCode/hansan.wu.svg",
//     mobile: 15864521478,
//     telephone: "0757-85624895",
//     mail: "456@163.com",
//     position: "总经理助理",
//     department: "维森集团/集团总经办"
// };

    // fs.link('D:/123165.png','./1235nbfd.png',(err) =>{
    //   console.log(err);
    // });
app.use(cors());
//设置跨域访问

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
// UserModel.create(user).then((res) => {
//   // 此 user 是插入 mongodb 后的值，包含 _id
//       user = res.ops[0];
//       // 将用户信息存入 session
//       delete user.password;
//       console.log(user);
// }).catch(function (e) {
//   console.log(e)
//     });

routes(app);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});
// var rOption={
//     flags:"r",
//     encoding:'base64',
//     mode:0666
// }
//
// var wOption = {
//   flags: 'a',
//   encoding: 'base64',
//   mode: 0666
// }
// var fileReadStream=fs.createReadStream('D:/111.jpg',rOption);
// var fileWriteStream = fs.createWriteStream('D:/github/shunda/public/254.jpg',wOption);
//
// fileReadStream.on('data',function(data){
//     fileWriteStream.write(data);
// });
//
// fileReadStream.on('end',function(){
//     console.log("readStream end");
//     fileWriteStream.end();
// });
// 监听端口，启动程序

app.listen(config.port, function() {
    console.log(`${pkg.name} listening on port ${config.port}`);
});
