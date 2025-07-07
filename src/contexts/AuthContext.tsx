import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cliente, AuthContextType } from '../types';
import { clienteAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: AuthProviderProps) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um token salvo
    const token = localStorage.getItem('cliente_token');
    const clienteData = localStorage.getItem('cliente_data');
    
    if (token && clienteData) {
      try {
        setCliente(JSON.parse(clienteData));
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        localStorage.removeItem('cliente_token');
        localStorage.removeItem('cliente_data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (telefone: string, senha: string) => {
    try {
      const { cliente: clienteData, token } = await clienteAPI.login(telefone, senha);
      // Mapear os dados do backend para o formato do frontend
      const c: any = clienteData;
      const clienteMapeado = {
        id: c.id,
        nome: c.name || c.nome,
        telefone: (c.phone || c.telefone || '').replace(/\D/g, ''), // só números
        email: c.email,
        endereco: c.address || c.endereco,
        data_cadastro: new Date().toISOString()
      };
      setCliente(clienteMapeado);
      localStorage.setItem('cliente_token', token);
      localStorage.setItem('cliente_data', JSON.stringify(clienteMapeado));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setCliente(null);
    localStorage.removeItem('cliente_token');
    localStorage.removeItem('cliente_data');
  };

  const value: AuthContextType = {
    cliente,
    login,
    logout,
    isAuthenticated: !!cliente,
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 