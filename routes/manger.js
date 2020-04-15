var express = require('express')
//var User = require('./models/user')
var md5 = require('blueimp-md5')
//var mysql = require('mysql')
var db = require('../models/db')
var router = express.Router()

router.get('/list', function (req, res) {
  var id = req.query.id
 // console.log('class'+ id)
  req.session.user.course  = id
  var str1 = "select * from course where id = '"+id+"' and duty ='1';"
  db.query(str1, (err, data)=>{
    if(err) {throw err}
    //console.log(data)
    //查学生信息
    var str = "select * from course where id = '"+id+"' and duty ='2' order by class, num;"
    db.query(str, (err, result) => {
      if(err) {throw err}
      res.render('manger/list.html', {
        user: req.session.user,
        result: result, //student
        data: data  //课程
      })
    })
  })
})
//score
router.get('/score', function(req, res){
  res.render('manger/score.html', {
    user: req.session.user
  })
})
// manger course delete
router.get('/manger/del',function(req, res){
  var id = req.query.id
  var num = req.query.num
  //console.log(num,id)
  //1. 删除该课程中学生信息
  var str = "delete from course where num = '"+num+"';"
  db.query(str, (err, data)=>{
    if(err) {throw err}
    //2. 清空对应组表中该课程的信息
    var str1 = "update mygroup2 set name=null, num=null, class=null where num = '" + num + "' and course_id='"+id+"';"
    db.query(str, (err, result)=>{
      if(err) {throw err}
      var url = '/list?id=' + id
      res.redirect(url)
    })
  })
})

//teacher
router.get('/teacher',function(req, res){
  var str = "select * from teacher;"
  db.query(str, (err, result) => {
    if(err) {throw err}
    res.render('manger/teacher.html', {
      user: req.session.user,
      result: result
    })
  })
})

//teacher del
router.get('/teacher/del',function(req, res){
  var num = req.query.num
  //console.log('teacher'+num)
  var str = "delete teacher,course from teacher left join course on teacher.num = course.num where teacher.num = '"+num+"';"
  db.query(str, (err, data) => {
    if(err) {throw err}
    var str1= "delete from file where teacher_num = '"+num+"';"
    db.query(str1, (err, result) => {
      if(err) {throw err}
      res.redirect('/teacher')
    })
  })
})
//teacher stop 
router.get('/teacher/stop',function(req, res){
  var num = req.query.num
  //console.log(num,id)
  var str = "update course set end = '1' where num = '" + num + "';"
  db.query(str, (err, result)=>{
    if(err) {throw err}
    var str1 = "update teacher set end = '1' where num = '" + num + "';"
    db.query(str1, (err, data)=>{
      if(err) {throw err}
      res.redirect('/teacher')
    })
  })
})
//teacher use
router.get('/teacher/use',function(req, res){
  var num = req.query.num
  //console.log(num,id)
  var str = "update course set end = '0' where num = '" + num + "';"
  db.query(str, (err, result)=>{
    if(err) {throw err}
    var str1 = "update teacher set end = '0' where num = '" + num + "';"
    db.query(str1, (err, data)=>{
      if(err) {throw err}
      res.redirect('/teacher')
    })
  })
})
// student
router.get('/student',function(req, res){
  var str = "select * from student;"
  db.query(str, (err, result) => {
    if(err) {throw err}
    res.render('manger/student.html', {
      user: req.session.user,
      result: result
    })
  })
})
//student del
router.get('/student/del', function(req, res){
  var num = req.query.num
  //console.log('teacher'+num)
  //删除学生表和课程表中学生的信息
  var str = "delete student,course from student left join course on student.num = course.num where student.num = '"+num+"';"
  db.query(str, (err, data) => {
    if(err) {throw err}
    //清空对应组表中所有课程中该学生的信息
    var str1="update mygroup2 set name=null, num=null, class=null where num = '" + num + "';"
    db.query(str1, (err, result) => {
      if(err) {throw err}
      res.redirect('/student')
    })
  })
})
// student stop
router.get('/student/stop',function(req, res){
  var num = req.query.num
  //console.log(num,id)
  var str = "update course set end = '1' where num = '" + num + "';"
  db.query(str, (err, result)=>{
    if(err) {throw err}
    var str1 = "update student set end = '1' where num = '" + num + "';"
    db.query(str1, (err, data)=>{
      if(err) {throw err}
      res.redirect('/student')
    })
  })
})
//student use
router.get('/student/use',function(req, res){
  var num = req.query.num
  //console.log(num,id)
  var str = "update course set end = '0' where num = '" + num + "';"
  db.query(str, (err, result)=>{
    if(err) {throw err}
    var str1 = "update student set end = '0' where num = '" + num + "';"
    db.query(str1, (err, data)=>{
      if(err) {throw err}
      res.redirect('/student')
    })
  })
})
module.exports = router;
