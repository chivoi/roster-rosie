import schedule, { Job, Range } from 'node-schedule';
import { rotateLead } from './member';
import axios from 'axios/index';
import { TeamMember } from '../interfaces';
import roster from '../files/ocean-roster.json';
import { readDutyFile } from '../helper/s3Bucket';

const rosterMembers: TeamMember[] = roster.members;

const RULE = {
  HOUR: 10,
  MINUTE: 16,
  RANGE: new Range(1, 5),
  TZ: 'Australia/Melbourne',
  ROTATE_DAY: 1,
};

export const scheduleTask = (): Job => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = RULE.HOUR;
  rule.minute = RULE.MINUTE;
  rule.dayOfWeek = RULE.RANGE;
  rule.tz = RULE.TZ;
  return schedule.scheduleJob(rule, async () => {
    const { next, current } = await readDutyFile();
    // rotate the lead on Monday
    const today = new Date();
    if (today.getDay() === RULE.ROTATE_DAY) {
      await rotateLead(next);
    }

    const currentLead = rosterMembers[current];
    const nextLead = rosterMembers[next];
    // post the lead and next info to Slack!
    axios
      .post(process.env.SLACK_WEBHOOK_URL!, {
        standup_lead: currentLead.slackID,
        next: nextLead.slackID,
      })
      .then((response) => {
        console.log(`===== Sent slack message, stand-up lead is ${currentLead.name} =====`);
      })
      .catch((e) => {
        console.log(e.status);
      });
  });
};
