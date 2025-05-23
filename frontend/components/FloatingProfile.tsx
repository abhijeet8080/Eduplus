'use client';

import { useSelector } from 'react-redux';
import ProfileDropdown from './ProfileDropdown';
import { RootState } from '@/store/store';

const FloatingProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  if (!user) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <ProfileDropdown />
    </div>
  );
};

export default FloatingProfile;