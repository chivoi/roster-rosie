import { readDutyFile } from '../src/helper/s3Bucket';
import { validateEventType } from '../src/helper/validator';

export async function GET(req: Request): Promise<Response> {
  return validateEventType(req, async (event) => {
    const rawJson = await readDutyFile(event!);
    return new Response(rawJson);
  });
}
