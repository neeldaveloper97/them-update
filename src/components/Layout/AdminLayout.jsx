import { useSelector } from 'react-redux';
import { selectCanAccessAdminRoutes } from './store/slices/authSlice';
import { Navigate } from 'react-router-dom';

export const AdminLayout = ({ children }) => {
  const canAccess = useSelector(selectCanAccessAdminRoutes);
  
  if (!canAccess) {
    return <Navigate to="/login" />;
  }
  
  return <div className="admin-layout">{children}</div>;
};