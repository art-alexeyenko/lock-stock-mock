import { NextRequest, NextResponse } from 'next/server';
import {debug} from 'debug';

type RedirectsQueryResult = {
    site: { siteInfo: { redirects: RedirectInfo[] } | null };
  };

  export type RedirectInfo = {
    pattern: string;
    target: string;
    redirectType: string;
    isQueryStringPreserved: boolean;
    locale: string;
  };

class SamplePlugin  {

  constructor(private endpoint: string) {
  }

  query = /* GraphQL */ `
  query RedirectsQuery($siteName: String!) {
    site {
      siteInfo(site: $siteName) {
        redirects {
          pattern
          target
          redirectType
          isQueryStringPreserved
          locale
        }
      }
    }
  }
`;

  timeout = 1000;

  /**
   * exec async method - to find coincidence in url.pathname and redirects of site
   * @param req<NextRequest>
   * @returns Promise<NextResponse>
   */
  async exec(): Promise<NextResponse> {

    const abort = new AbortController();
    let abortTimeout: NodeJS.Timeout;

      if (this.timeout) {
        abortTimeout = setTimeout(() => {
          abort.abort();
        }, this.timeout);
      }

      const variables = {siteName: '123'};

    let res = await new Promise((resolve, reject) => fetch(this.endpoint, {
        method: "POST",
        signal: abort.signal,
        headers: {
          'Content-Type': 'application/json',
          // ...this.headers,
        },
        body: JSON.stringify({
          query: this.query,
          variables: variables,
        }),
      })
      .then(res => res.json())
      .then((data: RedirectsQueryResult) => {
        clearTimeout(abortTimeout);
        debug('mock')('response: %o', data);
        resolve(data);
      })
      .catch((error: any) => {
        debug('mock')('response error: %o', error.response || error.message || error);
        reject(error);
      }));
    return NextResponse.next();
  }
}

export const samplePlugin = new SamplePlugin(process.env.FETCH_ENDPOINT || "https://lock-stock-mock.vercel.app/api");
