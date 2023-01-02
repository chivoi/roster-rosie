export interface TeamMember {
  name: string;
  slackID: string;
}

export enum Ceremony {
  standup,
  retro
}