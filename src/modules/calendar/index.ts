import { CalendarService } from './Calendar.service';

async function run() {
  // CalendarService.listEvents({
  //   calendarId: 'primary',
  //   timeMin: new Date().toISOString(),
  //   maxResults: 10,
  //   singleEvents: true,
  //   orderBy: 'startTime',
  // });

  // const resultGet = await CalendarService.getCalendar({ calendarId: 'primary' });
  // // tslint:disable:no-console
  // console.log(JSON.stringify(resultGet, undefined, 2));

  const resultCreate = await CalendarService.createCalendar({ resource: { summary: 'Test Calendar', timeZone: 'Europe/Chisinau' } });
  // tslint:disable:no-console
  console.log(JSON.stringify(resultCreate, undefined, 2));

  const startTime = new Date();
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 1);

  const event = {
    summary: 'Test event',
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'Europe/Chisinau',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'Europe/Chisinau',
    },
  };

  const resultAddEvent = await CalendarService.addEventInCalendar({ calendarId: 'primary', resource: event });
  // tslint:disable:no-console
  console.log(JSON.stringify(resultAddEvent, undefined, 2));

  // const resultDelete = await CalendarService.deleteCalendar({ calendarId: '' });
  // // tslint:disable:no-console
  // console.log(JSON.stringify(resultDelete, undefined, 2));

  const result = await CalendarService.listCalendars();
  // tslint:disable:no-console
  console.log(JSON.stringify(result, undefined, 2));
}

run();
