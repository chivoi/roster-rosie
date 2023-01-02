import { Request, Response } from 'express';
import roster from '../files/ocean-roster.json';
import { readDutyFile } from '../helper/s3Bucket';
import axios from 'axios';
import { rotateLead } from './member';

const rosterMembers = roster.members;

export const postSlackMessage = async (req: Request, res: Response) => {
  try {
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

  // rotate the lead after posting on Thursday, cause cyclic.sh TZ is likely UTC
  const today = new Date();
  if (today.getDay() === 4) await rotateLead();

};

export const postSlackMessageRetro = async (req: Request, res: Response) => {
  try {
    // rotate retro lead on Tuesday
    const { retroCurrent, retroNext } = await readDutyFile();
    const currentLead = rosterMembers[retroCurrent];
    const nextLead = rosterMembers[retroNext];

    axios
      .post(process.env.SLACK_WEBHOOK_URL!, {
        standup_lead: currentLead.slackID,
        next: nextLead.slackID,
      })
      .then(async () => {
        res.send(`===== Sent slack message, retro/sprint review lead is ${currentLead.name} =====`);
        rotateLead(retroNext, 1)
      })
      .catch((e) => {
        console.log(e.status);
      });
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
}
