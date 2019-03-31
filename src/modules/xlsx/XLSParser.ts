import { CellObject, WorkSheet } from 'xlsx/types';
import { COURSE_SPACE, GROUPS, IWeekdaysHoursRows, XLSCourseHoursEnum, XLSWeekdaysEnum } from './interface';
import { COLUMN_REGEX, GROUP_NAME_REGEX, NUMBER_REGEX, rowRegex } from './regex';
import { XLSUtils } from './XLSUtils';

/**
 * Used for parsing and extracting data from XLS docs
 * @class
 */
export class XLSParser {
  groupsRow: number;
  groupsColumns: Record<string, string>;
  weekdaysHoursRows: IWeekdaysHoursRows;

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
}
