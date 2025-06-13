import React, {useEffect} from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './layout';
import useStore from './store/user.store';
import { useProjectStore } from '@/store';
import {jwtDecode} from "jwt-decode"
import Dashboard from './Pages/Dashboard';
import LoginForm from './Pages/LoginForm';
import RegisterForm from './Pages/SignUpForm';
import NotificationPage from "./Pages/Notification";
import { TaskList } from './Components/TaskList';
import ProfilePage from './Pages/profile';
import { UserRole } from './types';

const AppRoutes: React.FC = () => {
  const { pathname } = useLocation();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  console.log('isAuthenticated', isAuthenticated)
  const hasRole = useStore((state) => state.hasRole);
  const clearUser = useStore((state) => state.clearUser);
  const { filterStatus } = useProjectStore();


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        if (decoded.exp < Date.now() / 1000) {
          console.warn("Token expired, logging out...");
          clearUser();
        }
      } catch (error) {
        console.error("Invalid token, clearing session.");
        clearUser();
      }
    }
  }, [pathname, clearUser]);

  const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const RoleBasedRoute: React.FC<{ children: React.ReactElement; allowedRole: UserRole }> = ({ children, allowedRole }) => {
    return isAuthenticated && hasRole(allowedRole) ? (
      children
    ) : (
      
      <Navigate to="/unauthorized" replace />
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/project/:projectId"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskList filter={filterStatus} />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <NotificationPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Role-Based Route (Admin) */}
      <Route
        path="/admin"
        element={
          <RoleBasedRoute allowedRole="Manager">
            <Layout>
              <div>Admin Page</div>
            </Layout>
          </RoleBasedRoute>
        }
      />

      <Route path="/unauthorized" element={<div>You are not authorized to access this page.</div>} />
    </Routes>
  );
};

export default AppRoutes;
