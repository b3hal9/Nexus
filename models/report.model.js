const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    incidentDate: {
      type: String,
      required: true,
    },
    incidentTime: {
      type: String,
      required: true,
    },
    incidentAddress: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      required: true,
    },
    station: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Report", reportSchema);
