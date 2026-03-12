import { useContext } from 'react';
import { UserContext } from '../../UserContext.js';
import { getCurrentDate } from '../../utils/getCurrentDate.js';

export default function WelcomeHeader() {
  const user = useContext(UserContext);

  return (
    <div>
      <h1 className="text-xl font-semibold">Hello, {user?.username}!</h1>
      <small className='text-gray-400 text-xm'>Welcome to Evergreen Financial</small>
      {/* <p className="text-sm text-gray-400">{date}</p> */}
    </div>
  );
}
