import { useEffect, useState } from 'react';

import StripeCheckout from 'react-stripe-checkout';
import userRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, user }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { doRequest, errors } = userRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiredAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    setInterval(() => {
      findTimeLeft();
    }, 1000);
  }, []);

  if (timeLeft < 0) {
    return (
      <div>
        <h1>{order.ticket.title}</h1>
        <h4>{order.ticket.price}</h4>
        <br />

        <h3>Expired</h3>
      </div>
    );
  }
  return (
    <div>
      <h1>{order.ticket.title}</h1>
      <h4>{order.ticket.price}</h4>
      <br />
      {timeLeft} seconds until order expires
      <br />
      <StripeCheckout
        token={({ id }) =>
          doRequest({
            token: id,
          })
        }
        stripeKey="pk_test_51JGAyWLbv3cZdQGnx3uMIc1NWdn6NyLArb5unmudKe93F64FmiuP4jGsOz9XpSmvCTPebppptQo08uyP10Cu5dLV00wTJDgqbC"
        amount={order.ticket.price * 100}
        email={user.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
