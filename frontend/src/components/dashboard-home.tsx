import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, LinearProgress, Typography, createTheme, ThemeProvider, Avatar, CircularProgress, Skeleton } from '@mui/material';
import { CalendarIcon } from '@mui/x-date-pickers';
import ArticleIcon from '@mui/icons-material/Article';
import MoodIcon from '@mui/icons-material/Mood';
import { getActiveAppointmentByDate, getAllUsers, getMyAppointment, getUnpublishUserTestScore, getUserTestsAnalytics } from '../services/apiService';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Function to generate random colors
const getRandomColor = () => {
  const randomColor = () => Math.floor(Math.random() * 256);
  return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.7)`;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    info: {
      main: '#00bcd4',
    },
  },
});

// Sample data
const dashboardData = {
  totalPatients: 120,
  unreadMessages: 5,
  appointmentsToday: 8,
};


const DashboardHome = () => {

  const [chartDataPastDays, setChartDataPastDays] = useState(30);
  const [patientCount, setPatientCount] = useState(0);
  const [stressChartData, setStressChartData] = useState<any>(null);
  const [anxietyChartData, setAnxietyChartData] = useState<any>(null);
  const [depressChartData, setDepressChartData] = useState<any>(null);
  const [unPublishAssessmentCount, setUnPublishAssessmentCount] = useState(0);
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [loadingChartData, setLoadingChartData] = useState(true);
  const [loadingPatientCount, setLoadingPatientCount] = useState(true);
  const [loadingAppointmentsCount, setLoadingAppointmentsCount] = useState(true);
  const [loadingUnPublishAssessment, setLoadingUnPublishAssessment] = useState(true);


  //Fetch a random thought of the day
  useEffect(() => {
    getPatientCount();
    getAppointmentsToday();
    getUnPublishAssessmentCount();
    getChartData();
  }, []);

  const getPatientCount = async () => {
    try {
      const response = await getAllUsers('Customer');
      setPatientCount(response?.length ?? 0)
    }
    catch (e) {
      console.log(e)
    } finally {
      setLoadingPatientCount(false);
    }
  }

  const getAppointmentsToday = async () => {
    try {
      const response = await getActiveAppointmentByDate(dayjs().format('YYYY-MM-DD'));
      console.log(response)
      setAppointmentsToday(response?.length ?? 0)
    }
    catch (e) {
      console.log(e)
    } finally {
      setLoadingAppointmentsCount(false);
    }
  }

  const getUnPublishAssessmentCount = async () => {
    try {
      const response = await getUnpublishUserTestScore();
      setUnPublishAssessmentCount(response?.length ?? 0)
    }
    catch (e) {
      console.log(e)
    } finally {
      setLoadingUnPublishAssessment(false);
    }
  }

  const getChartData = async () => {
    try {
      const response = await getUserTestsAnalytics(chartDataPastDays);
      console.log(response)

      const stressRawData = response?.filter(r => r.scoreType === 'Stress Severity');
      const anxietyRawData = response?.filter(r => r.scoreType === 'Anxiety Severity');
      const depressRawData = response?.filter(r => r.scoreType === 'Depression Severity');

      //Stress data
      const stressBarData = {
        labels: stressRawData.map(s => s.scoreInterpretation),
        datasets: [
          {
            label: 'Stress Severity',
            data: stressRawData.map(s => s.count),
            backgroundColor: stressRawData.map(s => getRandomColor()),
            borderColor: Array(stressRawData.length).fill('rgba(0, 0, 0, 1)'),
            borderWidth: 1,
          }
        ]
      }
      setStressChartData(stressBarData);

      //Anxiety data
      const anxietyBarData = {
        labels: anxietyRawData.map(s => s.scoreInterpretation),
        datasets: [
          {
            label: 'Anxiety Severity',
            data: anxietyRawData.map(s => s.count),
            backgroundColor: anxietyRawData.map(s => getRandomColor()),
            borderColor: Array(anxietyRawData.length).fill('rgba(0, 0, 0, 1)'),
            borderWidth: 1,
          }
        ]
      }
      setAnxietyChartData(anxietyBarData);

      //Depression data
      const depressBarData = {
        labels: depressRawData.map(s => s.scoreInterpretation),
        datasets: [
          {
            label: 'Depression Severity',
            data: depressRawData.map(s => s.count),
            backgroundColor: depressRawData.map(s => getRandomColor()),
            borderColor: Array(depressRawData.length).fill('rgba(0, 0, 0, 1)'),
            borderWidth: 1,
          }
        ]
      }
      setDepressChartData(depressBarData);
    }
    catch (e) {
      console.log(e)
    } finally {
      setLoadingChartData(false);
    }
  }

  const defaultStressBarChartData = {
    labels: ['Mild', 'Moderate', 'Severe'],
    datasets: [
      {
        label: 'Stress Severity',
        data: [0, 0, 0],
        backgroundColor: [
          theme.palette.info.light,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderColor: [
          theme.palette.info.dark,
          theme.palette.warning.dark,
          theme.palette.error.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  const defaultDepressionBarChartData = {
    labels: ['Mild', 'Moderate', 'Severe'],
    datasets: [
      {
        label: 'Depression Severity',
        data: [0, 0, 0],
        backgroundColor: [
          theme.palette.info.light,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderColor: [
          theme.palette.info.dark,
          theme.palette.warning.dark,
          theme.palette.error.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  const defaultAnxietyBarChartData = {
    labels: ['Mild', 'Moderate', 'Severe'],
    datasets: [
      {
        label: 'Anxiety Severity',
        data: [0, 0, 0],
        backgroundColor: [
          theme.palette.info.light,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderColor: [
          theme.palette.info.dark,
          theme.palette.warning.dark,
          theme.palette.error.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    scales: {
      y: {

        beginAtZero: true,
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Typography pl={3} variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ flexGrow: 1, p: 3 }}>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', color: 'white', backgroundColor: theme.palette.primary.main }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                {loadingPatientCount ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={250} />
                    <Skeleton variant="text" width={200} sx={{ marginTop: 1 }} />
                    <Skeleton variant="text" width={150} />
                    <CircularProgress sx={{ marginTop: 2, color: 'white' }} />
                  </Box>) :
                  <>
                    <Avatar sx={{ bgcolor: 'white', color: theme.palette.primary.main, mb: 1 }}>
                      <MoodIcon />
                    </Avatar>
                    <Typography variant="h6" component="div" color="white">
                      Total Patients
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }} color="white">
                      {patientCount}
                    </Typography>
                  </>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', color: 'white', backgroundColor: theme.palette.secondary.main }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                {loadingUnPublishAssessment ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={250} />
                    <Skeleton variant="text" width={200} sx={{ marginTop: 1 }} />
                    <Skeleton variant="text" width={150} />
                    <CircularProgress sx={{ marginTop: 2, color: 'white' }} />
                  </Box>) :
                  <>
                    <Avatar sx={{ bgcolor: 'white', color: theme.palette.secondary.main, mb: 1 }}>
                      <ArticleIcon />
                    </Avatar>
                    <Typography variant="h6" component="div" color="white">
                      Unpublish Assessments
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }} color="white">
                      {unPublishAssessmentCount}
                    </Typography>
                  </>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ display: 'flex', alignItems: 'center', color: 'white', backgroundColor: theme.palette.info.main }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                {loadingAppointmentsCount ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={250} />
                    <Skeleton variant="text" width={200} sx={{ marginTop: 1 }} />
                    <Skeleton variant="text" width={150} />
                    <CircularProgress sx={{ marginTop: 2, color: 'white' }} />
                  </Box>) :
                  <>
                    <Avatar sx={{ bgcolor: 'white', color: theme.palette.info.main, mb: 1 }}>
                      <CalendarIcon />
                    </Avatar>
                    <Typography variant="h6" component="div" color="white">
                      Appointments Today
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }} color="white">
                      {appointmentsToday}
                    </Typography>
                  </>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>

                <Typography variant="h6" component="div" gutterBottom>
                  Patients Stress Analytics
                </Typography>
                <Typography variant="caption" component="div" gutterBottom>
                  Past 30 days
                </Typography>
                {loadingChartData ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={250} />
                    <Skeleton variant="text" width={200} sx={{ marginTop: 1 }} />
                    <Skeleton variant="text" width={150} />
                    <CircularProgress sx={{ marginTop: 2, color: 'white' }} />
                  </Box>) :
                  <>
                    <Bar data={stressChartData ?? defaultStressBarChartData} options={barChartOptions} />
                  </>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Patients Depression Analytics
                </Typography>
                <Typography variant="caption" component="div" gutterBottom>
                  Past 30 days
                </Typography>
                {loadingChartData ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={250} />
                    <Skeleton variant="text" width={200} sx={{ marginTop: 1 }} />
                    <Skeleton variant="text" width={150} />
                    <CircularProgress sx={{ marginTop: 2, color: 'white' }} />
                  </Box>) :
                  <>
                    <Bar data={depressChartData ?? defaultDepressionBarChartData} options={barChartOptions} />
                  </>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Patients Anxiety Analytics
                </Typography>
                <Typography variant="caption" component="div" gutterBottom>
                  Past 30 days
                </Typography>
                {loadingChartData ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={250} />
                    <Skeleton variant="text" width={200} sx={{ marginTop: 1 }} />
                    <Skeleton variant="text" width={150} />
                    <CircularProgress sx={{ marginTop: 2, color: 'white' }} />
                  </Box>) :
                  <>
                    <Bar data={anxietyChartData ?? defaultAnxietyBarChartData} options={barChartOptions} />
                  </>
                }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardHome;

