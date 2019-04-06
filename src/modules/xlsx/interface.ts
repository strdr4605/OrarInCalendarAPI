import { CellObject } from 'xlsx/types';

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

export enum WeekdaysEnumEN {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  // Saturday = 'Saturday',
  // Sunday = 'Sunday',
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

export interface ICourseDetails {
  name: string;
  teacher?: string;
  room?: string;
}

export interface ICourseInfo {
  stable?: ICourseDetails;
  even?: ICourseDetails;
  odd?: ICourseDetails;
  stableString?: string;
  evenString?: string;
  oddString?: string;
}

export interface ICourse {
  courseInfo: ICourseInfo;
  isStable: boolean;
  isEven: boolean;
  isOdd: boolean;
  getStableCourseString(): string;
  getEvenOrOddCourseString(startCell: number): string;
  getCourseName(info: string): string;
  getCourseTeacher(info: string): string;
  getCourseRoom(info: string): string;
  getCourseInfo(): ICourseInfo;
}

export interface IGroupSchedule {
  groupName: string;
  weeklySchedule: GroupWeeklySchedule;
}

export type WeekdaysHoursRows = { [key in XLSWeekdaysEnum]: { [key2 in XLSCourseHoursEnum]: number } };
export type GroupWeeklySchedule = { [key in WeekdaysEnumEN]: { [key2 in XLSCourseHoursEnum]: ICourseInfo } };
