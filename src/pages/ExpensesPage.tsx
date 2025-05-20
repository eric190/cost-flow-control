
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ExpensesList from '../components/dashboard/ExpensesList';
import { useAuth } from '../context/AuthContext';
import { Expense } from '@/types/user';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  },
  {
    id: '6',
    userId: '4',
    userName: 'Employee',
    department: 'Marketing',
    description: 'Passagem aérea',
    amount: 1250.00,
    date: '2023-05-25',
    status: 'approved',
    approvedBy: 'Financial Manager'
  },
  {
    id: '7',
    userId: '4',
    userName: 'Employee',
    department: 'Marketing',
    description: 'Hotel',
    amount: 850.00,
    date: '2023-05-25',
    status: 'approved',
    approvedBy: 'Financial Manager'
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

const ExpensesPage: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Filter expenses based on user role
  let filteredExpenses = mockExpenses;
  
  if (user.role === 'funcionario') {
    // Employees can only see their own expenses
    filteredExpenses = mockExpenses.filter(e => e.userId === user.id);
  } else if (user.role === 'gestao') {
    // Managers can see expenses from their department
    filteredExpenses = mockExpenses.filter(e => e.department === user.department);
  }
  
  // Apply status filter
  if (statusFilter !== "all") {
    filteredExpenses = filteredExpenses.filter(e => e.status === statusFilter);
  }
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredExpenses = filteredExpenses.filter(
      e => e.description.toLowerCase().includes(query) || 
           e.department.toLowerCase().includes(query)
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Despesas</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as suas despesas
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Buscar por descrição ou departamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <Label htmlFor="status">Filtrar por status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ExpensesList
          expenses={filteredExpenses}
          title="Histórico de Despesas"
          description="Lista completa de todas as suas despesas"
        />
      </div>
    </Layout>
  );
};

export default ExpensesPage;
