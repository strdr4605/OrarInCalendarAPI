import { CellObject } from 'xlsx/types';
import { ICourse, ICourseInfo } from './interface';

export class Course implements ICourse {
  courseInfo: ICourseInfo = {};
  isEven: boolean = false;
  isStable: boolean = false;
  isOdd: boolean = false;
  constructor(private readonly cells: CellObject[]) {
    this.isStable = !cells[0] && !cells[5];
    this.isOdd = !!cells[0];
    this.isEven = !!cells[3];
    if (this.isStable) {
      this.courseInfo.stableString = this.getStableCourseString().length > 0 ? this.getStableCourseString() : undefined;
      // tslint:disable-next-line:no-debugger
      debugger;
    } else {
      if (this.isOdd) {
        this.courseInfo.oddString = this.getEvenOrOddCourseString(0);
      }
      if (this.isEven) {
        this.courseInfo.evenString = this.getEvenOrOddCourseString(3);
        // tslint:disable-next-line:no-debugger
        debugger;
      }
    }
  }

  getEvenOrOddCourseString(startCell: number): string {
    let info: string = this.cells[startCell].w + '\n';
    if (this.cells[startCell + 1]) {
      info += this.cells[startCell + 1].w + '\n';
    }
    if (this.cells[startCell + 2]) {
      info += this.cells[startCell + 2].w + '\n';
    }
    return info;
  }

  getStableCourseString(): string {
    const res = this.cells.reduce((info: string, cellObj: CellObject) => info + (cellObj ? `${cellObj.w}\n` : ''), '');
    return res;
  }

  getCourseName(info: string): string {
    return info.split('\n')[0];
  }
  getCourseTeacher(info: string): string {
    return info.split('\n')[1];
  }
  getCourseRoom(info: string): string {
    return info.split('\n')[2];
  }
  getCourseInfo(): ICourseInfo {
    if (this.courseInfo.stableString) {
      this.courseInfo.stable = {
        name: this.getCourseName(this.courseInfo.stableString),
        room: this.getCourseRoom(this.courseInfo.stableString),
      };
      const teacher: string = this.getCourseTeacher(this.courseInfo.stableString);
      if (teacher.length && !teacher.match(/\d/)) {
        this.courseInfo.stable.teacher = teacher;
      }
      this.courseInfo.stable.room =
        this.courseInfo.stable.room && this.courseInfo.stable.room.length ? this.courseInfo.stable.room : teacher.match(/\d/) ? teacher : undefined;
      delete this.courseInfo.stableString;
    }
    if (this.courseInfo.oddString) {
      this.courseInfo.odd = {
        name: this.getCourseName(this.courseInfo.oddString),
        room: this.getCourseRoom(this.courseInfo.oddString),
      };
      const teacher: string = this.getCourseTeacher(this.courseInfo.oddString);
      if (teacher.length && !teacher.match(/\d/)) {
        this.courseInfo.odd.teacher = teacher;
      }
      this.courseInfo.odd.room =
        this.courseInfo.odd.room && this.courseInfo.odd.room.length ? this.courseInfo.odd.room : teacher.match(/\d/) ? teacher : undefined;
      delete this.courseInfo.oddString;
    }
    if (this.courseInfo.evenString) {
      this.courseInfo.even = {
        name: this.getCourseName(this.courseInfo.evenString),
        teacher: this.getCourseTeacher(this.courseInfo.evenString),
        room: this.getCourseRoom(this.courseInfo.evenString),
      };
      const teacher: string = this.getCourseTeacher(this.courseInfo.evenString);
      if (teacher.length && !teacher.match(/\d/)) {
        this.courseInfo.even.teacher = teacher;
      }
      this.courseInfo.even.room =
        this.courseInfo.even.room && this.courseInfo.even.room.length ? this.courseInfo.even.room : teacher.match(/\d/) ? teacher : undefined;
      delete this.courseInfo.evenString;
    }
    return this.courseInfo;
  }
}
