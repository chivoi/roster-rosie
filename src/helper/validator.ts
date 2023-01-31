import { NextFunction, Request, Response } from "express";
import { Event } from "../interfaces";
import tuesdayCount from '../files/tuesday-count.json';
import { writeFile } from "fs";

const path = './src/files/tuesday-count.json';


export const validateEnv = () => {
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  const RETRO_SLACK_WEBHOOK_URL = process.env.S3_BUCKET_NAME;
  if (!SLACK_WEBHOOK_URL || !S3_BUCKET_NAME || !RETRO_SLACK_WEBHOOK_URL) {
    console.warn('Missing required env');
    return false;
  }
  return true;
};

export const validateEventType = (req: Request, res: Response, next: NextFunction) => {
  const { event } = req.params;
  if (Object.keys(Event).includes(event)) {
    next()
  } else {
    res.status(400).send("Invalid event type. Valid types: retro or standup")
  };
}

export const isThisRetroDay = (req: Request, res: Response, next: NextFunction) => {
  const { event } = req.params;
  const today = new Date();
  // 1 || 2 is to account for both UTC and AEST
  if ((event !== Event.retro as string) || (today.getDay() !== (1 || 2))) {
    console.log("It's not Tuesday or not retro day. Going to the next function")
    next();
  }

  if (tuesdayCount) {
    const newTuesdayCount = {
      "count": 0
    };
    try {
      writeFile(path, JSON.stringify(newTuesdayCount, null, 2), () => {
        console.log("Updated Tuesday count");
      });
      next();
    } catch {
      res.status(400).send("Could not update Tuesday count")
    }
  } else {
    const newTuesdayCount = {
      "count": 1
    };
    try {
      writeFile(path, JSON.stringify(newTuesdayCount, null, 2), () => {
        console.log("Updated Tuesday count");
      });
      res.send("Not posting to Slack, because it's not sprint review/retro Tuesday")
    } catch {
      res.status(400).send("Could not update Tuesday count")
    }
  }
}