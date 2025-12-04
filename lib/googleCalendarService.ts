import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-calendar',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Calendar not connected');
  }
  return accessToken;
}

async function getCalendarClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string; displayName?: string }[];
  conferenceData?: any;
  location?: string;
}

export async function createCalendarEvent(event: CalendarEvent): Promise<{ eventId: string; meetLink?: string } | null> {
  try {
    const calendar = await getCalendarClient();
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
        conferenceData: {
          createRequest: {
            requestId: `drizzl-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        location: event.location
      }
    });

    return {
      eventId: response.data.id || '',
      meetLink: response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri
    };
  } catch (error) {
    console.error('[GoogleCalendar] Error creating event:', error);
    return null;
  }
}

export async function updateCalendarEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<boolean> {
  try {
    const calendar = await getCalendarClient();
    
    await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: updates
    });

    return true;
  } catch (error) {
    console.error('[GoogleCalendar] Error updating event:', error);
    return false;
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  try {
    const calendar = await getCalendarClient();
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId
    });

    return true;
  } catch (error) {
    console.error('[GoogleCalendar] Error deleting event:', error);
    return false;
  }
}

export async function getCalendarEvents(startDate: string, endDate: string): Promise<any[]> {
  try {
    const calendar = await getCalendarClient();
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate,
      timeMax: endDate,
      singleEvents: true,
      orderBy: 'startTime'
    });

    return response.data.items || [];
  } catch (error) {
    console.error('[GoogleCalendar] Error fetching events:', error);
    return [];
  }
}

export async function isCalendarConnected(): Promise<boolean> {
  try {
    await getAccessToken();
    return true;
  } catch {
    return false;
  }
}
