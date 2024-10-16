import React from 'react';
import { Container, Grid, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
    return (
        <footer style={{ background: 'linear-gradient(180deg, #D5E9F5 50.98%, #D4F5F5 100%)', color: 'black', padding: '20px 0'}}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between" mt={1}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h5" gutterBottom>
                            DecipheringMinds
                        </Typography>
                        <Typography variant="body2">You’ve reached the end, but it’s not the end!
                            Remember, you’re not alone. Reach out, seek support, and prioritize your mental well-being.</Typography>
                        
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Services
                        </Typography>
                        <Link color="inherit" underline="hover">Psychotherapy</Link><br />
                        <Link color="inherit" underline="hover">Mental Counseling</Link><br />
                        <Link color="inherit" underline="hover">Support Groups</Link><br />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Contact Info
                        </Typography>
                        <Typography variant="body2">Email: decipheringminds@gmail.com</Typography>
                        <Typography variant="body2">Phone: (123) 456-7890</Typography>
                    </Grid>
                    <Divider />
                    <Grid item xs={12} textAlign='center'>
                    <Typography variant="body2" style={{ marginTop: '20px' }}>
                            © {new Date().getFullYear()} DecipheringMinds.com All rights reserved
                        </Typography>
                    </Grid>

                </Grid>
            </Container>
        </footer>
    );
};

export default Footer;
