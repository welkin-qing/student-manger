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
  //根据当前课程渲染组列表
  var num = req.session.user.num
  var str1 = "select * from mygroup2 where id in (select id from mygroup2 where num ='"+num+"');"
  db.query(str1, (err, data) => {
    if(err) {throw err}
    //console.log(data)
    if(data.length == 0){
      //自己的组不存在
      req.session.user.group_id = 0
    }else{
      req.session.user.group_id = data[0].id
    }
    //console.log(data.length)
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
    var str = "select * from mygroup2 where course_id = '"+id+"';"
    db.query(str, (err, result) => {
      if(err) {throw err}
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
})
//quit group
router.get('/group/quit', function(req ,res){
  var num = req.session.user.num
  var course_id = req.session.user.course
  // var group_id = req.session.user.group_id
  req.session.user.group_id = 0
  // var str = "update mygroup2 set name='',num = '',class='' where num = '"+num+"';"
  // db.query(str, (err, result) => {
  //   if(err) {throw err}
  //   res.redirect('/group')
  // })
 
 var url = '/group?id='+course_id
 res.redirect(url)
 //console.log('333')
})
// add group
router.get('/group/add', function(req, res){
  var id  = req.query.id
  console.log(id)
})
module.exports = router;