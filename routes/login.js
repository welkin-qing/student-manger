var express = require('express')
//var User = require('./models/user')
var md5 = require('blueimp-md5')
//var mysql = require('mysql')
var db = require('../models/db')
var router = express.Router()

router.get('/login', function (req, res) {
  res.render('login.html')
})
router.post('/login', function (req, res, next) {
  // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var body = req.body
  var duty = body.duty
  var num = body.number
  var password = body.password
  console.log(duty)
  if (duty == 0) {
    //manger
    //console.log('i am manger')
    var str = 'select password from manger where num = ' + num;
    db.query(str, (err, result) => {
      if (err) { throw err }
      // console.log(result)
      if (result.length === 0) {
        //console.log("找不到账号！")
        res.status(200).json({
          err_code: 2,
          message: 'OK'
        })
      } else if (password != result[0].password) {
        //console.log("密码错误")
        res.status(200).json({
          err_code: 1,
          message: 'OK'
        })
      }
      else {
        // console.log("成功登陆!")
        res.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      }
    })
  } else if (duty == 1) {
    //teacher
    //console.log('i am teacher')
    var str = 'select password from teacher where num = ' + num;
    db.query(str, (err, result) => {
      if (err) { throw err }
      // console.log(result)
      if (result.length === 0) {
        //console.log("找不到账号！")
        res.status(200).json({
          err_code: 2,
          message: 'OK'
        })
      } else if (password != result[0].password) {
        //console.log("密码错误")
        res.status(200).json({
          err_code: 1,
          message: 'OK'
        })
      }
      else {
        // console.log("成功登陆！!")
        res.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      }
    })
  } else if (duty == 2) {
    //student
    //console.log('i am student')
    var str = 'select * from student where num = ' + num;

    db.query(str, (err, result) => {
      if (err) { throw err }
       console.log(result)
      if (result.length === 0) {
        //console.log("找不到账号！")
        res.status(200).json({
          err_code: 2,
          message: 'OK'
        })
      } else if (password != result[0].password) {
        //console.log("密码错误")
        res.status(200).json({
          err_code: 1,
          message: 'OK'
        })
      }
      else {
        // console.log("成功登陆！!")
        console.log(result[0].password)
        req.session.user = result[0]
        res.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      }
    })
  }
})
module.exports = router;