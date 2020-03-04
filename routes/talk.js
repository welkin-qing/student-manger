var express = require('express')
var md5 = require('blueimp-md5')
var db = require('../models/db')
var router = express.Router()

router.get('/talk', function (req, res) {
  res.render('controllers/talk.html', {
    user: req.session.user
  })
})

router.get('/choice', function (req, res) {
  res.render('controllers/choice.html', {
    user: req.session.user
  })
})

module.exports = router;