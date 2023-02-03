export interface TeamMember {
  name: string;
  slackID: string;
}

export enum Event {
  standup = "standup",
  retro = "retro"
}

export interface Duty {
  current: number;
  next: number;
}

export interface TuesdayCount {
  count: number;
}