const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AttendanceSchema = new Schema({
  name: String,
  address: String,
  email: String,
  phone: String
}, {
  timestamps: true
})

const Attandance = mongoose.model('Attadance', AttendanceSchema)

module.exports = Attandance