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

/*后台系统登录界面*/
router.get('/login',require("./login"));
router.post('/login',require("./login"));
//settings
router.get('/admin',require('./settings'))

module.exports = router;