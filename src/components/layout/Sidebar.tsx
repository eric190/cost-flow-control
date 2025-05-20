
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Upload, 
  FileText, 
  Users, 
  Settings, 
  User, 
  DollarSign,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/", roles: ['admin', 'financeiro', 'gestao', 'funcionario'] },
    { label: "Minhas Despesas", icon: <FileText size={20} />, path: "/expenses", roles: ['admin', 'funcionario'] },
    { label: "Enviar Comprovante", icon: <Upload size={20} />, path: "/upload", roles: ['admin', 'funcionario'] },
    { label: "Aprovar Despesas", icon: <DollarSign size={20} />, path: "/approve", roles: ['admin', 'financeiro', 'gestao'] },
    { label: "Relatórios", icon: <BarChart3 size={20} />, path: "/reports", roles: ['admin', 'financeiro', 'gestao'] },
    { label: "Usuários", icon: <Users size={20} />, path: "/users", roles: ['admin'] },
    { label: "Configurações", icon: <Settings size={20} />, path: "/settings", roles: ['admin'] },
    { label: "Meu Perfil", icon: <User size={20} />, path: "/profile", roles: ['admin', 'financeiro', 'gestao', 'funcionario'] },
  ];
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-16 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-accent transition-all",
                  isActive(item.path) && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
