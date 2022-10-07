import { NextRequest, NextResponse } from 'next/server';
import {debug} from 'debug';

class SamplePlugin  {

  constructor(private endpoint: string) {
  }

  /**
   * exec async method - to find coincidence in url.pathname and redirects of site
   * @param req<NextRequest>
   * @returns Promise<NextResponse>
   */
  async exec(): Promise<NextResponse> {

    const abort = new AbortController();

    let res = await new Promise((resolve, reject) => fetch(this.endpoint, {
        method: 'POST',
        signal: abort.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then((data: any) => {
        debug('mock:')('response: %o', data)
        resolve(data);
      })
      .catch((error) => {
        debug('mock:')('response error: %o', error.response || error.message || error);
        reject(error);
      })
    );
    return NextResponse.next();
  }
}

export const samplePlugin = new SamplePlugin(process.env.FETCH_ENDPOINT || 'http://localhost:5000/api');
