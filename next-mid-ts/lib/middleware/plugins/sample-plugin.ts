import { NextResponse } from 'next/server';
import { debug } from 'debug';

class SamplePlugin {
  private debug = debug(`mock:redirects`);

  private endpoint = process.env.FETCH_ENDPOINT || "https://lock-stock-mock.vercel.app/api";

  private timeout = 4000;

  async exec(): Promise<NextResponse> {
    const importantData = await this.request();
    console.log(importantData);
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
        this.debug('response: %o', data);
        resolve(data);
      })
      .catch((error: any) => {
        this.debug('response error: %o', error.response || error.message || error);
        reject(error);
      });
    });
  }
}

export const samplePlugin = new SamplePlugin();
