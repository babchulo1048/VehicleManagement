import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../config/api';
import LoadingDialog from '../../components/LoadingDialog';

const BlogEdit = ({ open, onClose, onEdit, blog }) => {
  const [modalData, setModalData] = useState({
    id: null,
    title: '',
    description: '',
    image: null, // Assuming the blog has an image
  });
  const [loading, setLoading] = useState(false);

  // Set modalData when blog is provided and open
  useEffect(() => {
    if (blog) {
        console.log("blog:",blog)
      setModalData({
        id: blog.id,
        title: blog.title || '',
        description: blog.description || '',
        image: blog.image || null, // Don't preload the image (it will be replaced if a new image is selected)
      });
    }
  }, [blog]);

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
      if (modalData.image) {
        formData.append('image', modalData.image); // Append the file if selected
      }

      // Send the FormData object
      const response = await axiosInstance.put(`/blogs/${modalData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure correct headers
        },
      });

      if (response.status === 200) {
        onEdit(response.data); // Call the onEdit prop to update the parent component
        swal({
          title: 'Blog Updated Successfully!',
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
      console.error('Error updating blog:', error.response?.data?.message);
      swal({
        title: 'Error updating blog!',
        text: error.response?.data?.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };


    const handleDeleteMenuItem = async (id) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: "You will not be able to recover this menu item!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirm) {
            setDeleting(true);
            try {
                const response = await axiosInstance.delete(`/menu-items/${id}`);
                if (response.status === 200) {
                    setMenuData((prevData) => prevData.filter((item) => item.id !== id)); 
                    swal({
                        title: "Menu Item Deleted Successfully!",
                        icon: "success"
                    });
                }
            } catch (error) {
                console.error("Error deleting menu item:", error);
                swal({
                    title: `${error.response.data.message}`,
                    icon: "warning"
                });
            } finally{
                setDeleting(false);
            }
        }
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle textAlign="center">
        <EditIcon /> Edit Blog
      </DialogTitle>
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
          onChange={handleFileChange}
          margin="normal"
        />
        {modalData.image ? (
          <div>
            <p>Image Selected: {modalData.image?.name }</p> {/* Display the file name */}
            <img
                src={modalData?.image?.url} // Assuming the blog image URL is provided
                alt="Selected Image"
                style={{ maxWidth: '100px', marginTop: '10px' }}
              />
          </div>
        ) : (
          <p>No image selected</p> // If no image is selected, display this message
        )}
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

export default BlogEdit;
