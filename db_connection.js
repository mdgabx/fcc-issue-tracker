const mongoose = require('mongoose')

const uri = process.env.MONGO_URI

const db = mongoose.connect(uri)

if(db){
    console.log('db connected successfully')
} else {
    console.log('error in db connecting')
}

module.exports = db;