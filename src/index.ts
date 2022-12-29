import roster from "./files/ocean-roster.json";
import schedule, {Job} from 'node-schedule';
import axios from 'axios';
import path from "path";
import {TeamMember} from "./interfaces";
import express from 'express'

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express()
const SLACK_WEBHOOK_URL: string | undefined = process.env.WEBHOOK_URL;
if (!SLACK_WEBHOOK_URL) {
  throw new Error("Failed to load env config")
}
const rosterMembers: TeamMember[] = roster.members;

let currentLeadIndex: number = 0;
let nextLeadIndex: number = 1;
let job: Job;

app.listen(3000, () => {
  console.log('===== App starts =====')
  job = scheduleTask()
  console.log('===== Schedule Task =====')
})

app.get('/api/all-team-member', ( req, res) => {
  res.send(roster)
})

app.get('/api/current-lead', ( req, res) => {
  res.send(rosterMembers[currentLeadIndex]?.name)
})

app.get('/api/next-lead', ( req, res) => {
  res.send( rosterMembers[nextLeadIndex]?.name)
})

app.post('/api/lead/:id', ( req, res) => {
  try {
    const leadIndex = parseInt(req.params.id as string)
    if (leadIndex > rosterMembers.length - 1) {
      res.send({error: "Lead Index is greater than the number of team member in ocean"})
    }
    rotateLead(leadIndex)
    const message =`The current lead is updated to ${rosterMembers[currentLeadIndex]?.name}`
    console.log(`===== ${message} =====`)
    res.send(message)
  } catch (err) {
    res.status(500).send({error: 'Invalid lead index number'})
  }
})

const rotateLead = (newLeadIndex: number): void => {
  currentLeadIndex = newLeadIndex || nextLeadIndex;
  nextLeadIndex = (currentLeadIndex + 1) % rosterMembers.length
}

const scheduleTask = (): Job => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 8;
  rule.minute = 0
  rule.tz = 'Australia/Melbourne';
  return schedule.scheduleJob(rule, () => {
    // rotate the lead on Monday
    const today = new Date();
    if (today.getDay() === 1) {
      rotateLead(nextLeadIndex);
    }

    const currentLead = rosterMembers[currentLeadIndex];
    const nextLead = rosterMembers[nextLeadIndex];
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
}

