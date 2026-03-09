import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function SettingsLink() {
  const [settingRoutes] = useState([
    {
      key: 'settings',
      title: 'Settings',
      Icon: Settings,
      link: '/settings',
    },
  ]);
  return (
    <ul className="flex flex-row justify-around sm:flex-col sm:justify-start gap-1 sm:gap-2 list-none w-full">
      {settingRoutes.map((route) => (
        <li key={route.key} className="w-full sm:w-auto">
          <NavLink
            to={route.link}
            className={({ isActive }) =>
              `flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 p-3 rounded-xl transition-all duration-200 
                ${
                  isActive
                    ? 'bg-teal-50 text-teal-600 sm:border-l-4 sm:border-teal-500'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }`
            }
          >
            <route.Icon size={24} className="sm:size-5" />
            <span className="text-[10px] font-medium sm:text-base">
              {route.title}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
