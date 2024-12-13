import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

export default function MenuContent() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Set permissions to true for all items to show them
  const permissions = {
    showMenu: true,
    showOrders: true,
    showCategories: true,
    showReservations: true,
    showBlogs: true,
    showUsers: true,
    showRoles: true,
    showPermissions: true,
    showHome: true,
  };

  // Define all menu items
  const sidebarItems = [
    // { text: 'Home', icon: <HomeRoundedIcon />, path: '/admin' },
    { text: 'Vehicle List', icon: <LocalPizzaIcon />, path: '/vehicles' },

   
  ];

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {/* Main list items */}
        {sidebarItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
