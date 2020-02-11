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
  //console.log(body)
  if (duty === 1) {
    //teacher
    var num = req.session.user.num
    var name = req.session.user.name
    var id = body.time
    // str = 'select * from file;'
    var str = `insert into file (id, topic, content, time, teacher_name, teacher_num, file_name, is_group)
       values('`+id+`', '`+body.topic+`', '`+body.content+`', '`+body.time+`', '`+name+`', '`+num+`', '`+body.fileUrl+`', '`+body.group+`');`
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
  var id = req.query.id
  var str = "select * from file where id = '"+id+"';"
  db.query(str, (err, result) => {
    if(err){ throw err}
    res.render('topic/show.html', {
      user: req.session.user,
      result: result[0]
    })
  })
  
})
// router.get('/show/content', function(req, res){
//   var id = req.query.id
//   console.log(id)
// })
module.exports = router;