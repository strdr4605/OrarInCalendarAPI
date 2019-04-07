import { CalendarService } from './Calendar.service';

async function run() {
  // CalendarService.listEvents({
  //   calendarId: 'primary',
  //   timeMin: new Date().toISOString(),
  //   maxResults: 10,
  //   singleEvents: true,
  //   orderBy: 'startTime',
  // });

  const resultGet = await CalendarService.getCalendar({ calendarId: 'primary' });
  // tslint:disable:no-console
  console.log(JSON.stringify(resultGet, undefined, 2));

  const resultCreate = await CalendarService.createCalendar({ summary: 'My new Calendar' });
  // tslint:disable:no-console
  console.log(JSON.stringify(resultCreate, undefined, 2));

  const result = await CalendarService.listCalendars();
  // tslint:disable:no-console
  console.log(JSON.stringify(result, undefined, 2));
}

run();
