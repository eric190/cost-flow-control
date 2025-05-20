
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Upload } from 'lucide-react';

const ExpenseUploadForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !date || !file) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Todos os campos são obrigatórios",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Despesa enviada com sucesso!",
        description: "Sua despesa foi enviada para aprovação.",
      });
      
      // Reset form
      setDescription('');
      setAmount('');
      setDate('');
      setFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua despesa",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Nova Despesa</CardTitle>
        <CardDescription>Preencha os dados da despesa e anexe o comprovante</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Despesa</Label>
            <Textarea
              id="description"
              placeholder="Ex: Almoço com cliente, Táxi para reunião, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2 flex-1">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="receipt">Comprovante (PDF, JPG, PNG)</Label>
            <div className="border border-dashed border-input rounded-md p-6 text-center">
              <Input
                id="receipt"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Label htmlFor="receipt" className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="font-medium mb-1">
                  {file ? file.name : "Clique para selecionar um arquivo"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)}MB` : "PDF, JPG ou PNG até 10MB"}
                </span>
              </Label>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Despesa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseUploadForm;
