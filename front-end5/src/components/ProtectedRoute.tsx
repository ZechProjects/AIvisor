// import { Navigate, useLocation } from 'react-router-dom';
// import { useApp } from '@/contexts/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { user, isLoading } = useApp();
//   const location = useLocation();

//   if (isLoading) {
//     return <div>Loading...</div>; // Consider creating a proper loading component
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

  return <>{children}</>;
} 