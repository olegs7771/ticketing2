import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreateListener } from '../src/events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  // const option = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('accounting-service');

  // Tell NATS to redeliver messages in the past

  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'order-service-queue-group',
  //   option,
  // );

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();
  //   if (typeof data === 'string') {
  //     console.log(
  //       `We received message #${msg.getSequence()} and the data is : ${data}`,
  //     );
  //   }
  //   msg.ack();
  // // });
  new TicketCreateListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
