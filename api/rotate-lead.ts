import { rotateLead } from '../src/helper/rotateLead';
import { validateEventType } from '../src/helper/validator';

export async function POST(request: Request): Promise<Response> {
  return await validateEventType(request, async (event) => {
    await rotateLead(event);
    return new Response(null, { status: 200 });
  });
}
