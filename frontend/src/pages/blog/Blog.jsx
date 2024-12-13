import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../config/api';
import { Card, CardMedia, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid2';
import LoadingDialog from '../../components/LoadingDialog';
import { Pagination } from '@mui/material';
import BlogCreate from './BlogCreate';
import BlogEdit from './BlogEdit';
import DeleteIcon from '@mui/icons-material/Delete';

const Blog = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [openAddBlog, setOpenAddBlog] = useState(false); 
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/blogs');
      setBlogData(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedItems = blogData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddBlog = () => {
    fetchBlogs();
  };

  const handleOpenEdit = (blog) => {
    setSelectedBlog(blog); 
    setOpenEdit(true); // Open the edit dialog
  };

  const handleCloseDialog = () => {
    setOpenAddBlog(false); 
    setOpenEdit(false); 
    setSelectedBlog(null); 
  };

  const handleEditBlog = () => {
    fetchBlogs();
  };

  const handleDeleteBlog = async (id) => {
    const confirm = await swal({
        title: "Are you sure?",
        text: "You will not be able to recover this Blog!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    });

    if (confirm) {
      setDeleting(true);
        try {
            const response = await axiosInstance.delete(`/blogs/${id}`);
            if (response.status === 200) {
                setBlogData((prevData) => prevData.filter((item) => item.id !== id)); 
                swal({
                    title: "Blog Deleted Successfully!",
                    icon: "success"
                });
                fetchBlogs();
            }
        } catch (error) {
            console.error("Error deleting Blog:", error);
        } 
        finally{
            setDeleting(false);
        }
    }
};


  return (
    <Box sx={{ padding: 4, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddBlog(true)}
          sx={{
            backgroundColor: '#1a76d2',
            '&:hover': {
              backgroundColor: '#0D47A1'
            }
          }}
        >
          Add Blog
        </Button>
      </Box>
      
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#fff'
        }}
      >
        Blogs
      </Typography>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'center',
      }}>
        {paginatedItems.map((blog) => (
          <Box
            key={blog.id}
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
                height: '250px',
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
                  image={blog?.image?.url}
                  alt={blog.title}
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
                  {blog.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    color: '#1a76d2'
                  }}
                >
                  {blog.description.length > 100
                    ? `${blog.description.slice(0, 100)}...`
                    : blog.description}
                </Typography>
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
                  onClick={() => handleOpenEdit(blog)}
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
                  onClick={() => handleDeleteBlog(blog.id)}
                  sx={{
                    color: '#d32f2f',
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.1)'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
        <LoadingDialog open={loading || deleting} />
      </Box>

      <Pagination
        count={Math.ceil(blogData.length / itemsPerPage)}
        page={currentPage}
        variant="outlined"
        onChange={handlePageChange}
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          '.MuiPaginationItem-root': {
            color: '#d3a871',
            borderColor: '#d3a871'
          },
          '.MuiPaginationItem-root.Mui-selected': {
            backgroundColor: '#d3a871',
            color: '#fff'
          },
        }}
      />
       <BlogCreate
            open={openAddBlog}
            onClose={handleCloseDialog}
            onAdd={handleAddBlog}
        />
        {openEdit && selectedBlog && (
            <BlogEdit
                open={openEdit}
                onClose={handleCloseDialog}
                blog={selectedBlog}
                onEdit={handleEditBlog}
            />
        )}
    </Box>
  );
};

export default Blog;
