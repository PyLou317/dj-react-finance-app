import { useContext } from 'react';
import { UserContext } from '../../UserContext.js';
import { getCurrentDate } from '../../utils/getCurrentDate.js';

export default function WelcomeHeader() {
  const user = useContext(UserContext);
  const date = getCurrentDate();
  return (
    <div className='mb-6'>
      <h1 className="text-3xl font-semibold">Hello, {user?.username}!</h1>
      <small className='text-gray-400 text-sm'>Welcome to Evergreen Financial</small>
      {/* <p className="text-sm text-gray-400">{date}</p> */}
    </div>
  );
}
