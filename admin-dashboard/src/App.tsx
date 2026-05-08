import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { UsersPage } from './pages/UsersPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { ChargeRequestsPage } from './pages/ChargeRequestsPage';
import { SubAdminsPage } from './pages/SubAdminsPage';
import { ToastProvider } from './components/Toast';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } });

function ProtectedLayout() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return (
    <div className="loading-spinner" style={{ minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return (
    <div className="loading-spinner" style={{ minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🚫</div>
      <div style={{ color: '#ff4d6d', fontWeight: 700, fontSize: 18 }}>Access Denied</div>
      <div style={{ color: '#64748b', fontSize: 14 }}>Your account is not authorized as an admin.</div>
      <button className="btn btn-ghost btn-sm" onClick={() => { import('./lib/firebase').then(m => { import('firebase/auth').then(fa => fa.signOut(m.auth)); }); }}>Sign Out</button>
    </div>
  );
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/charge-requests" element={<ChargeRequestsPage />} />
          <Route path="/sub-admins" element={<SubAdminsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
