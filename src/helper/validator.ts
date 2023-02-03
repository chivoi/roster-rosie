import { NextFunction, Request, Response } from "express";
import { Event } from "../interfaces";
import { readTuesdayCountFile, writeFile } from './s3Bucket';

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

export const isThisRetroDay = async (req: Request, res: Response, next: NextFunction) => {
  const { event } = req.params;
  const today = new Date();
  let tuesdayCount = await readTuesdayCountFile();

  // 1 || 2 is to account for both UTC and AEST
  if (event == Event.standup as string) {
    res.send("Posting standup lead to Slack")
    next();
  } else if (tuesdayCount.count) {
    console.log("Tuesday count before: " + JSON.stringify(tuesdayCount))
    console.log("Tuesday count count: " + tuesdayCount.count)

    const newTuesdayCount = { "count": 0 };
    try {
      await writeFile(newTuesdayCount, 'tuesday-count');
      console.log("These are contents of the file now")
      console.log(JSON.stringify(await readTuesdayCountFile()))
      next();
    } catch (e) {
      res.send("Tuesday count file didn't write")
      console.log(e)
    }
  } else if (!tuesdayCount.count) {
    console.log("Tuesday count before: " + JSON.stringify(tuesdayCount))
    console.log("Tuesday count count: " + tuesdayCount.count)

    const newTuesdayCount = { "count": 1 };
    try {
      await writeFile(newTuesdayCount, 'tuesday-count')
      console.log("These are contents of the file now")
      console.log(JSON.stringify(await readTuesdayCountFile()))
      res.send("Not posting to Slack, because it's not sprint review/retro Tuesday")
    } catch (e) {
      res.send("Tuesday count file didn't write")
      console.log(e)
    }
  }
}