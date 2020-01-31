var express = require('express')
var md5 = require('blueimp-md5')
var db = require('../models/db')
var router = express.Router()

//admin
router.get('/admin',function(req,res){
  res.render('settings/admin.html',{
    user: req.session.user
  })
})
router.post('/admin', function(req, res){
  var body = req.body
  console.log(body)
})
module.exports = router;
