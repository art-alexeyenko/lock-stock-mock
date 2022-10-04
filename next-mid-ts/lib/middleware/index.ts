import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { redirectsPlugin } from './plugins/redirects';

export interface MiddlewarePlugin {
  /**
   * Detect order when the plugin should be called, e.g. 0 - will be called first (can be a plugin which data is required for other plugins)
   */
  order: number;
  /**
   * A middleware to be called, it's required to return @type {NextResponse} for other middlewares
   */
  exec(req: NextRequest, res?: NextResponse, ev?: NextFetchEvent): Promise<NextResponse>;
}

export default async function middleware(
  req: NextRequest,
  ev: NextFetchEvent
): Promise<NextResponse> {
  const response = NextResponse.next();

  return Promise.resolve(response).then(() => redirectsPlugin.exec(req));
}
