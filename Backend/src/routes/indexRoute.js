const error = require("../middleware/error");
const express = require("express");
const vehcleRoute = require("./vehicleRoute");

const router = express.Router();

router.use('/vehicles', vehcleRoute);


module.exports = router;