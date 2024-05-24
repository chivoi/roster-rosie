export function GET(request: Request): Response | Promise<Response> {
  return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}
