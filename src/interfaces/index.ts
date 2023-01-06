export interface TeamMember {
  name: string;
  slackID: string;
}

export enum Event {
  standup = "standup",
  retro = "retro"
}