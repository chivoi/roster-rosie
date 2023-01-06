import { Request, Response } from 'express';
import roster from '../files/ocean-roster.json';
import { readDutyFile, writeDutyFile } from '../helper/s3Bucket';
import { Ceremony } from '../interfaces';

const rosterMembers = roster.members

const rotateLead = async (newLeadIndex?: number, ceremony?: Ceremony) => {
  let dutyObject = await readDutyFile();
  const { next, retroNext } = dutyObject;
  if (ceremony === 1) { // if it's a retro
    const newRetroCurrent = newLeadIndex || retroNext;
    const newRetroNext = (newRetroCurrent + 1) % rosterMembers.length;
    dutyObject = {
      retroCurrent: newRetroCurrent,
      retroNext: newRetroNext,
      ...dutyObject
    };
  } else { // if no ceremony specified, the default is standup
    const newCurrent = newLeadIndex || next;
    const newNext = (newCurrent + 1) % rosterMembers.length;
    dutyObject = { current: newCurrent, next: newNext, ...dutyObject };
  }
  await writeDutyFile(dutyObject);
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
    const message = `===== The current lead is updated to ${rosterMembers[next].name} =====`;
    console.log(message);
    res.send(message);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
};

// Retro things

const getCurrentRetroLead = async (req: Request, res: Response) => {
  const { retroCurrent } = await readDutyFile();
  if (!retroCurrent) retroCurrent === 0;
  res.send(rosterMembers[retroCurrent]?.name);
};

const getNextRetroLead = async (req: Request, res: Response) => {
  const { retroNext } = await readDutyFile();
  if (!retroNext) retroNext === 1;
  res.send(rosterMembers[retroNext]?.name);
};

const updateRetroLeadByIndex = async (req: Request, res: Response) => {
  try {
    const leadIndex = parseInt(req.params.id as string);
    if (leadIndex > rosterMembers.length - 1) {
      res.send({ error: 'Lead Index is greater than the number of team members in ocean' });
    }
    await rotateLead(leadIndex, 1);
    const message = `The current sprint review and retro lead is updated to ${rosterMembers[leadIndex]?.name}`;
    console.log(`===== ${message} =====`);
    res.send(message);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
};

const updateNextRetroLead = async (req: Request, res: Response) => {
  try {
    const { retroNext } = await readDutyFile();
    await rotateLead(retroNext, 1);
    const message = `===== The current lead is updated to ${rosterMembers[retroNext].name} =====`;
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
  updateNextLead,
  getCurrentRetroLead,
  getNextRetroLead,
  updateRetroLeadByIndex,
  updateNextRetroLead
};
