import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../config/api';
import { Typography, Box } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import useThemeStore from '../../hook/zustand';
import { useSelector } from 'react-redux';
import DishReview from './DishReview';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slider, Button,Snackbar, Alert } from '@mui/material';
import swal from 'sweetalert';
import BurgerLoading from '../../components/CustomLoading';
import { Pagination } from '@mui/material';
import { useNavigate } from "react-router-dom";

const DishesPage = ({show,ratings,size,priceRange}) => {

  const [menuItems, setMenuItems] = useState([]);
  const dispatch = useDispatch();
  const { theme } = useThemeStore();
  const selectedCategory = useSelector((state) => state.category.selectedCategory);
  const cartItems = useSelector((state) => state.cart.items);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [rating, setRating] = useState(1);
  const user_id = localStorage.getItem('targetId');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate()

  const [averageRatings, setAverageRatings] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const itemsPerPage = 8; 
  const [expandedItems, setExpandedItems] = useState({});

  const handleToggle = (id) => {
      setExpandedItems((prevState) => ({
          ...prevState,
          [id]: !prevState[id], // Toggle the expanded state for the specific item
      }));
  };


  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }



  


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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/menu-items');
        setMenuItems(response.data);
        setFilteredMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  useEffect(() => {
    let filteredItems = menuItems;

    // Filter by selected category if one is set
    if (selectedCategory && selectedCategory.id) {
      filteredItems = filteredItems.filter(item => item.category_id === selectedCategory.id);
    }


    // Filter by rating if a rating is selected
    if (ratings > 0) {
      filteredItems = filteredItems.filter((item) => averageRatings[item.id] >= ratings);
    }

    if(priceRange){

      filteredItems = filteredItems.filter(item => {
        const price = parseFloat(item.price); // Convert price to a number
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }


    setFilteredMenuItems(filteredItems);
    
  }, [selectedCategory, menuItems, ratings,priceRange]);

  const handleAddToCart = (item) => {
    setOpenDialog(true);
    setSelectedItem(item);

    // dispatch(addToCart(item));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


 

  const fetchAverageRating = async (itemId) => {
    try {
      const response = await axiosInstance.get(`/ratings/${itemId}`);
  
      if (response.status === 200 && response.data.average_rating) {
        // Extract the average_rating from the response
        const average = parseFloat(response.data.average_rating); // Parse the string to a float
  
        // Update the state with the calculated average rating
        setAverageRatings(prevState => ({
          ...prevState,
          [itemId]: average,
        }));
      } else {
        // If no ratings are found, set rating to 0
        setAverageRatings(prevState => ({
          ...prevState,
          [itemId]: 0,
        }));
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle the 404 error (e.g., show a default message or fallback rating)
        setAverageRatings(prevState => ({
          ...prevState,
          [itemId]: 0,
        }));
      } else {
        console.error("Error fetching ratings:", error);
      }
    }
  };
  
  

  useEffect(() => {
    menuItems.forEach(item => {
      fetchAverageRating(item.id);
    });
  }, [menuItems]);

  const paginatedItems = filteredMenuItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  

  

  const handleSubmitRating = async () => {
    try {

      const response = await axiosInstance.post('/ratings', {
        menu_item_id: selectedItem.id,
        user_id: user_id,
        rating: rating,
      });
      
      if (response.status === 201) {
          setOpen(false);
        swal({
          title: 'Rating Submitted Successfully!',
          icon: 'success',
        });
        const updatedMenuItems = menuItems.map(item =>
          item.id === selectedItem.id ? { ...item, rating: rating } : item
        );
        setMenuItems(updatedMenuItems);
      }
    
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating.');
    }
  };

  const showAlert = () => {
    setSnackbarMessage('Item added to cart successfully!');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      paddingInline: { xs: '20px', sm: '40px' }, // Adjust padding for small screens
      marginTop: '30px',
    }}>
        <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', backgroundColor: '#4CAF50', color:"#fff" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Dancing Script, cursive',
            color: '#d3a871',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Dishes
        </Typography>
        <Typography variant="h4" sx={{
          fontWeight: '900',
          color: '#444',
          mb: 1,
          my: 2,
          fontSize: { xs: '1.5rem', md: '2rem' },
          textTransform: 'uppercase',
          fontFamily: "Roboto Slab, serif",
        }}>
          Featured Dishes
        </Typography>
        <Typography
          sx={{
            fontWeight: '900',
            color: '#444',
            mb: 1,
            fontSize: { xs: '1.5rem', md: '2rem' },
            textTransform: 'uppercase',
            fontFamily: "Roboto Slab, serif",
            borderBottom: '6px double #d3a871',
            width: '150px',
          }}
        ></Typography>
    
        {/* Buttons container */}
      </div>
       {paginatedItems.length === 0 ? (
    <Typography variant="h6" sx={{ 
      fontWeight: 'bold', 
      color: '#d3a871', 
      fontSize: { xs: '1.5rem', md: '2rem' }, 
      // marginTop: '20px', 
      textTransform: 'uppercase' ,
      textAlign: 'center',
      fontFamily: "Roboto Slab, serif",
    }}>
      No Dishes Found
    </Typography>
  ) : (
    <>
    
    
    <div
  style={{
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    // gap: '10px',
    justifyContent: 'center', // Center cards on small screens
  }}
>
  {paginatedItems.map((item) => (
    <Box
      key={item.id}
      sx={{
        flex: '1 1 calc(100% - 20px)', // Default: one card per row (for smallest screens)
        maxWidth: 'calc(100% - 20px)', // Default: full width for smallest screens
        '@media (min-width: 600px)': {
          flex: '1 1 calc(50% - 20px)', // Two cards per row for screens ≥ 600px
          maxWidth: 'calc(50% - 20px)',
        },
        '@media (min-width: 900px)': {
          flex: '1 1 calc(33.33% - 20px)', // Three cards per row for screens ≥ 900px
          maxWidth: 'calc(33.33% - 20px)',
        },
        '@media (min-width: 1200px)': {
          flex: '1 1 calc(25% - 20px)', // Four cards per row for screens ≥ 1200px
          maxWidth: 'calc(25% - 20px)',
        },
        margin: '10px',
        borderRadius: '20px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
        backgroundColor: '#fff',
        padding: '15px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        borderTop: '4px solid #d3a871',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 15px 25px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 15px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid #d3a871',
        }}
      >
        <img
          src={item?.image?.url}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Item Name */}
      <Typography
        variant="h6"
        sx={{
          marginTop: '10px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
        }}
      >
        {item.name}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          color: '#333',
          textAlign: 'center',
          overflow: expandedItems[item.id] ? 'visible' : 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: expandedItems[item.id] ? 'normal' : 'nowrap',
        }}
      >
        {item.description.length <= 20
          ? item.description
          : `${item.description.slice(0, 60)}...`}
      </Typography>

      {item.description.length > 20 && (
        <Button
          onClick={() => handleToggle(item.id)}
          sx={{
            padding: '0',
            textTransform: 'none',
            color: '#d3a871',
            display: 'block',
            margin: '5px auto',
          }}
        >
          {expandedItems[item.id] ? 'Show Less' : 'Show More'}
        </Button>
      )}

      {/* Ratings */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            sx={{
              color: index < (averageRatings[item.id] || 0) ? '#FFB400' : '#ddd',
              fontSize: '20px',
            }}
          />
        ))}
      </Box>

      {/* Price */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px',
          textAlign: 'center',
        }}
      >
        ${item.price}
      </Typography>

      {/* Add to Cart Button */}
      <Button
        onClick={() => handleAddToCart(item)}
        sx={{
          marginTop: '10px',
          width: '100%',
          backgroundColor: '#AF854E',
          color: '#fff',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#c8a14b',
          },
          pointerEvents:
            item.availability === 0 || item.availability === null
              ? 'none'
              : 'auto',
          opacity:
            item.availability === 0 || item.availability === null ? 0.5 : 1,
        }}
        disabled={item.availability === 0 || item.availability === null}
      >
        {item.availability === 0 || item.availability === null
          ? 'Item Unavailable'
          : 'Add to Cart'}
      </Button>
    </Box>
  ))}
</div>



    
    {
      size ? (
        <Box
            sx={{
              display: 'flex',
              gap: 2,
              // flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            
            <Button
              variant="outlined"
              onClick={() => {
                // dispatch(addContent('About'))
                navigate('/item')

              }}

              sx={{
                fontWeight: 'bold',
                padding: { xs: '7px 20px', md: '8px 24px' },
                fontSize: { xs: '1rem', md: '1.2rem' },
                borderRadius: '20px',
                border: '1px solid white',
                backgroundColor: '#d3a871',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#D19A52',
                  borderColor: '#d3a871',
                },
                fontFamily: "Roboto, sans-serif",
              }}
              startIcon={<i className="fas fa-video"></i>} // Font Awesome or replace with appropriate icon
            >
              View More
            </Button>
          </Box>
      ) :
      (
        <Pagination
        count={Math.ceil(filteredMenuItems.length / itemsPerPage)}
        page={currentPage}
        variant="outlined"
        onChange={handlePageChange}
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          '.MuiPaginationItem-root': {
            color: '#d3a871',
            borderColor: '#d3a871',
          },
          '.MuiPaginationItem-root.Mui-selected': {
            backgroundColor: '#d3a871',
            color: '#fff',
          },
        }}
      />
      )
    }
     
      </>
  )
}
    
      <DishReview
        open={openDialog}
        onClose={handleCloseDialog}
        dish={selectedItem}
        show={showAlert}
      />
    
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Rate {selectedItem.name}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Rating</Typography>
          <Slider
            value={rating}
            onChange={handleRatingChange}
            valueLabelDisplay="auto"
            step={1}
            min={1}
            max={5}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitRating} color="primary">
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    
      <BurgerLoading open={loading}/> 
    </Box>
    

  
  
  );
};

export default DishesPage;
