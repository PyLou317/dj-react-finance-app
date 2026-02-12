import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { Outlet } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { UserContext } from './UserContext.js';

import BottomNavbar from './components/navbar/BottomNavbar';
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
      <div className=" bg-neutral-100 min-h-screen">
        <SignedOut>
          <div className="flex justify-center items-center w-screen h-screen">
            <SignIn />
          </div>
        </SignedOut>
        <SignedIn>
          <BottomNavbar />
          <div className="flex-1 sm:pl-64">
            <div className="p-4 sm:p-6 mb-16 sm:mb-0">
              <Outlet />
            </div>
          </div>
        </SignedIn>
      </div>
    </UserContext>
  );
}

export default App;
