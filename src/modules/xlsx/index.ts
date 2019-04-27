import { utils } from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx/types';
import { ICourseInfo } from './interface';
import { XLSParser } from './XLSParser';
import { XLSUtils } from './XLSUtils';

export const INPUT_FILE: string = __dirname + '/assets/inputs/schedule1.xls';
export const OUTPUT_FILE: string = __dirname + '/assets/outputs/result1.xls';

export * from './XLSParser';
export * from './XLSUtils';
export * from './interface';

function run() {
  // tslint:disable:no-console
  const wb: WorkBook = XLSUtils.loadFile(INPUT_FILE);
  const ws: WorkSheet = XLSUtils.deleteUnusedCells(wb.Sheets[wb.SheetNames[0]]);
  XLSUtils.fillMerges(ws);
  // console.log(JSON.stringify(ws['!merges'], undefined, 2));
  // console.log(JSON.stringify(ws, undefined, 2));
  // const data = utils.sheet_to_json(ws, { header: 1 });
  // XLSUtils.saveToFile(OUTPUT_FILE, data);

  const xlsParser: XLSParser = new XLSParser(ws);
  // console.log(JSON.stringify(xlsParser.groupsColumns, undefined, 2));
  // console.log(JSON.stringify(xlsParser.weekdaysHoursRows, undefined, 2));
  console.log(JSON.stringify(xlsParser.getWeeklyScheduleByGroup('FAF-181'), undefined, 2));
}

// run();
