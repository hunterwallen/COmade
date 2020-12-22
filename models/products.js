const mongoose = require('mongoose')



const productSchema = new mongoose.Schema({
  name: {type:String, required: true, unique: true},
  description: String,
  img: {type:String, validate: {
                          validator: (str) => {
                          let lastThree = str.slice(str.length - 4, str.length)
                          let prefix = str.slice(0, 4)
                          if((lastThree !== ('.png' || '.jpg')) && (prefix !== 'http')) {
                            return false
                          } else {
                            return true
                          }}, message: 'You must provide a valid image URL'}},
  price: {type:Number, min:[0, 'Must be above 0']},
  qty: {type:Number, min:[0, 'Must be above 0']}
})


const Product = mongoose.model('Product', productSchema)

module.exports = Product
