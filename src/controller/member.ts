import { Request, Response } from 'express';
import roster from '../files/ocean-roster.json';
import { readDutyFile, writeFile } from '../helper/s3Bucket';

const rosterMembers = roster.members

const rotateLead = async (event: string, newLeadIndex?: number) => {
  let dutyObject = await readDutyFile(event);
  const { next } = dutyObject;

  const newCurrent = newLeadIndex || next;
  const newNext = (newCurrent + 1) % rosterMembers.length;
  dutyObject = { current: newCurrent, next: newNext };

  await writeFile(dutyObject, event);
};

const getAllMembers = (req: Request, res: Response) => {
  res.send(roster);
};

const getCurrentLead = async (req: Request, res: Response) => {
  const { event } = req.params;
  const { current } = await readDutyFile(event);
  res.send(rosterMembers[current]?.name);
};

const getDuty = async (req: Request, res: Response) => {
  const { event } = req.params;
  const rawJson = await readDutyFile(event);
  res.send(rawJson);
};

const getNextLead = async (req: Request, res: Response) => {
  const { event } = req.params;
  const { next } = await readDutyFile(event);
  res.send(rosterMembers[next]?.name);
};

const updateLeadByIndex = async (req: Request, res: Response) => {
  try {
    const leadIndex = parseInt(req.params.id as string);
    if (leadIndex > rosterMembers.length - 1) {
      res.send({ error: 'Lead Index is greater than the number of team member in ocean' });
    }
    await rotateLead(req.params.event, leadIndex);
    const message = `The current lead is updated to ${rosterMembers[leadIndex]?.name}`;
    console.log(`===== ${message} =====`);
    res.send(message);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
};

const updateNextLead = async (req: Request, res: Response) => {
  try {
    const { event } = req.params;
    const { next } = await readDutyFile(event);
    await rotateLead(event, next);
    const message = `===== The current lead is updated to ${rosterMembers[next].name} =====`;
    console.log(message);
    res.send(message);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
};

export {
  rotateLead,
  getAllMembers,
  getCurrentLead,
  getDuty,
  getNextLead,
  updateLeadByIndex,
  updateNextLead
};
