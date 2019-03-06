import { readFile, utils, WorkBook, WorkSheet, writeFile } from 'xlsx';

const inputFile: string = '/assets/inputs/schedule1.xls';
const outputFile: string = '/assets/outputs/result1.xls';

let data;

// tslint:disable:no-console
/* helper to generate the workbook object */
function makeBook(): WorkBook {
  const ws: WorkSheet = utils.aoa_to_sheet(data);
  const wb: WorkBook = utils.book_new();
  utils.book_append_sheet(wb, ws, 'SheetJS');
  return wb;
}

function getFile(file: string): void {
  const wb: WorkBook = makeBook();
  /* write using writeFile */
  writeFile(wb, __dirname + file);
  console.log(`wrote to ${file}`);
}

function loadFile(file: string) {
  const wb: WorkBook = readFile(__dirname + file);
  const ws: WorkSheet = wb.Sheets[wb.SheetNames[0]];
  data = utils.sheet_to_json(ws, { header: 1 });
  console.log(JSON.stringify(ws['!merges'], undefined, 2));
  console.log(JSON.stringify(ws, undefined, 2));
}

loadFile(inputFile);
// getFile(outputFile);
