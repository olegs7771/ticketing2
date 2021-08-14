import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  NotFoundError,
  BadRequestError,
  requireAuth,
  validateRequest,
  OrderStatus,
} from '@olegs777tickets/common';
import { body } from 'express-validator';

import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 180;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      //Check if input is valid mangoose id
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // 1) Find the ticket the user is trying to order in the db
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // 2) Make sure that ticket is not already reserved
    // Run query to look at all orders. Find an order where the Ticket
    // is the ticket we just found *and* the order status is not cancelled.
    // if we find an order from that means the ticket *is* reserved.
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    if (existingOrder) {
      throw new BadRequestError('Ticket already reserved');
    }

    // Calculate the expertion date for this order 15 min
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    console.log('expiration', expiration);

    // Build the order and save it to the db
    const order = Order.build({
      userId: req.user!.id,
      status: OrderStatus.Created,
      expiredAt: expiration,
      ticket,
    });
    await order.save();
    res.status(201).send(order);
    // publish an event that the order was created

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiredAt: order.expiredAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
  },
);

export { router as newOrderRouter };
