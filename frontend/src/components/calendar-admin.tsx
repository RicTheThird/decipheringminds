import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getActiveAppointment, updateUserAppointmentStatus } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
const localizer = dayjsLocalizer(dayjs)
const adminEmail = 'decipheringminds@gmail.com';
const adminName = 'Deciphering Minds';

const CalendarAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleClickOpen = (event) => {
    console.log(event)
    setSelectedEvent(event)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setAppointments = async () => {
    const response = await getActiveAppointment()
    if (response && response.length) {
      const _calendarEvents: any[] = []
      response.filter(r => r.status === 'Confirmed').forEach(e => {
        const bookedDate = dayjs(e.bookedDate).format('YYYY-MM-DD');
        _calendarEvents.push({
          id: e.id,
          name: `${e.user.firstName} ${e.user.lastName}`,
          userId: e.user.id,
          status: e.status,
          bookedDate: bookedDate,
          bookedType: e.bookedType,
          bookedLocation: e.bookedLocation,
          meetingNumber: e.meetingNumber,
          meetingPassword: e.meetingPassword,
          time: `${e.startTime}:00 - ${e.endTime}:00`,
          title: `${e.user.firstName} ${e.user.lastName}    ${e.startTime}:00-${e.endTime}:00`,
          start: new Date(`${bookedDate}T${e.startTime}:00`),
          end: new Date(`${bookedDate}T${e.endTime}:00`),
        });
      });

      console.log(_calendarEvents)
      setCalendarEvents(_calendarEvents);
    } else {
      setCalendarEvents([])
    }
  };

  const updateAppointmentStatus = async (status: string, id: number) => {
    await updateUserAppointmentStatus(status, id);
    await setAppointments();
  }

  useEffect(() => {
    setAppointments();
    setSelectedEvent(null)
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Calendar Appointment
      </Typography>
      <Typography variant="body1" marginTop={5}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event: any) => handleClickOpen(event)}
          popup
        />
      </Typography>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Name: <strong>{selectedEvent?.name}</strong></Typography>
          <Typography variant="body1">Appointment Type: <strong>{selectedEvent?.bookedType}</strong></Typography>
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
      </Dialog>
    </div>
  );
};

export default CalendarAdmin;
