import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@olegs777tickets/common';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
      {
        throw new NotFoundError();
      }
    }

    //Make sure that only owner of the order can see the order
    if (order.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  },
);

export { router as showOrderRouter };
