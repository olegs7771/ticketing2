import express, { Request, Response } from 'express';
import { requireAuth } from '@olegs777tickets/common';
import { Order } from '../models/order';
const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.user!.id,
  }).populate('ticket');
  res.send(orders);
});

export { router as indexOrderRouter };
