var express = require('express')
var md5 = require('blueimp-md5')
var db = require('../models/db')
var random = require('string-random')
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
  }else if(duty == 0){
    //manger 显示所有课程信息
    var str = "select * from course where duty = '1'"
    db.query(str, (err, result)=>{
      if(err) {throw err}
      res.render('controllers/course.html', {
        user: req.session.user,
        result: result
      })
    })
  }
})

//course new 老师创建课程 
router.post('/course/new', function(req,res){
  var body = req.body
  //console.log(body)
  var course_id = random(7,{letters:false})
 // console.log(course_id)
  var num = req.session.user.num
  var name = req.session.user.name
  var str = `insert into course (id, course_name, num, name, duty, info) values
  (`+parseInt(course_id)+`,'`+body.course_name+`',`+num+`,'`+name+`',1,'`+body.course_info+`');`
  db.query(str, (err, result)=>{
    if(err) {throw err}
    var str1 = `insert into mygroup2 (id, name, num, class, course_id, sort) values
    (1,null,null,null,'`+course_id+`',1),(1,null,null,null,'`+course_id+`',2),(1,null,null,null,'`+course_id+`',3),(1,null,null,null,'`+course_id+`',4),
    (2,null,null,null,'`+course_id+`',1),(2,null,null,null,'`+course_id+`',2),(2,null,null,null,'`+course_id+`',3),(2,null,null,null,'`+course_id+`',4),
    (3,null,null,null,'`+course_id+`',1),(3,null,null,null,'`+course_id+`',2),(3,null,null,null,'`+course_id+`',3),(3,null,null,null,'`+course_id+`',4),
    (4,null,null,null,'`+course_id+`',1),(4,null,null,null,'`+course_id+`',2),(4,null,null,null,'`+course_id+`',3),(4,null,null,null,'`+course_id+`',4),
    (5,null,null,null,'`+course_id+`',1),(5,null,null,null,'`+course_id+`',2),(5,null,null,null,'`+course_id+`',3),(5,null,null,null,'`+course_id+`',4),
    (6,null,null,null,'`+course_id+`',1),(6,null,null,null,'`+course_id+`',2),(6,null,null,null,'`+course_id+`',3),(6,null,null,null,'`+course_id+`',4),
    (7,null,null,null,'`+course_id+`',1),(7,null,null,null,'`+course_id+`',2),(7,null,null,null,'`+course_id+`',3),(7,null,null,null,'`+course_id+`',4),
    (8,null,null,null,'`+course_id+`',1),(8,null,null,null,'`+course_id+`',2),(8,null,null,null,'`+course_id+`',3),(8,null,null,null,'`+course_id+`',4),
    (9,null,null,null,'`+course_id+`',1),(9,null,null,null,'`+course_id+`',2),(9,null,null,null,'`+course_id+`',3),(9,null,null,null,'`+course_id+`',4),
    (10,null,null,null,'`+course_id+`',1),(10,null,null,null,'`+course_id+`',2),(10,null,null,null,'`+course_id+`',3),(10,null,null,null,'`+course_id+`',4);`
    db.query(str1, (err, data)=>{
      if(err) {throw err}
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  })
})

//course delete 老师删除课程
router.get('/course/delete', function(req, res){
  var id = req.query.id
  //1. delete course  学生处也会删除
  var str = "delete from course where id='"+id+"';"
  db.query(str, (err, result)=>{
    if(err) {throw err}
    //2. delete group file
    var str1 = "delete mygroup2,file from mygroup2 left join file on mygroup2.course_id = file.course_id where mygroup2.course_id ='"+id+"';"
    db.query(str1, (err, data)=>{
      if(err) {throw err}
      res.redirect('/course')
    })
  })
})

//course end 老师结束课程
router.get('/course/end', function(req, res){
  var id = req.query.id
  var str = "update course set end='1' where id='"+id+"' and duty='1';"
  db.query(str, (err, result)=>{
    if(err) {throw err}
    var str1 = "update file set end='1' where course_id ='"+id+"';"
    db.query(str1, (err, data)=>{
      if(err) {throw err}
      res.redirect('/course')
    })
  })
})

//cancel course manger cancel 课程
router.get('/course/cancelend',function(req, res){
  var id = req.query.id
  var str = "update course set end='0' where id='"+id+"' and duty='1';"
  db.query(str, (err, result)=>{
    if(err) {throw err}
    var str1 = "update file set end='0' where course_id ='"+id+"';"
    db.query(str1, (err, data)=>{
      if(err) {throw err}
      res.redirect('/course')
    })
  })
})

//course add 学生添加课程
router.post('/course/add', function(req, res){
  var body = req.body
  var num = req.session.user.num
  var name = req.session.user.name
  var class_id = req.session.user.class
  var class_info = ''
  console.log(class_id)
  //判断班级是否存在
  if(class_id){
    //存在
    class_info = class_id
  }else{
    //不存在
    class_info = ''
  }
  //1. 查询id是否存在
  var str1 = "select * from course where id = '"+parseInt(body.course_id)+"';"
  db.query(str1, (err, data)=>{
    if(err) {throw err}
    if(data.length == 0){
      //查不到这个课
      res.status(200).json({
        err_code: 1,
        message: '课程id输入错误，请重新输入!'
      })
    }else{
      var str = `insert into course (id, num, name,class,duty) values
      (`+body.course_id+`,`+num+`,'`+name+`','`+class_info+`',2);`
      db.query(str, (err, result)=>{
        if(err) {throw err}
        res.status(200).json({
          err_code: 0,
          message: 'ok'
        })
      })
    }
  })
})

//class
router.get('/class', function(req, res){
  var id = req.query.id
  //console.log('class'+ id)
  req.session.user.course  = id
  var str1 = "select id, course_name from course where id = '"+id+"' and duty ='1';"
  db.query(str1, (err, data)=>{
    if(err) {throw err}
    //console.log(data)
    //查学生信息
    var str = "select * from course where id = '"+id+"' and duty ='2' order by class, num;"
    db.query(str, (err, result) => {
      if(err) {throw err}
      res.render('controllers/class.html', {
        user: req.session.user,
        result: result,
        data: data
      })
    })
  })
})
//class list
router.get('/class/list', function(req, res, next){
  var id = req.query.id
  var str = "select * from course where id = '"+id+"' and duty ='2' order by class, num;"
  db.query(str, (err, result) => {
    if(err) {return next(err)}
    res.status(200).json({
      err_code: 0,
      message: 'ok',
      rows: result
    })
  })
})
//group
router.get('/group', function (req, res) {
  var id = req.query.id //课程id
  var duty = parseInt(req.session.user.duty)
  if (duty == 1) {
    //teacher
    var str = "select * from mygroup2 where course_id = '" + id + "';"
    db.query(str, (err, result) => {
      if (err) { throw err }
     // console.log(result)
      let resultFilter = {}
      result.map((item) => {
        if (resultFilter[String(item.id)]) {
          resultFilter[String(item.id)].push(item)
          // console.log(item)
        } else {
          let arr = []
          arr.push(item)
          resultFilter[String(item.id)] = arr
        }
      })
     //console.log(resultFilter)
      res.render('controllers/group.html', {
        user: req.session.user,
        result: resultFilter
      })
    })
  } else if (duty == 2) {
    //student
    //根据当前课程渲染组列表
    var num = req.session.user.num
    var str1 = "select * from mygroup2 where id in (select id from mygroup2 where num ='" + num + "') and course_id = '"+id+"';"
    db.query(str1, (err, data) => {
      if (err) { throw err }
      if (data.length == 0) {
        //自己的组不存在
        req.session.user.group_id = 0
      } else {
        req.session.user.group_id = data[0].id
      }
      //console.log(data.length)
      //console.log(data)
      let dataFilter = {} //自己的组
      data.map((item) => {
        if (dataFilter[String(item.id)]) {
          dataFilter[String(item.id)].push(item)
          //   console.log(item)
        } else {
          let arr = []
          arr.push(item)
          dataFilter[String(item.id)] = arr
        }
      })
      // console.log(dataFilter)
      var str = "select * from mygroup2 where course_id = '" + id + "';"
      db.query(str, (err, result) => {
        if (err) { throw err }
        // var data = JSON.stringify(result)
        let resultFilter = {}
        result.map((item) => {
          if (resultFilter[String(item.id)]) {
            resultFilter[String(item.id)].push(item)
            // console.log(item)
          } else {
            let arr = []
            arr.push(item)
            resultFilter[String(item.id)] = arr
          }
        })
        // console.log(dataFilter)
        res.render('controllers/group.html', {
          user: req.session.user,
          data: dataFilter,
          result: resultFilter
        })
      })
    })
  }
})
//quit group
router.get('/group/quit', function (req, res) {
  var num = req.session.user.num
  var course_id = req.session.user.course
  //将session中的自己的组group_id置空
  req.session.user.group_id = 0
  var str = "update mygroup2 set name=null, num=null, class=null where num = '" + num + "';"

  db.query(str, (err, result) => {
    if (err) { throw err }
    //res.redirect('/group')
    var url = '/group?id=' + course_id
    res.redirect(url)
  })
})
// add group
router.get('/group/add', function(req, res){
//  console.log(req.query.group)
  var isGroup = req.query.group
  if(parseInt(isGroup) == 0){
    var group_id  = req.query.id
  var course_id = req.session.user.course
  var name = req.session.user.name
  var num = req.session.user.num
  var class_id = req.session.user.class
  let m  = 5  //表示即将加入的位置
  var str = "select * from mygroup2 where id = '"+group_id+"' and course_id='"+course_id+"';"
  db.query(str, (err, data) => {
    if(err) {throw err}
    for(let i =0; i<data.length;i++){
     // console.log(data[i].num)
      if(!data[i].num){
        m--
      }
    }

    if(m == 5){
      //人员满
      var url = '/group?id=' + course_id
      res.redirect(url)
    }else{
      var str1 = "update mygroup2 set name='"+name+"',num='"+num+"',class='"+class_id+"' where id = '"+group_id+"'and course_id='"+course_id+"'and sort='"+m+"';"
      db.query(str1, (err, result) => {
        if(err) {throw err}
        // res.status(200).json({
        //   err_code: 0,
        //   message: 'ok'
        // })
       // res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); 
       // res.send("<script>alert('添加成功!');</script>");
        var url = '/group?id=' + course_id
        res.redirect(url)
      })
     }
   })
  }
})



module.exports = router;