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
  var str = "select * from course where id = '"+id+"' and duty ='2' order by class, num;"
  db.query(str, (err, result) => {
    if(err) {throw err}
    res.render('controllers/class.html', {
      user: req.session.user,
      result: result
    })
  })
})

//group
router.get('/group', function (req, res) {
  var id = req.query.id
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
    var str1 = "select * from mygroup2 where id in (select id from mygroup2 where num ='" + num + "');"
    db.query(str1, (err, data) => {
      if (err) { throw err }
      if (data.length == 0) {
        //自己的组不存在
        req.session.user.group_id = 0
      } else {
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
  console.log(str)
  db.query(str, (err, result) => {
    if (err) { throw err }
    //res.redirect('/group')
    var url = '/group?id=' + course_id
    res.redirect(url)
  })
})
// add group
router.get('/group/add', function(req, res){
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
})



module.exports = router;