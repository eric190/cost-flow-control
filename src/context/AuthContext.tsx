
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole, department?: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Financial Manager', email: 'finance@example.com', role: 'financeiro' },
  { id: '3', name: 'Department Manager', email: 'manager@example.com', role: 'gestao', department: 'Marketing' },
  { id: '4', name: 'Employee', email: 'employee@example.com', role: 'funcionario', department: 'Marketing', manager: 'Department Manager' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('expense-track-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') { // In real app, would check hashed password
        setUser(foundUser);
        localStorage.setItem('expense-track-user', JSON.stringify(foundUser));
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${foundUser.name}!`,
        });
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar fazer login",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, department?: string) => {
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const userExists = mockUsers.some(u => u.email === email);
      if (userExists) {
        throw new Error('Email já cadastrado');
      }
      
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        name,
        email,
        role,
        department
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('expense-track-user', JSON.stringify(newUser));
      
      toast({
        title: "Registro realizado com sucesso",
        description: `Bem-vindo, ${name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao registrar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar registrar",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expense-track-user');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
