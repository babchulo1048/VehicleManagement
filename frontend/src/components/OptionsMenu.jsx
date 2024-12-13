import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './MenuButton';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert,Avatar,Button ,Modal,Box,Typography} from '@mui/material'
import LoadingDialog from './LoadingDialog';
import { axiosInstance } from '../config/api';


const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [email2, setEmail2] = React.useState('');
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [error2, setError2] = React.useState('');
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('targetId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    
    navigate('/login');
  };

  const handleUpdatePassword = async () => {
    setDialogOpen(true)
    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/update-password', {
        email,
        oldPassword,
        newPassword
      });

      if (response.status === 200) {
        swal({
          title: 'Password Updated Successfully!',
          icon: 'success',
        });
        setDialogOpen(false);
        setEmail('');
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error) {
      console.error('Error updating password:', error?.response?.data?.error);
      if (error.response.data.error) {
        setError(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setModalOpen(true);
    setLoading2(true);
   console.log("Forgot Password",isModalOpen)

   try{

    const response = await axiosInstance.post('/users/forgot-password', {
      email: email2,
    });  
    console.log("response:",response)
    if(response.status === 200){
      swal({
        title: 'Password Reset Request Successful!',
        text: 'A Password has been sent to your email address .',
        icon: 'success',
      });
      
      setEmail2('');
      setModalOpen(false); // Close the dialog
      
    }
   }catch(error){
    console.error('Error forgot password:', error?.response?.data?.error);
    if (error.response.data.error) {
      setError2(error.response.data.error);
    }
   }finally {
    setLoading2(false);
   }
   
  };

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
    setEmail('');
    setOldPassword('');
    setNewPassword('');
  };

const handleModalClose = () => {
  setModalOpen(false);
  // setEmail2('');
  setError2('');
};

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Add another account</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem> */}
        <MenuItem onClick={handleUpdatePassword}>Update Password</MenuItem>
        <MenuItem onClick={() => setModalOpen(true)}>Forgot Password</MenuItem>
        <Divider />
        <MenuItem
          onClick={handleClose}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText onClick={handleLogout}>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
      <Dialog open={isDialogOpen} onClose={toggleDialog} maxWidth="xl" fullWidth PaperProps={{ style: { width: '100%', maxWidth: '400px' } }}>
        {error && (
          <Alert severity="error" variant="filled" sx={{ width: '100%', marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <DialogTitle color='#fff'>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
          />
          <TextField
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={(e) => { setOldPassword(e.target.value); setError(''); }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>Cancel</Button>
          <Button onClick={handleUpdatePassword}>Update</Button>
        </DialogActions>
        <LoadingDialog open={loading || loading2} />
      </Dialog>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
            {error2 && (
          <Alert severity="error" variant="filled" sx={{ width: '100%', marginBottom: 2 }}>
            {error2}
          </Alert>
        )}
          <Typography id="modal-title" variant="h6" component="h2">
            Forgot Password
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Enter your email to reset your password:
          </Typography>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email2}
            onChange={(e) => {
              setError2('');
              setEmail2(e.target.value)}}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleModalClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" 
            // onClick={handleSendEmail}
            onClick={handleForgotPassword}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}