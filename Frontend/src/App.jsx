import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Checkbox } from '@mui/material';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState({ Title: '', Description: '', Status: 'Pending' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/todos/get');
      setTodos(response.data); // Set the todos state with fetched data
      setLoading(false);
    } catch (error) {
      setTodos([])
      setLoading(false);
      console.error('Error fetching todos:', error.message);
    }
  };

  const handleChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/todos/create', newTodo);
      fetchTodos(); // Reload the todos after creation
      setNewTodo({ Title: '', Description: '', Status: 'Pending' }); // Reset form
    } catch (error) {
      console.error('Error creating todo:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`http://localhost:4000/todos/delete`, { TodoID: id });
      fetchTodos(); // Reload todos after deletion
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  };

  // Function to handle status change from Pending to Completed or vice versa
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      await axios.post('http://localhost:4000/todos/update', { TodoID: id, Status: newStatus });
      fetchTodos(); // Reload todos after status change
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };
  const handleEdit = async (id, newTitle, newDescription) => {
    try {
      await axios.put('http://localhost:4000/todos/updatedetails', {
        TodoID: id,
        Title: newTitle,
        Description: newDescription,
      });
      fetchTodos(); // Reload todos after update
    } catch (error) {
      console.error('Error updating todo:', error.message);
    }
  };
  

  // Define columns for the DataGrid
  const columns = [
    { field: 'TodoID', headerName: 'ID', width: 100 },
    { 
      field: 'Title', 
      headerName: 'Title', 
      width: 200,
      renderCell: (params) => (
        <Typography 
          style={{ textDecoration: params.row.Status === 'Completed' ? 'line-through' : 'none' }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'Description', 
      headerName: 'Description', 
      width: 300,
      renderCell: (params) => (
        <Typography 
          style={{ textDecoration: params.row.Status === 'Completed' ? 'line-through' : 'none' }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'Status', 
      headerName: 'Status', 
      width: 150, 
      renderCell: (params) => (
        <Checkbox
          checked={params.value === 'Completed'}
          onChange={() => handleStatusChange(params.row.TodoID, params.value)}
        />
      ),
    },
    { 
      field: 'delete', 
      headerName: 'Actions', 
      width: 150, 
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => handleDelete(params.row.TodoID)}
        >
          Delete
        </Button>
      )
    },
    { 
      field: 'edit', 
      headerName: 'Edit', 
      width: 150, 
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => {
            const newTitle = prompt('Enter new title:', params.row.Title);
            const newDescription = prompt('Enter new description:', params.row.Description);
            if (newTitle && newDescription) {
              handleEdit(params.row.TodoID, newTitle, newDescription);
            }
          }}
        >
          Edit
        </Button>
      )
    }
  ];
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '20px',
      }}
    >
      <Box sx={{ width: '80%', marginBottom: '20px' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="Title"
            value={newTodo.Title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="Description"
            value={newTodo.Description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">Create Todo</Button>
        </form>
      </Box>

      <Box sx={{ height: 400, width: '80%' }}>
        <DataGrid
          rows={todos} // Data for the DataGrid
          columns={columns} // Column definitions
          pageSize={5} // Number of rows per page
          rowsPerPageOptions={[5, 10, 15]} // Page size options
          getRowId={(row) => row.TodoID} // Specify unique row identifier
        />
      </Box>
    </Box>
  );
};

export default App;
