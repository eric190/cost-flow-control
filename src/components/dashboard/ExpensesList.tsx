
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Expense } from "@/types/user";
import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface ExpensesListProps {
  expenses: Expense[];
  title: string;
  description?: string;
}

const ExpensesList = ({ expenses, title, description }: ExpensesListProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="success">Aprovado</Badge>;
      case "rejected":
        return <Badge className="rejected">Rejeitado</Badge>;
      default:
        return <Badge className="pending">Pendente</Badge>;
    }
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma despesa encontrada.
            </p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="animate-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{expense.description}</h4>
                      <div className="text-sm text-muted-foreground flex gap-2 items-center">
                        <span>{expense.department}</span>
                        <span>•</span>
                        <span>{format(new Date(expense.date), "dd/MM/yyyy")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">R$ {expense.amount.toFixed(2)}</div>
                        <div>{getStatusBadge(expense.status)}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedExpense(expense)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        {selectedExpense && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Despesa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Descrição</h4>
                  <p>{selectedExpense.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Valor</h4>
                  <p>R$ {selectedExpense.amount.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Data</h4>
                  <p>{format(new Date(selectedExpense.date), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <p>{getStatusBadge(selectedExpense.status)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Departamento</h4>
                  <p>{selectedExpense.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Funcionário</h4>
                  <p>{selectedExpense.userName}</p>
                </div>
              </div>
              
              {selectedExpense.comments && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Comentários</h4>
                  <p>{selectedExpense.comments}</p>
                </div>
              )}

              {selectedExpense.receiptUrl && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Comprovante</h4>
                  <Button variant="outline" className="mt-1">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Comprovante
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default ExpensesList;
