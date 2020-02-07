var express = require('express')
var md5 = require('blueimp-md5')
var db = require('../models/db')
var router = express.Router()
//var new = require('../public/lib/JavaScriptLatest/')
//var qiniu = require('qiniu')


//new 发布作业
router.get('/new', function (req, res) {
  res.render('topic/new.html', {
    user: req.session.user
  })
})

router.post('/new', function (req, res) {

  var duty = req.session.user.duty
  var body = req.body
  if (duty === 1) {
    //teacher
    var num = req.session.user.num
    var id = body.time
    // str = 'select * from file;'
    var str = "insert into file (id,topic,content,time,teacher_num,file_name) values ('" + id + "','" + body.topic + "', '" + body.content + "', '" + body.time + "', '" + num + "','" + body.fileUrl + "');"
    // console.log(str)
    db.query(str, (err, result) => {
      if (err) { throw err }
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
  res.render('topic/show.html', {
    user: req.session.user
  })
})

module.exports = router;