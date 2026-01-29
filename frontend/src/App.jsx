import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from '@clerk/clerk-react';
import { Outlet } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { UserContext } from './UserContext.js';

import BottomNavbar from './components/navbar/BottomNavbar';
import TopNavbar from './components/navbar/TopNavBar';
import fetchUser from './api/users';

function App() {
  const { getToken } = useAuth();

  const {
    isPending,
    isError,
    data: user,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getToken();
      return fetchUser(token);
    },
    placeholderData: keepPreviousData,
  });

  return (
    <UserContext value={user}>
      <div className="p-3 bg-white">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <TopNavbar />
          <div className="mt-4 mb-16">
            <Outlet />
          </div>
          <BottomNavbar />
        </SignedIn>
      </div>
    </UserContext>
  );
}

export default App;
