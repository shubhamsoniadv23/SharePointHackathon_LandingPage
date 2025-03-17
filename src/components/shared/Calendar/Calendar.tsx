import React, { useState, useEffect } from "react";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { Typography, Box, Button, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ISharedComponentProps } from "../../../webparts/landingPage/components/ILandingPageProps";
import { typographyStyles } from "../../../constants/constant";

// Configure dayjs to use timezone
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Kolkata");

interface ICalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string };
  end?: { dateTime: string };
  location?: string;
  onlineMeeting?: { joinUrl: string };
}

const CalendarComponent: React.FC<ISharedComponentProps> = ({ context, isDarkTheme }) => {
  const today = dayjs().tz("Asia/Kolkata");
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<ICalendarEvent[]>([]);

  const formatToIndianTime = (dateTime: string) => {
    // Convert UTC to Indian time
    return dayjs.utc(dateTime).tz("Asia/Kolkata").format("h:mm A");
  };

  const fetchMeetings = (date: dayjs.Dayjs) => {
    const startDateTime = date.startOf("day").toISOString();
    const endDateTime = date.endOf("day").toISOString();

    context.msGraphClientFactory
      .getClient("3")
      .then((msGraphClient: MSGraphClientV3) =>
        msGraphClient
          .api(`/me/calendarView?startDateTime=${startDateTime}&endDateTime=${endDateTime}&$select=id,subject,start,end,location,onlineMeeting`)
          .version("v1.0")
          .get()
      )
      .then((response: any) => {
        const meetings = response.value.map((event: any) => ({
          id: event.id,
          subject: event.subject,
          start: { dateTime: event.start.dateTime },
          end: { dateTime: event.end.dateTime },
          location: event.location?.displayName || 'No Location',
          onlineMeeting: event.onlineMeeting
        }));
        setEvents(meetings);
      })
      .catch((err: any) => console.error("Error fetching meetings", err));
  };

  useEffect(() => {
    fetchMeetings(selectedDate);
  }, [selectedDate]);

  return (
    <Box id="calendar" sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, }}>
      <Typography variant="h4" sx={typographyStyles.heading}>
        Calender
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}
      >
        <DateCalendar
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(dayjs(newDate))}
          views={["year", "month", "day"]}
          sx={{
            width: '100%',
            maxWidth: '360px',
            margin: '0 auto',
            paddingTop: '20px',
            "& .MuiPickersDay-root": {
              backgroundColor: "#e6f9d4",
              color: "#0f3d0f",
              borderRadius: "8px",
            },
            "& .Mui-selected": {
              backgroundColor: "#0f3d0f !important",
              color: "white !important",
              borderRadius: "20px",
            },
            "& .MuiPickersDay-root:hover": {
              backgroundColor: "#c2e6a4",
            },
          }}
        />
      </LocalizationProvider>

      <Typography variant="h6" sx={{ mt: 2, mb: 2, textAlign: "center", color: isDarkTheme ? "#fff" : "#333", fontSize: '1.1rem' }}>
        Meetings on {selectedDate.format("MMMM DD, YYYY")}
      </Typography>

      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        height: "150px",
        overflowY: "auto",
        padding: '10px',
        "&::-webkit-scrollbar": {
          width: "6px"
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "4px"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px",
          "&:hover": {
            background: "#555"
          }
        }
      }}>
        {events.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 2, width: '500px' }}>
            No meetings for today!
          </Typography>
        ) : (
          events.map((event) => (
            <Box
              key={event.id}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: '10px',
                gap: '0.75rem',
                boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.2), -3px -3px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                backgroundColor: '#fff',
                height: '50px',
              }}
            >
              <Box sx={{ borderRight: '1px solid black', minWidth: '80px', textAlign: 'center' }}>
                <Typography color="black" sx={{ padding: "2px 4px", fontSize: '0.9rem' }}>
                  {dayjs(event.start.dateTime).tz().format("D MMM")}
                </Typography>
              </Box>

              <Box sx={{ width: '260px', ml: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: "700", fontSize: '0.9rem', mb: 0.5 }}>{event.subject}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                    {formatToIndianTime(event.start.dateTime)} - {event.end && formatToIndianTime(event.end.dateTime)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100px',
                marginLeft: 'auto'
              }}>
                <Tooltip title={event.location || 'No Location'} placement="top">
                  <Button
                    component="a"
                    href={event.onlineMeeting?.joinUrl && event.onlineMeeting.joinUrl.indexOf("teams.microsoft.com") > -1 ?
                      event.onlineMeeting.joinUrl : undefined}
                    target="_blank"
                    size="small"
                    sx={{
                      backgroundColor: '#4b7d2f',
                      color: 'white',
                      padding: '3px 12px',
                      borderRadius: 8,
                      textTransform: 'capitalize',
                      fontSize: '0.8rem',
                      width: '90px',
                      minWidth: '90px',
                      maxWidth: '90px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      textAlign: 'center',
                      '&:hover': {
                        backgroundColor: '#3d6626'
                      }
                    }}
                  >
                    {event.location === "Microsoft Teams Meeting" ? "Online" : "In-Person"}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default CalendarComponent;
