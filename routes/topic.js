var express = require('express')
var md5 = require('blueimp-md5')
var db = require('../models/db')
var router = express.Router()
//var new = require('../public/lib/JavaScriptLatest/')
//var qiniu = require('qiniu')


//new 发布作业
router.get('/new', function (req, res) {
  var num = req.session.user.num
  //选择未结束的课程
  var str = "select * from course where num ='"+num+"'and end='0';"
  db.query(str, (err, result)=>{
    if(err) {throw err}
    res.render('topic/new.html', {
      user: req.session.user,
      result: result
    })
  })
})
router.post('/new', function (req, res,next) {

  var duty = req.session.user.duty
  var body = req.body
 // console.log(body)
  if (duty === 1) {
    //teacher
    var num = req.session.user.num
    var name = req.session.user.name
    var id = body.time
    // str = 'select * from file;'
    var str = `insert into file (topic, content, time, teacher_name, teacher_num, file_name, is_group,course_id)
       values('`+body.topic+`', '`+body.content+`', '`+body.time+`', '`+name+`', '`+num+`', '`+body.fileUrl+`', '`+body.group+`','`+body.course_id+`');`
    db.query(str, (err, result) => {
      if (err) { return next(err) }
      //console.log(result.length)//得到数据长度
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  }
})
//show
router.get('/show', function (req, res) {
  var id = req.query.id
  var str = "select * from file where id = '"+id+"';"
  db.query(str, (err, result) => {
    if(err){ throw err}
    var str1 = "select * from stu_put where file_id ='"+id+"';"
    db.query(str1, (err, data) => {
      if(err){ throw err}
      var length = data.length
      res.render('topic/show.html', {
        user: req.session.user,
        result: result[0],
        data: data,
        length: length
      })
    })
    
  })
  
})
//评论
router.post('/show', function(req, res, next){
  var body = req.body
  //console.log(body)
  var num = req.session.user.num
  var name = req.session.user.name
 // console.log(num, name)
  var str = `insert into stu_put (content, time, file_id, file_name, stu_num, stu_name, group_id)
  values
  ('`+body.content+`','`+body.time+`','`+body.file_id+`','`+body.file_name+`','`+num+`','`+name+`','`+body.group_id+`');`
  //console.log(str)
  db.query(str, (err, result) => {
    if(err) { return next(err)}
    //console.log('111')
    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
})

//获取评论列表
// router.get('/put', function(req, res){
//   var body = req.body
//   console.log(body)
//   var id = req.query.id
//   console.log(id)
// })
// router.get('/show/content', function(req, res){
//   var id = req.query.id
//   console.log(id)
// })
module.exports = router;