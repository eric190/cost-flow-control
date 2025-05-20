
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/user";
import { DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";

interface ExpensesSummaryProps {
  expenses: Expense[];
}

const ExpensesSummary: React.FC<ExpensesSummaryProps> = ({ expenses }) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedAmount = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const rejectedAmount = expenses
    .filter((e) => e.status === "rejected")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingAmount = expenses
    .filter((e) => e.status === "pending")
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {totalAmount.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">R$ {approvedAmount.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">R$ {rejectedAmount.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">R$ {pendingAmount.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesSummary;
