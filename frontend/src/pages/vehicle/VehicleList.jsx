import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../config/api';
import { Card, CardMedia, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddVehicle from './addVehicle'; // Import the AddVehicle modal component
import EditVehicle from './editVehicle';
import swal from 'sweetalert';
import Grid from '@mui/material/Grid2';
import LoadingDialog from '../../components/LoadingDialog';
import { Pagination } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon for availability
import CancelIcon from '@mui/icons-material/Cancel';

const VehicleList = () => {
    const [vehicleData, setVehicleData] = useState([]);
    const [openAddVehicle, setOpenAddVehicle] = useState(false); 
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // For pagination
    const itemsPerPage = 6;

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const fetchVehicles = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/vehicles');
            console.log("response:",response.data)
            setVehicleData(response.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const paginatedItems = vehicleData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Function to handle adding a new vehicle
    const handleAddVehicle = (newVehicle) => {
        setVehicleData((prevData) => [...prevData, newVehicle]);
        setOpenAddVehicle(false);
        fetchVehicles();
    };

    const handleOpenEdit = (vehicle) => {
        setSelectedVehicle(vehicle); 
        setOpenEdit(true); // Open the edit dialog
    };

    const handleCloseDialog = () => {
        setOpenAddVehicle(false); 
        setOpenEdit(false); 
        setSelectedVehicle(null); 
    };

    const handleEditVehicle = (updatedVehicle) => {
        setVehicleData((prevData) => prevData.map((item) => (item.id === updatedVehicle.id ? updatedVehicle : item)));
        fetchVehicles();
    };

    // Function to handle deleting a vehicle
    const handleDeleteVehicle = async (id) => {
        console.log("id:",id)
        const confirm = await swal({
            title: "Are you sure?",
            text: "You will not be able to recover this vehicle!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirm) {
            setDeleting(true);
            try {
                const response = await axiosInstance.delete(`/vehicles/${id}`);
                if (response.status === 200) {
                    setVehicleData((prevData) => prevData.filter((item) => item.id !== id)); 
                    swal({
                        title: "Vehicle Deleted Successfully!",
                        icon: "success"
                    });
                }
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                swal({
                    title: `${error.response.data.message}`,
                    icon: "warning"
                });
            } finally {
                setDeleting(false);
            }
        }
    };

    const updateAvailability = async (id, newAvailability) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: `This will ${newAvailability ? "make" : "remove"} the availability of this vehicle.`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirm) {
            setLoading(true); // Assuming you have a loading state to manage UI feedback
            try {
                const response = await axiosInstance.put(`/vehicles/availability/${id}`, { availability: newAvailability });
                if (response.status === 200) {
                    fetchVehicles();
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
        <Box sx={{ padding: '1 4', mt: 1 }}>
            {/* Add Vehicle Button at the top-right corner */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddVehicle(true)}
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

            {/* Vehicle Section */}
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 4, 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: '#fff'
                }}
            >
                Vehicles
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
                                md: 'calc(33.333% - 24px)',
                                lg: 'calc(33.333% - 24px)'
                            },
                            minWidth: '280px',
                            maxWidth: '350px'
                        }}
                    >
                        <Card 
                            sx={{ 
                                height: '350px',
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
                                height: '150px',
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
                                    onClick={() => handleDeleteVehicle(item._id)}
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
                                    onClick={() => updateAvailability(item._id, !item.availability)}
                                    sx={{
                                        color: item.availability ? '#4caf50' : '#d32f2f',
                                        '&:hover': {
                                            backgroundColor: item.availability ? 'rgba(76, 175, 80, 0.1)' : 'rgba(211, 47, 47, 0.1)'
                                        }
                                    }}
                                >
                                    {item.availability ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                                </IconButton>
                            </Box>
                        </Card>
                    </Box>
                ))}
                <LoadingDialog open={loading || deleting} />
            </Box>
            <Pagination
                count={Math.ceil(vehicleData.length / itemsPerPage)}
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

            {/* Modals */}
            <AddVehicle
                open={openAddVehicle}
                onClose={handleCloseDialog}
                onAdd={handleAddVehicle}
            />
            {openEdit && selectedVehicle && (
                <EditVehicle
                    open={openEdit}
                    onClose={handleCloseDialog}
                    vehicle={selectedVehicle}
                    onEdit={handleEditVehicle}
                />
            )}
        </Box>
    );
};

export default VehicleList;
