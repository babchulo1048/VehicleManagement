import React from 'react';
import { Dialog, CircularProgress, Box, Typography } from '@mui/material';


const LoadingDialog = ({ open }) => {

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        bgcolor="transparent" 
      >
        <Box
          bgcolor="transparent" 
          p={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        boxShadow={3} 
        >
          <CircularProgress size={40} sx={{ mb: 2,color:'#FF5722' }} />
          <Typography variant="h6" color="white">
            Loading...
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LoadingDialog;