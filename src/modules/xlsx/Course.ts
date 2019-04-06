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

  getCourseTeacher(info: string): string | undefined {
    const infoArray = info.split('\n');
    return infoArray.find(str => !!str.match(/[A-Z]\./) && !!str.match(/[A-Z][a-z]/)); // if match "D. Strainu" or "D.Strainu"
  }

  getCourseRoom(info: string): string | undefined {
    const infoArray = info.split('\n');
    return infoArray.find(str => !!str.match(/\d/));
  }

  stringToCourseDetails(courseType: string) {
    const courseTypeStr = courseType + 'String';
    this.courseInfo[courseType] = {
      name: this.getCourseName(this.courseInfo[courseTypeStr]),
      teacher: this.getCourseTeacher(this.courseInfo[courseTypeStr]),
      room: this.getCourseRoom(this.courseInfo[courseTypeStr]),
    };
    delete this.courseInfo[courseTypeStr];
  }

  getCourseInfo(): ICourseInfo {
    if (this.courseInfo.stableString) {
      this.stringToCourseDetails('stable');
    } else {
      if (this.courseInfo.oddString) {
        this.stringToCourseDetails('odd');
      }
      if (this.courseInfo.evenString) {
        this.stringToCourseDetails('even');
      }
    }
    return this.courseInfo;
  }
}
