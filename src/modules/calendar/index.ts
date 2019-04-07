import { CalendarService } from './Calendar.service';

async function run() {
  await CalendarService.listEvents({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const result = await CalendarService.listCalendars();
  // tslint:disable:no-console
  console.log(JSON.stringify(result, undefined, 2));
}

run();
