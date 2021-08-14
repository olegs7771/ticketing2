// import buildClient from '../api/build-client';
import Link from 'next/link';
const LandingPage = ({ user, tickets }) => {
  console.log('tickets', tickets);
  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[tickets]" as={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

//Invoke NextJs getInitialProps()
// Whenever nextjs renders component
// Only for serverside first rendering phase
// We cant use hooks in server side rendering
// So must import axios separatly
//req object its the same as in express.js
// context = ({req})

//Page Component context==={req,res}

LandingPage.getInitialProps = async (context, client, user) => {
  // const client = buildClient(context);
  // const { data } = await client.get('/api/users/currentuser');
  // return data;
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
