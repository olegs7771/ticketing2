// Global css from bootstrap
// Component =  every page between divs in return
// wrapped in custom component with spreaded pageProps
// would apply on each page

import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, user }) => {
  return (
    // Component =  every page between divs
    <div>
      <Header user={user} />
      <div className="container">
        <Component user={user} {...pageProps} />
      </div>
    </div>
  );
};

//In custom App Component context==={Componenet,ctx:{req,res}}
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  //Get Props into individual page Components
  //In Pages that does not have getInitialProps()
  // appContext.Component .getInitialProps is undefined
  // so we do not want to get props into this pages
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.user,
    );
  }

  console.log('pageProps', pageProps);

  console.log('data in appContext', data);

  //Share data between all pages
  //pageProps:{
  //   user:{
  //     email:'dddddd@ffff.com',

  //   }
  // }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
const user = null;
