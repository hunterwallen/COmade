const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')

sessions.get('/new', (req, res) => {
  res.render('sessions/new.ejs', {
    currentUser: req.session.currentUser,
    error: 0
  })
})

sessions.post('/', (req, res) => {
  User.findOne({username: req.body.username}, (err, foundUser) => {
    if(err) {
      console.log(err);
      res.render('sessions/new.ejs', {
        error: 'db',
        currentUser: req.session.currentUser
      })
    } else if (!foundUser) {
      res.render('sessions/new.ejs', {
        error: 'username',
        currentUser: req.session.currentUser
      })
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser
        res.redirect('/store/')
      } else {
        res.render('sessions/new.ejs', {
          error: 'password',
          currentUser: req.session.currentUser
        })
      }
    }
  })
})

sessions.delete('/', (req, res) => {
  req.session.destroy(() => {
    console.log('logged out');
    res.redirect('/store/')
  })
})

module.exports = sessions
