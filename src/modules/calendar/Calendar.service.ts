import { google } from 'googleapis';
import { GoogleAPI } from './GoogleAPI.service';

export class CalendarService {
  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param options - options
   */
  static listEvents(options) {
    GoogleAPI.authorizeAndExec(auth => {
      const calendar = google.calendar({ version: 'v3', auth });
      calendar.events.list(options, (err, res) => {
        // tslint:disable:no-console
        if (err) throw new Error('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
          console.log('Upcoming 10 events:');
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
          });
        } else {
          console.log('No upcoming events found.');
        }
      });
    });
  }

  static async listCalendars(): Promise<any> {
    return await GoogleAPI.authorizeAndExec(auth => {
      const calendar = google.calendar({ version: 'v3', auth });
      return new Promise((resolve, reject) => {
        calendar.calendarList.list((err, res) => {
          if (err) reject(err);
          resolve(res.data);
        });
      });
    });
  }

  static async createCalendar(options): Promise<any> {
    return await GoogleAPI.authorizeAndExec(auth => {
      const calendar = google.calendar({ version: 'v3', auth });
      return new Promise((resolve, reject) => {
        calendar.calendars.insert(options, (err, res) => {
          if (err) reject(err);
          resolve(res.data);
        });
      });
    });
  }

  static async getCalendar(options): Promise<any> {
    return await GoogleAPI.authorizeAndExec(auth => {
      const calendar = google.calendar({ version: 'v3', auth });
      return new Promise((resolve, reject) => {
        calendar.calendars.get(options, (err, res) => {
          if (err) reject(err);
          resolve(res.data);
        });
      });
    });
  }

  static async deleteCalendar(options): Promise<any> {
    return await GoogleAPI.authorizeAndExec(auth => {
      const calendar = google.calendar({ version: 'v3', auth });
      return new Promise((resolve, reject) => {
        calendar.calendars.delete(options, (err, res) => {
          if (err) reject(err);
          resolve(res.data);
        });
      });
    });
  }

  static async addEventInCalendar(options): Promise<any> {
    return await GoogleAPI.authorizeAndExec(auth => {
      const calendar = google.calendar({ version: 'v3', auth });
      return new Promise((resolve, reject) => {
        calendar.events.insert(options, (err, res) => {
          if (err) reject(err);
          resolve(res.data);
        });
      });
    });
  }
}
