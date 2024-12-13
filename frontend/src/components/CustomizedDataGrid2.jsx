import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from '../config/api';// Replace with your axios instance

export default function CustomizedDataGrid() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('targetId');

  useEffect(() => {
    const fetchGridData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/admin-dashboard/${userId}`); // Replace with your endpoint
        const { recentOrders } = response.data;

        // Define columns dynamically (ensure you map the keys properly)
        const dynamicColumns = [
          { field: 'id', headerName: 'Order ID', flex: 1, minWidth: 50 },
          {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
              const getStatusStyle = (status) => {
                const normalizedStatus = status.toLowerCase();  // Normalize the status to lowercase
            
                switch (normalizedStatus) {
                    case 'pending':
                        return {
                            color: 'orange',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(255, 165, 0, 0.2)', // Light orange background
                            padding: '2px 8px',
                            borderRadius: '4px',
                        };
                    case 'completed':
                        return {
                            color: 'green',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(0, 128, 0, 0.2)', // Light green background
                            padding: '2px 8px',
                            borderRadius: '4px',
                        };
                    case 'cancelled':
                        return {
                            color: 'red',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(255, 0, 0, 0.2)', // Light red background
                            padding: '2px 8px',
                            borderRadius: '4px',
                        };
                    case 'in progress':
                        return {
                            color: 'blue',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(0, 0, 255, 0.2)', // Light blue background
                            padding: '2px 8px',
                            borderRadius: '4px',
                        };
                    default:
                        return {
                            color: 'gray',
                            backgroundColor: 'rgba(169, 169, 169, 0.2)', // Light gray background
                            padding: '2px 8px',
                            borderRadius: '4px',
                        };
                }
            };
            
          
              return (
                <span style={getStatusStyle(params.value)}>
                  {params.value}
                </span>
              );
            },
          }
          
,          
          { field: 'user_name', headerName: 'Users', flex: 1, minWidth: 100 },
          { field: 'total_price', headerName: 'Total Price', flex: 1, minWidth: 100 },
        ];

        // Assign rows
        const dynamicRows = recentOrders.map((order, index) => ({
          id: index + 1, // Unique ID for each row
          ...order, // Ensure API data matches column fields
        }));

        setColumns(dynamicColumns);
        setRows(dynamicRows);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGridData();
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        autoHeight
        checkboxSelection
        rows={rows}
        columns={columns}
        loading={loading}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
