
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Expense } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ExpenseApprovalListProps {
  expenses: Expense[];
  onUpdateStatus: (id: string, status: "approved" | "rejected", comments?: string) => void;
}

const ExpenseApprovalList = ({ expenses, onUpdateStatus }: ExpenseApprovalListProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleApprove = () => {
    if (!selectedExpense) return;
    
    onUpdateStatus(selectedExpense.id, "approved", comment);
    toast({
      title: "Despesa aprovada",
      description: "A despesa foi aprovada com sucesso.",
    });
    handleClose();
  };

  const handleReject = () => {
    if (!selectedExpense) return;
    
    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Comentário obrigatório",
        description: "Por favor, forneça um motivo para a rejeição.",
      });
      return;
    }
    
    onUpdateStatus(selectedExpense.id, "rejected", comment);
    toast({
      title: "Despesa rejeitada",
      description: "A despesa foi rejeitada com sucesso.",
    });
    handleClose();
  };

  const handleClose = () => {
    setSelectedExpense(null);
    setComment("");
  };

  if (expenses.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Despesas Pendentes</CardTitle>
          <CardDescription>Despesas aguardando sua aprovação</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Não há despesas pendentes de aprovação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Despesas Pendentes</CardTitle>
          <CardDescription>Despesas aguardando sua aprovação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="border rounded-lg p-4 animate-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <div className="text-sm text-muted-foreground">
                      {expense.userName} • {expense.department} • 
                      {format(new Date(expense.date), " dd/MM/yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <div className="font-medium">R$ {expense.amount.toFixed(2)}</div>
                      <Badge className="pending">Pendente</Badge>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedExpense} onOpenChange={handleClose}>
        {selectedExpense && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Revisar Despesa</DialogTitle>
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
                  <h4 className="text-sm font-medium text-muted-foreground">Funcionário</h4>
                  <p>{selectedExpense.userName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Departamento</h4>
                  <p>{selectedExpense.department}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Comentários (obrigatório para rejeição)</h4>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Adicione um comentário sobre esta despesa..."
                />
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" />
                  Rejeitar
                </Button>
                <Button
                  variant="default"
                  onClick={handleApprove}
                  className="flex items-center gap-1 bg-success hover:bg-success/90"
                >
                  <CheckCircle className="h-4 w-4" />
                  Aprovar
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default ExpenseApprovalList;
