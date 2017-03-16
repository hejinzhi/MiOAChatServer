var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');
var sha1 = require('sha1');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/user/photo');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });
router.get('/', function(req, res, next) {

  res.json({isPass:true});
});

router.post('/', function(req, res, next) {
  var accountName = req.body.accountName;
  var password = req.body.password;
  UserModel.getUserByName(accountName).then(function(user){
    if(!user){
      res.json({error:'账号不存在'});

    }else {
      if(sha1(password) !== user.password ){
        res.json({error:'密码或账号名错误'});
      }else{
        res.json({user:user});
      }
    }
  });
});

router.post('/update', function(req, res, next) {
  var accountName = req.body.accountName;
  var data = req.body.data;
  if(data.mobile){
    data.mobile = +data.mobile;
  }
  UserModel.updateDetailById(accountName,data).then(function(user){
    if(!user){
      res.json({isPass:false,error:'账号不存在'});

    }else {
        res.json({isPass:true});
    }
  });
});

router.post('/update/picture', upload.array('file', 1), function(req, res, next) {
  console.log(req.body.accountName);
  console.log(req.files[0].filename);
  UserModel.updateDetailById(req.body.accountName,{photo: 'user/photo/' + req.files[0].filename}).then(function(user) {
    if(!user){
      res.json({isPass:false,error:'账号不存在'});

    }else {
        res.json({isPass:true});
        console.log('done');
    }
  });
});

module.exports = router;
