import { GoogleCalendarService } from '../google/GoogleCalendar.service';
import { ICalendarEntry, ICalendarsList } from '../google/interface';

export class OrarInCalendarService {
  calendarEntry: ICalendarEntry;
  constructor(private readonly calendarName) {}
  async init() {
    const calendarSumary: string = `${process.env.CALENDAR_PREFIX}-${this.calendarName}`;
    const result: ICalendarsList = await GoogleCalendarService.listCalendars();
    const foundCalendar: ICalendarEntry | undefined = result.items.find(el => el.summary === calendarSumary);
    this.calendarEntry =
      foundCalendar || (await GoogleCalendarService.createCalendar({ resource: { summary: calendarSumary, timeZone: 'Europe/Chisinau' } }));
  }

  getCalendar(): ICalendarEntry {
    return this.calendarEntry;
  }
}
