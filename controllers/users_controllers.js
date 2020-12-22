const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')

users.get('/new', (req, res) => {
  let currentUser = 0
  if(req.session) {
    currentUser = req.session.currentUser
  } 
  res.render('users/new.ejs', {
    currentUser: currentUser
  })
})

users.post('/', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, createdUser) => {
    console.log('user is created', createdUser);
    res.redirect('/store/')
  })
})


module.exports = users
