import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';
import LoadingDialog from '../../../components/LoadingDialog';

const AddMenuItem = ({ open, onClose, onAdd }) => {
  const [modalData, setModalData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    category_id: '',
    availability: true,
    selectedToppings: [],
  });
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndToppings = async () => {
      try {
        const categoryResponse = await axiosInstance.get('/categories');
        setCategories(categoryResponse.data);
        const toppingResponse = await axiosInstance.get('/toppings');
        setToppings(toppingResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCategoriesAndToppings();
  }, []);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setModalData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleToppingChange = (toppingId) => {
    setModalData((prev) => {
      const updatedToppings = prev.selectedToppings.includes(toppingId)
        ? prev.selectedToppings.filter((id) => id !== toppingId)
        : [...prev.selectedToppings, toppingId];
      return { ...prev, selectedToppings: updatedToppings };
    });
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size_name: '', size_price: '' }]);
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = sizes.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    );
    setSizes(updatedSizes);
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', modalData.name);
      formData.append('price', parseFloat(modalData.price));
      formData.append('description', modalData.description);
      formData.append('image', modalData.image);
      formData.append('category_id', modalData.category_id);
      // formData.append('availability', modalData.availability);
      console.log("Original Sizes:", sizes);
      const sizesArray = sizes.map((size) => ({
        size_name: size.size_name,
        size_price: size.size_price,
      }));
      console.log("sizesArray:",sizesArray)
      formData.append('size', JSON.stringify(sizesArray));
      console.log("Serialized sizes:", JSON.stringify(sizesArray));

      const response = await axiosInstance.post('/menu-items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        const menuItemId = response.data.id;

        await Promise.all(
          modalData.selectedToppings.map(async (toppingId) => {
            await axiosInstance.post('/menu_item_toppings', {
              menu_item_id: menuItemId,
              topping_id: toppingId,
            });
          })
        );

        onAdd(response.data);
        swal({ title: 'Menu Item Created Successfully!', icon: 'success' });
        onClose();
        setModalData({
          name: '',
          price: '',
          description: '',
          image: null,
          category_id: '',
          availability: true,
          selectedToppings: [],
        });
        setSizes([]);
      }
    } catch (error) {
      console.error('Error creating menu item:', error.response?.data?.message);
      swal({
        title: 'Error creating menu item!',
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
        <AddIcon /> Add Menu Item
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
          value={
            categories.find((category) => category.id === modalData.category_id) ||
            null
          }
          renderInput={(params) => <TextField {...params} label="Categories" />}
        />

        {/* Toppings Section */}
        <div>
          <h4>Toppings:</h4>
          {toppings.map((topping) => (
            <FormControlLabel
              key={topping.id}
              control={
                <Checkbox
                  checked={modalData.selectedToppings.includes(topping.id)}
                  onChange={() => handleToppingChange(topping.id)}
                />
              }
              label={topping.name}
            />
          ))}
        </div>

        {/* Sizes Section */}
        <div style={{ marginTop: '1.2rem', marginBottom: '1rem' }}>
          <h4>Sizes:</h4>
          {sizes.map((size, index) => (
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

export default AddMenuItem;
