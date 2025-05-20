
import React, { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ExpensesList from '../components/dashboard/ExpensesList';
import ExpensesSummary from '../components/dashboard/ExpensesSummary';
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { ChartBarIcon, ChartPieIcon } from 'lucide-react';

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

// Extended mock data for the departments
const departmentMockData = [
  { name: 'Marketing', value: 1735.5 },
  { name: 'Vendas', value: 2100.0 },
  { name: 'TI', value: 3200.0 },
  { name: 'RH', value: 950.0 },
  { name: 'Financeiro', value: 1280.0 }
];

// Extended mock data for employees
const employeeMockData = [
  { name: 'Employee', department: 'Marketing', expenses: 1635.0 },
  { name: 'John Doe', department: 'Marketing', expenses: 120.5 },
  { name: 'Jane Smith', department: 'TI', expenses: 800.0 },
  { name: 'Carlos Silva', department: 'Vendas', expenses: 1200.0 },
  { name: 'Ana Oliveira', department: 'Vendas', expenses: 900.0 },
  { name: 'Pedro Santos', department: 'TI', expenses: 2400.0 },
  { name: 'Maria Costa', department: 'RH', expenses: 950.0 },
  { name: 'Roberto Lima', department: 'Financeiro', expenses: 1280.0 }
];

const COLORS = ['#9b87f5', '#7E69AB', '#F97316', '#33C3F0', '#8E9196', '#ea384c'];

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [expenses] = useState<Expense[]>(mockExpenses);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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

  // Calculate expenses by department for finance role
  const departmentExpenses = useMemo(() => {
    if (user.role !== 'financeiro' && user.role !== 'admin') {
      return [];
    }
    
    return departmentMockData;
  }, [user.role]);

  // Calculate expenses by employee for finance role
  const employeeExpenses = useMemo(() => {
    if (user.role !== 'financeiro' && user.role !== 'admin') {
      return [];
    }
    
    return employeeMockData;
  }, [user.role]);

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
        <ExpensesSummary expenses={filteredExpenses} />

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            {(user.role === 'financeiro' || user.role === 'admin') && (
              <>
                <TabsTrigger value="departments">Por Departamento</TabsTrigger>
                <TabsTrigger value="employees">Por Funcionário</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Overview Tab - Basic expense table */}
          <TabsContent value="overview" className="space-y-4">
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
          </TabsContent>

          {/* Department Expenses Tab - For Finance role only */}
          {(user.role === 'financeiro' || user.role === 'admin') && (
            <TabsContent value="departments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Despesas por Departamento</CardTitle>
                  <CardDescription>
                    Visão geral dos gastos de cada departamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        Marketing: {
                          color: COLORS[0],
                        },
                        Vendas: {
                          color: COLORS[1],
                        },
                        TI: {
                          color: COLORS[2],
                        },
                        RH: {
                          color: COLORS[3],
                        },
                        Financeiro: {
                          color: COLORS[4],
                        },
                      }}
                    >
                      <BarChart
                        data={departmentExpenses}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent 
                              labelFormatter={(value) => `Departamento: ${value}`}
                              formatter={(value) => [`R$ ${value.toFixed(2)}`, "Valor"]}
                            />
                          }
                        />
                        <Legend />
                        <Bar dataKey="value" name="Valor (R$)" fill="var(--color-Marketing)" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                  
                  <div className="mt-8 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Departamento</TableHead>
                          <TableHead className="text-right">Total de Despesas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentExpenses.map((dept) => (
                          <TableRow key={dept.name}>
                            <TableCell>{dept.name}</TableCell>
                            <TableCell className="text-right">R$ {dept.value.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="font-bold text-right">
                            R$ {departmentExpenses.reduce((sum, dept) => sum + dept.value, 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Gastos</CardTitle>
                  <CardDescription>
                    Proporção de gastos por departamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        Marketing: { color: COLORS[0] },
                        Vendas: { color: COLORS[1] },
                        TI: { color: COLORS[2] },
                        RH: { color: COLORS[3] },
                        Financeiro: { color: COLORS[4] },
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={departmentExpenses}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {departmentExpenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={
                            <ChartTooltipContent
                              formatter={(value) => [`R$ ${value.toFixed(2)}`, "Valor"]}
                            />
                          }
                        />
                      </PieChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Employee Expenses Tab - For Finance role only */}
          {(user.role === 'financeiro' || user.role === 'admin') && (
            <TabsContent value="employees" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Despesas por Funcionário</CardTitle>
                  <CardDescription>
                    Visão detalhada dos gastos de cada funcionário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        expenses: { color: "#9b87f5" },
                      }}
                    >
                      <BarChart
                        data={employeeExpenses}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ angle: -45 }} 
                          textAnchor="end" 
                          height={70}
                        />
                        <YAxis />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent 
                              labelFormatter={(value) => `Funcionário: ${value}`}
                              formatter={(value, name) => [`R$ ${value.toFixed(2)}`, "Despesas"]}
                            />
                          }
                        />
                        <Legend />
                        <Bar 
                          dataKey="expenses" 
                          name="Valor (R$)" 
                          fill="var(--color-expenses)"
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>

                  <div className="mt-8 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Funcionário</TableHead>
                          <TableHead>Departamento</TableHead>
                          <TableHead className="text-right">Total de Despesas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeeExpenses.map((emp) => (
                          <TableRow key={emp.name}>
                            <TableCell>{emp.name}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell className="text-right">R$ {emp.expenses.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} className="font-bold">Total</TableCell>
                          <TableCell className="font-bold text-right">
                            R$ {employeeExpenses.reduce((sum, emp) => sum + emp.expenses, 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Group by Department */}
              <Card>
                <CardHeader>
                  <CardTitle>Despesas por Funcionário (Agrupado por Departamento)</CardTitle>
                  <CardDescription>
                    Total de despesas de cada funcionário, agrupado por departamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {Array.from(new Set(employeeExpenses.map(emp => emp.department))).map(department => (
                      <div key={department} className="space-y-4">
                        <h3 className="text-lg font-semibold">{department}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Funcionário</TableHead>
                              <TableHead className="text-right">Total de Despesas</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {employeeExpenses
                              .filter(emp => emp.department === department)
                              .map(emp => (
                                <TableRow key={emp.name}>
                                  <TableCell>{emp.name}</TableCell>
                                  <TableCell className="text-right">R$ {emp.expenses.toFixed(2)}</TableCell>
                                </TableRow>
                              ))
                            }
                            <TableRow>
                              <TableCell className="font-bold">Total do Departamento</TableCell>
                              <TableCell className="font-bold text-right">
                                R$ {employeeExpenses
                                  .filter(emp => emp.department === department)
                                  .reduce((sum, emp) => sum + emp.expenses, 0).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportsPage;
