import React, { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../config/api";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  Pagination,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MaterialReactTable } from "material-react-table";
import swal from "sweetalert";
import AddVehicle from "./addVehicle";
import EditVehicle from "./editVehicle";
import ViewVehicles from "./viewVehicles";
import LoadingDialog from "../../components/LoadingDialog";

const statusOptions = ["available", "pending", "sold"];

const Vehicles = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [openAddVehicle, setOpenAddVehicle] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor
  const [menuVehicleId, setMenuVehicleId] = useState(null); // Vehicle ID for menu
  const itemsPerPage = 6;

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/vehicles");
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddVehicle = (newVehicle) => {
    setVehicleData((prevData) => [...prevData, newVehicle]);
    setOpenAddVehicle(false);
  };

  const handleEditVehicle = (updatedVehicle) => {
    fetchVehicles();
    setVehicleData((prevData) =>
      prevData.map((item) =>
        item.id === updatedVehicle.id ? updatedVehicle : item
      )
    );
    setOpenEdit(false);
  };


  const handleDeleteVehicle = async (id) => {
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
        if (response.status === 204) {
            fetchVehicles();
          setVehicleData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
          swal({ title: "Vehicle Deleted Successfully!", icon: "success" });
        }
      } catch (error) {
        swal({ title: `${error.response?.data?.message}`, icon: "warning" });
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/vehicles/status/${vehicleId}`, {
        status: newStatus,
      });
      fetchVehicles();
      setVehicleData((prevData) =>
        prevData.map((item) =>
          item.id === vehicleId ? { ...item, status: response.data.status } : item
        )
      );
      setAnchorEl(null); // Close the menu
    } catch (error) {
      swal({ title: "Failed to update status", icon: "error" });
    }
  };

  const handleOpenMenu = (event, vehicleId) => {
    console.log("vehicleId:",vehicleId)
    setAnchorEl(event.currentTarget);
    setMenuVehicleId(vehicleId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuVehicleId(null);
  };

  function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  return new Date(date).toLocaleString('en-US', options);  
}

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    // {
    //   accessorKey: "price",
    //   header: "Price",
    //   Cell: ({ cell }) => `$${cell.getValue()}`,
    // },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => <Typography>{cell.getValue()}</Typography>,
    },
    {
        accessorKey: "lastUpdated",
        header: "Last Updated",
        Cell: ({ cell }) => <Typography>{formatDate(cell.getValue())}</Typography>,
      },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <IconButton
            onClick={() => {
              setSelectedVehicle(row.original);
              setOpenEdit(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteVehicle(row.original._id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton sx={{  padding: '1rem'}}
            onClick={(event) => handleOpenMenu(event, row.original._id)}
          >
            <Typography sx={{fontSize: '0.7rem'}}>Status</Typography>
          </IconButton>
          {/* <IconButton onClick={() => handleOpenView(row.original)}>
            <VisibilityIcon />
          </IconButton> */}
        </Box>
      ),
    },
  ];

  const paginatedItems = vehicleData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      {/* Add Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddVehicle(true)}
        >
          Add Vehicle
        </Button>
      </Box>

      {/* Table */}
      <MaterialReactTable
        columns={columns}
        data={paginatedItems}
        initialState={{ showGlobalFilter: true }}
        state={{ isLoading: loading }}
      />

      {/* Pagination */}
      <Pagination
        count={Math.ceil(vehicleData.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {statusOptions.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(menuVehicleId, status)}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>

      {/* Modals */}
      <AddVehicle
        open={openAddVehicle}
        onClose={() => setOpenAddVehicle(false)}
        onAdd={handleAddVehicle}
      />
      {openEdit && selectedVehicle && (
        <EditVehicle
          open={openEdit}
          vehicle={selectedVehicle}
          onClose={() => setOpenEdit(false)}
          onEdit={handleEditVehicle}
        />
      )}
      {openView && (
        <ViewVehicles
          open={openView}
          vehicle={vehicle}
          onClose={() => setOpenView(false)}
        />
      )}

      {/* Loading Dialog */}
      <LoadingDialog open={loading || deleting} />
    </Box>
  );
};

export default Vehicles;
