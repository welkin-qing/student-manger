var express = require('express')
//var User = require('./models/user')
var md5 = require('blueimp-md5')
//var mysql = require('mysql')
 var db = require('../models/db')
var router = express.Router()

router.get('/', function (req, res) {
  // console.log(req.session.user)
  res.render('index.html', {
    user: req.session.user
  })
})
//test
router.get('/test',function(req, res){
  res.render("test.html")
})

/*后台系统登录界面*/
router.get('/login',require("./login"));
router.post('/login',require("./login"));
//settings
router.get('/admin',require('./settings'))
router.post('/admin',require('./settings'))
router.get('/profile', require('./settings'))
router.post('/profile', require('./settings'))

//logout
router.get('/logout', function (req, res) {
  // 清除登陆状态
  req.session.user = null
  // 重定向到登录页
  res.redirect('/login')
})
module.exports = router;