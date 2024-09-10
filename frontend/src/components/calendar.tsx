import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import { Typography } from "@mui/material";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const BookingCalendar: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
      <Typography variant="body1" paddingTop={5}>
        <div className="calendar-container">
          <Calendar
            onChange={onChange}
            value={value}
            className="responsive-calendar"
          />
        </div>
      </Typography>
    </div>
  );
};

export default BookingCalendar;
