import React from 'react';
import { AuthProvider } from './services/authContext';
import { LandingPage } from './pages/LandingPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LandingPage />
    </AuthProvider>
  );
};

export default App;
