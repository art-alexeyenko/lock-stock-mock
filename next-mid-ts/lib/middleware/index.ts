import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { samplePlugin } from './plugins/sample-plugin';
// import { redirectsPlugin } from './plugins/redirects';

export default async function middleware(
  req: NextRequest,
  ev: NextFetchEvent
): Promise<NextResponse> {
  const response = NextResponse.next();

  // return Promise.resolve(response).then(() => redirectsPlugin.exec(req));
  return Promise.resolve(response).then(() => samplePlugin.exec(req));
}
