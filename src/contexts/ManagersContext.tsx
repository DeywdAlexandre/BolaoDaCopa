import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthorizedManager } from '../types';

interface ManagersContextType {
  authorizedManagers: AuthorizedManager[];
  addManager: (email: string, name: string, platformFee?: number) => string;
  updateManager: (id: string, updates: Partial<AuthorizedManager>) => void;
  removeManager: (id: string) => void;
  getManagerByCode: (code: string) => AuthorizedManager | undefined;
}

const ManagersContext = createContext<ManagersContextType | undefined>(undefined);

const generateCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return fallback;
}

export function ManagersProvider({ children }: { children: ReactNode }) {
  const [authorizedManagers, setAuthorizedManagers] = useState<AuthorizedManager[]>(
    () => loadFromStorage('bolao_managers', [])
  );

  useEffect(() => {
    localStorage.setItem('bolao_managers', JSON.stringify(authorizedManagers));
  }, [authorizedManagers]);

  const addManager = (email: string, name: string, platformFee: number = 3): string => {
    const code = generateCode();
    const newManager: AuthorizedManager = {
      id: `mgr_${Date.now()}`,
      email: email.toLowerCase(),
      name,
      code,
      platformFee,
      blocked: false,
      authorizedAt: new Date().toISOString(),
      authorizedBy: 'super_admin'
    };
    setAuthorizedManagers(prev => [...prev, newManager]);
    return code;
  };

  const updateManager = (id: string, updates: Partial<AuthorizedManager>) => {
    setAuthorizedManagers(prev => prev.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const removeManager = (id: string) => {
    setAuthorizedManagers(prev => prev.filter(m => m.id !== id));
  };

  const getManagerByCode = (code: string): AuthorizedManager | undefined => {
    return authorizedManagers.find(m => m.code === code.toUpperCase());
  };

  return (
    <ManagersContext.Provider value={{
      authorizedManagers,
      addManager,
      updateManager,
      removeManager,
      getManagerByCode
    }}>
      {children}
    </ManagersContext.Provider>
  );
}

export function useManagers() {
  const context = useContext(ManagersContext);
  if (context === undefined) {
    throw new Error('useManagers must be used within a ManagersProvider');
  }
  return context;
}
