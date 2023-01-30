import { NextFunction, Request, Response } from "express";
import { Event } from "../interfaces";

let TUESDAY_COUNTER = 1;

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
  if ((today.getDay() !== (1 || 2)) || (event !== Event.retro as string)) next();

  if (TUESDAY_COUNTER) {
    TUESDAY_COUNTER = 0;
    next();
  } else {
    TUESDAY_COUNTER = 1;
    res.send("Not posting to Slack, because it's not sprint review/retro Tuesday")

  }
}