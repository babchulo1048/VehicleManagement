import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../config/api';
import LoadingDialog from '../../components/LoadingDialog';

const BlogCreate = ({ open, onClose, onAdd }) => {
  const [modalData, setModalData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setModalData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('title', modalData.title);
      formData.append('description', modalData.description);
      formData.append('image', modalData.image); // Append the file

      // Send the FormData object
      const response = await axiosInstance.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure correct headers
        },});

      if (response.status === 201) {
        onAdd(response.data); // Call the onAdd prop to update the parent component
        swal({
          title: 'Blog Created Successfully!',
          icon: 'success',
        });
        onClose(); // Close the modal
        // Reset modal data
        setModalData({
          title: '',
          description: '',
          image: null,
        });
      }
    } catch (error) {
      console.error('Error creating blog:', error.response?.data?.message);
      swal({
        title: 'Error creating blog!',
        text: error.response?.data?.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle textAlign="center"><AddIcon /> Add Blog</DialogTitle>
      <DialogContent>
        <TextField
          label="Blog Title"
          name="title"
          fullWidth
          required
          value={modalData.title}
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
          type="file"
          name="image"
          fullWidth
          required
          onChange={handleFileChange}
          margin="normal"
        />
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

export default BlogCreate;
