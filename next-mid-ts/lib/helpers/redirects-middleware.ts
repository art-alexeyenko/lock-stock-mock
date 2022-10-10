import { NextResponse, NextRequest } from 'next/server';
import {
  RedirectInfo,
  GraphQLRedirectsService,
  GraphQLRedirectsServiceConfig,
} from './graphql-redirects-service';

export class RedirectsMiddleware {
  private redirectsService: GraphQLRedirectsService;

  /**
   * @param {RedirectsMiddlewareConfig} [config] redirects middleware config
   */
  constructor(config: GraphQLRedirectsServiceConfig) {
    this.redirectsService = new GraphQLRedirectsService({ ...config, fetch: fetch });
  }

  /**
   * Gets the Next.js API route handler
   * @returns route handler
   */
  public getHandler(): (req: NextRequest) => Promise<NextResponse> {
    return this.handler;
  }

  private handler = async (req: NextRequest): Promise<NextResponse> => {
    // Find the redirect from result of RedirectService
    const existsRedirect = await this.getExistsRedirect(req);

    return NextResponse.next();
  };

  /**
   * Method returns RedirectInfo when matches
   * @param {NextRequest} req
   * @returns Promise<RedirectInfo | undefined>
   * @private
   */
  private async getExistsRedirect(req: NextRequest): Promise<RedirectInfo | undefined> {
    const redirects = await this.redirectsService.fetchRedirects();

    return redirects[0] || undefined;
  }
}
