const express = require('express')
const router = express.Router()
const Item = require('../models/products.js')
const seed = require('../models/seed.js')

const isAuthenticated = (req, res, next) => {
  if(currentUser) {
    next()
  } else {
    res.redirect('/sessions/new')
  }
}

router.get('/error', (req, res) => {
  res.render('errorNew.ejs')
})
router.get('/error/:id', (req, res) => {
  res.render('errorPage.ejs', {
    lastItem: req.params.id
  })
})
router.get('/', (req, res) => {
  Item.find({}, (error, products) => {
    res.render('index.ejs', {
      products: products,
      currentUser: req.session.currentUser
    })
  })
})

router.get('/seed', (req, res) => {
  Item.create(seed, (err, data) => {
    if(err){
      console.log(err.message);
    } else {
      console.log('data added to database');
      res.redirect('/store')
    }
  })
})

router.get('/new', (req, res) => {
  res.render('new.ejs', {
    currentUser: req.session.currentUser
  })
})

router.get('/:id', (req, res) => {
  Item.findById(req.params.id, (error, foundProduct) => {
    let inStock = false
    if(foundProduct.qty > 0) {
      inStock = true
    }
    res.render('show.ejs', {
      product: foundProduct,
      inStock: inStock,
      currentUser: req.session.currentUser
    })
  })
})

router.get('/:id/edit', (req, res) => {
  Item.findById(req.params.id, (error, foundProduct) => {
    res.render('edit.ejs', {
      product: foundProduct,
      currentUser: req.session.currentUser
    })
  })
})

router.put('/:id', (req, res) => {
  const validateURL = (str) => {
    let lastThree = str.slice(str.length - 4, str.length)
    let prefix = str.slice(0, 4)
    if((lastThree !== ('.png' || '.jpg')) && (prefix !== 'http')) {
      return false
    } else {
      return true
    }
  }
  const validateNumber = (num) => {
    if(Number(num) >= 0 && Number(num) == num) {
      return true
    } else {
      return false
    }
  }
  if(validateURL(req.body.img) && validateNumber(req.body.price) && validateNumber(req.body.qty)){
    Item.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedProduct) => {
        res.redirect(`/store/${req.params.id}`)
      })
      } else {
    res.redirect(`/store/error/${req.params.id}`)
}
})

router.put('/:qty/:id', (req, res) => {
  let newInventory = req.params.qty - 1
  Item.findByIdAndUpdate(req.params.id, {$set: {qty: newInventory}}, {new: true}, (error, updatedProduct) => {
    res.redirect(`/store/${req.params.id}`)
  })
})

router.post('/', (req, res) => {
  Item.create(req.body, (error, newProduct) => {
    if(error) {
      res.redirect('/store/error')
    } else {
    res.redirect(`/store/${req.params.id}`)
    }
  })
})

router.delete('/:id', (req, res) => {
  Item.findByIdAndRemove(req.params.id, (error, data) => {
    res.redirect('/store')
  })
})

module.exports = router
