var express = require('express')
var md5 = require('blueimp-md5')
var db = require('../models/db')
var router = express.Router()

//course
router.get('/course', function(req, res){
  var duty =  req.session.user.duty
  var num = req.session.user.num
 // console.log(duty)
  if(duty==1){
    //teacher  显示所负责的课 还有科目信息
    var str = "select * from course where num ='"+num+"' "
    db.query(str, (err, result) => {
      if(err) {throw err}
      res.render('controllers/course.html', {
        user: req.session.user,
        result: result
      })
    })
  }else if (duty ==2){
    //student 显示自己所上的课 还有科目信息
    var str = "select * from course where id in(select id from course where num ='"+num+"')and duty ='1';"
    db.query(str, (err, result) => {
      if(err) {throw err}
      res.render('controllers/course.html', {
        user: req.session.user,
        result: result
      })
    })
  }
})

//class
router.get('/class', function(req, res){
  var id = req.query.id
  req.session.user.course  = id
  var str = "select * from course where id = '"+id+"' and duty ='2';"
  db.query(str, (err, result) => {
    if(err) {throw err}
    res.render('controllers/class.html', {
      user: req.session.user,
      result: result
    })
  })
})

//group
router.get('/group', function(req, res){
  var id = req.query.id
  res.render('controllers/group.html', {
    user: req.session.user
  })
})
module.exports = router;