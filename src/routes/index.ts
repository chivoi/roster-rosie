import { Express } from 'express';
import * as Member from '../controller/member';
import * as Message from '../controller/message';

export const loadRoutes = (app: Express) => {
  app.get('/api/all-team-member', Member.getAllMembers);

  app.get('/api/current-lead', Member.getCurrentLead);

  app.get('/api/duty', Member.getDuty);

  app.get('/api/next-lead', Member.getNextLead);

  app.post('/api/lead/:id', Member.updateLeadByIndex);

  app.post('/api/lead/next', Member.updateNextLead);

  app.post('/api/message-slack', Message.postSlackMessage);
};
