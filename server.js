const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const userController = require('./controllers/users_controllers.js')
const sessionsController = require('./controllers/sessions.js')


require('dotenv').config()
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const db = mongoose.connection


app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
app.use('/users', userController)
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use('/sessions', sessionsController)




app.listen(PORT, () => {
  console.log('listening...');
})


mongoose.connect(
    MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    () => {
        console.log('Connected to mongod');
    }
)


const productController = require('./controllers/controller.js')
app.use('/', productController)
