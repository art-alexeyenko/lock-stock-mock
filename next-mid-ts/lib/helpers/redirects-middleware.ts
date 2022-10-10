import { NextResponse, NextRequest } from 'next/server';
import {
  GraphQLRedirectsServiceConfig,
} from './graphql-redirects-service';
import debug from 'debug';

export class RedirectsMiddleware {
  
  private debug = debug(`mock:redirects`);

  private timeout = 1000;

  private abortController = new AbortController();

  private defaultQuery = /* GraphQL */ `
  query RedirectsQuery($siteName: String!) {
    site {
      siteInfo(site: $siteName) {
        whatever
      }
    }
  }
`;

  /**
   * @param {RedirectsMiddlewareConfig} [config] redirects middleware config
   */
  constructor(private config: GraphQLRedirectsServiceConfig) {    
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
  private async getExistsRedirect(req: NextRequest): Promise<any> {
    const redirects = await this.fetchRedirects();

    return redirects[0] || undefined;
  }

  async fetchRedirects(): Promise<any> {
    try {
      const redirectsResult = await this.request<any>(this.defaultQuery);

      return [];
    } catch (error) {
      console.log(`catched: ${error}`);
      return [];
    }
  }

  async request<T>(
    query: string
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Note we don't have access to raw request/response with graphql-request
      // (or nice hooks like we have with Axios), but we should log whatever we have.
      this.debug('request: %o', {
        url: this.config.endpoint,
        query,
      });

      let abortTimeout: NodeJS.Timeout;

      if (this.timeout) {
        abortTimeout = setTimeout(() => {
          this.abortController.abort();
        }, this.timeout);
      }

      fetch(this.config.endpoint, {
        method: "POST",
        signal: this.abortController.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
        }),
      })
      .then(res => res.json())
      .then((data: T) => {
        clearTimeout(abortTimeout);
        this.debug('response: %o', data);
        resolve(data);
      })
      .catch((error) => {
        this.debug('response error: %o', error.response || error.message || error);
        reject(error);
      });
    });
  }
}
