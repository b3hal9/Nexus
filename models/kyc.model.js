const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

//schema for kyc form
const kycSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    dob: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
      maxlength: 255,
    },

    address: {
      type: String,
      required: true,
      maxlength: 255,
    },
    religion: {
      type: String,
      required: true,
      maxlength: 255,
    },
    gender: {
      type: String,
      required: true,
      maxlength: 255,
    },
    occupation: {
      type: String,
      required: true,
      maxlength: 255,
    },
    documentType: {
      type: String,
      required: true,
      maxlength: 255,
    },
    documentId: {
      type: String,
      required: true,
      maxlength: 255,
    },
    province: {
      type: Number,
      required: true,
      maxlength: 1,
    },
    number: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

//export modelsetting

module.exports = new mongoose.model("kyc", kycSchema);
