import { useState, useEffect } from 'react';
import { Box, Typography, Button } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { axiosInstance } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const DishesPage2 = ({handleNavbarClick2}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const itemsToShow = 3;
  const [averageRatings, setAverageRatings] = useState({});

  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate()

  // Handle toggle for description expansion
  const handleToggle = (id) => {
      setExpandedItems((prev) => ({
          ...prev,
          [id]: !prev[id], // Toggle the current item's state
      }));
  };


  // Fetch menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/menu-items');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchData();
  }, []);

  // Toggle to show all items
  const handleViewMore = () => {
    setShowAll(!showAll);
  };

  // Determine items to display
  const displayedItems = showAll ? menuItems : menuItems.slice(0, itemsToShow);

 
  const fetchAverageRating = async (itemId) => {
    try {
      const response = await axiosInstance.get(`/ratings/${itemId}`);

      console.log("response",response.data,itemId)
  
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

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      marginTop: '60px',
    }}
  >
    {/* Title */}
    <Typography
      variant="h3"
      sx={{
        fontFamily: 'Dancing Script, cursive',
        color: '#d3a871',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: { xs: '2rem', md: '3rem' }, // Adjust for small screens
      }}
    >
      Dishes
    </Typography>
  
    {/* Subtitle */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: '900',
        color: '#444',
        mb: 1,
        fontSize: { xs: '1.2rem', md: '1.8rem' },
        textTransform: 'uppercase',
        fontFamily: 'Roboto Slab, serif',
        textAlign: 'center',
      }}
    >
      Featured Dishes
    </Typography>
  
    {/* Divider */}
    <Typography
      sx={{
        fontWeight: '900',
        color: '#444',
        mb: 1,
        fontSize: { xs: '1rem', md: '1.5rem' },
        textTransform: 'uppercase',
        fontFamily: 'Roboto Slab, serif',
        borderBottom: '6px double #d3a871',
        width: '150px',
        margin: '0 auto',
      }}
    ></Typography>
  
    {/* Menu Items */}
    {menuItems.length === 0 ? (
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: '#d3a871',
          fontSize: { xs: '1rem', md: '1.5rem' },
          textAlign: 'center',
          fontFamily: 'Roboto Slab, serif',
        }}
      >
        No Dishes Found
      </Typography>
    ) : (
      <>
        {/* Cards Wrapper */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {displayedItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                position: 'relative',
                padding: '20px',
                borderRadius: '20px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                backgroundColor: '#fff',
                width: { xs: '100%', sm: 'calc(50% - 20px)', md: 'calc(25% - 20px)' }, // Responsive widths
                margin: '10px',
                overflow: 'hidden',
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
                  width: '130px',
                  height: '130px',
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
  
              {/* Content Section */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    fontFamily: "'Roboto Slab', serif",
                    fontSize: '1.2rem',
                    marginBottom: '8px',
                  }}
                >
                  {item.name}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-block',
                    backgroundColor: '#d3a871',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '5px 10px',
                    fontSize: '14px',
                    borderRadius: '12px',
                    marginBottom: '10px',
                  }}
                >
                  ${item.price}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    marginTop: '5px',
                    marginBottom: '10px',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
  
        {/* View More Button */}
        {menuItems.length > itemsToShow && (
          <Button
            onClick={() => handleNavbarClick2('/item', 'Item')}
            sx={{
              marginTop: '20px',
              alignSelf: 'center',
              backgroundColor: '#d3a871',
              color: '#fff',
              '&:hover': { backgroundColor: '#b58a5f' },
              fontFamily: 'Roboto, sans-serif',
              paddingInline: 4,
              paddingBlock: 1,
              borderRadius: 4,
            }}
            startIcon={<i className="fas fa-video"></i>}
          >
            View More
          </Button>
        )}
      </>
    )}
  </Box>
  
  );
};

export default DishesPage2;
