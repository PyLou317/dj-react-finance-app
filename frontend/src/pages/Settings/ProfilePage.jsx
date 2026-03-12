import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../UserContext.js';
import { Pencil } from 'lucide-react';

export default function ProfilePage() {
  const user = useContext(UserContext);

  const labelClasses = 'text-gray-400';
  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="font-bold text-3xl">Profile</h1>
      </div>
      <div className="p-4 border border-gray-200 rounded-xl">
        <div className="flex flex-row justify-between mb-6">
          <h2 className="font-semibold text-gray-700">Personal Information</h2>
          <button className="flex flex-row m-0 px-2 py-2 bg-white items-center justify-center rounded-2xl border border-gray-300 text-sm text-gray-600 leading-none gap-2 hover:border-gray-400 hover:text-gray-700 cursor-pointer">
            Edit
            <Pencil size={15} />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6">
          <div>
            <label htmlFor="first_name" className={labelClasses}>
              First Name
            </label>
            <p id="first_name">{user?.first_name ? user?.first_name : 'NA'}</p>
          </div>
          <div>
            <label htmlFor="last_name" className={labelClasses}>
              Last Name
            </label>
            <p id="last_name">{user?.last_name ? user?.last_name : 'NA'}</p>
          </div>
          <div>
            <label htmlFor="username" className={labelClasses}>
              Username
            </label>
            <p id="username">{user?.username}</p>
          </div>
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email address
            </label>
            <p id="email">Email: {user?.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}
