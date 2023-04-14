import { Express } from 'express';
import * as Member from '../controller/member';
import * as Message from '../controller/message';
import { isThisRetroDay, validateEventType } from '../helper/validator';

export const loadRoutes = (app: Express) => {
  app.get('/api/all-team-member', Member.getAllMembers);

  app.get('/api/current-lead/:event', validateEventType, Member.getCurrentLead);

  app.get('/api/duty/:event', validateEventType, Member.getDuty);

  app.get('/api/tuesdaycount', Member.getTuesdayCount);

  app.get('/api/next-lead/:event', validateEventType, Member.getNextLead);

  app.post('/api/lead/:event/:id', validateEventType, Member.updateLeadByIndex);

  app.post('/api/rotate-lead/:event', validateEventType, Member.updateNextLead);

  app.post('/api/message-slack/:event', validateEventType, isThisRetroDay, Message.postSlackMessage);
};
