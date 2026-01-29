import { useContext } from 'react';
import { UserContext } from '../../UserContext.js';
import { getCurrentDate } from '../../utils/getCurrentDate.js';

export default function WelcomeHeader() {
  const user = useContext(UserContext);
  const date = getCurrentDate();
  return (
    <div>
      <h1 className="text-xl font-semibold">Hello, {user?.username}!</h1>
      <small>Welcome to your finance app</small>
      {/* <p className="text-sm text-gray-400">{date}</p> */}
    </div>
  );
}
