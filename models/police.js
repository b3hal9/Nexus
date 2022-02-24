const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const policeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      minLength: 5,
    },
    id: {
      type: Number,
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
    address: {
      type: String,
      maxlength: 50,
      minLength: 5,
      required: true,
    },
    phone: {
      type: String,
      minLength: 10,
      required: true,
    },
    label: {
      type: String,
      default: "police", //roles: [police,admin]
    },
    location: {
      type: Object,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

policeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      address: this.address,
    },
    process.env.PRIVATE_JWT_KEY,
    { expiresIn: 2 * 60 * 60 }
  );
  return token;
};

module.exports = new mongoose.model("Police", policeSchema);
