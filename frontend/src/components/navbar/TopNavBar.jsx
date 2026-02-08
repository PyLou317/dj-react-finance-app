import { UserButton } from '@clerk/clerk-react';
import WelcomeHeader from './Header';

export default function TopNavbar() {
  return (
    <nav className="top-0 left-0 right-0 pb-4 text-black bg-transparent z-100">
      <ul className="flex flex-row items-center justify-between gap-6 list-none">
        <WelcomeHeader />
        <li className="ml-auto list-none">
          {' '}
          <UserButton />
        </li>
      </ul>
    </nav>
  );
}
