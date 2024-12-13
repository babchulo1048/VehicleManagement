const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },


  status: {
    type: String,
    enum: ["available", "pending", "sold"], // Enum values for status
    default: "available", // Default status value
  },
  lastUpdated: {
    type: Date,
    default: Date.now,  // Automatically set to the current date and time
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;
