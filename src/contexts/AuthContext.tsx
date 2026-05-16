import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, AuthorizedManager } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  updateUserRole: (role: UserRole, managerId?: string) => void;
  updateUserName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAIL = 'deywd12@gmail.com';

// Simula alguns usuários do Google para teste
const mockGoogleUsers = [
  { email: 'deywd12@gmail.com', name: 'David (Super Admin)', photoURL: '' },
  { email: 'gerente@teste.com', name: 'João Gerente', photoURL: '' },
  { email: 'usuario@teste.com', name: 'Maria Usuária', photoURL: '' },
];

// Carregar user do localStorage de forma síncrona
function loadUser(): User | null {
  try {
    const saved = localStorage.getItem('bolao_user');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [isLoading] = useState(false);

  const login = () => {
    // Simula popup do Google - mostra uma lista de usuários para escolher
    const emailInput = prompt(
      '🔐 Simular Login com Google\n\n' +
      'Digite um email para simular login:\n\n' +
      '👑 deywd12@gmail.com (Super Admin)\n' +
      '👔 gerente@teste.com (Gerente de teste)\n' +
      '👤 Qualquer outro email (Usuário)\n\n' +
      'Seu email:'
    );

    if (!emailInput) return;

    const email = emailInput.trim().toLowerCase();
    const mockUser = mockGoogleUsers.find(u => u.email === email);
    
    // Verificar se é gerente autorizado
    const authorizedManagers: AuthorizedManager[] = JSON.parse(
      localStorage.getItem('bolao_managers') || '[]'
    );
    const isManager = authorizedManagers.some(m => m.email === email);
    
    // Determinar role
    let role: UserRole = 'user';
    if (email === SUPER_ADMIN_EMAIL) {
      role = 'super_admin';
    } else if (isManager) {
      role = 'manager';
    }

    // Verificar se usuário já existe (manter mesmo ID)
    const users: User[] = JSON.parse(localStorage.getItem('bolao_users') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    const finalUser: User = existingUser 
      ? { ...existingUser, role, name: existingUser.name || mockUser?.name || email.split('@')[0] }
      : {
          id: `user_${email.replace(/[^a-z0-9]/gi, '_')}`,
          email,
          name: mockUser?.name || email.split('@')[0],
          photoURL: mockUser?.photoURL,
          role,
          createdAt: new Date().toISOString()
        };

    // Salvar no localStorage
    localStorage.setItem('bolao_user', JSON.stringify(finalUser));
    setUser(finalUser);
    
    // Atualizar lista de usuários
    if (existingUser) {
      const updatedUsers = users.map(u => u.email === email ? finalUser : u);
      localStorage.setItem('bolao_users', JSON.stringify(updatedUsers));
    } else {
      localStorage.setItem('bolao_users', JSON.stringify([...users, finalUser]));
    }
  };

  const logout = () => {
    localStorage.removeItem('bolao_user');
    setUser(null);
  };

  const updateUserRole = (role: UserRole, managerId?: string) => {
    if (!user) return;
    
    const updatedUser = { ...user, role, managerId };
    setUser(updatedUser);
    localStorage.setItem('bolao_user', JSON.stringify(updatedUser));
    
    // Atualizar na lista de usuários
    const users: User[] = JSON.parse(localStorage.getItem('bolao_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = updatedUser;
      localStorage.setItem('bolao_users', JSON.stringify(users));
    }
  };

  const updateUserName = (name: string) => {
    if (!user || !name.trim()) return;
    
    const updatedUser = { ...user, name: name.trim() };
    setUser(updatedUser);
    localStorage.setItem('bolao_user', JSON.stringify(updatedUser));
    
    // Atualizar na lista de usuários
    const users: User[] = JSON.parse(localStorage.getItem('bolao_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = updatedUser;
      localStorage.setItem('bolao_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUserRole, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
