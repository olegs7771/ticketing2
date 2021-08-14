import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  BadRequestError,
} from '@olegs777tickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('provide the title'),
    body('price').isFloat({ gt: 0 }).withMessage('price can not be negative'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    //Check if ticket not reserved by some user
    if (ticket.orderId) {
      throw new BadRequestError('Ticket has been reserved');
    }

    //Check if user owns the ticket
    if (ticket.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    //Update Ticket
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    console.log('ticket updated', ticket);
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.json({ ticket, message: 'success' });
  },
);

export { router as updateTicketRouter };
