import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ManagersProvider, useManagers } from './contexts/ManagersContext';
import { MatchesProvider } from './contexts/MatchesContext';
import { PoolsProvider } from './contexts/PoolsContext';
import { BetsProvider } from './contexts/BetsContext';
import { ToastProvider } from './components/shared/Toast';
import { LoginPage } from './components/LoginPage';
import { SuperAdminPanel } from './components/SuperAdminPanel';
import { ManagerPanel } from './components/ManagerPanel';
import { UserPanel } from './components/UserPanel';
import { PublicPoolView } from './components/PublicPoolView';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { authorizedManagers } = useManagers();

  const [activePoolId, setActivePoolId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view-pool');
  });

  const handleBack = () => {
    window.history.replaceState({}, '', window.location.pathname);
    setActivePoolId(null);
  };

  if (activePoolId) {
    return <PublicPoolView poolId={activePoolId} onBack={handleBack} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce">⚽</div>
          <p className="text-white mt-4 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;
  if (user.role === 'super_admin') return <SuperAdminPanel />;
  
  const isManager = authorizedManagers.some(m => m.email === user.email);
  if (isManager || user.role === 'manager') return <ManagerPanel />;

  return <UserPanel />;
}

function App() {
  return (
    <AuthProvider>
      <ManagersProvider>
        <MatchesProvider>
          <PoolsProvider>
            <BetsProvider>
              <ToastProvider>
                <div className="min-h-screen">
                  <AppContent />
                  <footer className="text-center py-6 text-white/60 text-sm">
                    <p>🏆 Bolão Copa do Mundo 2026 🇺🇸🇲🇽🇨🇦</p>
                    <p className="text-xs mt-1">Feito com ❤️ para os amantes de futebol</p>
                  </footer>
                </div>
              </ToastProvider>
            </BetsProvider>
          </PoolsProvider>
        </MatchesProvider>
      </ManagersProvider>
    </AuthProvider>
  );
}

export default App;
