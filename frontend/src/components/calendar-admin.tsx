import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { deleteRecurringBlockOffTime, deleteSingleBlockOffTime, getActiveAppointment, getBlockOffTime, postBlockOffTime, updateUserAppointmentStatus } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const generateTimeRanges = (startHour, endHour) => {
  const timeRanges: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour < 10 ? '0' : ''}${hour}:00`;
    const endTime = `${hour + 1 < 10 ? '0' : ''}${hour + 1}:00`;
    timeRanges.push(`${startTime}-${endTime}`);
  }
  return timeRanges;
};

const timeRangeStart = [8, 9, 10, 11, 12, 13, 14, 15, 16]
const timeRangeEnd = [9, 10, 11, 12, 13, 14, 15, 16, 17]

const timeRanges = generateTimeRanges(9, 17); // 9 AM to 5 PM

export const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const localizer = dayjsLocalizer(dayjs)
const adminEmail = 'decipheringminds@gmail.com';
const adminName = 'Deciphering Minds';
const sixMosFromNow = dayjs().add(6, 'months');

const CalendarAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isAllDayCheck, setAllDayCheck] = useState(false);
  const [isRepeatDays, setRepeatDays] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockOffDateTime, setBlockOffDateTime] = useState(dayjs());
  const [blockOffStartDateTime, setBlockOffStartDateTime] = useState(dayjs());
  const [blockOffEndDateTime, setBlockOffEndDateTime] = useState(dayjs().add(1, 'day'));
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [openBlockOff, setOpenBlockOff] = useState(false)
  const [reason, setReason] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleClickOpen = (event) => {
    setSelectedEvent(event)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const resetForm = () => {
    setReason('')
    setSelectedDays([])
    setRepeatDays(false)
    setSelectedStartTime('')
    setSelectedEndTime('')
  }

  // const setBlockOffTimeToCalendar = async () => {
  //   const response = await getBlockOffTime();
  //   if (response && response.length) {
  //     const _calendarEvents: any[] = calendarEvents
  //     response.forEach(e => {
  //       const bookedDate = dayjs(e.blockedDate).format('YYYY-MM-DD');
  //       _calendarEvents.push({
  //         id: e.id,
  //         name: `Admin`,
  //         email: '',
  //         userId: '',
  //         status: '',
  //         bookedDate: bookedDate,
  //         bookedType: 'blockoff',
  //         bookedLocation: '',
  //         meetingNumber: '',
  //         meetingPassword: '',
  //         time: `${e.startTime}:00 - ${e.endTime}:00`,
  //         title: `Block off time from ${e.startTime}:00-${e.endTime}:00`,
  //         start: new Date(`${bookedDate}T${e.startTime}:00`),
  //         end: new Date(`${bookedDate}T${e.endTime}:00`),
  //       });
  //     });
  //   }
  // }

  const getCalendarEvents = async () => {
    const _calendarEvents: any[] = []
    const response = await getActiveAppointment()
    if (response && response.length) {
      response.filter(r => r.status === 'Confirmed').forEach(e => {
        const bookedDate = dayjs(e.bookedDate).format('YYYY-MM-DD');
        _calendarEvents.push({
          id: e.id,
          name: `${e?.user?.firstName} ${e?.user?.lastName}`,
          email: e?.user?.email,
          userId: e?.user?.id,
          status: e?.status,
          bookedDate: bookedDate,
          bookedType: e.bookedType,
          type: 'appointment',
          bookedLocation: e.bookedLocation,
          meetingNumber: e.meetingNumber,
          meetingPassword: e.meetingPassword,
          time: `${e.startTime}:00 - ${e.endTime}:00`,
          title: `${e.user.firstName} ${e.user.lastName}    ${e.startTime}:00-${e.endTime}:00`,
          start: new Date(`${bookedDate}T${e.startTime < 10 ? `0${e.startTime}` : e.startTime}:00`),
          end: new Date(`${bookedDate}T${e.endTime < 10 ? `0${e.endTime}` : e.endTime}:00`),
        });
      });

    }

    const blockTimeResponse = await getBlockOffTime();
    if (blockTimeResponse && blockTimeResponse.length) {
      blockTimeResponse.forEach(e => {
        const blockDate = dayjs(e.blockedDate).format('YYYY-MM-DD');
        _calendarEvents.push({
          id: e.id,
          name: `Admin`,
          email: '',
          userId: '',
          status: '',
          type: 'blockOff',
          bookedDate: blockDate,
          bookedType: 'blockoff',
          bookedLocation: '',
          meetingNumber: '',
          meetingPassword: '',
          isAllDay: e.isAllDay ? 'Yes' : 'No',
          isRepeated: e.isRepeated,
          repeats: e.isRepeated ? `Repeats every ${daysOfWeek.at(e.repeatDays)}` : 'No',
          time: `${e.startTime}:00 - ${e.endTime}:00`,
          title: `${e?.reason} from ${e.startTime}:00-${e.endTime}:00`,
          start: new Date(`${blockDate}T${e.startTime < 10 ? `0${e.startTime}` : e.startTime}:00`),
          end: new Date(`${blockDate}T${e.endTime < 10 ? `0${e.endTime}` : e.endTime}:00`),
        });
      });
    }
    setCalendarEvents(_calendarEvents)
  };

  const deleteOneEvent = async (id) => {
    setLoading(true)
    try {
      await deleteSingleBlockOffTime(id);
      await getCalendarEvents();
      setOpen(false)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteRecurringEvent = async (id) => {
    setLoading(true)
    try {
      await deleteRecurringBlockOffTime(id);
      await getCalendarEvents();
      setOpen(false)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const submitBlockOffTime = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const request = {
      reason: reason,
      blockedDate: isRepeatDays ? null : blockOffDateTime.format('YYYY-MM-DD'),
      blockedStartDate: isRepeatDays ? blockOffStartDateTime.format('YYYY-MM-DD') : null,
      blockedEndDate: isRepeatDays ? blockOffEndDateTime.format('YYYY-MM-DD') : null,
      isAllDay: isAllDayCheck,
      startTime: isAllDayCheck ? 8 : Number(selectedStartTime),
      endTime: isAllDayCheck ? 17 : Number(selectedEndTime),
      isRepeated: isRepeatDays,
      repeatedDays: isRepeatDays ? selectedDays.map(sd => daysOfWeek.indexOf(sd)) : []
    };

    try {
      await postBlockOffTime(request);
      getCalendarEvents();
      setOpenBlockOff(false)
      resetForm()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }

  }

  const handleDateChange = async (date: any) => {
    setBlockOffDateTime(date);
  };

  const handleStartDateChange = (date: any) => {
    setBlockOffStartDateTime(date);
  };

  const handleEndDateChange = (date: any) => {
    setBlockOffEndDateTime(date);
  };

  const updateSelectedDays = (event) => {
    setSelectedDays(event.target.value);
  }

  const updateAppointmentStatus = async (status: string, id: number) => {
    await updateUserAppointmentStatus(status, id);
    await getCalendarEvents();
    setOpen(false)
  }

  useEffect(() => {
    getCalendarEvents();
    setSelectedEvent(null)
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Calendar Appointment
      </Typography>
      <Typography variant="body1" marginTop={5}>
        <Button onClick={() => setOpenBlockOff(true)}>Add block off time</Button>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event: any) => handleClickOpen(event)}
          eventPropGetter={(e: any) => {
            const backgroundColor = e.type === 'appointment' ? '#3756A3' : '#D6554E';
            return { style: { backgroundColor } };
          }}
          popup
        />
      </Typography>

      <Dialog open={open} onClose={handleClose}>
        {selectedEvent?.type === 'appointment' && <>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Name: <strong>{selectedEvent?.name}</strong></Typography>
            <Typography variant="body1">Email: <strong>{selectedEvent?.email}</strong></Typography>
            <Typography variant="body1">Topic/Agenda: <strong>{selectedEvent?.bookedType}</strong></Typography>
            <Typography variant="body1">Status: <strong>{selectedEvent?.status}</strong></Typography>
            <Typography variant='body1'>Date: <strong>{selectedEvent?.bookedDate}</strong></Typography>
            <Typography variant='body1'>Time: <strong>{selectedEvent?.time}</strong></Typography>
          </DialogContent>
          <DialogActions>
            {selectedEvent?.status === 'Pending Confirmation' && <Button onClick={() => updateAppointmentStatus('Confirmed', selectedEvent.id)} color="success">
              Confirm Appointment
            </Button>
            }
            {selectedEvent?.status === 'Confirmed' && selectedEvent?.bookedLocation === 'Online'
              && <Button color='primary' onClick={() =>
                navigate(`/dashboard/meeting?userId=${selectedEvent?.userId}&meetingNumber=${selectedEvent?.meetingNumber}&meetingPassword=${selectedEvent?.meetingPassword}&email=${adminEmail}&name=${adminName}&role=1`)}>

                Start Meeting
              </Button>
            }
            <Button onClick={() => updateAppointmentStatus('Cancelled', selectedEvent.id)} color="warning">
              Cancel Appointment
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </>}

        {selectedEvent?.type === 'blockOff' && <>
          <DialogTitle><h3>Block Off Time Details</h3></DialogTitle>
          <DialogContent>
            <Typography variant='h5'>{selectedEvent?.title}</Typography>
            <Typography variant='body1'>Date: <strong>{selectedEvent?.bookedDate}</strong></Typography>
            <Typography variant='body1'>Time: <strong>{selectedEvent?.time}</strong></Typography>
            <Typography variant='body1'>All Day: <strong>{selectedEvent?.isAllDay}</strong></Typography>
            <Typography variant='body1'>Repeats: <strong>{selectedEvent?.repeats}</strong></Typography>
          </DialogContent>
          <DialogActions>
            {selectedEvent?.isRepeated && <Button onClick={() => deleteRecurringEvent(selectedEvent.id)} color="error">
              Delete this and the following events
            </Button>}
            <Button onClick={() => deleteOneEvent(selectedEvent.id)} color="warning">
              Delete this event
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </>
        }
      </Dialog>

      <Drawer anchor='right' open={openBlockOff} onClose={() => setOpenBlockOff(false)}>
        <Box sx={{ width: '30vw' }}>
          <Typography variant="h6" sx={{ backgroundColor: '#9c27b0', color: 'white', padding: '20px' }} component="h2">
            Add Block Off Time
          </Typography>
          <form onSubmit={submitBlockOffTime}>
            <Box sx={{ padding: '20px' }}>
              <Grid container spacing={2} marginTop={2} marginBottom={3}>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isRepeatDays}
                        onChange={(e) => setRepeatDays(e.target.checked)}
                        name="allRepeatDays"
                        color="info"
                      />
                    }
                    label="Repeat days?"
                  />
                </Grid>

                {!isRepeatDays &&
                  <Grid item xs={12} >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disablePast
                        maxDate={sixMosFromNow}
                        format='YYYY-MM-DD'
                        label="Select Block Date"
                        value={blockOffDateTime}
                        onChange={handleDateChange}
                        slots={{
                          textField: (textFieldProps) => (
                            <TextField fullWidth required {...textFieldProps} />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                }

                {isRepeatDays && <>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disablePast
                        maxDate={sixMosFromNow}
                        format='YYYY-MM-DD'
                        label="Select Block Start Date"
                        value={blockOffStartDateTime}
                        onChange={handleStartDateChange}
                        slots={{
                          textField: (textFieldProps) => (
                            <TextField fullWidth required {...textFieldProps} />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disablePast
                        minDate={blockOffStartDateTime.add(1, 'day')}
                        maxDate={sixMosFromNow}
                        format='YYYY-MM-DD'
                        label="Select Block End Date"
                        value={blockOffEndDateTime}
                        onChange={handleEndDateChange}
                        slots={{
                          textField: (textFieldProps) => (
                            <TextField fullWidth required {...textFieldProps} />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
                }

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAllDayCheck}
                        onChange={(e) => setAllDayCheck(e.target.checked)}
                        name="allDayCheck"
                        color="info"
                      />
                    }
                    label="All day"
                  />
                </Grid>

                {!isAllDayCheck && <>
                  <Grid item xs={6} >
                    <FormControl fullWidth>
                      <InputLabel id="time-range-select-label">Select start time</InputLabel>
                      <Select
                        required
                        labelId="time-range-select-label"
                        value={selectedStartTime}
                        onChange={(e) => { setSelectedStartTime(e.target.value); setSelectedEndTime(''); }}
                        label="Select Time Range"
                      >
                        {timeRangeStart.map((range, index) => {
                          return (
                            <MenuItem key={index} value={range}>
                              {`${range}:00`}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} >
                    <FormControl fullWidth>
                      <InputLabel id="time-range-select-label">Select End time</InputLabel>
                      <Select
                        required
                        labelId="time-range-select-label"
                        value={selectedEndTime}
                        onChange={(e) => setSelectedEndTime(e.target.value)}
                        label="Select Time"
                      >
                        {timeRangeEnd.map((range, index) => {
                          const disabled = range <= Number(selectedStartTime ?? 0)
                          return (
                            <MenuItem key={index} value={range} disabled={disabled}>
                              {`${range}:00`}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
                }
                {isRepeatDays && <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="days-multi-select-label">Select Days</InputLabel>
                    <Select
                      required
                      labelId="days-multi-select-label"
                      multiple
                      value={selectedDays}
                      onChange={(e) => updateSelectedDays(e)}
                      input={<OutlinedInput label="Select Days" />}
                      renderValue={(selected) => (
                        <div>
                          {selected.map((day) => (
                            <Chip key={day} label={day} style={{ margin: 2 }} />
                          ))}
                        </div>
                      )}
                    >
                      {daysOfWeek.map((day) => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                }


              </Grid>

              <Button type='submit' variant="contained" color="primary" disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}>
                Add Block Off Time
              </Button>
              {/* <Button variant="contained" color="warning" onClick={onModalClose} sx={{ mt: 2, ml: 2 }}>
                Cancel
              </Button> */}

            </Box>
          </form>
        </Box>

      </Drawer>
    </div>
  );
};

export default CalendarAdmin;
