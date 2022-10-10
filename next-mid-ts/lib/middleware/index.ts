import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
// import { maybeReproPlugin } from './plugins/maybe-repro';
import { alwaysReproPlugin } from './plugins/always-repro';

export default async function middleware(
  req: NextRequest,
  ev: NextFetchEvent
): Promise<NextResponse> {
  const response = NextResponse.next();

  return Promise.resolve(response).then(() => alwaysReproPlugin.exec());
  // return Promise.resolve(response).then(() => maybeReproPlugin.exec());
}
