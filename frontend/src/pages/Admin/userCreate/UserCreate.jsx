import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,Autocomplete } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';
import LoadingDialog from '../../../components/LoadingDialog';

const UserCreate = ({ open, onClose, onAdd }) => {
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    password: '',
    role_id: null, // Default role ID (can be changed)
  });
  const [roles, setRoles] = useState([]); // Available roles fetched from API
  const [loading, setLoading] = useState(false);

  // Fetch available roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/roles');
        if (response.status === 200) {
          setRoles(response.data); // Assuming the response contains the list of roles
        }
      } catch (error) {
        console.error('Error fetching roles:', error.response?.data?.message);
      }
    };

    fetchRoles();
  }, []);

  // Handle user input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for creating a user
  const handleModalSubmit = async () => {
    setLoading(true);
    console.log('userData:', userData);
    try {
      // Send the user data
      const response = await axiosInstance.post('/users/register', userData);
      console.log("response:", response.status);

      if (response.status === 201) {
        onAdd(); // Call the onAdd prop to update the parent component
        swal({
          title: 'User Created Successfully!',
          icon: 'success',
        });
        onClose(); // Close the modal
        // Reset user data
        setUserData({
          email: '',
          name: '',
          password: '',
          role_id: 1,
        });
      }
    } catch (error) {
      if (error.response?.data) {
        console.error('Error creating user:', error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle textAlign="center">Create User</DialogTitle>
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
          required
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

export default UserCreate;
