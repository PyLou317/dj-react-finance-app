import { useState } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react';

function App() {
  const { getToken } = useAuth();
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    const token = await getToken();
    const response = await fetch('http://127.0.0.1:8000/api/accounts/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setAccounts(data);
  };

  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div>
          <button onClick={fetchAccounts}>Fetch Accounts</button>
        </div>
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>{account.name}</li>
          ))}
        </ul>
        <SignOutButton />
      </SignedIn>
    </>
  );
}

export default App;
