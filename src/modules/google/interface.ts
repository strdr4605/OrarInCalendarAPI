export interface IAttendant {
  email: string;
}

export interface ICreateEvent {
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: IAttendant[];
  description?: string;
  summary?: string;
}

export interface ICalendarEntry {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  timeZone: string;
  colorId?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  selected?: boolean;
  accessRole?: string;
  defaultReminders?: any[];
}
export interface ICalendarsList {
  kind: string;
  items: ICalendarEntry[];
}
