export type Schedule = { title: string; start: string; end: string };

export type EventInModal = {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  assigneeIds: string[];
};
