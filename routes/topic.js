var express = require('express')
var md5 = require('blueimp-md5')
var db = require('../models/db')
var router = express.Router()

//edit 发布作业
router.get('/edit', function (req, res) {
  res.render('topic/edit.html', {
    user: req.session.user
  })
})

//new
router.get('/new', function (req, res) {
  res.render('topic/new.html', {
    user: req.session.user
  })
})

//show
router.get('/show', function (req, res) {
  res.render('topic/show.html', {
    user: req.session.user
  })
})

module.exports = router;