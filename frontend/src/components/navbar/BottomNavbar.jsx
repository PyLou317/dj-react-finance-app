import { useState } from 'react';
import { NavLink } from 'react-router';
import { CircleGauge, ListCheck, Tag, CircleDollarSign, Settings } from 'lucide-react';

export default function BottomNavbar() {
  const [routes] = useState([
    {
      key: 'transactions',
      title: 'Transactions',
      Icon: ListCheck,
      link: '/transaction-list',
    },
    {
      key: 'home',
      title: 'Dashboard',
      Icon: CircleGauge,
      link: '/',
    },
    {
        key: 'categories',
        title: 'Categories',
        Icon: Tag,
        link: '/categories',
    },
  ]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-3 text-black bg-white">
      <ul className="flex flex-row items-center justify-around gap-6 list-none">
        {routes.map((route) => (
          <li
            key={route.key}
            className="flex flex-col items-center hover:cursor-pointer hover:scale-110"
          >
            <NavLink
              to={route.link}
              className={({ isActive }) =>
                `hover:scale-110 transition-transform ${
                  isActive
                    ? 'text-teal-500 border-teal-500 border-t-2'
                    : 'text-black border-transparent'
                }`
              }
            >
              <div className="pt-2 flex flex-col items-center">
                <route.Icon size={18} />
                <span className="text-[9px]">{route.title}</span>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
