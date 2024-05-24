import roster from '../src/files/ocean-roster.json';

export const GET = (req: Request): Response | Promise<Response> => {
  return new Response(JSON.stringify(roster));
};
