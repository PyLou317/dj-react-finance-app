import { UserButton } from '@clerk/clerk-react';
import SettingsLink from './SettingsLink';

import { Menu } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="top-0 left-0 right-0 pb-4 text-black bg-transparent z-100">
      <ul className="flex flex-row items-center justify-between gap-6 list-none">
        <li className="ml-auto list-none">
          {' '}
          <Menu size={30} />
          {/* <div className="sm:hidden">
            <SettingsLink />
          </div> */}
          {/* <UserButton /> */}
        </li>
      </ul>
    </nav>
  );
}
