const mongoose = require('mongoose')

const crimeSchema = new mongoose.Schema({
  user: {
    type: Object,
    required: true,
  },
  crimeNature: {
    type: String,
    required: true,
  },
  crimeStatus: {
    type: String,
    required: true,
  },
  imprisonment: {
    type: String,
    required: true,
  },
  bailAmount: {
    type: Number,
    required: true,
  },
  RegisteredBy: {
    type: String,
    required: true,
  },
})

module.exports = new mongoose.model('crime', crimeSchema)
