var express = require('express')
//var User = require('./models/user')
var md5 = require('blueimp-md5')
//var mysql = require('mysql')
 var db = require('../models/db')
var router = express.Router()

router.get('/', function (req, res) {
 // console.log(req.session.user)
  var str = "select * from file;"
  db.query(str, (err, result) => {
    if(err) { throw err}
    //console.log(result)
    res.render('index.html', {
      user: req.session.user,
      result: result
    })
  })
  // res.render('index.html', {
  //   user: req.session.user
  // })
})
// router.get('/file', function(req, res){
//   var str = "select * from file;"
//   db.query(str, (err, result) => {
//     if(err) { throw err}
//     //console.log(result)
//     res.status(200).json({
//       err_code: 0,
//       message: 'ok',
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

/*后台系统登录界面*/
router.get('/login',require("./login"));
router.post('/login',require("./login"));
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
router.get('/class', require('./controllers'))
router.get('/group', require('./controllers'))
router.get('/group/quit', require('./controllers'))
router.get('/group/add', require('./controllers'))
//logout
router.get('/logout', function (req, res) {
  // 清除登陆状态
  req.session.user = null
  // 重定向到登录页
  res.redirect('/login')
})
module.exports = router;