import { useState } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from '@clerk/clerk-react';
import { Outlet } from 'react-router';
import BottomNavbar from './components/navbar/BottomNavbar';
import TopNavbar from './components/navbar/TopNavBar';

function App() {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <TopNavbar />
        <div className='mt-16 mb-16'>
          <Outlet />
        </div>
        <BottomNavbar />
      </SignedIn>
    </>
  );
}

export default App;
