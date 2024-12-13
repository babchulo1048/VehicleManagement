// import React from 'react';
// import { Dialog, Box, Typography } from '@mui/material';
// import useThemeStore from '../hook/zustand';

// const BurgerLoading = ({ open }) => {
//   const { theme } = useThemeStore();

//   // Define each layer with looping animation and border
//   const layerStyle = (color, delay) => ({
//     width: '60px',
//     height: '10px',
//     backgroundColor: color,
//     border: `2px solid ${theme === 'light' ? '#000' : '#fff'}`, // Border around each layer
//     borderRadius: '5px',
//     marginBottom: '4px',
//     animation: `fall-in 2s ${delay}s ease-in-out infinite`,
//   });

//   const bunColor = theme === 'light' ? '#FFD700' : '#FFA500';
//   const pattyColor = theme === 'light' ? '#8B4513' : '#A0522D';
//   const cheeseColor = '#FFD700'; // Cheese color is the same for both themes

//   return (
//     <Dialog 
//       open={open} 
//       maxWidth="sm" 
//       PaperProps={{
//         style: {
//           backgroundColor: 'transparent',
//           boxShadow: 'none',
//         },
//       }}
//     >
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100%"
//         bgcolor="transparent"
//       >
//         <Box
//           bgcolor="transparent"
//           p={2}
//           display="flex"
//           flexDirection="column"
//           alignItems="center"
//           boxShadow={3}
//         >
//           {/* Animated burger layers with border and looping animation */}
//           <Box sx={layerStyle(bunColor, 0)} />
//           <Box sx={layerStyle(pattyColor, 0.3)} />
//           <Box sx={layerStyle(cheeseColor, 0.6)} />
//           <Box sx={layerStyle(bunColor, 0.9)} />

//           {/* Loading text */}
//           {/* <Typography 
//             variant="h1" 
//             color="#fff"
//           >
//             ...
//           </Typography> */}
//         </Box>
//       </Box>

//       {/* Keyframes for looping "fall-in" animation */}
//       <style jsx>{`
//         @keyframes fall-in {
//           0%, 100% { transform: translateY(-30px); opacity: 0; }
//           50% { transform: translateY(0); opacity: 1; }
//         }
//       `}</style>
//     </Dialog>
//   );
// };

// export default BurgerLoading;
import React from 'react';
import { Dialog, Box, Typography } from '@mui/material';
import useThemeStore from '../hook/zustand';
import Logo from "../assets/logo.webp"; // Assuming you have a logo image at this path
import { LegendToggleOutlined } from '@mui/icons-material';

const BurgerLoading = ({ open }) => {
  const { theme } = useThemeStore();

  // Style for animated dots at the bottom
  const dotStyle = {
    width: '7px',
    height: '8px',
    backgroundColor: theme === 'light' ? '#000' : '#fff',
    borderRadius: '50%',
    margin: '0 4px',
    animation: 'blink 1.5s infinite',
  };
  // const dotStyle = {
  //   borderRadius: '50%',
  //   animation: 'bounce 1.5s infinite',
  //   margin: '0 4px', // optional: space between the dots
  // };


  

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
        flexDirection="column"
      >
        {/* Logo at the top */}
        <Box mb={2}>
          <img src={Logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
        </Box>

        {/* Loading text */}
        {/* <Typography
          variant="h4"
          color="#fff"
          sx={{fontFamily: 'Roboto Slab, serif', fontWeight: 'bold',fontSize: '4rem'}}
          mb={2}
        >
        ...
        </Typography> */}

        {/* Loading dots animation */}
        <Box mt={2} display="flex" justifyContent="center" alignItems="center">
  <Box sx={{ ...dotStyle, animationDelay: '0s', backgroundColor: 'white', width: '20px', height: '20px' }} />
  <Box sx={{ ...dotStyle, animationDelay: '0.5s', backgroundColor: 'white', width: '20px', height: '20px' }} />
  <Box sx={{ ...dotStyle, animationDelay: '1s', backgroundColor: 'white', width: '20px', height: '20px' }} />
</Box>
      </Box>

      {/* Keyframes for "blink" animation */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </Dialog>
  );
};

export default BurgerLoading;
