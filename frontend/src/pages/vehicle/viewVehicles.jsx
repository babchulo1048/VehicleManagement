import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ViewVehicles = ({ vehicle,  onClose }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(vehicle);
  }, [vehicle]);

  if (!data) return null; // Avoid rendering if no vehicle data is available.

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', position: 'relative' }}>
        Vehicle Details
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          key={data.id}
         
        >
          <Card
           
          >
            {/* Vehicle Image */}
            <Box
            sx={{
              width: '100%',
              height: '200px', // Adjust the height as needed
              overflow: 'hidden',
            }}
             
            >
              <CardMedia
                component="img"
                image={data?.image?.url || '/placeholder.jpg'} // Fallback image
                alt={data.name}
                sx={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            {/* Vehicle Info */}
            <CardContent
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  mb: 1,
                }}
              >
                {data.name}
              </Typography>

              <Typography
                variant="body2"
                color="primary"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: '#1a76d2',
                }}
              >
                ${data.price}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontSize: '0.9rem',
                }}
              >
                {data.description || 'No description available.'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVehicles;
