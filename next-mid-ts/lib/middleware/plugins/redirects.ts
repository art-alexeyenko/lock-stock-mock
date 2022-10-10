import { NextRequest, NextResponse } from 'next/server';
import { RedirectsMiddleware } from '../../helpers/redirects-middleware';
import { MiddlewarePlugin } from '..';

class RedirectsPlugin implements MiddlewarePlugin {
  private redirectsMiddleware: RedirectsMiddleware;
  order = 0;

  constructor() {
    this.redirectsMiddleware = new RedirectsMiddleware({
      endpoint: process.env.FETCH_ENDPOINT || "https://lock-stock-mock.vercel.app/api",
    });
  }

  /**
   * exec async method - to find coincidence in url.pathname and redirects of site
   * @param req<NextRequest>
   * @returns Promise<NextResponse>
   */
  async exec(req: NextRequest): Promise<NextResponse> {
    return this.redirectsMiddleware.getHandler()(req);
  }
}

export const redirectsPlugin = new RedirectsPlugin();
