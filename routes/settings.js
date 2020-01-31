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

module.exports = router;
