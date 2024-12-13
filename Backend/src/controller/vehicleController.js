const asyncMiddleware = require("../middleware/async");
const Vehicle = require("../model/Vehicle");

// Get all vehicles
exports.detail = asyncMiddleware(async (req, res) => {
  const vehicles = await Vehicle.find();
  res.status(200).json(vehicles);
});

// Create a new vehicle
exports.create = asyncMiddleware(async (req, res) => {
  const { name, description, price, location, status } = req.body;

  const vehicle = new Vehicle({
    name,
    description,
    price,
    location,
    status,
  });

  await vehicle.save();
  res.status(201).json(vehicle);
});

// Get a specific vehicle by ID
exports.getVehicleById = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  res.status(200).json(vehicle);
});

// Update a vehicle
exports.updateVehicle = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, location, features, status } = req.body;

  const updateData = {
    name,
    description,
    price,
    location,
    features,
    status
  };

  const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedVehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  res.status(200).json(updatedVehicle);
});

// Delete a vehicle
exports.deleteVehicle = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const deletedVehicle = await Vehicle.findByIdAndDelete(id);
  if (!deletedVehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  res.status(204).end();
});

// Update vehicle status
exports.updateStatus = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status: one of "available", "pending", "sold"

  // Validate the provided status
  if (!["available", "pending", "sold"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  // Find the vehicle by its ID and update its status
  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { status },
    { new: true } // Return the updated document
  );

  if (!updatedVehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  res.status(200).json(updatedVehicle); // Return the updated vehicle data
});