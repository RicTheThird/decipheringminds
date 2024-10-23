import { useEffect, useState } from 'react';
import {
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Badge
} from '@mui/material';
import { getAllUsers } from '../services/apiService';
import dayjs from 'dayjs';

const UserSearch = ({ setSelectedPatient, selectedPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [patientList, setPatientList] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  useEffect(() => {
    if (selectedPatient === null) {
      setPatientList(patients)
    }
  }, [selectedPatient]);

  useEffect(() => {
    setAppointments();
  }, []);

  const setAppointments = async () => {
    const response = await getAllUsers('Customer')
    if (response && response.length) {
      setPatients(response);
      setPatientList(response)
    } else {
      setPatients([])
      setPatientList([])
    }
  };

  const onSearch = (key: string) => {
    setSearchTerm(key);
    if (key !== null && key.trim() !== '') {
      const filtered = patients.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPatientList(filtered)
    } else {
      setPatientList(patients)
    }

  }
  const handleUserClick = (user) => {
    setSelectedPatient(user);
    setSearchTerm('')
  };

  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        label="Search Patient"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        margin="normal"
      />
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Birthdate</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row.id} onClick={() => handleUserClick(row)}>
                  <TableCell component="th" scope="row" sx={{ cursor: 'pointer', fontWeight: row.id === selectedPatient?.id ? 'bold' : 'normal' }}>
                    {row.lastName} {row.id === selectedPatient?.id && <Badge
                    badgeContent="Selected"
                    color="primary"
                    sx={{ position: 'relative', left: '30px' }}
                  />}
                  </TableCell>
                  <TableCell sx={{ cursor: 'pointer', fontWeight: row.id === selectedPatient?.id ? 'bold' : 'normal' }}>{row.firstName}</TableCell>
                  <TableCell sx={{ cursor: 'pointer', fontWeight: row.id === selectedPatient?.id ? 'bold' : 'normal' }}>{row.gender}</TableCell>
                  <TableCell sx={{ cursor: 'pointer', fontWeight: row.id === selectedPatient?.id ? 'bold' : 'normal' }}>{dayjs(row.birthDate).format('YYYY-MM-DD')}</TableCell>
                  <TableCell sx={{ cursor: 'pointer', fontWeight: row.id === selectedPatient?.id ? 'bold' : 'normal' }}>{row.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={patientList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper >
      {/* } */}
    </>
  );
};

export default UserSearch;
