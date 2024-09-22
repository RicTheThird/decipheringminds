import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { getMyUserTest } from '../services/apiService';
import dayjs from 'dayjs';
import { Questionnaires } from '../constants/questionnaires';
import { useNavigate } from 'react-router-dom';

const PsychResult: React.FC = () => {
    const navigate = useNavigate();
    const [testResults, setTestResults] = useState<any[]>([]);
    useEffect(() => {
        getMyTestTaken();
    }, []);

    const getMyTestTaken = async () => {
        const response = await getMyUserTest()
        if (response && response.length) {
            setTestResults(response);
        }
        console.log(response)
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Result
            </Typography>
            {!testResults || testResults.length === 0 &&
                <Typography variant="body1" paddingTop={5}>No questionnaire result available</Typography>
            }
            <Grid container spacing={3}>
                {testResults.filter(t => t.isSubmitted).map(t => (
                    <Grid key={t.id} item xs={12} md={6}>
                        <Card>
                            <CardHeader
                                title={t.testId}
                                subheader={Questionnaires.find(q => q.id === t.testId)?.title}
                                sx={{ backgroundColor: 'darkgrey', color: 'white' }}
                            />
                            <CardContent>
                                {t.userTestScores.filter(u => u.isPublished).map(tu => (
                                    <Box key={tu.id} my={2} p={2} border={1} borderRadius={1}>
                                        <Typography variant="h5">Interpretation: {tu.scoreInterpretation}</Typography>
                                        <Typography variant="h6">Score: {tu.score}</Typography>
                                        <Typography variant="h6">Test Taken: {dayjs(t.createdAt).format('YYYY-MM-DD hh:mm A')}</Typography>
                                    </Box>
                                ))}
                                {
                                    t.userTestScores.filter(u => !u.isPublished).length === t.userTestScores.length
                                    && <Typography color='warning' variant="body1">Not yet available</Typography>
                                }
                                {/* <Button variant="contained" color="primary" onClick={() => navigate('/dashboard/calendar')} >
                                    Book Appointment
                                </Button> */}
                            </CardContent>

                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default PsychResult;
