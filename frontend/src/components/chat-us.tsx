import React, { useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getRole, isAuthenticated } from "../services/authService";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: "20px",
    },
    title: {
        textAlign: "center",
        marginBottom: "40px",
        color: "#202124",
        fontWeight: "bold",
        fontSize: "2.5rem",
    },
    highlightedText: {
        color: "#3ab3f7", // Color for 'Deciphering'
    },
    card: {
        textAlign: "center",
        borderRadius: "15px",
        padding: "20px",
    },
    cardImage: {
        height: "160px",
        marginBottom: "10px",
        borderRadius: '80px',
        border: '3px solid #0F85A5'
    },
    chipContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "20px",
    },
    startChatButton: {
        background: "linear-gradient(to right, #00b4db, #0083b0)",
        color: "white",
        marginTop: "50px",
        borderRadius: "25px",
        padding: "10px 20px"
    },
}));

const ChatUs: React.FC = () => {
    const navigate = useNavigate();
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onClickChatUs = () => {
        if (isAuthenticated()) {
            navigate(getRole() === 'Admin' ? "/dashboard/home" : (getRole() === 'Staff' ? "/dashboard/chat-view" : "/dashboard/calendar"));
        } else {
            handleClickOpen();
        }
    }

    return (
        <Container maxWidth="lg" className={classes.root} sx={{ marginBottom: '20px' }}>
            {/* Title */}
            <Typography
                variant="h4"
                component="h4"
                textAlign="center"
                sx={{ fontWeight: 700 }}
                gutterBottom
            >
                Our <span className="gradient-text">Deciphering Mates</span>{" "}
            </Typography>

            {/* Cards */}
            <Grid container spacing={4}>
                {/* First Card */}
                <Grid item xs={12} md={4}>
                    <Card className={classes.card} elevation={3}>
                        <img
                            className={classes.cardImage}
                            src="/anxiety.png" // Replace with image source
                            alt="Your Well-Wisher"
                        />
                        <CardContent>
                            <Typography variant="h5">Your Well-Wisher</Typography>
                            <div className={classes.chipContainer}>
                                <Chip label="Depression" color="primary" />
                                <Chip label="Stress" color="primary" />
                            </div>
                            <Typography variant="body2" gutterBottom>
                                I believe that mental health is a key component of well-being and success.
                                I use evidence-based and holistic approaches to address the root causes
                                of mental health issues.
                            </Typography>
                            <Button sx={{ color: 'white', marginTop: '20px' }} className={classes.startChatButton} onClick={() => onClickChatUs()}>Start Chat</Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Second Card */}
                <Grid item xs={12} md={4}>
                    <Card className={classes.card} elevation={3}>
                        <img
                            className={classes.cardImage}
                            src="/depression.png" // Replace with image source
                            alt="Helping hands"
                        />
                        <CardContent>
                            <Typography variant="h5">Helping Hands</Typography>
                            <div className={classes.chipContainer}>
                                <Chip label="Anxiety" color="primary" />
                                <Chip label="Depression" color="primary" />
                            </div>
                            <Typography variant="body2" gutterBottom>
                                I believe in following my passion, so I do it through creating mindful
                                beings and creating happy lives on earth.
                            </Typography>
                            <br /> <br />
                            <Button sx={{ color: 'white', marginTop: '20px' }} className={classes.startChatButton} onClick={() => onClickChatUs()}>Start Chat</Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Third Card */}
                <Grid item xs={12} md={4}>
                    <Card className={classes.card} elevation={3}>
                        <img
                            className={classes.cardImage}
                            src="/dashboard-avatar.png" // Replace with image source
                            alt="Smiley"
                        />
                        <CardContent>
                            <Typography variant="h5">Smiley</Typography>
                            <div className={classes.chipContainer}>
                                <Chip label="Anxiety" color="primary" />
                                <Chip label="Stress" color="primary" />
                            </div>
                            <Typography variant="body2" gutterBottom>
                                My goal as an empathetic practitioner is creating a secure therapeutic
                                environment for clients. I employ a versatile approach to meet individual
                                needs.
                            </Typography>
                            <Button sx={{ color: 'white', marginTop: '20px' }} className={classes.startChatButton} onClick={() => onClickChatUs()}>Start Chat</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}>
                <DialogTitle>Sign-in required</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are required to sign in to start a chat with our staff. You'll be redirected to login page.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate(`/login?redirectUrl=/dashboard`)} color="primary" autoFocus>
                        OK, take me there
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ChatUs;
