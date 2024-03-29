import { Request, Response } from 'express';
import roster from '../files/ocean-roster.json';
import { readDutyFile } from '../helper/s3Bucket';
import axios from 'axios';
import { rotateLead } from './member';
import { Event } from "../interfaces"

const rosterMembers = roster.members;

export const postSlackMessage = async (req: Request, res: Response) => {
  const { event } = req.params;
  try {
    const { current, next } = await readDutyFile(event);
    const currentLead = rosterMembers[current];
    const nextLead = rosterMembers[next];
    console.log(`Ok read file, about to post. CurrentLead is ${currentLead}, next is ${nextLead}`)

    axios
      .post(event === (Event.standup as string)
        ? process.env.SLACK_WEBHOOK_URL!
        : process.env.RETRO_SLACK_WEBHOOK_URL!,
        {
          current: currentLead.slackID,
          next: nextLead.slackID,
        })
      .then(async () => {
        res.send(`===== Sent slack message, ${event} lead is ${currentLead.name} =====`);
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
  const today = new Date();
  // rotate standup lead after posting on Thursday, cause cyclic.sh TZ is likely UTC
  // rotate retro lead every time this method is called with '/retro'

  if ((today.getDay() === 2 && event === (Event.standup as string))
    || (event === (Event.retro as string))
  ) await rotateLead(event);
};