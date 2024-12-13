import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Autocomplete } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';
import LoadingDialog from '../../../components/LoadingDialog';

const EditUser = ({ open, onClose, onEdit, user }) => {
  const [userData, setUserData] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    role_id: null, // Role ID selected from the Autocomplete
  });
  const [roles, setRoles] = useState([]); // Available roles fetched from API
  const [loading, setLoading] = useState(false);

  // Fetch available roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/roles'); // Assuming `/roles` provides available roles
        if (response.status === 200) {
          setRoles(response.data); // Assuming response contains list of roles
        }
      } catch (error) {
        console.error('Error fetching roles:', error.response?.data?.message);
      }
    };

    fetchRoles();
  }, []);

  // Set the user data when the user is passed as a prop
  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '', // Don't pre-fill password for security reasons
        role_id: user.role_id || null, // Preload selected role
      });
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      // Send the updated user data
      const response = await axiosInstance.put(`/users/${userData.id}`, userData);

      if (response.status === 200) {
        onEdit(response.data); // Call the onEdit prop to update the parent component
        swal({
          title: 'User Updated Successfully!',
          icon: 'success',
        });
        onClose(); // Close the modal
        // Reset user data
        setUserData({
          name: '',
          email: '',
          password: '',
          role_id: null,
        });
      }
    } catch (error) {
      console.error('Error updating user:', error.response?.data?.message);
      swal({
        title: 'Error updating user!',
        text: error.response?.data?.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle textAlign="center">Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          fullWidth
          required
          value={userData.name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          value={userData.email}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={userData.password}
          onChange={handleInputChange}
          margin="normal"
        />
        <Autocomplete
          fullWidth
          sx={{ my: 2 }}
          options={roles}
          getOptionLabel={(option) => option.name || ''}
          onChange={(event, newValue) => {
            setUserData((prev) => ({
              ...prev,
              role_id: newValue ? newValue.id : null,
            }));
          }}
          value={roles.find((role) => role.id === userData.role_id) || null}
          renderInput={(params) => <TextField {...params} label="Role" />}
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

export default EditUser;
