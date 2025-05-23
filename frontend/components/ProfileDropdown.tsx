import { logout } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { User, Settings, LogOut,UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

const ProfileDropdown = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch(); 
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleDropdown = (): void => setIsOpen(!isOpen);

  const handleOptionClick = (option: string, callback?: () => void): void => {
    if (callback) callback();
    setIsOpen(false);
  };

  const onChangePassword = () => {
    router.push('/auth/change-password');
  };
  const onClickAdmin = () => {
    router.push('/admin');
  };
  const onClickDashBoard = () => {
    router.push('/store/dashboard');
  };
  const onLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        type="button"
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        <User size={20} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              {
                user?.role === 'ADMIN' && (
                  <div>
                <button
                onClick={() => handleOptionClick('Admin', onClickAdmin)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                type="button"
              >
                <UserCog size={16} className="mr-3" />
                Admin Options
              </button>
              </div>
                )
              }
              {
                user?.role === 'OWNER' && (
                  <div>
                <button
                onClick={() => handleOptionClick('Store_Dashboard', onClickDashBoard)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                type="button"
              >
                <UserCog size={16} className="mr-3" />
                Store Dashboard
              </button>
              </div>
                )
              }
              <button
                onClick={() => handleOptionClick('Change Password', onChangePassword)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                type="button"
              >
                <Settings size={16} className="mr-3" />
                Change Password
              </button>

              <div className="border-t border-gray-100">
                <button
                  onClick={() => handleOptionClick('Logout', onLogout)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  type="button"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
