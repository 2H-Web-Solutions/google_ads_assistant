import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import CampaignWorkspace from './pages/CampaignWorkspace';
import AllCampaigns from './pages/AllCampaigns';
import Tasks from './pages/Tasks';

// Login moved to pages/Login.tsx
import Login from './pages/Login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10">Loading App...</div>;
  if (!user) return <Login />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:clientId" element={<ClientDetails />} />
          <Route path="clients/:clientId/campaigns/:campaignId" element={<CampaignWorkspace />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="campaigns" element={<AllCampaigns />} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" toastOptions={{
        className: "font-['Barlow']",
        style: { background: '#101010', color: '#B7EF02', border: '1px solid #333' }
      }} />
    </BrowserRouter>
  );
}

export default App;
