import { readTuesdayCountFile, writeFile } from '../src/helper/s3Bucket';
import { validateNumberParam } from '../src/helper/validator';
import { TuesdayCount } from '../src/interfaces';

export async function GET(req: Request): Promise<Response> {
  const rawJson = await readTuesdayCountFile();
  return new Response(rawJson);
}

export async function POST(req: Request): Promise<Response> {
  return validateNumberParam('id', req, async (countToSet) => {
    const body: TuesdayCount = { count: countToSet };
    await writeFile(body, 'tuesday-count');
    return new Response(`Tuesday count set to: ${countToSet}`, { status: 200 });
  });
}
