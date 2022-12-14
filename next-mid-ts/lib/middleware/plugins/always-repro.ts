import { NextResponse } from 'next/server';
import debug from 'debug';

class AlwaysRepro {

  private debug = debug(`mock:redirects`);

  private timeout = 4000;

  private abortController = new AbortController();

  private endpoint = process.env.FETCH_ENDPOINT || "https://lock-stock-mock.vercel.app/api";

  async exec(): Promise<NextResponse> {
    const importantData = await this.request();
    console.log(importantData);
    return NextResponse.next();
  }

  async request(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.debug('request: %o', {
        url: this.endpoint,
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
      })
      .then((data: any) => {
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

export const alwaysReproPlugin = new AlwaysRepro();
