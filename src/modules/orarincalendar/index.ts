import { DateTime } from 'luxon';
import { WorkBook, WorkSheet } from 'xlsx/types';
import { ICourseInfo, INPUT_FILE, XLSParser, XLSUtils } from './../xlsx';
import { OrarInCalendarService } from './OrarInCalendar.service';

async function run() {
    // tslint:disable:no-console
  const wb: WorkBook = XLSUtils.loadFile(INPUT_FILE);
  const startDate: DateTime = DateTime.fromFormat('2019-04-29', 'yyyy-MM-dd');
  const endDate: DateTime = DateTime.fromFormat('2019-05-27', 'yyyy-MM-dd');
  const ws: WorkSheet = XLSUtils.deleteUnusedCells(wb.Sheets[wb.SheetNames[0]]);
  XLSUtils.fillMerges(ws);
  const xlsParser: XLSParser = new XLSParser(ws);
  const faf181: OrarInCalendarService = new OrarInCalendarService(startDate, endDate);
  const faf181schedule = xlsParser.getWeeklyScheduleByGroup('FAF-181');
  await faf181.init(faf181schedule);
  console.log(JSON.stringify(faf181.getCalendar(), undefined, 2));
  console.log(JSON.stringify(faf181.getSchedule(), undefined, 2));
}

run();
