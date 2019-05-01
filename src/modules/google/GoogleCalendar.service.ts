import { google } from 'googleapis';
import { GoogleAPI } from './GoogleAPI.service';
import { IAddEvent, ICalendar, ICreateCalendar, IEventsList, IGetEvent } from './interface';

export class GoogleCalendarService {
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

  static async createCalendar(options: ICreateCalendar): Promise<any> {
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

  static async getCalendar(options: ICalendar): Promise<any> {
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

  static async deleteCalendar(options: ICalendar): Promise<any> {
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

  static async addEventInCalendar(options: IAddEvent): Promise<any> {
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

  static async getEventsInCalendar(options: ICalendar): Promise<IEventsList> {
    return (await GoogleAPI.authorizeAndExec(auth => {
      const calendar = google.calendar({ version: 'v3', auth });
      return new Promise((resolve, reject) => {
        calendar.events.list(options, (err, res) => {
          if (err) reject(err);
          resolve(res.data);
        });
      });
    })) as IEventsList;
  }

  static async deleteEvent(options: IGetEvent): Promise<any> {
    return await GoogleAPI.authorizeAndExec(auth => {
      const calendar = google.calendar({ version: 'v3', auth });
      return new Promise((resolve, reject) => {
        calendar.events.delete(options, (err, res) => {
          if (err) reject(err);
          resolve(res.data);
        });
      });
    });
  }
}
