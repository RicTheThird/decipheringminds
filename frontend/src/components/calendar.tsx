import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, TextField, MenuItem, Box, FormControl, InputLabel, Select, CardHeader, CircularProgress } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getActiveAppointmentByDate, getMyAppointment, postUserAppointment, updateUserAppointmentStatus } from '../services/apiService';
import { getUserProfile } from '../services/authService';

const generateTimeRanges = (startHour, endHour) => {
  const timeRanges: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour < 10 ? '0' : ''}${hour}:00`;
    const endTime = `${hour + 1 < 10 ? '0' : ''}${hour + 1}:00`;
    timeRanges.push(`${startTime}-${endTime}`);
  }
  return timeRanges;
};

const BookingPage = () => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(dayjs());
  const [description, setDescription] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [userAppointments, setUserAppointments] = useState<any[]>([])
  const [unAvailableTimes, setUnAvailableTimes] = useState<any[]>([])
  const [loading, setLoading] = useState(false); // Loading state
  //const [profile, setUserProfile] = useState<any>(null)

  const profile = getUserProfile();

  useEffect(() => {
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

  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  const timeRanges = generateTimeRanges(9, 17); // 9 AM to 5 PM

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
      await postUserAppointment(request);
      await setAppointments();
      handleDateChange(dateTime)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  };

  const updateAppointmentStatus = async (status: string, id: number) => {
    await updateUserAppointmentStatus(status, id);
    await setAppointments();
  }

  const handleDateChange = async (date: any) => {
    const response = await getActiveAppointmentByDate(dayjs(date).toDate());
    let time: any[] = []
    if (response && response.length > 0) {
      const temp = response.map((r) => `${r.startTime}:00-${r.endTime}:00`);
      setUnAvailableTimes(temp)
    } else
      setUnAvailableTimes([])
    setDateTime(date);
    setSelectedTimeRange('')
  };



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Typography variant="h3" gutterBottom>Appointments</Typography>
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
                            onClick={() => navigate(`/dashboard/meeting?meetingNumber=${b.meetingNumber}&meetingPassword=${b.meetingPassword}&email=${profile?.email}&name=${profile?.name}&role=0`)}>
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

                {userAppointments?.filter(u => dayjs(u.bookedDate).isBefore(dayjs())).map(b => (
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
                    <Button fullWidth variant="contained" type="submit" color="info">
                      View Diagnosis
                    </Button>

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
                        const currentHour = dayjs().hour();
                        const isToday = dayjs().isSame(dateTime, 'day');
                        const startTime = Number(range.split(":")[0]);
                        const disabled = unAvailableTimes.some(u => u === range) || (currentHour >= startTime && isToday);
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
                    label="Topic / Agenda"
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
    </LocalizationProvider>
  );
};

export default BookingPage;
