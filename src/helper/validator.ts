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
  let tuesdayCount = await readTuesdayCountFile();
  const today = new Date();

  // Any other day except Tuesday - post standup
  if ((event == Event.standup as string) && (today.getDay() !== 1)) {
    next();
  }

  // Tuesdays (Monday in UTC)
  if (today.getDay() == 1) {
    // regular Tuesday - post standup, no post retro
    if (!tuesdayCount.count) {
      if (event == Event.standup as string) {
        console.log("Non-retro Tuesday, posting Standup lead")
        next();
      } else if (event == Event.retro as string) {
        // change Tuesday count to 1 to post next week
        const newTuesdayCount = { "count": 1 };
        try {
          // write it into file
          await writeFile(newTuesdayCount, 'tuesday-count')
          console.log("These are contents of the file now")
          console.log(JSON.stringify(await readTuesdayCountFile()))
          // don't post, just send response
          res.send("Not posting to Slack, because it's not sprint review/retro Tuesday")
        } catch (e) {
          res.send("Tuesday count file didn't write")
          console.log(e)
        }
      }
    }

    // retro Tuesday - post retro, no post standup
    if (tuesdayCount.count) {
      // change Tuesday count to 0
      const newTuesdayCount = { "count": 0 };
      // write it in file
      try {
        await writeFile(newTuesdayCount, 'tuesday-count');
        console.log("These are contents of the Count file now")
        console.log(JSON.stringify(await readTuesdayCountFile()))
        // Post to Slack
        next();
      } catch (e) {
        res.send("Tuesday count file didn't write")
        console.log(e)
      }
    }
  }
}