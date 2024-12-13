import React, { useMemo,useCallback, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { axiosInstance } from '../../../config/api';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { MenuItem, Select,Button,Menu,Box,Container } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import EditIcon from '@mui/icons-material/Edit';
import LoadingDialog from '../../../components/LoadingDialog';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';


const UserList = () => {
  const [roles,setRoles]=useState([]);
  const [loading, setLoading] = useState(true);
  const [open,setOpen] = useState(false);
  const [openEdit,setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users,setUsers] = useState([])
  
  const handleCloseDialog = () => {
    setOpen(false); 
    setOpenEdit(false); 
    setSelectedUser(null); 
  };

  const handleOpenEdit = (user) => {
    console.log("user:")
    setSelectedUser(user); 
    setOpenEdit(true); // Open the edit dialog
  };

  const getUsers = useCallback(async () => {
    setLoading(true);
    try{
    const response = await axiosInstance.get('/users');
    console.log("response:",response.data)
    setUsers(response.data);
    }catch(error){
      console.error('Error fetching roles:', error);
    }
    finally{
      setLoading(false);
    }
  },[]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleAddUser = () => {
    getUsers();
  }

  const handleEditUser = () => {
    getUsers();
  }
  const columns = useMemo(
    () => [
      // {
      //   id: 'action',
      //   accessor: 'action',
      //   header: '',
      //   size: 40,
      //   Cell: ({ row }) => (
      //     <PopupState variant="popover" popupId="demo-popup-menu">
      //       {(popupState) => (
      //         <React.Fragment>
      //           <Button color='#444' {...bindTrigger(popupState)} style={{ padding: 0, minWidth: 0 }}>
      //             <MoreVertIcon />
      //           </Button>
      //           <Menu {...bindMenu(popupState)}>
      //           <MenuItem onClick={() => {
      //                 handleOpenEdit(row.original);
      //                 popupState.close();
      //               }} style={{ color: '#1976d2' }}>
      //                 <EditIcon style={{ marginRight: 8 }} /> Edit
      //               </MenuItem>
      //           </Menu>
      //         </React.Fragment>
      //       )}
      //     </PopupState>
      //   ),
      //   showSortIcons: false,
      // },
      {
        accessorKey: 'id', // Column for order ID
        header: 'User Id',
        size: 100,
      },
      {
        accessorKey: 'name', // Column for order ID
        header: 'Name',
        size: 100,
      },
      {
        accessorKey: 'email', // Column for order ID
        header: 'Email',
        size: 150,
      },
      {
        accessorKey: 'role.name', // Column for order ID
        header: 'role',
        size: 100,
      },
      
    ]
   // Add statusMap as a dependency
  );

  const table = useMaterialReactTable({
    columns,
    data: users, // Use fetched orders data here
  });


  return (
    <Container sx={{ position: 'relative',mt:10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>

    <Button 
      variant="contained" 
      color="primary" 
      sx={{ my:2 }}
      onClick={() => setOpen(true)}
    >
      Add
    </Button>
          </Box>
    <Box />
    <MaterialReactTable table={table} />
    <UserCreate
        open={open}
        onClose={handleCloseDialog}
        onAdd={handleAddUser}
      />
    <LoadingDialog open={loading} />
    {openEdit && selectedUser && (
        <UserEdit
          open={openEdit}
          onClose={handleCloseDialog}
          user={selectedUser}
          onEdit={handleEditUser}
        />
      )}
    </Container>
  )
}

export default UserList