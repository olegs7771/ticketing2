import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push(`/orders/[orderId]`, `/orders/${order.id}`),
  });

  const _MakeOrder = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={_MakeOrder} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  console.log('context', context);
  console.log('ticketId', ticketId);
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};
export default TicketShow;
