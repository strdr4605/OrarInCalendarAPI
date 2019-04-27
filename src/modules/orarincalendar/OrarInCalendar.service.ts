import { GoogleCalendarService } from '../google/GoogleCalendar.service';
import { ICalendarEntry, ICalendarsList } from '../google/interface';
import { IGroupSchedule } from '../xlsx/interface';

export class OrarInCalendarService {
  calendarEntry: ICalendarEntry;
  groupSchedule: IGroupSchedule;
  constructor(startDate: Date, endDate: Date) {}
  async init(groupSchedule: IGroupSchedule) {
    this.groupSchedule = groupSchedule;
    const calendarSumary: string = `${process.env.CALENDAR_PREFIX}-${this.groupSchedule.groupName}`;
    const result: ICalendarsList = await GoogleCalendarService.listCalendars();
    const foundCalendar: ICalendarEntry | undefined = result.items.find(el => el.summary === calendarSumary);
    this.calendarEntry =
      foundCalendar || (await GoogleCalendarService.createCalendar({ resource: { summary: calendarSumary, timeZone: 'Europe/Chisinau' } }));
  }

  getCalendar(): ICalendarEntry {
    return this.calendarEntry;
  }
}
