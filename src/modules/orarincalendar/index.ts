import { OrarInCalendarService } from './OrarInCalendar.service';

async function run() {
  const faf181: OrarInCalendarService = new OrarInCalendarService('FAF-181');
  await faf181.init();
  // tslint:disable:no-console
  console.log(JSON.stringify(faf181.getCalendar(), undefined, 2));
}

run();
