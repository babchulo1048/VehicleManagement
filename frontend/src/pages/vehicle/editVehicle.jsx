import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../config/api';
import LoadingDialog from '../../components/LoadingDialog';

const EditVehicle = ({ open, onClose, onEdit, vehicle }) => {
  const [modalData, setModalData] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    location: '',
    status: 'available', // Default status
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setModalData({
        id: vehicle._id,
        name: vehicle.name || '',
        description: vehicle.description || '',
        price: vehicle.price || '',
        location: vehicle.location || '',
        status: vehicle.status || 'available', // Set status from vehicle
      });
    }
  }, [vehicle]);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/vehicles/${modalData.id}`, modalData);

      if (response.status === 200) {
        onEdit(response.data);
        swal({ title: "Vehicle Updated Successfully!", icon: "success" });
        onClose();
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      swal({ title: "Error", text: "Failed to update vehicle. Try again later.", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        <EditIcon /> Edit Vehicle
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Vehicle Name"
          name="name"
          fullWidth
          required
          value={modalData.name}
          onChange={handleModalChange}
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          required
          value={modalData.description}
          onChange={handleModalChange}
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          fullWidth
          required
          value={modalData.price}
          onChange={handleModalChange}
          margin="normal"
        />
        <TextField
          label="Location"
          name="location"
          fullWidth
          required
          value={modalData.location}
          onChange={handleModalChange}
          margin="normal"
        />

        {/* Status selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="status"
            value={modalData.status}
            onChange={handleModalChange}
            required
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="sold">Sold</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleModalSubmit} color="primary" disabled={loading}>
          Save
        </Button>
      </DialogActions>
      {loading && <LoadingDialog />}
    </Dialog>
  );
};

export default EditVehicle;