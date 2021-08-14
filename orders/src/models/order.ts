import mongoose from 'mongoose';
import { OrderStatus } from '@olegs777tickets/common';
import { TicketDoc } from './ticket';

import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

//export to use it with one import in /models/ticket
export { OrderStatus };

//Create three interfaces.

// 1) describes the properties  to create order record
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiredAt: Date;
  ticket: TicketDoc;
}

// 2} describes all the properties saved document has
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiredAt: Date;
  ticket: TicketDoc;
  version: number;
}

// 3) describes the properties overall model has
// Generic Type
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// Build Schema

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      // Additional check for valid status.
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiredAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export { Order };
