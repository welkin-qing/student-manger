var express = require('express')
//var User = require('./models/user')
var md5 = require('blueimp-md5')
//var mysql = require('mysql')
 var db = require('../models/db')
var router = express.Router()

router.get('/', function (req, res) {
  var dl = req.session.user
  //var num = req.session.user.num
  if(dl){
    //登录成功 判断身份
    //console.log('1')
    if(duty == 0){
      //manger
    }else{
      //teacher student
      var duty = req.session.user.duty
      var num = req.session.user.num
      var str="select * from file where course_id in(select id from course where num='"+num+"');"
      db.query(str, (err, result)=>{
        if(err) {throw err}
        res.render('index.html', {
          user: req.session.user,
          result: result
        })
      })
    }
  }else{
    //未登录成功 显示所有file
    //console.log('2')
    var str = "select * from file;"
    db.query(str, (err, result) => {
      if(err) { throw err}
      //console.log(result)
      res.render('index.html', {
        user: req.session.user,
        result: result
      })
    })
  }
  //var str="select * from file where course_id in(select id from course where num='"+num+"');"
  //console.log(str)
  // db.query(str, (err, result)=>{
  //   if(err) {throw err}
  //   console.log(result)
  // })
})
// router.get('/', function(req, res){
//   var str = "select * from file;"
//   db.query(str, (err, result) => {
//     if(err) { throw err}
//     //console.log(result)
//     res.render('index.html', {
//       user: req.session.user,
//       result: result
//     })
//   })
// })
//delete
router.get('/delete', function (req, res) {
  var id = req.query.id
  var str = "delete from file where id =" + id + ";"
  db.query(str, (err, result) => {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/')
  })
})
//test
router.get('/test',function(req, res){
  res.render("test.html")
})
//test1
router.get('/test1',function(req, res){
  res.render("test1.html")
})

/*后台系统登录注册界面*/
router.get('/login',require("./login"));
router.post('/login',require("./login"));
router.get('/register',require("./login"));
router.post('/register',require("./login"));
//settings
router.get('/admin',require('./settings'))
router.post('/admin',require('./settings'))
router.get('/profile', require('./settings'))
router.post('/profile', require('./settings'))
//topic
router.get('/new',require('./topic'))
router.post('/new', require('./topic'))
router.get('/show',require('./topic'))
router.post('/show',require('./topic'))
router.get('/put', require('./topic'))
//controllers
router.get('/course', require('./controllers'))
//课程的创建、添加、删除、结束、取消结束（manger）
router.post('/course/new',require('./controllers'))
router.post('/course/add',require('./controllers'))
router.get('/course/delete',require('./controllers'))
router.get('/course/end',require('./controllers'))
router.get('/course/cancelend', require('./controllers'))
//班级
router.get('/class', require('./controllers'))
router.get('/class/list', require('./controllers'))
router.get('/group', require('./controllers'))
//组的退出与加入
router.get('/group/quit', require('./controllers'))
router.get('/group/add', require('./controllers'))
//talk
router.get('/talk', require('./talk'))
router.get('/choice', require('./talk'))

//manger
router.get('/list',require('./manger'))
router.get('/course/list', require('./manger'))
router.get('/manger/del', require('./manger'))
router.get('/teacher',require('./manger'))
router.get('/teacher/list', require('./manger'))
router.get('/teacher/del', require('./manger'))
router.get('/teacher/stop', require('./manger'))
router.get('/teacher/use', require('./manger'))
router.get('/student',require('./manger'))
router.get('/student/list', require('./manger'))
router.get('/student/del', require('./manger'))
router.get('/student/stop', require('./manger'))
router.get('/student/use', require('./manger'))
router.post('/manger/score',require('./manger'))
router.get('/score',require('./manger'))
router.get('/score/del', require('./manger'))
router.get('/score/list', require('./manger'))
router.post('/score/mod', require('./manger'))
router.post('/score/add', require('./manger'))

//logout
router.get('/logout', function (req, res) {
  // 清除登陆状态
  req.session.user = null
  // 重定向到登录页
  res.redirect('/login')
})
module.exports = router;