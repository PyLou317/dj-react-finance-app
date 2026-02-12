import { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Ensure this import is correct based on your setup
import {
  CircleGauge,
  ListCheck,
  Tag,
} from 'lucide-react';

export default function BottomNavbar() {
  const [routes] = useState([
    {
      key: 'home',
      title: 'Dashboard',
      Icon: CircleGauge,
      link: '/',
    },
    {
      key: 'transactions',
      title: 'Transactions',
      Icon: ListCheck,
      link: '/transaction-list',
    },
    {
      key: 'categories',
      title: 'Categories',
      Icon: Tag,
      link: '/categories',
    },
  ]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-2 sm:p-4 sm:top-0 sm:left-0 sm:w-64 sm:h-screen sm:border-r sm:border-t-0"
    >
      <h1 className='hidden sm:block text-2xl font-bold text-teal-600 p-4 mb-6'>FinanceApp</h1>
      
      <ul className="flex flex-row justify-around sm:flex-col sm:justify-start gap-1 sm:gap-2 list-none">
        {routes.map((route) => (
          <li key={route.key} className="w-full sm:w-auto">
            <NavLink
              to={route.link}
              className={({ isActive }) =>
                `flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 p-3 rounded-xl transition-all duration-200 
                ${isActive
                  ? 'bg-teal-50 text-teal-600 sm:border-l-4 sm:border-teal-500'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }`
              }
            >
              <route.Icon size={24} className="sm:size-5" />
              <span className="text-[10px] font-medium sm:text-base">{route.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}