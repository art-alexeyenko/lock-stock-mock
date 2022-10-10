import { NextRequest, NextResponse } from 'next/server';
import { debug } from 'debug';

class SamplePlugin {

  constructor(private endpoint: string) {
  }

  timeout = 4000;

  async exec(req: NextRequest): Promise<NextResponse> {
    const sampleData = await this.request();
    console.log(sampleData);
    return NextResponse.next();
  }

  async request(): Promise<any> {
    return new Promise((resolve, reject) => {

      const abort = new AbortController();
      let abortTimeout: NodeJS.Timeout;

      if (this.timeout) {
        abortTimeout = setTimeout(() => {
          abort.abort();
        }, this.timeout);
      }

      fetch(this.endpoint, {
        method: "POST",
        signal: abort.signal,
      })
      .then((data: any) => {
        clearTimeout(abortTimeout);
        debug(`mock:redirects`)('response: %o', data);
        resolve(data);
      })
      .catch((error: any) => {
        debug(`mock:redirects`)('response error: %o', error.response || error.message || error);
        reject(error);
      });
    });
  }
}

export const samplePlugin = new SamplePlugin(process.env.FETCH_ENDPOINT || "https://lock-stock-mock.vercel.app/api");
