
export type UserRole = 'financeiro' | 'gestao' | 'funcionario' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  manager?: string;
}

export interface Expense {
  id: string;
  userId: string;
  userName: string;
  department: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  approvedBy?: string;
  comments?: string;
}
