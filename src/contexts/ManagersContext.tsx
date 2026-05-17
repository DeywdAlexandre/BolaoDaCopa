import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthorizedManager } from '../types';
import { supabase } from '../lib/supabase';

interface ManagersContextType {
  authorizedManagers: AuthorizedManager[];
  isLoading: boolean;
  addManager: (email: string, name: string, platformFee?: number) => Promise<string>;
  updateManager: (id: string, updates: Partial<AuthorizedManager>) => Promise<void>;
  removeManager: (id: string) => Promise<void>;
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

export function ManagersProvider({ children }: { children: ReactNode }) {
  const [authorizedManagers, setAuthorizedManagers] = useState<AuthorizedManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchManagers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('authorized_managers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted: AuthorizedManager[] = data.map(m => ({
          id: m.id,
          email: m.email,
          name: m.name,
          panelName: m.panel_name,
          code: m.manager_code,
          platformFee: m.platform_fee ? parseFloat(m.platform_fee) : 3,
          blocked: m.blocked || false,
          authorizedAt: m.created_at,
          authorizedBy: 'super_admin'
        }));
        setAuthorizedManagers(formatted);
      }
    } catch (err) {
      console.error('Erro ao buscar gerentes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const addManager = async (email: string, name: string, platformFee: number = 3): Promise<string> => {
    const code = generateCode();
    const { error } = await supabase
      .from('authorized_managers')
      .insert({
        email: email.toLowerCase(),
        name,
        manager_code: code,
        panel_name: `Bolão de ${name}`,
        platform_fee: platformFee,
        blocked: false
      });

    if (error) throw error;
    await fetchManagers();
    return code;
  };

  const updateManager = async (id: string, updates: Partial<AuthorizedManager>) => {
    const fieldsToUpdate: any = {};
    if (updates.name !== undefined) fieldsToUpdate.name = updates.name;
    if (updates.panelName !== undefined) fieldsToUpdate.panel_name = updates.panelName;
    if (updates.email !== undefined) fieldsToUpdate.email = updates.email;
    if (updates.platformFee !== undefined) fieldsToUpdate.platform_fee = updates.platformFee;
    if (updates.blocked !== undefined) fieldsToUpdate.blocked = updates.blocked;

    const { error } = await supabase
      .from('authorized_managers')
      .update(fieldsToUpdate)
      .eq('id', id);

    if (error) throw error;
    await fetchManagers();
  };

  const removeManager = async (id: string) => {
    const { error } = await supabase
      .from('authorized_managers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchManagers();
  };

  const getManagerByCode = (code: string): AuthorizedManager | undefined => {
    return authorizedManagers.find(m => m.code === code.toUpperCase());
  };

  return (
    <ManagersContext.Provider value={{
      authorizedManagers,
      isLoading,
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
  if (context === undefined) throw new Error('useManagers must be used within a ManagersProvider');
  return context;
}
