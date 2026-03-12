import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function SettingsMenu() {
  const [routes] = useState([
    {
      key: 'profile',
      title: 'Profile',
      link: 'profile',
    },
    {
      key: 'accounts',
      title: 'Accounts',
      link: 'accounts',
    },
  ]);
  return (
    <nav>
      <ul className="border border-gray-200 rounded-xl overflow-hidden">
        {routes.map((route) => (
          <li
            key={route.link}
            className="border-b border-gray-200 last:border-b-0"
          >
            <NavLink
              to={route.link}
              className={({ isActive }) =>
                `block px-3 py-2 cursor-pointer transition-colors
            ${
              isActive
                ? 'bg-teal-50 text-gray-600 sm:border-l-4 sm:border-gray-500'
                : 'text-gray-500 hover:bg-gray-100 hover:text-black'
            }`
              }
            >
              <span>{route.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
