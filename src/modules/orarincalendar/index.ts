import { WorkBook, WorkSheet } from 'xlsx/types';
import { ICourseInfo, INPUT_FILE, XLSParser, XLSUtils } from './../xlsx';
import { OrarInCalendarService } from './OrarInCalendar.service';

async function run() {
  const wb: WorkBook = XLSUtils.loadFile(INPUT_FILE);
  // console.log(wb);
  const ws: WorkSheet = XLSUtils.deleteUnusedCells(wb.Sheets[wb.SheetNames[0]]);
  XLSUtils.fillMerges(ws);
  const xlsParser: XLSParser = new XLSParser(ws);
  const ti181: OrarInCalendarService = new OrarInCalendarService(new Date('2019-04-22'), new Date('2019-04-27'));
  const ti181schedule = xlsParser.getWeeklyScheduleByGroup('TI-181');
  await ti181.init(ti181schedule);
  // tslint:disable:no-console
  console.log(JSON.stringify(ti181.getCalendar(), undefined, 2));
}

run();
