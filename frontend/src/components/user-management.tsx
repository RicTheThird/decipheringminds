import React, { useEffect, useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Snackbar,
    Alert,
    Paper,
    MenuItem,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { invite } from '../services/authService';
import { deleteUser, getAllUsers, updateUser } from '../services/apiService';
import ConfirmationDialog from './confirmation';

const UserManagement = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Staff');
    const [users, setUsers] = useState<any[]>([]);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const users = await getAllUsers('Staff');
            setUsers(users)
        } catch (e) {
            console.log(e)
        }
    };

    const updateUserAsync = async (user, action) => {
        if (action === 'Delete') {
            if (window.confirm("Do you really want to delete this user? Note: This is action cannot be undone")) {
                await deleteUser(user.id);
            } else
                return;

        } else if (action === 'Activate') {
            user.active = true;
            await updateUser(user.id, user)
        } else if (action === 'Deactivate') {
            if (window.confirm("Do you really want to deactivate this user?")) {
                user.active = false;
                await updateUser(user.id, user)
            } else return;
        }
        setSnackMessage({ message: 'Users successfully updated.', success: true });
        setSnackOpen(true);
        getUsers();
    }

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response: any = await invite({ email, role });
            if (response.status < 299) {
                //setUsers([...users, { email, disabled: false }]);
                setSnackMessage({ message: `Successfully invited user with ${email} and role ${role}`, success: true })
                setSnackOpen(true);
                setEmail('');
                //setRole('')
            } else {
                setSnackMessage({ message: response.response.data, success: false })
                setSnackOpen(true);
            }
        } catch (e) {
            setSnackMessage({ message: 'Failed to invite user', success: false })
            setSnackOpen(true);
        } finally {
            setLoading(false)
        }
    };

    const handleDelete = (userEmail) => {
        setUsers(users.filter(user => user.email !== userEmail));
        setSnackMessage(`Deleted ${userEmail}`);
        setSnackOpen(true);
    };

    const handleDisable = (userEmail) => {
        setUsers(users.map(user =>
            user.email === userEmail ? { ...user, disabled: true } : user
        ));
        setSnackMessage(`Disabled ${userEmail}`);
        setSnackOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ margin: '0' }}>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <form onSubmit={handleInvite}>
                    <TextField
                        label="Invite User by Email"
                        variant="outlined"
                        fullWidth
                        type='email'
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* <TextField
                        label="Role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        variant="outlined"
                        fullWidth
                        select
                        sx={{ textAlign: "left", mt: 2 }}
                        required>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Staff">Staff</MenuItem>
                    </TextField> */}
                    <Button type='submit' variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}>
                        Invite
                    </Button>
                </form>
            </Paper>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel>Name</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>Email</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>Role</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel>Is Active</TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.active ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="warning" size="small" onClick={() => updateUserAsync(user, user.active ? 'Deactivate' : 'Activate')}>
                                        {user.active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button variant="contained" color="error" size="small" style={{ marginLeft: 8 }} onClick={() => updateUserAsync(user, 'Delete')}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <List>
                {users.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${user.firstName} ${user.lastName}`}
                            secondary='Name'
                        />
                        <ListItemText
                            primary={user.email}
                            secondary='Email'
                            //secondary={user.active ? 'Disabled' : 'Active'}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDelete(user.email)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleDisable(user.email)} disabled={!user.active}>
                                <DisabledByDefaultIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List> */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackOpen(false)} severity={snackMessage?.success ? "success" : "error"} sx={{ width: '100%' }}>
                    {snackMessage?.message}
                </Alert>
            </Snackbar>

            {/* <ConfirmationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                //onConfirm={handleConfirm}
                title="Confirm Action"
                message={dialogMessage}
            /> */}
        </Container>
    );
};

export default UserManagement;
