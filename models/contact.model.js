const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 20,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
      minLength: 8,
    },
    message: {
      type: String,
      required: true,
      maxlength: 255,
      minLength: 20,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Contact", contactSchema);
