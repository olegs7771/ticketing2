import { Ticket } from '../ticket';

// done is a callback to tell Jest specificly that test is done.

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // Save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id); //version 0
  const secondInstance = await Ticket.findById(ticket.id); //version 0

  // make two separate changes to the tickets we fetched

  firstInstance!.set({ price: 10 }); //version 0 --> looking for 0
  secondInstance!.set({ price: 15 }); // version 0 --> loking for 0

  // save the first fetched ticket
  await firstInstance!.save(); // version 1

  // save the second fetched ticket and expect an error

  try {
    await secondInstance!.save(); // version 1 but looking for 0
  } catch (error) {
    return done();
  }
  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
