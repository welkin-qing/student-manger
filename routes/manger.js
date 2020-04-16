var express = require('express')
var url = require('url')
var formidable = require('formidable');
var path = require('path');
//var User = require('./models/user')
var md5 = require('blueimp-md5')
//var mysql = require('mysql')
var db = require('../models/db')
var multer = require('multer')
var fs = require('fs')
var xlsx = require('node-xlsx');
var multiparty = require('multiparty');
var router = express.Router()
var upload = multer({dest:'upload/'});
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
router.get('/student/stop',function(req, res,next){
  var num = req.query.num
  //console.log(num,id)
  var str = "update course set end = '1' where num = '" + num + "';"
  db.query(str, (err, result)=>{
    if(err) {return next(err)}
    var str1 = "update student set end = '1' where num = '" + num + "';"
    db.query(str1, (err, data)=>{
      if(err) {return next(err)}
      res.redirect('/student')
    })
  })
})
//student use
router.get('/student/use',function(req, res,next){
  var num = req.query.num
  //console.log(num,id)
  var str = "update course set end = '0' where num = '" + num + "';"
  db.query(str, (err, result)=>{
    if(err) {return next(err)}
    var str1 = "update student set end = '0' where num = '" + num + "';"
    db.query(str1, (err, data)=>{
      if(err) {return next(err)}
      res.redirect('/student')
    })
  })
})

//score
router.get('/score', function(req, res, next){
  var id = req.query.id
  var str = "select * from st_score where course_id = '"+id+"';"
  db.query(str, (err, result) => {
    if(err) {return next(err)}
    res.render('manger/score.html', {
      user: req.session.user,
      id: id,
      result: result
    })
  })
})

router.post('/manger/score', function (req, res, next) {
  var form = new multiparty.Form()
  form.uploadDir = path.join(__dirname, '../upload')
  var folder = form.uploadDir
  //console.log(form.uploadDir)
  form.keepExtensions = true
  //console.log(form)
  form.parse(req, (err, fields, files) => {
    //console.log(fields)
    var course_id = fields.course_id[0]
    var score_info = fields.score_info[0]
    //console.log(score_info,course_id)
    var file_path = files.file[0].path
    //console.log(file_path)
    var sheets = xlsx.parse(file_path);
 
    // 遍历 sheet
    var data_msg = []
    sheets.forEach(function (sheet) {
      //console.log(sheet['name']);
      // 读取每行内容
      for (var rowId in sheet['data']) {
        //console.log(rowId);
        var row = sheet['data'][rowId];
        data_msg.push(row)
        //console.log(row);
      }
    });
   // console.log(data_msg)
    function isnull(val) {
      var val_str = new String(val)
      var str = val_str.replace(/(^\s*)|(\s*$)/g, '');//去除空格;

      if (str == '' || str == undefined || str == null || str == 'undefined' || str == 'null') {
        //return true;
        //	console.log('空')
        return false
      } else {
        //return false;
        //	console.log('非空');
        return true
      }
    }
   // isnull(1)
    function str_null(a, b, c, d) {
     // console.log(a,b,c,d)
      var a1 = isnull(a)
      var b1 = isnull(b)
      var c1 = isnull(c)
      var d1 = isnull(d)
      //console.log(a1,b1,c1,d1)
      if (a1 && b1 && c1 && d1) {
        //console.log('true')
        return true
      } else {
        //console.log('false')
        return false
      }
    }
    var available = 0;
    var total = parseInt(data_msg.length-1)
    var str = ``
    var str1 = 'insert into st_score (course_id, score_info, num, name, class, score) values '
    var str2 = ''
    for(let i=1; i<data_msg.length-1; i++){
      var msg_isnull = str_null(data_msg[i][0],data_msg[i][1],data_msg[i][2],data_msg[i][3])
      //console.log(msg_isnull)
      if(msg_isnull){
        str2 = str2+"('"+course_id+"','"+score_info+"','"+data_msg[i][0]+"','"+data_msg[i][1]+"','"+data_msg[i][2]+"','"+data_msg[i][3]+"'),"
        available++
      }
    }
    var j = parseInt(data_msg.length-1)
    var msg_isnull1 = str_null(data_msg[j][0],data_msg[j][1],data_msg[j][2],data_msg[j][3])
    if(msg_isnull1){
      str3 = "('"+course_id+"','"+score_info+"','"+data_msg[j][0]+"','"+data_msg[j][1]+"','"+data_msg[j][2]+"','"+data_msg[j][3]+"');"
      available++
    }else{
      str3=";"
    }
    
    
    str = str1+str2+str3
    //console.log(str)
    db.query(str, (err, result) => {
      if(err) {return next(err)}
      //删除已上传的文件
      deleteFolder(folder);
      function deleteFolder(path) {
        let files = [];
        if (fs.existsSync(path)) {
          files = fs.readdirSync(path);
          files.forEach(function (file, index) {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
              deleteFolder(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
      }

      res.status(200).json({
        err_code: 0,
        message: 'ok',
        total: total,
        available: available
      })
    })
  })
})
module.exports = router;
