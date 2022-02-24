const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

//userSchema

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      minLength: 5,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
      minLength: 8,
    },
    password: {
      type: String,
      required: true,
      maxlength: 255,
      minLength: 8,
    },

    status: {
      type: String,
      default: 'unverified',
    },
    label: {
      type: String,
      default: 'user', //roles: [police,user,admin]
    },
    isCriminal: {
      type: Boolean,
      default: false,
    },
    crimes: {
      type: Object,
    },
    request: {
      type: Boolean,
      default: false,
    },
    emergency_requests: {
      type: Object,
    },
  },
  { timestamps: true }
)

//create method to generate auth token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, status: this.status, name: this.name },
    process.env.PRIVATE_JWT_KEY_USER,
    { expiresIn: 2 * 60 * 60 }
  )
  return token
}

//create method to add crime records
userSchema.methods.addCrimeRecords = (crimes) => {
  if (this.isCriminal) {
    this.status = 'criminal'
    this.crimes = crimes
    return true
  }
  return false
}

//export model
module.exports = new mongoose.model('User', userSchema)
