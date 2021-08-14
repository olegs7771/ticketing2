import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-create-publisher';

const stan = nats.connect('ticketing', 'pub', {
  url: 'http://localhost:4222',
});
console.clear();
stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 70,
    });
  } catch (error) {
    console.log('error to publish', error);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });
  // //Publish event to NATS-STREAMING-SERVICE

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
