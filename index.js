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
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
//backdate a jwt 30 seconds
var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
console.log(token);
console.log(older_token);
var decoded = jwt.verify(token,'shhhhh');
console.log(decoded.foo);
var oa_token = jwt.sign({
  accountName: 'yuanwen.yang'
}, 'secret', { expiresIn: 5 });
console.log(jwt.verify(oa_token,'secret'));
// setTimeout(() => {
//   jwt.verify(oa_token,'secret', function(err, decoded) {
//   // console.log(decoded.foo)
//   console.log(err); // bar
// })
// },6000)
// sign asynchronously
jwt.sign({ foo: 'bar' }, 'cert');
// var qr = require('qr-image');
// var qr_svg = qr.image('yuanwen.yang', { type: 'svg' });
// qr_svg.pipe(fs.createWriteStream('public/user/qrCode/yuanwen.yang.svg'));
var app = express();

var UserModel = require('./models/users');

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


// app.get('/',function(req, res) {
//   // res.json([{sdf:'dfg'},{dfgd:{dfg:'retgr'}}]);
//   res.write('./1235nbfd.png',"binary");
//   res.end();
// });
//
//
// app.post('/',function(req, res) {
//   res.send('hello fdg');
//   var postData = "";
//   req.setEncoding("binary");
//   req.addListener("data", function(posDataChunk){
//     postData += posDataChunk;
//     console.log("Receive POST data chunk" + posDataChunk);
//   });
//   req.addListener("end", function() {
//       console.log(postData);
//   })
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//     name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
//     secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
//     resave: true, // 强制更新 session
//     saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
//     cookie: {
//         maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
//     },
//     store: new MongoStore({ // 将 session 存储到 mongodb
//         url: config.mongodb // mongodb 地址
//     })
// }));
// UserModel.create(user).then((res) => {
//   // 此 user 是插入 mongodb 后的值，包含 _id
//       user = res.ops[0];
//       // 将用户信息存入 session
//       delete user.password;
//       console.log(user);
// }).catch(function (e) {
//   console.log(e)
//     });
// 路由
// app.use(_jwt({secret: config.jwt.secret }).unless({path:['/user', '/user/update/picture']}));
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
