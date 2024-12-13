import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
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

const AddVehicle = ({ open, onClose, onAdd }) => {
  const [modalData, setModalData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    status: 'available', // Default status is 'available'
  });
  const [loading, setLoading] = useState(false);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/vehicles', modalData);

      if (response.status === 201) {
        onAdd(response.data);
        swal({ title: 'Vehicle Added Successfully!', icon: 'success' });
        onClose();
        setModalData({
          name: '',
          description: '',
          price: '',
          location: '',
          status: 'available', // Reset status after submission
        });
      }
    } catch (error) {
      console.error('Error adding vehicle:', error.response?.data?.message);
      swal({
        title: 'Error adding vehicle!',
        text: error.response?.data?.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle textAlign="center">
        <AddIcon /> Add Vehicle
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

        {/* Status select */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={modalData.status}
            onChange={handleModalChange}
            label="Status"
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="sold">Sold</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleModalSubmit}>
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
      <LoadingDialog open={loading} />
    </Dialog>
  );
};

export default AddVehicle;