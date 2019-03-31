export const GROUPS = 'Grupele';
export const COURSE_SPACE = 6; // number of rows for each course

export enum XLSWeekdaysEnum {
  Monday = 'Luni',
  Tuesday = 'Marţi',
  Wednesday = 'Miercuri',
  Thursday = 'Joi',
  Friday = 'Vineri',
  // Saturday = 'Sâmbătă',
  // Sunday = 'Duminică',
}

export enum XLSCourseHoursEnum {
  Course1 = '8.00-9.30',
  Course2 = '9.45-11.15',
  Course3 = '11.30-13.00',
  Course4 = '13.30-15.00',
  Course5 = '15.15-16.45',
  Course6 = '17.00-18.30',
  Course7 = '18.45-20.15',
}

export interface IRangeMap {
  start: string;
  end: string;
}

export type IWeekdaysHoursRows = { [key in XLSWeekdaysEnum]: { [key2 in XLSCourseHoursEnum]: number } };
