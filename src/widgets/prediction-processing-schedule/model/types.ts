export interface ScheduleEvent {
  id: string;
  dayOfWeek: string;
  dayOfMonth: string;
  title: string;
  formattedTime: string;
}

export interface CalendarDay {
  id: string;
  value: number;
  disabled: boolean;
  selected: boolean;
}
