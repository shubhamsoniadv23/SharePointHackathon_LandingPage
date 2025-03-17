import React, { useState, useEffect } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IMeeting {
  subject: string;
  start: string;
  end: string;
  location: string;
  joinUrl: string; // Add joinUrl
}
export interface IGaUserMeetingsProps {
  context: WebPartContext;
}


const GaUserMeetings: React.FC<IGaUserMeetingsProps> = (props) => {
  const [meetings, setMeetings] = useState<IMeeting[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    void GetMeetings();
  }, []);

  const getISODateRange = (): { startISO: string; endISO: string } => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const startISO = today.toISOString().split("T")[0] + "T00:00:00Z";  // Start of today
    const endISO = tomorrow.toISOString().split("T")[0] + "T23:59:59Z"; // End of tomorrow

    return { startISO, endISO };
  };

  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short', // "Feb"
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const GetMeetings = async (): Promise<void> => {
    try {
      const client: MSGraphClientV3 = await props.context.msGraphClientFactory.getClient("3");

      const { startISO, endISO } = getISODateRange();

      const response = await client
        .api(`me/calendarView?startDateTime=${startISO}&endDateTime=${endISO}`)
        .version('v1.0')
        .select('subject,start,end,location,onlineMeeting')
        .orderby('start/dateTime')
        .header("Prefer", 'outlook.timezone="Asia/Kolkata"')
        .get();

      console.log(response);

      const meetingsList = response.value.map((event: any) => ({
        subject: event.subject,
        start: formatDateTime(event.start.dateTime),
        end: formatDateTime(event.end.dateTime),
        location: event.location?.displayName || 'No Location',
        joinUrl: event.onlineMeeting?.joinUrl || '#', // Add joinUrl
      }));

      setMeetings(meetingsList);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {meetings.length === 0 ? (
        <Typography sx={{ textAlign: 'center' }}>
          Loading meetings for today!
        </Typography>
      ) : (
        meetings.map((meeting, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'left',
              padding: '10px',
              gap: '1rem',
              boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          >
            <Box sx={{ borderRight: '1px solid black' }}>
              <Typography color="black" sx={{ padding: "2px 10px" }}>
                {meeting.start.split(',')[0]}
              </Typography>
            </Box>
            <Box >
              <Box>
                <Typography sx={{ fontWeight: "700" }}>{meeting.subject}</Typography>
              </Box>
              <Box>
                <Typography>
                  {formatTime(meeting.start)} - {formatTime(meeting.end)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                component="a"
                href={typeof meeting.joinUrl === 'string' && meeting.joinUrl.indexOf("teams.microsoft.com") !== -1 ? meeting.joinUrl : undefined}
                target={typeof meeting.joinUrl === 'string' && meeting.joinUrl.indexOf("teams.microsoft.com") !== -1 ? "_blank" : undefined}
                sx={{ backgroundColor: '#4b7d2f', color: 'white', padding: '2px 20px', borderRadius: 10, textTransform: 'capitalize', }}
              >
                {meeting.location}
              </Button>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default GaUserMeetings;