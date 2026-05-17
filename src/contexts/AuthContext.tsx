import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole, managerId?: string) => void;
  updateUserName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAIL = 'deywd12@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUserSession = async (supabaseUser: any) => {
    try {
      const email = supabaseUser.email || '';
      let role: UserRole = 'user';
      let managerId: string | undefined = undefined;

      if (email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        role = 'super_admin';
      } else {
        // Consultar a tabela authorized_managers para verificar se o email é um gerente ativo
        const { data: managerData, error } = await supabase
          .from('authorized_managers')
          .select('id, blocked')
          .eq('email', email.toLowerCase())
          .maybeSingle();

        if (error) {
          console.error('Erro ao verificar status de gerente:', error);
        } else if (managerData) {
          if (managerData.blocked) {
            console.warn('Gerente bloqueado:', email);
          } else {
            role = 'manager';
            managerId = managerData.id;
          }
        }
      }

      // Carregar código do gerente seguido localmente para usuários comuns
      const savedManagerCode = localStorage.getItem('bolao_followed_manager_code');

      const finalUser: User = {
        id: supabaseUser.id,
        email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || email.split('@')[0],
        photoURL: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || '',
        role,
        managerId: role === 'manager' ? managerId : (savedManagerCode || undefined),
        createdAt: supabaseUser.created_at || new Date().toISOString()
      };

      setUser(finalUser);
    } catch (err) {
      console.error('Erro ao tratar sessão de usuário:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Checar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await handleUserSession(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Erro ao obter sessão inicial:', err);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkSession();

    // 2. Ouvir mudanças no estado de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('onAuthStateChange:', event, session?.user?.email);
        if (session?.user) {
          await handleUserSession(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Erro no login com Google:', err.message);
      alert('Erro ao iniciar login com Google: ' + err.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err: any) {
      console.error('Erro ao deslogar:', err.message);
    }
  };

  const updateUserRole = (role: UserRole, managerId?: string) => {
    if (!user) return;
    setUser({ ...user, role, managerId });
  };

  const updateUserName = async (name: string) => {
    if (!user || !name.trim()) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name.trim() }
      });
      if (error) throw error;
      
      setUser({ ...user, name: name.trim() });
    } catch (err: any) {
      console.error('Erro ao atualizar nome:', err.message);
      alert('Erro ao atualizar nome: ' + err.message);
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
