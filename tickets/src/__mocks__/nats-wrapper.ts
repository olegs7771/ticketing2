// In this mock file we  will write client object
// like in real nats-wrapper.ts
// export const natsWrapper = new NatsWrapper();

export const natsWrapper = {
  client: {
    //Create mock function (not fake function!) so we can make expectations around it.

    //Fake
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // }

    // Mock

    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        },
      ),
    //Reset Mock function to recent number of call recorded
    // in mock function
    // done it in setup.ts
  },
};
