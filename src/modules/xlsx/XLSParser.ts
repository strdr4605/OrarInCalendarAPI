import { CellObject, WorkSheet } from 'xlsx/types';
import {
  COURSE_SPACE,
  GROUPS,
  GroupWeeklySchedule,
  ICourseInfo,
  IGroupSchedule,
  WeekdaysHoursRows,
  XLSCourseHoursEnum,
  XLSWeekdaysEnum,
} from './interface';
import { COLUMN_REGEX, GROUP_NAME_REGEX, NUMBER_REGEX, rowRegex } from './regex';
import { XLSUtils } from './XLSUtils';

/**
 * Used for parsing and extracting data from XLS docs
 * @class
 */
export class XLSParser {
  groupsRow: number;
  groupsColumns: Record<string, string>;
  weekdaysHoursRows: WeekdaysHoursRows;

  constructor(private readonly ws: WorkSheet) {
    this.groupsRow = this.getGroupsRow();
    this.getGroupsColumns();
    this.getWeekdaysHoursRows();
  }

  /**
   * Find the row number that match with GROUPS constant
   * @returns row number
   */
  private getGroupsRow(): number {
    for (const key of Object.keys(this.ws)) {
      if (!XLSUtils.typeOfCellObject(this.ws[key])) continue;
      const cellObject = this.ws[key] as CellObject;
      if (cellObject.w.match(new RegExp(GROUPS))) {
        return +key.match(NUMBER_REGEX)[0];
      }
    }

    throw new Error(`CellObject with w: '${GROUPS}' not found`);
  }

  /**
   * Find every column on specific row that much with GROUP_NAME_REGEX
   * saves them in this.groupsColumns
   */
  private getGroupsColumns(): void {
    this.groupsColumns = {};
    for (const key of Object.keys(this.ws)) {
      if (!XLSUtils.typeOfCellObject(this.ws[key]) || !key.match(rowRegex(this.groupsRow))) continue;
      const cellObject = this.ws[key] as CellObject;
      if (cellObject.w.match(new RegExp(GROUP_NAME_REGEX))) {
        this.groupsColumns[cellObject.w] = key.match(COLUMN_REGEX)[0];
      }
    }
  }

  /**
   * Find every row number for every CourseHour in every Weekday
   * saves them in this.weekdaysHoursRows
   */
  private getWeekdaysHoursRows(): void {
    this.weekdaysHoursRows = {
      [XLSWeekdaysEnum.Monday]: {
        [XLSCourseHoursEnum.Course1]: -1,
        [XLSCourseHoursEnum.Course2]: -1,
        [XLSCourseHoursEnum.Course3]: -1,
        [XLSCourseHoursEnum.Course4]: -1,
        [XLSCourseHoursEnum.Course5]: -1,
        [XLSCourseHoursEnum.Course6]: -1,
        [XLSCourseHoursEnum.Course7]: -1,
      },
      [XLSWeekdaysEnum.Tuesday]: {
        [XLSCourseHoursEnum.Course1]: -1,
        [XLSCourseHoursEnum.Course2]: -1,
        [XLSCourseHoursEnum.Course3]: -1,
        [XLSCourseHoursEnum.Course4]: -1,
        [XLSCourseHoursEnum.Course5]: -1,
        [XLSCourseHoursEnum.Course6]: -1,
        [XLSCourseHoursEnum.Course7]: -1,
      },
      [XLSWeekdaysEnum.Wednesday]: {
        [XLSCourseHoursEnum.Course1]: -1,
        [XLSCourseHoursEnum.Course2]: -1,
        [XLSCourseHoursEnum.Course3]: -1,
        [XLSCourseHoursEnum.Course4]: -1,
        [XLSCourseHoursEnum.Course5]: -1,
        [XLSCourseHoursEnum.Course6]: -1,
        [XLSCourseHoursEnum.Course7]: -1,
      },
      [XLSWeekdaysEnum.Thursday]: {
        [XLSCourseHoursEnum.Course1]: -1,
        [XLSCourseHoursEnum.Course2]: -1,
        [XLSCourseHoursEnum.Course3]: -1,
        [XLSCourseHoursEnum.Course4]: -1,
        [XLSCourseHoursEnum.Course5]: -1,
        [XLSCourseHoursEnum.Course6]: -1,
        [XLSCourseHoursEnum.Course7]: -1,
      },
      [XLSWeekdaysEnum.Friday]: {
        [XLSCourseHoursEnum.Course1]: -1,
        [XLSCourseHoursEnum.Course2]: -1,
        [XLSCourseHoursEnum.Course3]: -1,
        [XLSCourseHoursEnum.Course4]: -1,
        [XLSCourseHoursEnum.Course5]: -1,
        [XLSCourseHoursEnum.Course6]: -1,
        [XLSCourseHoursEnum.Course7]: -1,
      },
    };

    for (const key of Object.keys(this.ws)) {
      if (!XLSUtils.typeOfCellObject(this.ws[key])) continue;
      const cellObject = this.ws[key] as CellObject;
      for (const day of Object.keys(XLSWeekdaysEnum)) {
        if (cellObject.w.match(new RegExp(XLSWeekdaysEnum[day]))) {
          let currentHourRow = +key.match(NUMBER_REGEX)[0];
          for (const hour of Object.keys(XLSCourseHoursEnum)) {
            this.weekdaysHoursRows[XLSWeekdaysEnum[day]][XLSCourseHoursEnum[hour]] = currentHourRow;
            currentHourRow += COURSE_SPACE;
          }
        }
      }
    }
  }

  /**
   * Get Info about a course on specific row and column
   * @param {string} column - column of couse info
   * @param {number} startRow - row number of course info
   * @returns Course info (stable, even, odd)!
   */
  getCourseInfo(column: string, startRow: number): ICourseInfo {
    const courseInfo: ICourseInfo = {};
    if (this.ws[`${column}${startRow}`]) {
      courseInfo.even = this.getEvenOrOddCourseInfo(column, startRow);
    }
    if (this.ws[`${column}${startRow + 3}`]) {
      courseInfo.odd = this.getEvenOrOddCourseInfo(column, startRow + 3);
    }
    if (!courseInfo.even || !courseInfo.odd) {
      courseInfo.stable = this.getStableCourseInfo(column, startRow).length ? this.getStableCourseInfo(column, startRow) : undefined;
    }
    return courseInfo;
  }

  /**
   * Conbine cells from 3 row in one string
   * @param {string} column - column of couse info
   * @param {number} startRow - row number of course info
   * @returns string with course info
   */
  getEvenOrOddCourseInfo(column: string, startRow: number): string {
    let info: string = (this.ws[`${column}${startRow}`] as CellObject).w + '\n';
    if (this.ws[`${column}${startRow + 1}`]) {
      info += (this.ws[`${column}${startRow + 1}`] as CellObject).w + '\n';
    }
    if (this.ws[`${column}${startRow + 2}`]) {
      info += (this.ws[`${column}${startRow + 2}`] as CellObject).w + '\n';
    }
    return info;
  }

  /**
   * Conbine cells from 6 row in one string
   * @param {string} column - column of couse info
   * @param {number} startRow - row number of course info
   * @returns string with course info
   */
  getStableCourseInfo(column: string, startRow: number): string {
    let info: string = '';
    const endRow = startRow + COURSE_SPACE - 1;
    for (let i = startRow; i <= endRow; i++) {
      if (this.ws[`${column}${i}`]) {
        info += (this.ws[`${column}${i}`] as CellObject).w + '\n';
      }
    }
    return info;
  }

  getWeeklyScheduleByGroup(groupName: string): IGroupSchedule {
    const groupColumn: string | undefined = this.groupsColumns[groupName];
    if (groupColumn === undefined) {
      throw new Error(`Group Name '${groupName}' was not found.`);
    }
    const groupWeeklySchedule: GroupWeeklySchedule = {
      [XLSWeekdaysEnum.Monday]: {
        [XLSCourseHoursEnum.Course1]: {},
        [XLSCourseHoursEnum.Course2]: {},
        [XLSCourseHoursEnum.Course3]: {},
        [XLSCourseHoursEnum.Course4]: {},
        [XLSCourseHoursEnum.Course5]: {},
        [XLSCourseHoursEnum.Course6]: {},
        [XLSCourseHoursEnum.Course7]: {},
      },
      [XLSWeekdaysEnum.Tuesday]: {
        [XLSCourseHoursEnum.Course1]: {},
        [XLSCourseHoursEnum.Course2]: {},
        [XLSCourseHoursEnum.Course3]: {},
        [XLSCourseHoursEnum.Course4]: {},
        [XLSCourseHoursEnum.Course5]: {},
        [XLSCourseHoursEnum.Course6]: {},
        [XLSCourseHoursEnum.Course7]: {},
      },
      [XLSWeekdaysEnum.Wednesday]: {
        [XLSCourseHoursEnum.Course1]: {},
        [XLSCourseHoursEnum.Course2]: {},
        [XLSCourseHoursEnum.Course3]: {},
        [XLSCourseHoursEnum.Course4]: {},
        [XLSCourseHoursEnum.Course5]: {},
        [XLSCourseHoursEnum.Course6]: {},
        [XLSCourseHoursEnum.Course7]: {},
      },
      [XLSWeekdaysEnum.Thursday]: {
        [XLSCourseHoursEnum.Course1]: {},
        [XLSCourseHoursEnum.Course2]: {},
        [XLSCourseHoursEnum.Course3]: {},
        [XLSCourseHoursEnum.Course4]: {},
        [XLSCourseHoursEnum.Course5]: {},
        [XLSCourseHoursEnum.Course6]: {},
        [XLSCourseHoursEnum.Course7]: {},
      },
      [XLSWeekdaysEnum.Friday]: {
        [XLSCourseHoursEnum.Course1]: {},
        [XLSCourseHoursEnum.Course2]: {},
        [XLSCourseHoursEnum.Course3]: {},
        [XLSCourseHoursEnum.Course4]: {},
        [XLSCourseHoursEnum.Course5]: {},
        [XLSCourseHoursEnum.Course6]: {},
        [XLSCourseHoursEnum.Course7]: {},
      },
    };

    for (const day of Object.keys(this.weekdaysHoursRows)) {
      for (const hour of Object.keys(this.weekdaysHoursRows[day])) {
        groupWeeklySchedule[day][hour] = this.getCourseInfo(groupColumn, this.weekdaysHoursRows[day][hour]);
      }
    }

    return {
      groupName,
      weeklySchedule: groupWeeklySchedule,
    };
  }
}
