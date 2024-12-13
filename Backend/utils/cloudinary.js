const cloudinary = require("cloudinary").v2;

require("dotenv").config;

// console.log("process.env.CLOUD_NAME:", process.env.CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

module.exports = cloudinary;