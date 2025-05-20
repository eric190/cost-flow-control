
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ExpenseApprovalList from '../components/expenses/ExpenseApprovalList';
import { useAuth } from '../context/AuthContext';
import { Expense } from '@/types/user';
import { useToast } from "@/components/ui/use-toast";

// Mock data
const initialMockExpenses: Expense[] = [
  {
    id: '2',
    userId: '4',
    userName: 'Employee',
    department: 'Marketing',
    description: 'Táxi para reunião',
    amount: 45.00,
    date: '2023-05-12',
    status: 'pending'
  },
  {
    id: '5',
    userId: '3',
    userName: 'Department Manager',
    department: 'TI',
    description: 'Inscrição para workshop',
    amount: 350.00,
    date: '2023-05-20',
    status: 'pending'
  },
  {
    id: '8',
    userId: '4',
    userName: 'Employee',
    department: 'Marketing',
    description: 'Refeições em viagem',
    amount: 320.00,
    date: '2023-05-26',
    status: 'pending'
  }
];

const ApprovePage: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(initialMockExpenses);
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Only financeiro, gestao, and admin can access this page
  if (user.role === 'funcionario') {
    toast({
      variant: "destructive",
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta página",
    });
    return <Navigate to="/" />;
  }

  // Filter expenses based on user role
  let filteredExpenses = expenses;
  
  if (user.role === 'gestao') {
    // Managers can only approve expenses from their department
    filteredExpenses = expenses.filter(e => e.department === user.department && e.status === 'pending');
  } else {
    // Financeiro and Admin can approve all pending expenses
    filteredExpenses = expenses.filter(e => e.status === 'pending');
  }

  const handleUpdateStatus = (id: string, status: "approved" | "rejected", comments?: string) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id 
        ? { 
            ...expense, 
            status, 
            comments: comments || expense.comments,
            approvedBy: user.name
          } 
        : expense
    ));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aprovar Despesas</h1>
          <p className="text-muted-foreground">
            {user.role === 'gestao' 
              ? `Revise e aprove as despesas do departamento ${user.department}`
              : 'Revise e aprove as despesas de todos os departamentos'}
          </p>
        </div>

        <ExpenseApprovalList 
          expenses={filteredExpenses}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </Layout>
  );
};

export default ApprovePage;
