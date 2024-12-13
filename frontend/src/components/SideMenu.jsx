import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import Logo from "../assets/logo.webp"

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
       <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mt: 'calc(var(--template-frame-height, 0px) + 4px)',
        p: 1.5,
      }}
    >


      {/* Display the logo image */}
      <Box
        component="img"
        src={Logo} // Replace with the actual logo path
        alt="Zagew Logo"
        sx={{
          width: 50, // Adjust as needed
          height: 50, // Adjust as needed
          borderRadius: '50%', // Optional, makes the logo circular
          mr: 2, // Add margin between logo and text
        }}
      />

      {/* Display the restaurant name */}
      <Typography variant="h6">
        Vehicle Management
      </Typography>
    </Box>
      <Divider />
      <MenuContent />
      {/* <CardAlert /> */}
      <Stack
  direction="row"
  sx={{
    p: 2,
    gap: 1,
    alignItems: 'center',
    borderTop: '1px solid',
    borderColor: 'divider',
  }}
>
  <Avatar
    sizes="small"
    alt={name}
    src="/static/images/avatar/7.jpg"
    sx={{ width: 36, height: 36 }}
  />
  <Box sx={{ mr: 'auto', minWidth: 0 }}>
    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
      {name}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        color: 'text.secondary',
        display: 'block', // Ensures it behaves as a block to wrap
        overflow: 'hidden',
        textOverflow: 'ellipsis', // Optional if you want truncated text
        whiteSpace: 'normal', // Ensures wrapping
        wordWrap: 'break-word', // Breaks long words
        overflowWrap: 'break-word', // Alternative for word breaking
      }}
    >
      {email}
    </Typography>
  </Box>
  {/* <OptionsMenu /> */}
</Stack>

    </Drawer>
  );
}