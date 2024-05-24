import { readDutyFile } from '../src/helper/s3Bucket';
import roster from '../src/files/ocean-roster.json';
import { validateEventType } from '../src/helper/validator';

export async function GET(request: Request): Promise<Response> {
  return validateEventType(request, async (event) => {
    const { current } = await readDutyFile(event);
    return new Response(roster.members[current]?.name);
  });
}
