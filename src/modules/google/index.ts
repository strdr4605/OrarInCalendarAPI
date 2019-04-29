import { GoogleCalendarService } from './GoogleCalendar.service';
import { ICreateEvent } from './interface';

async function run() {
  // CalendarService.listEvents({
  //   calendarId: 'primary',
  //   timeMin: new Date().toISOString(),
  //   maxResults: 10,
  //   singleEvents: true,
  //   orderBy: 'startTime',
  // });

  // const resultGet = await GoogleCalendarService.getCalendar({ calendarId: 'primary' });
  // // tslint:disable:no-console
  // console.log(JSON.stringify(resultGet, undefined, 2));

  // const resultCreate = await GoogleCalendarService.createCalendar({ resource: { summary: 'DEv Test Calendar', timeZone: process.env.TIME_ZONE } });
  // // tslint:disable:no-console
  // console.log(JSON.stringify(resultCreate, undefined, 2));

  const startTime = new Date();
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 1);

  const event: ICreateEvent = {
    summary: 'Test event',
    start: {
      dateTime: startTime.toISOString(),
      timeZone: process.env.TIME_ZONE,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: process.env.TIME_ZONE,
    },
  };

  // const resultAddEvent = await GoogleCalendarService.addEventInCalendar({
  //   calendarId: 'primary',
  //   resource: event,
  // });
  // // tslint:disable:no-console
  // console.log(JSON.stringify(resultAddEvent, undefined, 2));

  // const resultDelete = await GoogleCalendarService.deleteCalendar({ calendarId: '' });
  // // tslint:disable:no-console
  // console.log(JSON.stringify(resultDelete, undefined, 2));

  const result = await GoogleCalendarService.listCalendars();
  // tslint:disable:no-console
  console.log(JSON.stringify(result, undefined, 2));
}

run();
