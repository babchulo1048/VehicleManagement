import React, { useState, useEffect,useCallback } from 'react';
import { axiosInstance } from '../../../config/api';
import {  Card, CardMedia, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddMenuItem from './addMenuItem'; // Import the AddMenuItem modal component
import EditMenuItem from './editMenuItem';
import swal from 'sweetalert';
import Grid from '@mui/material/Grid2';
import LoadingDialog from '../../../components/LoadingDialog';
import { Pagination } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon for availability
import CancelIcon from '@mui/icons-material/Cancel';


const MenuItems = () => {
    const [menuData, setMenuData] = useState([]);
    const [openAddMenuItem, setOpenAddMenuItem] = useState(false); 
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [loading,setLoading] = useState(true)
    const [deleting,setDeleting] = useState(false)
    const [currentPage, setCurrentPage] = useState(1); // For pagination
    const itemsPerPage = 6; 

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
      }


    const fetchMenuItems = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/menu-items');
            setMenuData(response.data);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        } finally{
            setLoading(false)
        }
    },[]);

    useEffect(() => {

        fetchMenuItems();
    }, [fetchMenuItems]);

    const paginatedItems = menuData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

    // Function to handle adding a new menu item
    const handleAddMenuItem = (newMenuItem) => {
        setMenuData((prevData) => [...prevData, newMenuItem]);
        setOpenAddMenuItem(false);
        fetchMenuItems()
    };

    const handleOpenEdit = (menuItem) => {
        setSelectedMenuItem(menuItem); 
        setOpenEdit(true); // Open the edit dialog
    };

    const handleCloseDialog = () => {
        setOpenAddMenuItem(false); 
        setOpenEdit(false); 
        setSelectedMenuItem(null); 
    };

    const handleEditMenuItem = (updatedMenuItem) => {
        setMenuData((prevData) => prevData.map((item) => (item.id === updatedMenuItem.id ? updatedMenuItem : item)));
      fetchMenuItems()
    };

    // Function to handle deleting a menu item
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

    const updateAvailability = async (id, newAvailability) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: `This will ${newAvailability ? "make" : "remove"} the availability of this item.`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });
    
        if (confirm) {
            setLoading(true); // Assuming you have a loading state to manage UI feedback
            try {
                const response = await axiosInstance.put(`/menu-items/availability/${id}`, { availability: newAvailability });
                if (response.status === 200) {
                    // Update local state to reflect the change
                   fetchMenuItems()
                    swal({
                        title: `Availability updated successfully!`,
                        icon: "success"
                    });
                }
            } catch (error) {
                console.error("Error updating availability:", error);
                swal({
                    title: `${error.response?.data?.message || "An error occurred."}`,
                    icon: "warning"
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box sx={{ padding: '1 4',mt:1  }}>
        {/* Add Menu Item Button at the top-right corner */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddMenuItem(true)}
                sx={{
                    backgroundColor: '#1a76d2',
                    '&:hover': {
                        backgroundColor: '#0D47A1'
                    }
                }}
            >
                Add
            </Button>
        </Box>
    
        {/* Menu Section */}
        <Typography 
            variant="h4" 
            sx={{ 
                mb: 4, 
                textAlign: 'center', 
                fontWeight: 'bold',
                color: '#fff'
            }}
        >
            Menu Items
        </Typography>
    
        <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
        }}>
            {paginatedItems.map((item) => (
                <Box 
                    key={item.id}
                    sx={{
                        width: {
                            xs: '100%',
                            sm: 'calc(50% - 24px)',
                            md: 'calc(33.333% - 24px)',  // 3 columns on medium and large screens
                            lg: 'calc(33.333% - 24px)'
                        },
                        minWidth: '280px',
                        maxWidth: '350px'
                    }}
                >
                    <Card 
                        sx={{ 
                            height: '350px', // Reduced height for compact layout
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: 6
                            }
                        }}
                    >
                        <Box sx={{ 
                            position: 'relative',
                            height: '150px', // Adjusted image height for smaller card
                            overflow: 'hidden'
                        }}>
                            <CardMedia
                                component="img"
                                image={item?.image?.url}
                                alt={item.name}
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
    
                        <CardContent sx={{ 
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            pb: 6
                        }}>
                            <Typography 
                                variant="h6" 
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    mb: 1
                                }}
                            >
                                {item.name}
                            </Typography>
    
                            <Typography 
                                variant="body2" 
                                color="primary"
                                sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    color: '#1a76d2'
                                }}
                            >
                                ${item.price}
                            </Typography>
    
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {item.description}
                            </Typography>
                        </CardContent>
    
                        {/* Edit and Delete Buttons */}
                        <Box sx={{ 
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            display: 'flex',
                            gap: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '4px',
                            padding: '4px'
                        }}>
                            <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(item)}
                                sx={{
                                    color: '#1a76d2',
                                    '&:hover': {
                                        backgroundColor: 'rgba(26, 35, 126, 0.1)'
                                    }
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={() => handleDeleteMenuItem(item.id)}
                                sx={{
                                    color: '#d32f2f',
                                    '&:hover': {
                                        backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                    }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                size="small"
                onClick={() => updateAvailability(item.id, !item.availability)} // Toggle availability
                sx={{
                    color: item.availability ? '#4caf50' : '#d32f2f', // Green if available, red if not
                    '&:hover': {
                        backgroundColor: item.availability ? 'rgba(76, 175, 80, 0.1)' : 'rgba(211, 47, 47, 0.1)'
                    }
                }}
            >
                {item.availability ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />} {/* Toggle icon based on availability */}
            </IconButton>
                        </Box>
                    </Card>
                </Box>
            ))}
            <LoadingDialog open={loading || deleting} />
        </Box>
        <Pagination
        count={Math.ceil(menuData.length / itemsPerPage)}
        page={currentPage}
        variant="outlined"
        onChange={handlePageChange}
        //  color="primary"
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          '.MuiPaginationItem-root': {
      color: '#d3a871', // Set text color for pagination items
      borderColor: '#d3a871', // Set border color for outlined variant
    },
    '.MuiPaginationItem-root.Mui-selected': {
      backgroundColor: '#d3a871', // Set background for selected item
      color: '#fff', // Text color for selected item
    },
        }}
      />
    
        {/* Modals */}
        <AddMenuItem
            open={openAddMenuItem}
            onClose={handleCloseDialog}
            onAdd={handleAddMenuItem}
        />
        {openEdit && selectedMenuItem && (
            <EditMenuItem
                open={openEdit}
                onClose={handleCloseDialog}
                menuItem={selectedMenuItem}
                onEdit={handleEditMenuItem}
            />
        )}
    </Box>
    
    );
};

export default MenuItems;
