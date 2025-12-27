import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import Header from "../../components/admin/Header";

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);

  // Handle clicking on a date to add a new booking
  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your booking (e.g., SUV Rental - John Doe)");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  // Handle clicking on an existing event to delete it
  const handleEventClick = (selected) => {
    if (window.confirm(`Are you sure you want to delete the booking: '${selected.event.title}'?`)) {
      selected.event.remove();
    }
  };

  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR (List of upcoming events) */}
        <Box
          flex="1 1 20%"
          backgroundColor="white"
          p="15px"
          borderRadius="4px"
          className="shadow-sm"
        >
          <Typography variant="h5" fontWeight="bold">Bookings</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: "#dc2626", // Brand Red
                  color: "white",
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography sx={{ color: "white", fontSize: "12px" }}>
                      {new Date(event.start).toLocaleDateString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* THE ACTUAL CALENDAR */}
        <Box flex="1 1 100%" ml="15px" backgroundColor="white" p="15px" borderRadius="4px" className="shadow-sm">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={[
              { id: "1234", title: "BMW X5 - Rental", date: "2025-12-25" },
              { id: "4321", title: "Audi A6 - Maintenance", date: "2025-12-28" },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;