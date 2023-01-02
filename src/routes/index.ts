import { Express } from 'express';
import * as Member from '../controller/member';
import * as Message from '../controller/message';

export const loadRoutes = (app: Express) => {
  app.get('/api/all-team-member', Member.getAllMembers);

  app.get('/api/current-lead', Member.getCurrentLead);

  app.get('/api/duty', Member.getDuty);

  app.get('/api/next-lead', Member.getNextLead);

  app.post('/api/lead/:id', Member.updateLeadByIndex);

  app.post('/api/rotate-lead', Member.updateNextLead);

  app.post('/api/message-slack', Message.postSlackMessage);

  // Retro

  // @TODO GET routes don't work cause no retro lead is initially written to the doc. When POST routes work it should be fine.

  app.get('/api/retro/current-lead', Member.getCurrentRetroLead);

  app.get('/api/retro/next-lead', Member.getNextRetroLead);

  app.post('/api/retro/lead/:id', Member.updateRetroLeadByIndex);

  app.post('/api/retro/rotate-lead', Member.updateNextRetroLead);

  app.post('/api/retro/message-slack', Message.postSlackMessageRetro);

};
