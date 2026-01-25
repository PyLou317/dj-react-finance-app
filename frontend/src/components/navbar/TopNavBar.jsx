import { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { CircleGauge, ListCheck, Tag } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 p-3 text-black bg-white">
      <ul className="flex flex-row items-center justify-around gap-6 list-none">
        <li className="ml-auto list-none">
          {' '}
          <UserButton />
        </li>
      </ul>
    </nav>
  );
}
