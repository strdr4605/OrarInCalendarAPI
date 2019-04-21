import * as _ from 'lodash';
import { CellAddress, CellObject, Range, readFile, utils, WorkBook, WorkSheet, writeFile } from 'xlsx';
import { IRangeMap } from './interface';
import { REJECT_REGEX } from './regex';

/**
 * Utils that read, write and change XLS docs
 * @class
 */
export class XLSUtils {
  // tslint:disable:no-console
  /* helper to generate the workbook object */
  static makeBook(data: any): WorkBook {
    const ws: WorkSheet = utils.aoa_to_sheet(data);
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'SheetJS');
    return wb;
  }

  static saveToFile(file: string, data: any): void {
    const wb: WorkBook = this.makeBook(data);
    /* write using writeFile */
    writeFile(wb, file);
    console.log(`\nwrote to ${file}`);
  }

  static loadFile = (file: string): WorkBook => readFile(file);

  /**
   * Deletes all cells from row 1 to 6 and from 225 to 999
   * @param {WorkSheet} ws - Worksheet from where cells will be deleted
   * @returns {WorkSheet} new Worksheet without some cells
   */
  static deleteUnusedCells(ws: WorkSheet): WorkSheet {
    const wsCopy = _.cloneDeep(ws);

    for (const key in wsCopy) {
      if (key.match(REJECT_REGEX)) delete wsCopy[key];
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
  static getCellNameFromCellAddress(cellAddress: CellAddress): string {
    const startPosition: number = 65; // Decimal position 'A' in UTF-16
    const lettersInAlphabet: number = 26;
    let cellName: string = '';
    const order: number = cellAddress.c % lettersInAlphabet;
    const letter: string = String.fromCharCode(startPosition + order);
    cellName += cellAddress.c > lettersInAlphabet ? 'A' + letter : letter;
    return cellName + cellAddress.r;
  }

  /**
   * Fill cell from a Worksheet that were merged
   * @param {WorkSheet} ws -Worksheet that will be filled
   */
  static fillMerges(ws: WorkSheet): void {
    const merges: Range[] = ws['!merges'];

    const mergesMap: IRangeMap[] = merges.map(merge => ({
      start: this.getCellNameFromCellAddress(merge.s),
      end: this.getCellNameFromCellAddress(merge.e),
    }));

    // console.log(JSON.stringify(mergesMap, undefined, 2));

    for (const merge of mergesMap) {
      const cells: string[] = this.getCellsForHorizontalRange(merge);
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
  static getNextColumn(column: string): string {
    let nextColumn: string = column.substring(0, column.length - 1) + String.fromCharCode(column.charCodeAt(column.length - 1) + 1);
    // next char after 'Z'
    if (nextColumn[nextColumn.length - 1] === '[') {
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
  static getCellsForHorizontalRange(merge: IRangeMap): string[] {
    const row: string = merge.start.match(/\d+/)[0];
    const startCol: string = merge.start.match(/[A-Z]{1,2}/)[0];
    const endCol: string = merge.end.match(/[A-Z]{1,2}/)[0];
    const cells: string[] = [merge.start];
    if (startCol.localeCompare(endCol) === 0) return cells;

    let nextColumn: string = this.getNextColumn(startCol);
    while (nextColumn.localeCompare(endCol) === -1) {
      cells.push(nextColumn + row);
      nextColumn = this.getNextColumn(nextColumn);
    }
    cells.push(endCol + row);

    return cells;
  }

  /**
   * Check if a variable is type of CellObject
   * @static
   * @param {any} object - any type
   * @returns true or false
   */
  static typeOfCellObject(object: any): object is CellObject {
    return typeof object === 'object' && !Array.isArray(object) && 't' in object;
  }
}
