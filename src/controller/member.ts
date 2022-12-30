import { Request, Response } from 'express';
import roster from '../files/ocean-roster.json';
import { readDutyFile, writeDutyFile } from '../helper/s3Bucket';

const rosterMembers = roster.members;

const rotateLead = async (newLeadIndex: number) => {
  const { next } = await readDutyFile();
  const newCurrent = newLeadIndex || next;
  const newNext = (newCurrent + 1) % rosterMembers.length;
  await writeDutyFile({ current: newCurrent, next: newNext });
};

const getAllMembers = (req: Request, res: Response) => {
  res.send(roster);
};

const getCurrentLead = async (req: Request, res: Response) => {
  const { current } = await readDutyFile();
  res.send(rosterMembers[current]?.name);
};

const getDuty = async (req: Request, res: Response) => {
  const rawJson = await readDutyFile();
  res.send(rawJson);
};

const getNextLead = async (req: Request, res: Response) => {
  const { next } = await readDutyFile();
  res.send(rosterMembers[next]?.name);
};

const updateLeadByIndex = async (req: Request, res: Response) => {
  try {
    const leadIndex = parseInt(req.params.id as string);
    if (leadIndex > rosterMembers.length - 1) {
      res.send({ error: 'Lead Index is greater than the number of team member in ocean' });
    }
    await rotateLead(leadIndex);
    const message = `The current lead is updated to ${rosterMembers[leadIndex]?.name}`;
    console.log(`===== ${message} =====`);
    res.send(message);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
};

const updateNextLead = async (req: Request, res: Response) => {
  try {
    const { next } = await readDutyFile();
    await rotateLead(next);
    console.log(next);
    console.log(typeof next);
    console.log(rosterMembers[next]);
    const message = `The current lead is updated to ${rosterMembers[next].name}`;
    console.log(`===== ${message} =====`);
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
  updateNextLead,
};
