import {
    Navigate,
    useLocation,
  } from "react-router-dom";



const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
    if (!isAuthenticated && location.pathname !== '/login') {
      return <Navigate to="/login" replace />;
    }
  
    if (isAuthenticated && location.pathname === '/login') {
      return <Navigate to="/" replace />;
    }
  
    return <>{children}</>;
  };
  
  export default ProtectedRoute;

