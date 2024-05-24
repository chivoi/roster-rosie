import { validateEnv } from './src/helper/validator';

export default function middleware(request: Request) {
  if (!validateEnv()) {
    return new Response('Invalid environment variable', { status: 500 });
  }
}
