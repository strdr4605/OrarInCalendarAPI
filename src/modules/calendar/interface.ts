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
