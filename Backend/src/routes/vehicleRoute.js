const express = require("express");
const vehicleController = require("../controller/vehicleController");

const router = express.Router();
router.use(express.json());

// Define routes
router.get("/", vehicleController.detail); 
router.post("/", vehicleController.create); 
router.get("/:id", vehicleController.getVehicleById); 
router.put("/:id", vehicleController.updateVehicle); 
router.delete("/:id", vehicleController.deleteVehicle);

router.put("/status/:id", vehicleController.updateStatus);

module.exports = router;