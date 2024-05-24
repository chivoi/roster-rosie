import { readDutyFile, writeFile } from './s3Bucket';
import roster from '../files/ocean-roster.json';

export async function rotateLead(event: string, newLeadIndex?: number) {
  let dutyObject = await readDutyFile(event);
  const { next } = dutyObject;

  const newCurrent = newLeadIndex || next;
  const newNext = (newCurrent + 1) % roster.members.length;
  dutyObject = { current: newCurrent, next: newNext };

  await writeFile(dutyObject, event);
}
