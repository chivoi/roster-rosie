import { validateEventType, validateNumberParam } from '../src/helper/validator';
import roster from '../src/files/ocean-roster.json';
import { rotateLead } from '../src/helper/rotateLead';

export async function POST(req: Request): Promise<Response> {
  return await validateEventType(req, async (event) => {
    return await validateNumberParam('id', req, async (leadIndex) => {
      try {
        if (leadIndex > roster.members.length - 1) {
          return new Response(JSON.stringify({ error: 'Lead Index is greater than the number of team member in ocean' }));
        }
        await rotateLead(event, leadIndex);
        const message = `The current lead is updated to ${roster.members[leadIndex]?.name}`;
        console.log(`===== ${message} =====`);
        return new Response(message);
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    });
  });
}
