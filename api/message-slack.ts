import { readDutyFile } from '../src/helper/s3Bucket';
import { isThisRetroDay, validateEventType } from '../src/helper/validator';
import roster from '../src/files/ocean-roster.json';
import { Event } from '../src/interfaces';
import { rotateLead } from '../src/helper/rotateLead';

export async function POST(req: Request): Promise<Response> {
  return await validateEventType(req, async (event) => {
    return await isThisRetroDay(req, async () => {
      try {
        const { current, next } = await readDutyFile(event);
        const currentLead = roster.members[current];
        const nextLead = roster.members[next];
        console.log(`Ok read file, about to post. CurrentLead is ${currentLead}, next is ${nextLead}`);
        const url = event === (Event.standup as string) ? process.env.SLACK_WEBHOOK_URL! : process.env.RETRO_SLACK_WEBHOOK_URL!;
        const slackReq = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current: currentLead.slackID,
            next: nextLead.slackID,
          }),
        });
        const today = new Date();

        // rotate standup lead after posting on Thursday, cause cyclic.sh TZ is likely UTC
        // rotate retro lead every time this method is called with '/retro'
        if ((today.getDay() === 2 && event === (Event.standup as string)) || event === (Event.retro as string)) {
          await rotateLead(event);
        }

        return new Response(`===== Sent slack message, ${event} lead is ${currentLead.name} =====`);
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    });
  });
}
