// We will create Singleton here. Single instance of connection to NATS and export
// to be available in all files as we did with mongoose module

import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  //create private property . ? tells ts that we admit that this
  // property might  be undefined
  // its too early to run constructor because we will init this class later in index.ts
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Can not access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      //In case there is error to connect to NATS
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
