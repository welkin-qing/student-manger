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
//  console.log(duty)
  if (duty == 0) {
    //manger
    //console.log('i am manger')
    var str = 'select * from manger where num = ' + num;
    db.query(str, (err, result) => {
      if (err) { throw err }
      // console.log(result)
      if (result.length === 0) {
        //console.log("找不到账号！")
        res.status(200).json({
          err_code: 2,
          message: 'not find number'
        })
      } else if (password != result[0].password) {
        //console.log("密码错误")
        res.status(200).json({
          err_code: 1,
          message: 'password error'
        })
      }
      else {
        // console.log("成功登陆!")
        req.session.user = result[0]
        req.session.user.duty = 0
        //res.redirect('/list')
        res.status(200).json({
          err_code: 201,
          message: 'manger OK'
        })
      }
    })
  } else if (duty == 1) {
    //teacher
    //console.log('i am teacher')
    var str = 'select * from teacher where num = ' + num;
    db.query(str, (err, result) => {
      if (err) { throw err }
       //console.log(result)
      if (result.length === 0) {
        //console.log("找不到账号！")
        res.status(200).json({
          err_code: 2,
          message: 'not find number'
        })
      } else if (password != result[0].password) {
        //console.log("密码错误")
        res.status(200).json({
          err_code: 1,
          message: 'password error'
        })
      }else if(result[0].end == 1){
        res.status(200).json({
          err_code: 3,
          message: '该账户已停用，请联系管理员处理!'
        })
      }else {
        // console.log("成功登陆！!")
        req.session.user = result[0]
       // console.log(req.session.user)
        req.session.user.duty = 1
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
      // console.log(result[0].password)
      if (result.length === 0) {
        //console.log("找不到账号！")
        res.status(200).json({
          err_code: 2,
          message: 'not find number'
        })
      } else if (password != result[0].password) {
        //console.log("密码错误")
        res.status(200).json({
          err_code: 1,
          message: 'password error'
        })
      }else if(result[0].end == 1){
        res.status(200).json({
          err_code: 3,
          message: '该账户已停用，请联系管理员处理!'
        })
      }else {
        // console.log("成功登陆！!")
        //console.log(result[0].password)
        req.session.user = result[0]
        req.session.user.duty = 2
        res.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      }
    })
  }
})
router.get('/register', function(req, res){
  res.render('register.html')
})
router.post('/register', function(req, res){
  var body = req.body
  var duty = parseInt(body.duty)
  if(duty==1){
    //teacher  1
    var str = "select * from teacher where num ='"+body.num+"';"
    db.query(str, (err, result)=> {
      if(err) {throw err}
      if(result.length == 0){
        //账号不存在,就可以用来注册
        var str1 = "insert into teacher (num, name, password) values ('"+body.num+"','"+body.name+"','"+body.password+"')"
        db.query(str1, (err, data)=>{
          if(err) throw(err)
          req.session.user = body
          res.status(200).json({
            err_code: 0,
            message: 'ok'
          })
        })
      }else{
        //已存在账号，无法注册
        res.status(200).json({
          err_code: 1,
          message: '已存在账号'
        })
      }
    })
  }else if(duty ==2){
    //student
    var str = "select * from student where num ='"+body.num+"';"
    db.query(str, (err, result)=> {
      if(err) {throw err}
      // console.log(result)
      // console.log(result.length)
      if(result.length == 0){
        //账号不存在,就可以用来注册
        var str1 = "insert into student (num, name, password) values ('"+body.num+"','"+body.name+"','"+body.password+"')"
        db.query(str1, (err, data)=>{
          if(err) throw(err)
          req.session.user = body
          req.session.user.num = parseInt(body.num)
          res.status(200).json({
            err_code: 0,
            message: 'ok'
          })
        })
      }else{
        //已存在账号，无法注册
        res.status(200).json({
          err_code: 1,
          message: '已存在账号'
        })
      }
    })
  }
})
module.exports = router;