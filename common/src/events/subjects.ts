// Telling typescript what type of subject (name of channel in NATS)
// enum does oblige to use as params items assigned in object Subject
export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  OrderUpdated = 'order:updated',
  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',

  ExpirationComplete = 'expiration:complete',

  PaymentCreated = 'payment:created',
}
