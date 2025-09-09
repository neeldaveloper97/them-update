import { useSelector } from 'react-redux';
import { selectCanAccessUserRoutes } from './store/slices/authSlice';

export const UserLayout = ({ children }) => {
  const canAccess = useSelector(selectCanAccessUserRoutes);
  
  if (!canAccess) {
    return <Navigate to="/login" />;
  }
  
  return <div className="user-layout">{children}</div>;
};