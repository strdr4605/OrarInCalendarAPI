import { WorkBook, WorkSheet } from 'xlsx/types';
import { ICourseInfo, INPUT_FILE, XLSParser, XLSUtils } from './../xlsx';
import { OrarInCalendarService } from './OrarInCalendar.service';

async function run() {
  const wb: WorkBook = XLSUtils.loadFile(INPUT_FILE);
  // console.log(wb);
  const ws: WorkSheet = XLSUtils.deleteUnusedCells(wb.Sheets[wb.SheetNames[0]]);
  XLSUtils.fillMerges(ws);
  const xlsParser: XLSParser = new XLSParser(ws);
  const faf181: OrarInCalendarService = new OrarInCalendarService(new Date('2019-04-29'), new Date('2019-05-27'));
  const faf181schedule = xlsParser.getWeeklyScheduleByGroup('FAF-181');
  await faf181.init(faf181schedule);
  // tslint:disable:no-console
  console.log(JSON.stringify(faf181.getCalendar(), undefined, 2));
  console.log(JSON.stringify(faf181.getSchedule(), undefined, 2));
}

run();
