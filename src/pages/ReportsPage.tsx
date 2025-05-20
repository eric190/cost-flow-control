
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ExpensesList from '../components/dashboard/ExpensesList';
import { useAuth } from '../context/AuthContext';
import { Expense } from '@/types/user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

// Mock data
const mockExpenses: Expense[] = [
  {
    id: '1',
    userId: '4',
    userName: 'Employee',
    department: 'Marketing',
    description: 'Viagem para conferência',
    amount: 1250.00,
    date: '2023-05-10',
    status: 'approved',
    approvedBy: 'Department Manager'
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
    userId: '5',
    userName: 'John Doe',
    department: 'Marketing',
    description: 'Almoço com cliente',
    amount: 120.50,
    date: '2023-05-15',
    status: 'approved',
    approvedBy: 'Department Manager'
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
  },
  {
    id: '10',
    userId: '6',
    userName: 'Jane Smith',
    department: 'TI',
    description: 'Novo monitor',
    amount: 800.00,
    date: '2023-05-30',
    status: 'rejected',
    comments: 'É necessário aprovação prévia para compras de equipamentos',
    approvedBy: 'Financial Manager'
  }
];

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [expenses] = useState<Expense[]>(mockExpenses);
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
    // Managers can only see expenses from their department
    filteredExpenses = expenses.filter(e => e.department === user.department);
  }

  // Calculate summary data
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'pending');
  const pendingAmount = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedExpenses = filteredExpenses.filter(e => e.status === 'approved');
  const approvedAmount = approvedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatório de Despesas</h1>
          <p className="text-muted-foreground">
            {user.role === 'gestao' 
              ? `Despesas do departamento ${user.department}`
              : 'Despesas de todos os departamentos'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredExpenses.length} despesas registradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Despesas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingExpenses.length} despesas aguardando aprovação
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Despesas Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {approvedAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {approvedExpenses.length} despesas já aprovadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento de Despesas</CardTitle>
            <CardDescription>
              Lista completa de todas as despesas {user.role === 'gestao' ? `do departamento ${user.department}` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(new Date(expense.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{expense.userName}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>R$ {expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {expense.status === 'approved' && <span className="text-green-500">Aprovado</span>}
                      {expense.status === 'rejected' && <span className="text-red-500">Rejeitado</span>}
                      {expense.status === 'pending' && <span className="text-yellow-500">Pendente</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Expenses List */}
        {pendingExpenses.length > 0 && (
          <ExpensesList 
            expenses={pendingExpenses}
            title="Despesas Pendentes"
            description="Despesas aguardando aprovação"
          />
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
