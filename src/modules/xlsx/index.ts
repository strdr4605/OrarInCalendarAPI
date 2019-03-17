import * as _ from 'lodash';
import { CellAddress, CellObject, Range, readFile, utils, WorkBook, WorkSheet, writeFile } from 'xlsx';

const inputFile: string = '/assets/inputs/schedule1.xls';
const outputFile: string = '/assets/outputs/result1.xls';

let data;

interface IRangeMap {
  start: string;
  end: string;
}

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

const loadFile = (file: string): WorkBook => readFile(__dirname + file);

/**
 * Deletes all cells from row 1 to 6 and from 225 to 999
 * @param {WorkSheet} ws - Worksheet from where cells will be deleted
 * @returns {WorkSheet} new Worksheet without some cells
 */
function deleteUnusedCells(ws: WorkSheet): WorkSheet {
  const wsCopy = _.cloneDeep(ws);

  const passRegex = /[A-Z]{1,2}([7-9]|[0-2][0-2][0-4]|[0-2][0-2])/;
  const rejectRegex = /[A-Z]{1,2}([1-6]$|[2-9][2-9][5-9]$)/;

  for (const key in wsCopy) {
    if (key.match(rejectRegex)) delete wsCopy[key];
  }

  return wsCopy;
}

/**
 * Converts a cell address to cell name
 * @example
 * // return AA21
 * getCellNameFromCellAddress({c: 27, r: 21});
 * @param {CellAddress} cellAddress - Cell address that will be converted
 * @returns {String} the cell name.
 */
function getCellNameFromCellAddress(cellAddress: CellAddress): string {
  const startPosition: number = 65; // Decimal position 'A' in UTF-16
  const lettersInAlphabet: number = 26;
  let cellName: string = '';
  const order: number = cellAddress.c % lettersInAlphabet;
  const letter: string = String.fromCharCode(startPosition + order);
  cellName += cellAddress.c > lettersInAlphabet ? 'A' + letter : letter;
  return (cellName + cellAddress.r);
}

/**
 * Fill cell from a Worksheet that were merged
 * @param {WorkSheet} ws -Worksheet that will be filled
 */
function fillMerges(ws: WorkSheet): void {
  const merges: Range[] = ws['!merges'];

  const mergesMap: IRangeMap[] = merges.map(merge => ({
    start: getCellNameFromCellAddress(merge.s),
    end: getCellNameFromCellAddress(merge.e),
  }));

  // console.log(JSON.stringify(mergesMap, undefined, 2));

  for (const merge of mergesMap) {
    const cells: string[] = getCellsForHorizontalRange(merge);
    if (ws[merge.start]) {
      const cellValue: CellObject = _.get(ws, merge.start);
      for (const newCell of cells) {
        ws[newCell] = cellValue;
      }
    }
  }
}

/**
 * Compute the next column name for a xls file
 * @example
 * // returns B
 * getNextColumn('A');
 * @example
 * // returns AA
 * getNextColumn('Z');
 * @param {String} column - Xls file column name
 * @returns next column name
 */
function getNextColumn(column: string): string {
  let nextColumn: string = column.substring(0, column.length - 1) + String.fromCharCode(column.charCodeAt(column.length - 1) + 1);
  if (nextColumn[nextColumn.length - 1] === '[') { // next char after 'Z'
    const arr: string[] = nextColumn.split('');
    arr.pop();
    nextColumn = arr.join().concat('AA');
  }

  return nextColumn;
}

/**
 * Create a array of cell names in the same row based on range of merged cells
 * @param merge - A range of merged cells
 * @returns {string[]} Array of cell names
 */
function getCellsForHorizontalRange(merge: IRangeMap): string[] {
  const row: string = merge.start.match(/\d+/)[0];
  const startCol: string = merge.start.match(/[A-Z]{1,2}/)[0];
  const endCol: string = merge.end.match(/[A-Z]{1,2}/)[0];
  const cells: string[] = [merge.start];
  if (startCol.localeCompare(endCol) === 0) return cells;

  let nextColumn: string = getNextColumn(startCol);
  while (nextColumn.localeCompare(endCol) === -1) {
    cells.push(nextColumn + row);
    nextColumn = getNextColumn(nextColumn);
  }
  cells.push(endCol + row);

  return cells;
}

function run() {
  const wb: WorkBook = loadFile(inputFile);
  const ws: WorkSheet = deleteUnusedCells(wb.Sheets[wb.SheetNames[0]]);
  fillMerges(ws);
  console.log(JSON.stringify(ws['!merges'], undefined, 2));
  console.log(JSON.stringify(ws, undefined, 2));
  data = utils.sheet_to_json(ws, { header: 1 });
  getFile(outputFile);
}

run();
