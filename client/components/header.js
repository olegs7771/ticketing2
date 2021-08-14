import Link from 'next/link';

export default function Header({ user }) {
  const links = [
    !user && { label: 'SignUp', href: '/auth/signup' },
    !user && { label: 'SignIn', href: '/auth/signin' },
    user && { label: 'Sell Tickets', href: '/tickets/new' },
    user && { label: 'My orders', href: '/orders' },
    user && { label: 'SignOut', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <a href={href} className="nav-link">
            {label}
          </a>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
}
