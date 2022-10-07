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

    return new Promise((resolve, reject) => fetch(this.endpoint, {
        method: 'POST',
        signal: abort.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res. json())
      .then((data: any) => {
        debug(`response: ${data}`);
        resolve(NextResponse.next());
      })
      .catch((error) => {
        debug(`response error: ${error.response || error.message || error}`, );
        reject(error);
      })
    );
  }
}

export const samplePlugin = new SamplePlugin('http://localhost:5000/api');
