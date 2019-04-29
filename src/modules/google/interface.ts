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
  recurrence?: string[];
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

export interface IEventsList {
  kind: string;
  items: IEvent[];
}

export interface IEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: Date;
  updated: Date;
  summary: string;
  description: string;
  recurrence: string[];
  iCalUID: string;
  sequence: number;
}
