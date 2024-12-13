import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Autocomplete, Checkbox, FormControlLabel,Box,IconButton } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';
import LoadingDialog from '../../../components/LoadingDialog';
import { Delete } from '@mui/icons-material';

const EditMenuItem = ({ open, onClose, onEdit, menuItem }) => {
  const [modalData, setModalData] = useState({
    id: null,
    name: '',
    price: '',
    description: '',
    image: menuItem.image,
    category_id: '', 
    availability: true, 
    selectedToppings: [], 
    sizes: menuItem.sizes || [],
  });
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);

  // Fetch toppings related to this menu item
  useEffect(() => {
    const fetchToppings = async () => {
        try {
            if (!menuItem?.id) return; // Ensure menuItem exists

            // Fetch toppings associated with the menu item
            const toppingResponse = await axiosInstance.get(`/menu_item_toppings/${menuItem.id}`);
            const associatedToppingIds = toppingResponse.data.map((topping) => topping.id);


            // Fetch all available toppings
            const toppingsResponse = await axiosInstance.get('/toppings');
            const allToppings = toppingsResponse.data.map((topping) => ({
                ...topping,
                checked: associatedToppingIds.includes(topping.id),
            }));

            // Update state
            setToppings(allToppings);
            setModalData((prev) => ({
                ...prev,
                selectedToppings: allToppings.filter((topping) => topping.checked), // Only selected toppings
            }));
        } catch (error) {
            console.error('Error fetching toppings:', error);
        }
    };

    fetchToppings();
}, [menuItem]);


  

  // Fetch categories only once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Set modalData only when menuItem is provided and open
  useEffect(() => {

    if (menuItem) {

      setModalData((prev) => ({
        ...prev,
        id: menuItem.id,
        name: menuItem.name || '',
        price: menuItem.price || '',
        description: menuItem.description || '',
        image: {
          url: menuItem.image?.url || menuItem.image,
          file: null // Will be set when user selects new file
        },
        category_id: menuItem.category_id || '',

      }));
    }
  }, [menuItem]);
  

  // Handle size changes
const handleSizeChange = (index, field, value) => {
  if(field === 'size_price'){
    value = parseFloat(value);
  }
  const updatedSizes = [...modalData.sizes];
  updatedSizes[index] = { ...updatedSizes[index], [field]: value };
  setModalData((prev) => ({
    ...prev,
    sizes: updatedSizes,
  }));
};

// Add a new size
const handleAddSize = () => {
  setModalData((prev) => ({
    ...prev,
    sizes: [...prev.sizes, { size_name: '', size_price: '' }],
  }));
};

// Remove a size
const handleRemoveSize = (index) => {
  const updatedSizes = modalData.sizes.filter((_, i) => i !== index);
  setModalData((prev) => ({
    ...prev,
    sizes: updatedSizes,
  }));
};

const handleToppingChange = (toppingId, isChecked) => {
  // Update the toppings state to reflect the checked status
  setToppings((prev) =>
    prev.map((topping) =>
      topping.id === toppingId ? { ...topping, checked: isChecked } : topping
    )
  );

  // Update modalData.selectedToppings based on the new toppings state
  setModalData((prev) => ({
    ...prev,
    selectedToppings: isChecked
      ? [...prev.selectedToppings, { id: toppingId }]
      : prev.selectedToppings.filter((topping) => topping.id !== toppingId),
  }));
};




  // Handle input changes
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setModalData((prev) => ({
        ...prev,
        image: e.target.files[0], // Store as File object
      }));
    }
  };
  
  
  // Handle topping selection changes
  // const handleToppingChange = (toppingId) => {
  //   setModalData((prev) => {
  //     const selectedToppings = prev.selectedToppings.includes(toppingId)
  //       ? prev.selectedToppings.filter(id => id !== toppingId)  // Deselect if already selected
  //       : [...prev.selectedToppings, toppingId];  // Add if not already selected
  //     return { ...prev, selectedToppings };
  //   });
  // };

  // Handle form submission
  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', modalData.name);
      formData.append('price', parseFloat(modalData.price));
      formData.append('description', modalData.description);
  
      // Append the image: either file or existing URL
      if (modalData.image instanceof File) {
        formData.append('image', modalData.image); // New file selected
      } else if (modalData.image?.url) {
        formData.append('image_url', modalData.image.url); // Existing image URL
      }
  
      formData.append('category_id', modalData.category_id);
      const sizesArray = modalData.sizes.map((size) => ({
        size_name: size.size_name,
        size_price: size.size_price,
      }));

      formData.append('size', JSON.stringify(sizesArray));


  
      // Send the FormData
      const response = await axiosInstance.put(`/menu-items/${modalData?.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

  
      if (response.status === 200) {
        onEdit(response.data);
        swal({ title: 'Menu Item Updated Successfully!', icon: 'success' });
        onClose();
        if(modalData.selectedToppings){

          const toppingIds = modalData.selectedToppings.map((topping) => topping.id);
          const toppingPayload = {
            menu_item_id: modalData.id,
            topping_ids: toppingIds,
          };
    
          // Update toppings associated with the menu item
          await axiosInstance.put('/menu_item_toppings', toppingPayload);
        }
  
    
      };
      
      
    } catch (error) {
      console.error('Error updating menu item:', error);
      // swal({ title: 'Error updating menu item!', text: error.response?.data?.message, icon: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle textAlign="center">
        <EditIcon /> Edit Menu Item
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Menu Item Name"
          name="name"
          fullWidth
          required
          value={modalData.name}
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
         {modalData.image ? (
        <div>
          <p>Image Selected: {modalData.image.name}</p> {/* Display the file name */}
          <img
            src={modalData?.image?.url} // Create an image preview URL
            alt="Selected Image"
            style={{ maxWidth: '100px', marginTop: '10px' }}
          />
        </div>
      ) : (
        <p>No image selected</p> // If no image is selected, display this message
      )}
      
        
        <Autocomplete
          fullWidth
          sx={{ my: 2 }}
          options={categories}
          getOptionLabel={(option) => option.name || ''}
          onChange={(event, newValue) => {
            setModalData((prevData) => ({
              ...prevData,
              category_id: newValue ? newValue.id : '',
            }));
          }}
          value={categories.find((category) => category.id === modalData.category_id) || null}
          renderInput={(params) => <TextField {...params} label="Categories" />}
        />
        
        <div>
          {/* <h4>Select Toppings:</h4>
          {toppings.map((topping) => (
            <FormControlLabel
              key={topping.id}
              control={
                <Checkbox
                  checked={modalData.selectedToppings.includes(topping.id)}
                  onChange={() => handleToppingChange(topping.id)}
                  name="toppings"
                  color="primary"
                />
              }
              label={topping.name}
            />
          ))} */}
        </div>
       
        <Box>
  <h4>Select Toppings:</h4>
  {toppings.map((topping) => (
    <Box
      key={topping.id}
      style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
    >
      <input
        type="checkbox"
        checked={topping.checked || false} // Ensure a fallback value
        onChange={(e) => {
          handleToppingChange(topping.id, e.target.checked);
        }}
      />
      <label style={{ marginLeft: '8px' }}>{topping.name}</label>
    </Box>
  ))}
</Box>

<div style={{ marginTop: '1.2rem', marginBottom: '1rem' }}>
          <h4>Sizes:</h4>
          {modalData.sizes.map((size, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <TextField
                label="Size Name"
                value={size.size_name}
                onChange={(e) =>
                  handleSizeChange(index, 'size_name', e.target.value)
                }
              />
              <TextField
                label="Size Price"
                type="number"
                value={size.size_price}
                onChange={(e) =>
                  handleSizeChange(index, 'size_price', e.target.value)
                }
              />
              <IconButton onClick={() => handleRemoveSize(index)} color="error">
                <Delete />
              </IconButton>
            </div>
          ))}
          <Button variant="outlined" color="primary" onClick={handleAddSize}>
            Add Size
          </Button>
        </div>



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

export default EditMenuItem;
