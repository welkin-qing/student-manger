var express = require('express')
//var User = require('./models/user')
var md5 = require('blueimp-md5')
//var mysql = require('mysql')
var db = require('../models/db')
var router = express.Router()

router.get('/list', function (req, res) {
  res.render('manger/list.html', {
    user: req.session.user
  })
})

module.exports = router;
