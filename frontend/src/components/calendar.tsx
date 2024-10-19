import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, TextField, MenuItem, Box, FormControl, InputLabel, Select, CardHeader, CircularProgress, Alert, Snackbar } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getActiveAppointmentByDate, getBlockOffTime, getMyAppointment, postUserAppointment, updateUserAppointmentStatus } from '../services/apiService';
import { getUserProfile, myProfile } from '../services/authService';
import PdfGenerator from './pdf-generator';

const generateTimeRanges = (startHour, endHour) => {
  const timeRanges: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour < 10 ? '0' : ''}${hour}:00`;
    const endTime = `${hour + 1 < 10 ? '0' : ''}${hour + 1}:00`;
    timeRanges.push(`${startTime}-${endTime}`);
  }
  return timeRanges;
};

const timeRanges = generateTimeRanges(8, 17); // 8 AM to 5 PM

const sixMosFromNow = dayjs().add(6, 'months');

const BookingPage = () => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(dayjs());
  const [description, setDescription] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [pdfModalData, setPdfModalData] = useState<any>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [userAppointments, setUserAppointments] = useState<any[]>([])
  const [unAvailableTimes, setUnAvailableTimes] = useState<any[]>([])
  const [blockDateTimes, setBlockDateTimes] = useState<any[]>([]);
  const [unavailableDates, setUnAvailableDates] = useState<string[]>([])
  const [unavailableTimeRange, setUnAvailableTimeRange] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [profile, setUserProfile] = useState<any>(null)
  const [snackOpen, setSnackOpen] = useState(false);
  const [alert, setAlert] = useState<any>(null);


  useEffect(() => {
    //getBlockDates()
    getMyProfile();
    setAppointments();
    handleDateChange(dayjs())
  }, []);

  const setAppointments = async () => {
    const response = await getMyAppointment()
    if (response && response.length) {
      setUserAppointments(response);
    } else {
      setUserAppointments([])
    }
  };

  const getMyProfile = async () => {
    const response = await myProfile();
    setUserProfile(response);
  }

  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };


  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    setDescription('');
    setSelectedTimeRange('')
    const startTime = selectedTimeRange.split('-')[0].split(':')[0];
    const request = {
      bookedDate: dayjs(`${dateTime.format("YYYY-MM-DD")}T${startTime}:00:00`).format("YYYY-MM-DDTHH:mm:ss"),
      bookedType: description,
      bookedLocation: 'Online',
      startTime: Number(startTime),
      endTime: Number(selectedTimeRange.split('-')[1].split(':')[0])
    }
    try {
      const response: any = await postUserAppointment(request);

      if (response.status < 299) {
        setAlert({ message: `Successfully booked an appointment. <br /> A confirmation has been sent to your email.`, success: true })
        setSnackOpen(true);
      } else {
        setAlert({ message: response.response.data, success: false })
        setSnackOpen(true);
      }
      await setAppointments();
      handleDateChange(dateTime)
    } catch (e) {
      setAlert({ message: `Failed to create an appointment. Please try again later.`, success: true })
      setSnackOpen(true);
      console.log(e)
    } finally {
      setLoading(false)
    }
  };

  const setPdfData = async (data: any) => {
    const result = data.psychReports[0] ?? null;
    const temp = {
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      gender: profile.gender,
      birthdate: profile.birthDate,
      appointmentDate: dayjs(data.bookedDate).format('YYYY-MM-DD'),
      title: "Psych Report",
      referralReason: result?.referralReason,
      assesmentProcedureResults: result?.assesmentProcedureResults,
      clinicalImpressionRecommendation: result?.clinicalImpressionRecommendation,
      generalObservation: result?.generalObservation,
      intakeInformation: result?.intakeInformation,
      psychometricProfile: result?.psychometricProfile
    };
    setPdfModalData(temp);
  }

  const updateAppointmentStatus = async (status: string, id: number) => {
    await updateUserAppointmentStatus(status, id);
    await setAppointments();
  }

  const disableBlockDates = (date) => {
    return unavailableDates.some(disabledDate =>
      dayjs(disabledDate).isSame(dayjs(date))
    );
  }

  const handleDateChange = async (date: any) => {
    const selectedDate = dayjs(date).format('YYYY-MM-DD');
    const response = await getActiveAppointmentByDate(selectedDate);
    const blockDateTime = await getBlockDates();
    if (blockDateTime) {
      const blockOffDate = blockDateTime.filter(b => dayjs(b.blockedDate).isSame(dayjs(date), 'day'))
      if (blockOffDate) {
        const temp = blockOffDate.map(m => ({ startTime: m.startTime, endTime: m.endTime }))
        setUnAvailableTimeRange(temp)
      }
      else
        setUnAvailableTimeRange([]);
    } else {
      setUnAvailableTimeRange([]);
    }

    if (response && response.length > 0) {
      const temp = response.map((r) => `${r.startTime < 10 ? `0${r.startTime}` : r.startTime}:00-${r.endTime < 10 ? `0${r.endTime}` : r.endTime}:00`);
      setUnAvailableTimes(temp)
      console.log('na timea')
      console.log(temp)
    } else
      setUnAvailableTimes([])
    setDateTime(date);
    setSelectedTimeRange('')
  };

  const getBlockDates: any = async () => {
    if (blockDateTimes && blockDateTimes.length > 0) {
      return blockDateTimes;
    }
    const response = await getBlockOffTime();
    if (response && response.length > 0) {
      const allDayBlock = response.filter(r => r.isAllDay === true).map(r => dayjs(r.blockedDate).format('YYYY-MM-DD'));
      setUnAvailableDates(allDayBlock);
      const otherBlock = response.filter(r => r.isAllDay === false);
      setBlockDateTimes(otherBlock)
      return otherBlock;
    }
    return null;
  }



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Typography variant="h4" gutterBottom>Appointments</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Upcoming Appointments"
                sx={{ backgroundColor: 'green', color: 'white' }} // Custom background color
              />
              <CardContent>
                {userAppointments?.filter(u => ['Pending Confirmation', 'Confirmed'].includes(u.status) && !dayjs(u.bookedDate).isBefore(dayjs())).map(b => (
                  <Box key={b.id} my={2} p={2} border={1} borderRadius={1}>
                    <Typography variant="h5">{b.bookedType}</Typography>
                    <Typography sx={{ color: b.status === 'Pending Confirmation' ? "orangered" : "green" }} variant="h6">{b.status}</Typography>
                    <Grid container spacing={2} marginTop={0.3} marginBottom={1}>
                      <Grid item xs={6} sm={6}>
                        <Typography color="textSecondary">Date: {dayjs(b.bookedDate).format('YYYY-MM-DD')}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Typography textAlign="right" color="textSecondary">Time: {b.startTime}:00 - {b.endTime}:00 </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Button fullWidth variant="contained" type="button" color="warning"
                          onClick={() => updateAppointmentStatus('Cancelled', b.id)}>
                          Cancel this appointment
                        </Button>
                      </Grid>
                      {b.bookedLocation === 'Online' &&
                        <Grid item xs={12} sm={6}>
                          <Button fullWidth variant="contained" type="button" color="primary"
                            onClick={() => navigate(`/dashboard/meeting?meetingNumber=${b.meetingNumber}&meetingPassword=${b.meetingPassword}&email=${profile?.email}&name=${profile?.firstName}%20${profile?.lastName}&role=0`)}>
                            Join Meeting
                          </Button>
                        </Grid>
                      }
                    </Grid>
                  </Box>
                ))}
                {(!userAppointments || !userAppointments.some(u => ['Pending Confirmation', 'Confirmed'].includes(u.status) && !dayjs(u.bookedDate).isBefore(dayjs()))) &&
                  <Typography textAlign="center" variant="caption" sx={{ fontSize: "14px" }} gutterBottom>No Upcoming Appointment</Typography>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>

              <CardHeader
                title="Past Appointments"
                sx={{ backgroundColor: 'yellow', color: 'black' }} // Custom background color
              />
              <CardContent>

                {userAppointments?.filter(u => dayjs(u.bookedDate).isBefore(dayjs()) || u.status === 'Completed').map(b => (
                  <Box key={b.id} my={2} p={2} border={1} borderRadius={1}>
                    <Typography variant="h5">{b.bookedType}</Typography>
                    {/* <Typography sx={{ color: b.status === 'Pending' ? "orangered" : "green" }} variant="h6">{b.status}</Typography> */}
                    <Grid container spacing={2} marginTop={0.3} marginBottom={1}>
                      <Grid item xs={6} sm={6}>
                        <Typography color="textSecondary">Date: {dayjs(b.bookedDate).format('YYYY-MM-DD')}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Typography textAlign="right" color="textSecondary">Time: {b.startTime}:00 - {b.endTime}:00 </Typography>
                      </Grid>
                    </Grid>
                    {b.psychReports.some(p => p.isPublished) &&
                      <Button fullWidth variant="contained" type="submit" color="info" onClick={() => { setPdfData(b); setPdfModalOpen(true); }}>
                        View Psych Report
                      </Button>
                    }
                  </Box>
                ))}
                {(!userAppointments || !userAppointments.some(u => dayjs(u.bookedDate).isBefore(dayjs()))) &&
                  <Typography textAlign="center" variant="caption" sx={{ fontSize: "14px" }} gutterBottom>No Past Appointment</Typography>
                }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Card style={{ marginTop: 20 }}>
          <CardContent>
            <form onSubmit={handleAddBooking}>
              <Typography variant="h5">Add New Appointment</Typography>

              <Grid container spacing={2} marginTop={2} marginBottom={3}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disablePast
                      maxDate={sixMosFromNow}
                      shouldDisableDate={disableBlockDates}
                      format='YYYY-MM-DD'
                      label="Select Appointment Date"
                      value={dateTime}
                      onChange={handleDateChange}
                      slots={{
                        textField: (textFieldProps) => (
                          <TextField fullWidth required {...textFieldProps} />
                        ),
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="time-range-select-label">Select Time Range</InputLabel>
                    <Select
                      required
                      labelId="time-range-select-label"
                      value={selectedTimeRange}
                      onChange={(e) => handleTimeRangeChange(e.target.value)}
                      label="Select Time Range"
                    >
                      {timeRanges.map((range, index) => {
                        var blockTime = false
                        const currentHour = dayjs().hour();
                        const isToday = dayjs().isSame(dateTime, 'day');
                        const startTime = Number(range.split(":")[0]);

                        if (unavailableTimeRange && unavailableTimeRange.length > 0) {
                          for (const u of unavailableTimeRange) {
                            blockTime = startTime >= u.startTime && u.endTime >= (startTime + 1);
                            if (blockTime) break;
                          }
                        }
                        const disabled = unAvailableTimes.some(u => u === range) || blockTime || (currentHour >= startTime && isToday);
                        return (
                          <MenuItem key={index} value={range} disabled={disabled}>
                            {`${range}   ${disabled ? '(Unavailable)' : ''}`}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="What do you want to talk about?"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Button variant="contained" type="submit" color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}>
                Book
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackOpen}
        autoHideDuration={10000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={alert?.success ? "success" : "error"} sx={{ width: '100%' }}>
          <span dangerouslySetInnerHTML={ {__html: alert?.message}}></span>
        </Alert>
      </Snackbar>

      <PdfGenerator open={pdfModalOpen}
        handleClose={() => setPdfModalOpen(false)}
        data={pdfModalData} assesmentReport={null} />
    </LocalizationProvider>
  );
};

export default BookingPage;
