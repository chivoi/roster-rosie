import { Request, Response } from 'express';
import roster from '../files/ocean-roster.json';
import { readDutyFile } from '../helper/s3Bucket';
import axios from 'axios';
import { rotateLead } from './member';
import { Event } from "../interfaces"

const rosterMembers = roster.members;

export const postSlackMessage = async (req: Request, res: Response) => {
  try {
    const { event } = req.params;
    const { current, next } = await readDutyFile(req.params.event);
    const currentLead = rosterMembers[current];
    const nextLead = rosterMembers[next];

    axios
      .post(event === (Event.standup as string)
        ? process.env.SLACK_WEBHOOK_URL!
        : process.env.RETRO_SLACK_WEBHOOK_URL!,
        {
          current: currentLead.slackID,
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