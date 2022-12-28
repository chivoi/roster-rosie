import roster from "./files/ocean-roster.json";
import schedule from 'node-schedule';
import axios from 'axios';
import path from "path";

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// @TODO:
// - If the app dies on Friday, it will not update.
//    - Check if it's Friday/Monday => yes => write new current lead to file

// - Changes to the list (in case someone's on holiday)
//    - is it possible as a step in Slack workflow?

// - TOKEN REVOKED error we need to deal with it

interface TeamMember {
  name: string,
  slackID: string
}


const SLACK_WEBHOOK_URL: string = process.env.WEBHOOK_URL || '';
if (!SLACK_WEBHOOK_URL) {
  throw new Error("Failed to load env config")
}


const rosterMembers: TeamMember[] = roster.members;
let currentLeadIndex: number = 0;
let nextLeadIndex: number = 1;

const rotateLead = (): void => {
  currentLeadIndex = nextLeadIndex;
  nextLeadIndex = (nextLeadIndex + 1) % rosterMembers.length
}

const reportLeadJob = schedule.scheduleJob('0 08 * * *', () => {
  const currentLead = rosterMembers[currentLeadIndex];
  const nextLead = rosterMembers[nextLeadIndex];

  // rotate the lead on Monday
  const today = new Date();
  if (today.getDay() === 1) {
    rotateLead();
  }

  // post the lead and next info to Slack
  axios.post(SLACK_WEBHOOK_URL, {
    standup_lead: currentLead.slackID,
    next: nextLead.slackID
  }).then(response => {
    console.log(response.status)
  }).catch(e => {
    console.log(e.status)
  })
})

reportLeadJob.invoke();