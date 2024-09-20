// src/UserSearch.js
import React, { useEffect, useState } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Paper
} from '@mui/material';
import { getAllPatients } from '../services/apiService';

const UserSearch = ({setSelectedPatient}) => {
  const [searchTerm, setSearchTerm] = useState('');
  //const [selectedUser, setSelectedUser] = useState(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchResults, setSearchResult] = useState<any[]>([]);

  useEffect(() => {
    setAppointments();
  }, []);

  const setAppointments = async () => {
    const response = await getAllPatients()
    if (response && response.length) {
      setPatients(response);
    } else {
      setPatients([])
    }
  };

  const onSearch = (key: string) => {
    setSearchTerm(key);
    const filtered = patients.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResult(filtered)
  }
  const handleUserClick = (user) => {
    setSelectedPatient(user);
    setSearchTerm('')
    setSearchResult([]);
    // You can add further logic here to handle user selection
  };

  return (
    <>
      {/* <Typography variant="body1">
        Search for Patient
      </Typography> */}
      <TextField
        fullWidth
        variant="outlined"
        label="Search Patient"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        margin="normal"
      />
      {searchTerm && searchResults && searchResults.length > 0 &&
        <Paper>
          <List>
            {searchResults.map((user) => (
              <ListItem
                key={user.id}
                //selected={selectedUser?.id === user.id}
                onClick={() => handleUserClick(user)}
              >
                <ListItemText primary={`${user.firstName} ${user.lastName}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      }
    </>
  );
};

export default UserSearch;
