var express = require('express')
var md5 = require('blueimp-md5')
var db = require('../models/db')
var router = express.Router()


//admin
router.get('/admin', function (req, res) {
  res.render('settings/admin.html', {
    user: req.session.user
  })
})
router.post('/admin', function (req, res) {
  var body = req.body
  //console.log(body.password0)
  var password = req.session.user.password
  var password0 = body.password0
  var password1 = body.password1
 // console.log(req.session.user)
  var num = req.session.user.num
  var duty = req.session.user.duty
  // console.log(duty)
  if (duty == 1) {
    //teacher
    if (password0 != password) {
      //原始密码输入错误
      console.log('原始密码输入错误')
      res.status(200).json({
        err_code: 1,
        message: 'origin password error'
      })
    } else{
      //改密码
      var str1 = "update teacher set password ='" + password1 + "'where num =" + num + ";"
      db.query(str1, (err, result) => {
        if (err) { throw err }
        res.status(200).json({
          err_code: 0,
          message: 'ok'
        })
      })
      req.session.user.password = password1
    }
  } else if (duty == 2) {
    //student
    if (password0 != password) {
      //原始密码输入错误
      console.log('原始密码输入错误')
      res.status(200).json({
        err_code: 1,
        message: 'origin password error'
      })
    } else {
      var str1 = "update student set password ='" + password1 + "'where num =" + num + ";"
      db.query(str1, (err, result) => {
        if (err) { throw err }
        res.status(200).json({
          err_code: 0,
          message: 'ok'
        })
      })
      req.session.user.password = password1
    }
  } else {
    //inout error
    res.status(200).json({
      err_code: 500,
      message: 'server error'
    })
  }
})

//profile
router.get('/profile', function (req, res) {
  res.render('settings/profile.html', {
    user: req.session.user
  })
})
router.post('/profile', function(req, res){
  var body = req.body
  //console.log(body)
  var duty = req.session.user.duty
  var num = req.session.user.num
 // console.log(duty)
  if(duty == 1){
    //teacher
    var str = "update teacher set name='"+body.name+"',email='"+body.email+"',sex='"+body.sex+"',phone='"+body.phone+"' where num='"+num+"';"
    db.query(str, (err, result) => {
      if(err) { throw err }
      req.session.user.name = body.name
      req.session.user.email = body.email
      req.session.user.sex = body.sex
      req.session.user.phone = body.phone
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  }else if(duty == 2){
  //  student
    //student  update student set sex = '1',phone ='17691266938'where num = '04151027';
    var str = "update student set name='"+body.name+"',class='"+body.class+"',sex='"+body.sex+"',phone='"+body.phone+"' where num='"+num+"';"
    db.query(str, (err, result) => {
      if(err) { throw err }
      req.session.user.name = body.name
      req.session.user.class = body.class
      req.session.user.sex = body.sex
      req.session.user.phone = body.phone
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  }else{
    res.status(200).json({
      err_code: 500,
      message: 'server error'
    })
  }
})
module.exports = router;
