import roster from './files/ocean-roster.json';
import schedule, { Job, Range } from 'node-schedule';
import axios from 'axios';
import path from 'path';
import { TeamMember } from './interfaces';
import express from 'express';
import fs from 'fs';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SLACK_WEBHOOK_URL = process.env.WEBHOOK_URL;
if (!SLACK_WEBHOOK_URL) {
  console.warn('Failed to load env config');
}

const app = express();
const rosterMembers: TeamMember[] = roster.members;
let currentLeadIndex: number;
let nextLeadIndex: number;

const readRoaster = async () => {
  const rawData = await fs.readFileSync(path.resolve(__dirname, '../duty.json'));
  const rawJson = JSON.parse(rawData.toString());
  currentLeadIndex = rawJson.current;
  nextLeadIndex = rawJson.next;
};

const writeRoaster = (current: number, next: number) => {
  const newDuty = {
    current,
    next,
  };
  try {
    fs.writeFileSync(path.resolve(__dirname, '../duty.json'), JSON.stringify(newDuty), 'utf-8');
  } catch (err) {
    throw err
  }
};

app.listen(3000, async () => {
  await readRoaster();
  console.log('===== App starts =====');
  scheduleTask();
  console.log('===== Schedule Task =====');
});

app.get('/api/all-team-member', (req, res) => {
  res.send(roster);
});

app.get('/api/current-lead', (req, res) => {
  res.send(rosterMembers[currentLeadIndex]?.name);
});

app.get('/api/next-lead', (req, res) => {
  res.send(rosterMembers[nextLeadIndex]?.name);
});

app.post('/api/lead/:id', (req, res) => {
  try {
    const leadIndex = parseInt(req.params.id as string);
    if (leadIndex > rosterMembers.length - 1) {
      res.send({ error: 'Lead Index is greater than the number of team member in ocean' });
    }
    rotateLead(leadIndex);
    const message = `The current lead is updated to ${rosterMembers[currentLeadIndex]?.name}`;
    console.log(`===== ${message} =====`);
    res.send(message);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});

app.post('/api/lead/next', (req, res) => {
  try {
    rotateLead(nextLeadIndex);
    const message = `The current lead is updated to ${rosterMembers[nextLeadIndex].name}`;
    console.log(`===== ${message} =====`);
    res.send(message);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});

const rotateLead = (newLeadIndex: number): void => {
  currentLeadIndex = newLeadIndex || nextLeadIndex;
  nextLeadIndex = (currentLeadIndex + 1) % rosterMembers.length;
  // writeRoaster(currentLeadIndex, newLeadIndex);
};

const scheduleTask = (): Job => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 8;
  rule.minute = 0;
  rule.dayOfWeek = new Range(1, 5);
  rule.tz = 'Australia/Melbourne';
  return schedule.scheduleJob(rule, () => {
    // rotate the lead on Monday
    const today = new Date();
    if (today.getDay() === 1) {
      rotateLead(nextLeadIndex);
    }

    const currentLead = rosterMembers[currentLeadIndex];
    const nextLead = rosterMembers[nextLeadIndex];
    // post the lead and next info to Slack!
    axios
      .post(SLACK_WEBHOOK_URL!, {
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
