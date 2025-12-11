import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminRequest } from '../../../../lib/adminAuth';
import { 
  createCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent,
  getCalendarEvents,
  isCalendarConnected
} from '../../../../lib/googleCalendarService';
import { scheduleMeeting } from '../../../../lib/leadService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  const { authorized, error } = await verifyAdminRequest(req);
  if (!authorized) {
    return res.status(401).json({ error: error || 'Unauthorized' });
  }
  
  const { action, eventId } = req.query;

  if (req.method === 'GET') {
    try {
      if (action === 'status') {
        const connected = await isCalendarConnected();
        return res.status(200).json({ connected });
      }

      if (action === 'events') {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
          return res.status(400).json({ error: 'Start and end dates required' });
        }
        const events = await getCalendarEvents(startDate as string, endDate as string);
        return res.status(200).json({ events });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error: any) {
      console.error('[Calendar API] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch calendar data' });
    }
  }

  if (req.method === 'POST') {
    try {
      if (action === 'create') {
        const { leadId, title, description, startTime, endTime, timezone, attendees, meetingType } = req.body;
        
        if (!title || !startTime || !endTime) {
          return res.status(400).json({ error: 'Title, start time, and end time required' });
        }

        const calendarResult = await createCalendarEvent({
          summary: title,
          description,
          start: { dateTime: startTime, timeZone: timezone || 'America/New_York' },
          end: { dateTime: endTime, timeZone: timezone || 'America/New_York' },
          attendees: attendees?.map((email: string) => ({ email }))
        });

        if (!calendarResult) {
          return res.status(500).json({ error: 'Failed to create calendar event' });
        }

        if (leadId) {
          await scheduleMeeting(leadId, {
            calendar_event_id: calendarResult.eventId,
            meeting_type: meetingType || 'discovery',
            title,
            description,
            start_time: startTime,
            end_time: endTime,
            timezone: timezone || 'America/New_York',
            meeting_link: calendarResult.meetLink,
            attendees: attendees?.map((email: string) => ({ email })) || []
          });
        }

        return res.status(200).json({ 
          success: true, 
          eventId: calendarResult.eventId,
          meetLink: calendarResult.meetLink
        });
      }

      if (action === 'update' && eventId) {
        const success = await updateCalendarEvent(eventId as string, req.body);
        return res.status(200).json({ success });
      }

      if (action === 'delete' && eventId) {
        const success = await deleteCalendarEvent(eventId as string);
        return res.status(200).json({ success });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (error: any) {
      console.error('[Calendar API] Error:', error);
      return res.status(500).json({ error: 'Action failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
