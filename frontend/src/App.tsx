import React from 'react';
import { AuthProvider } from './services/authContext';
import { DashboardPage } from './pages/Dashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  );
};

export default App;
