import { Event, RequestHandler, RequestHandlerWithParam, TuesdayCount } from '../interfaces';
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

export const validateEventType = (req: Request, next: RequestHandlerWithParam<string>): Response | Promise<Response> => {
  const event = new URL(req.url).searchParams.get('event');
  if (event && Object.keys(Event).includes(event)) {
    return next(event);
  } else {
    return new Response('Invalid event type. Valid types: retro or standup', { status: 400 });
  }
};

export const validateNumberParam = (paramName: string, req: Request, next: RequestHandlerWithParam<number>): Response | Promise<Response> => {
  const param = new URL(req.url).searchParams.get(paramName);
  if (param !== null && param !== undefined && !isNaN(parseInt(param))) {
    return next(parseInt(param));
  } else {
    return new Response('Invalid id', { status: 400 });
  }
};

export const isThisRetroDay = async (req: Request, next: RequestHandler): Promise<Response> => {
  const event = new URL(req.url).searchParams.get('event');
  let tuesdayCount = await readTuesdayCountFile();
  const today = new Date();

  // Any other day except Tuesday - post standup
  if (event == (Event.standup as string) && today.getDay() !== 1) {
    return next();
  }

  // Tuesdays (Monday in UTC)
  if (today.getDay() == 1) {
    // regular Tuesday - post standup, no post retro
    if (!tuesdayCount.count) {
      if (event == (Event.standup as string)) {
        console.log('Non-retro Tuesday, posting Standup lead');
        return next();
      } else if (event == (Event.retro as string)) {
        // change Tuesday count to 1 to post next week
        const newTuesdayCount: TuesdayCount = { count: 1 };
        try {
          // write it into file
          await writeFile(newTuesdayCount, 'tuesday-count');
          // don't post, just send response
          return new Response("Not posting to Slack, because it's not sprint review/retro Tuesday");
        } catch (e) {
          return new Response("Tuesday count file didn't write, because " + e);
        }
      }
    }

    // retro Tuesday - post retro, no post standup
    if (tuesdayCount.count) {
      // change Tuesday count to 0
      const newTuesdayCount: TuesdayCount = { count: 0 };
      // write it in file
      try {
        await writeFile(newTuesdayCount, 'tuesday-count');
        // Post to Slack
        return next();
      } catch (e) {
        return new Response("Tuesday count file didn't write, because " + e);
      }
    }
  }

  return new Response('Who knows?', { status: 500 });
};
