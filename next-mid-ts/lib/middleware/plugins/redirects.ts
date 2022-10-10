import { NextRequest, NextResponse } from 'next/server';
import debug from 'debug';

class RedirectsPlugin {

  private debug = debug(`mock:redirects`);

  private timeout = 1000;

  private abortController = new AbortController();

  private endpoint = process.env.FETCH_ENDPOINT || "https://lock-stock-mock.vercel.app/api";

  private defaultQuery = /* GraphQL */ `
  query RedirectsQuery($siteName: String!) {
    site {
      siteInfo(site: $siteName) {
        whatever
      }
    }
  }
`;

private handler = async (req: NextRequest): Promise<NextResponse> => {
  // Find the redirect from result of RedirectService
  const existsRedirect = await this.getExistsRedirect(req);

  return NextResponse.next();
};

private async getExistsRedirect(req: NextRequest): Promise<any> {
  const redirects = await this.fetchRedirects();

  return redirects[0] || undefined;
}

async fetchRedirects(): Promise<any> {
  const redirectsResult = await this.request<any>(this.defaultQuery);

  return [];
}

async request<T>(
  query: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    this.debug('request: %o', {
      url: this.endpoint,
      query,
    });

    let abortTimeout: NodeJS.Timeout;

    if (this.timeout) {
      abortTimeout = setTimeout(() => {
        this.abortController.abort();
      }, this.timeout);
    }

    fetch(this.endpoint, {
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


  /**
   * exec async method - to find coincidence in url.pathname and redirects of site
   * @param req<NextRequest>
   * @returns Promise<NextResponse>
   */
  async exec(req: NextRequest): Promise<NextResponse> {
    return this.handler(req);
  }
}

export const redirectsPlugin = new RedirectsPlugin();
