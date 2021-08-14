import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

// Interface for describing job
interface Payload {
  orderId: string;
}

// creating job for redis local database and assign name for bucket
// order:expiration' --- bucket name like channel name in NATS
const expirationQueue = new Queue<Payload>('order:expiration', {
  // We running instance of redis in our pod
  redis: {
    host: process.env.REDIS_HOST, // taking from expiration-depl.yaml
  },
});

expirationQueue.process(async (job) => {
  //Publish expiration completed event

  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
