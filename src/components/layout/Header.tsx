
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { UserIcon, LogOut, DollarSign } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <DollarSign size={24} />
          <span className="text-xl font-bold">Expense Track</span>
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1">
              <UserIcon size={16} />
              <span className="font-medium">
                {user.name} - {user.role === 'financeiro' ? 'Financeiro' : 
                  user.role === 'gestao' ? 'Gestão' : 
                  user.role === 'admin' ? 'Admin' : 'Funcionário'}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="bg-primary-foreground text-primary">
              <LogOut size={16} className="mr-1" />
              <span>Sair</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="bg-primary-foreground text-primary">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Registrar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
