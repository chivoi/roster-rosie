import { readDutyFile } from '../src/helper/s3Bucket';
import { validateEventType } from '../src/helper/validator';
import roster from '../src/files/ocean-roster.json';
import { rotateLead } from '../src/helper/rotateLead';

export async function GET(req: Request): Promise<Response> {
  return await validateEventType(req, async (event) => {
    const { next } = await readDutyFile(event!);
    return new Response(roster[next]?.name);
  });
}

export function POST(req: Request) {
  return validateEventType(req, async (event) => {
    try {
      const { next } = await readDutyFile(event);
      await rotateLead(event, next);
      const message = `===== The current lead is updated to ${roster.members[next].name} =====`;
      console.log(message);
      return new Response(message);
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  });
}
