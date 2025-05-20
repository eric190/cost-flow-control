
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ExpensesSummary from '../components/dashboard/ExpensesSummary';
import ExpensesList from '../components/dashboard/ExpensesList';
import { useAuth } from '../context/AuthContext';
import { Expense } from '@/types/user';

// Mock data
const mockExpenses: Expense[] = [
  {
    id: '1',
    userId: '4',
    userName: 'Employee',
    department: 'Marketing',
    description: 'Almoço com cliente',
    amount: 120.50,
    date: '2023-05-10',
    status: 'approved',
    approvedBy: 'Financial Manager'
  },
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
    id: '3',
    userId: '4',
    userName: 'Employee',
    department: 'Marketing',
    description: 'Material de escritório',
    amount: 89.90,
    date: '2023-05-15',
    status: 'rejected',
    comments: 'Falta comprovante fiscal'
  },
  {
    id: '4',
    userId: '3',
    userName: 'Department Manager',
    department: 'TI',
    description: 'Hospedagem para conferência',
    amount: 750.00,
    date: '2023-05-18',
    status: 'approved',
    approvedBy: 'Financial Manager'
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
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Filter expenses based on user role
  let filteredExpenses = mockExpenses;
  let recentExpenses = mockExpenses;
  
  if (user.role === 'funcionario') {
    // Employees can only see their own expenses
    filteredExpenses = mockExpenses.filter(e => e.userId === user.id);
    recentExpenses = filteredExpenses.slice(0, 5);
  } else if (user.role === 'gestao') {
    // Managers can see expenses from their department
    filteredExpenses = mockExpenses.filter(e => e.department === user.department);
    recentExpenses = filteredExpenses.slice(0, 5);
  }
  // Financeiro and Admin can see all expenses

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral de despesas{' '}
            {user.role === 'funcionario'
              ? 'pessoais'
              : user.role === 'gestao'
              ? `do departamento ${user.department}`
              : 'da empresa'}
          </p>
        </div>

        <ExpensesSummary expenses={filteredExpenses} />

        <ExpensesList
          expenses={recentExpenses}
          title="Despesas Recentes"
          description="Últimas despesas registradas"
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
