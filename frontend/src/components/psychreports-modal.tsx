import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Drawer,
    Card,
    CardContent,
    CardMedia,
    Divider,
    CircularProgress,
} from '@mui/material';
import dayjs from 'dayjs';
import { postPsychReport } from '../services/apiService';

const inputStyle = {
    '& .MuiInputBase-input': {
        fontSize: '0.8rem', // Font size for input text
    },
    '& .MuiInputLabel-root': {
        fontSize: '0.8rem', // Font size for label
    }
};

const resetData = {
    userId: null,
    appointmentId: null,
    referralReason: '',
    intakeInformation: '',
    generalObservation: '',
    assesmentProcedureResults: '',
    psychometricProfile: '',
    clinicalImpressionRecommendation: '',
}

const PsychReportModal = ({ open, data, psychReportMode, handleClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(resetData);

    useEffect(() => {
        if (data?.psychReports?.length > 0) {
            const psychReport = data.psychReports[0]
            setFormData(psychReport);
        } else {
            setFormData(resetData)
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true)
        formData.userId = data.userId;
        formData.appointmentId = data.id;
        console.log(formData);
        try {
            await postPsychReport(formData);
            setFormData(resetData)
            handleClose(data.userId)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    };

    const onModalClose = () => {
        setFormData(resetData)
        handleClose(null)
    }

    return (
        <Drawer anchor='right' open={open} onClose={onModalClose}>
            <Box sx={{ width: '50vw' }}>
                <Typography variant="h6" sx={{ backgroundColor: '#9c27b0', color: 'white', padding: '10px' }} component="h2">
                    {psychReportMode === 'new' ? 'Create Psych Report' : 'Edit Psych Report'}
                </Typography>
                <Box sx={{ padding: '10px' }}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>

                        <CardContent>
                            <Typography variant="h6" component="div">
                                Appointment Details
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box>
                                <Typography variant="body2">
                                    Date: {dayjs(data?.bookedDate).format('YYYY-MM-DD')}
                                </Typography>
                                <Typography variant="body2">
                                    Time: {`${data?.startTime}:00 - ${data?.endTime}:00`}
                                </Typography>
                                <Typography variant="body2">
                                    Location: {data?.bookedLocation}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <TextField sx={inputStyle}
                        name="referralReason"
                        label="Reason for Referral"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        margin="normal"

                        value={formData.referralReason}
                        onChange={handleChange}
                    />
                    <TextField sx={inputStyle}
                        name="intakeInformation"
                        label="Intake Information"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={formData.intakeInformation}
                        onChange={handleChange}
                    />
                    <TextField sx={inputStyle}
                        name="generalObservation"
                        label="General Observation"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={formData.generalObservation}
                        onChange={handleChange}
                    />
                    <TextField sx={inputStyle}
                        name="assesmentProcedureResults"
                        label="Assessment Procedure and Results"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={formData.assesmentProcedureResults}
                        onChange={handleChange}
                    />
                    <TextField sx={inputStyle}
                        name="psychometricProfile"
                        label="Psychometric Profile"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={formData.psychometricProfile}
                        onChange={handleChange}
                    />
                    <TextField sx={inputStyle}
                        name="clinicalImpressionRecommendation"
                        label="Clinical Impression & Recommendation"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={formData.clinicalImpressionRecommendation}
                        onChange={handleChange}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }} disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}>
                        {psychReportMode === 'new' ? 'Submit' : 'Update'}
                    </Button>
                    <Button variant="contained" color="warning" onClick={onModalClose} sx={{ mt: 2, ml: 2 }}>
                        Cancel
                    </Button>
                </Box>

            </Box>
        </Drawer>
    );
};

export default PsychReportModal;
