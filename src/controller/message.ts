import { Request, Response } from 'express';
import roster from '../files/ocean-roster.json';
import { readDutyFile } from '../helper/s3Bucket';
import axios from 'axios';
import { rotateLead } from './member';

const rosterMembers = roster.members;

export const postSlackMessage = async (req: Request, res: Response) => {
  try {
    // rotate the lead
    const today = new Date();

    if (today.getDay() === 1) {
      await rotateLead();
    }

    const { current, next } = await readDutyFile();
    const currentLead = rosterMembers[current];
    const nextLead = rosterMembers[next];

    axios
      .post(process.env.SLACK_WEBHOOK_URL!, {
        standup_lead: currentLead.slackID,
        next: nextLead.slackID,
      })
      .then(async () => {
        res.send(`===== Sent slack message, stand-up lead is ${currentLead.name} =====`);
      })
      .catch((e) => {
        console.log(e.status);
      });
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
};
