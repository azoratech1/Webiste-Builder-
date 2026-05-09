import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PagesManager from './pages/admin/PagesManager';
import PageEditor from './pages/admin/PageEditor';
import MediaManager from './pages/admin/MediaManager';
import CompanySettings from './pages/admin/CompanySettings';
import HomepageEditor from './components/admin/HomepageEditor';
import WebsiteView from './pages/WebsiteView';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/" element={<WebsiteView />} />
          <Route path="/:slug" element={<WebsiteView />} /> */}
          
          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pages" element={<PagesManager />} />
            <Route path="pages/:id" element={<PageEditor />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="settings" element={<CompanySettings />} />
            <Route path="homepage" element={<HomepageEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;