import { useState } from 'react';
import { NavLink } from 'react-router';
import { CircleGauge, ListCheck, Tag } from 'lucide-react';

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
          <NavLink
            to={route.link}
            className={({ isActive }) =>
              isActive ? 'text-teal-500' : 'text-black'
            }
          >
            <li
              key={route.key}
              className="flex flex-col items-center hover:cursor-pointer hover:scale-110"
            >
              <route.Icon size={25} />
              <span className="text-xs">{route.title}</span>
            </li>
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}
