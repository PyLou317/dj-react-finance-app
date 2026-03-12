import { UserButton } from '@clerk/clerk-react';
import WelcomeHeader from './Header';

import { Menu, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="relative flex px-4 py-3 text-black bg-white justify-between z-50 mb-4 sm:hidden items-center">
      <WelcomeHeader />
      <div className="relative">
        <button
          className="flex flex-row items-center"
          onClick={toggleMenu}
        >
          <Menu size={30} className="text-gray-500" />
        </button>

        {isOpen && (
          <ul className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rouded-xl shadow-lg py-1 z-20 overflow-hidden">
            <li>
              <NavLink
                to="/settings/profile"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings/accounts"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Accounts
              </NavLink>
            </li>
            <li className="bg-gray-50 p-2">
              <UserButton />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
