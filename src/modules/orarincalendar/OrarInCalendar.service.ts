import { isEmpty } from 'lodash';
import { DateTime } from 'luxon';
import { GoogleCalendarService } from '../google/GoogleCalendar.service';
import { ICalendarEntry, ICalendarsList, ICreateEvent, IEvent, IEventsList } from '../google/interface';
import { ICourseDetails, IGroupSchedule, WeekdaysEnumEN } from '../xlsx/interface';
import { Day } from './interface';

export class OrarInCalendarService {
  calendarEntry: ICalendarEntry;
  groupSchedule: IGroupSchedule;
  constructor(private readonly startDate: DateTime, private readonly endDate: DateTime) {}
  async init(groupSchedule: IGroupSchedule) {
    this.groupSchedule = groupSchedule;
    const calendarSumary: string = `${process.env.CALENDAR_PREFIX}-${this.groupSchedule.groupName}`;
    const result: ICalendarsList = await GoogleCalendarService.listCalendars();
    const foundCalendar: ICalendarEntry | undefined = result.items.find(el => el.summary === calendarSumary);
    this.calendarEntry =
      foundCalendar || (await GoogleCalendarService.createCalendar({ resource: { summary: calendarSumary, timeZone: process.env.TIME_ZONE } }));
  }

  getCalendar(): ICalendarEntry {
    return this.calendarEntry;
  }

  getSchedule(): IGroupSchedule {
    return this.groupSchedule;
  }

  async createEventsForWeek() {
    const week = {
      [WeekdaysEnumEN.Monday]: false,
      [WeekdaysEnumEN.Tuesday]: false,
      [WeekdaysEnumEN.Wednesday]: false,
      [WeekdaysEnumEN.Thursday]: false,
      [WeekdaysEnumEN.Friday]: false,
    };
    let dayCount = 0;
    while (!Object.values(week).every(Boolean)) {
      const weekday: string = this.startDate.plus({ days: dayCount }).weekdayLong;
      const currentDay: Day | undefined = this.groupSchedule.weeklySchedule[weekday];
      if (currentDay) {
        await this.createEventsForDay(currentDay, dayCount);
        week[weekday] = true;
      }
      dayCount++;
    }
  }

  async createEventsForDay(currentDay: Day, dayCount: number) {
    for (const courseTime of Object.keys(currentDay)) {
      if (isEmpty(currentDay[courseTime])) continue;
      if (currentDay[courseTime].stable) await this.stable(currentDay[courseTime].stable, courseTime, dayCount);
      if (currentDay[courseTime].odd) await this.odd(currentDay[courseTime].odd, courseTime, dayCount);
      if (currentDay[courseTime].even) await this.even(currentDay[courseTime].even, courseTime, dayCount + 7);
    }
  }

  async genericAddEvent(courseDetails: ICourseDetails, courseTime: string, dayCount: number, interval: number = 1) {
    const { courseStartDate, courseEndDate } = this.getCourseTime(courseTime, dayCount);
    const event: ICreateEvent = {
      summary: courseDetails.name,
      start: {
        dateTime: courseStartDate.toISO(),
        timeZone: process.env.TIME_ZONE,
      },
      end: {
        dateTime: courseEndDate.toISO(),
        timeZone: process.env.TIME_ZONE,
      },
      description: `${courseDetails.room ? 'Cab. ' + courseDetails.room : ''}\n${courseDetails.teacher ? courseDetails.teacher : ''}\n`,
      recurrence: [
        `RRULE:FREQ=WEEKLY;INTERVAL=${interval};UNTIL=${this.endDate
          .toUTC()
          .toISO()
          .replace(/[\-:]/gi, '')
          .replace(/\.000/gi, '')}`,
      ],
    };

    const resultAddEvent: IEvent = await GoogleCalendarService.addEventInCalendar({
      calendarId: this.calendarEntry.id,
      resource: event,
    });
    // tslint:disable:no-console
    console.log(
      `Add Event: ${resultAddEvent.id} | summary: ${resultAddEvent.summary} | calendarId: ${resultAddEvent.organizer.email} | calendarName: ${
        resultAddEvent.organizer.displayName
      }`,
    );
  }

  async stable(courseDetails: ICourseDetails, courseTime: string, dayCount: number) {
    await this.genericAddEvent(courseDetails, courseTime, dayCount);
  }

  async odd(courseDetails: ICourseDetails, courseTime: string, dayCount: number) {
    await this.genericAddEvent(courseDetails, courseTime, dayCount, 2);
  }
  async even(courseDetails: ICourseDetails, courseTime: string, dayCount: number) {
    const ONE_WEEK_IN_DAYS = 7;
    await this.genericAddEvent(courseDetails, courseTime, dayCount + ONE_WEEK_IN_DAYS, 2);
  }

  getCourseTime(courseTime: string, dayCount: number): Record<string, DateTime> {
    const [startTime, endTime]: string[] = courseTime.split('-');
    const [startHour, startMinute]: number[] = startTime.split(':').map(el => parseInt(el, 10));
    const [endHour, endMinute]: number[] = endTime.split(':').map(el => parseInt(el, 10));
    const courseStartDate: DateTime = this.startDate.set({ hour: startHour, minute: startMinute }).plus({ days: dayCount });
    const courseEndDate: DateTime = this.startDate.set({ hour: endHour, minute: endMinute }).plus({ days: dayCount });
    return { courseStartDate, courseEndDate };
  }

  async deleteAllEvents() {
    const result: IEventsList = await GoogleCalendarService.getEventsInCalendar({ calendarId: this.calendarEntry.id });
    result.items.forEach(event => {
      GoogleCalendarService.deleteEvent({ calendarId: this.calendarEntry.id, eventId: event.id });
    });
  }
}
