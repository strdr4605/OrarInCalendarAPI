import { ICourseInfo, XLSCourseHoursEnum } from '../xlsx';

export type Day = { [key2 in XLSCourseHoursEnum]: ICourseInfo };
