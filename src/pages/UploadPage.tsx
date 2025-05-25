
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ExpenseUploadForm from '../components/expenses/ExpenseUploadForm';
import { useAuth } from '../context/AuthContext';
import { useToast } from "@/hooks/use-toast";

const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Show toast for finance users when they try to access this page
    if (user && user.role === 'financeiro') {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Usuários do financeiro não precisam enviar despesas",
      });
    }
  }, [user, toast]);

  // Handle redirects without early returns
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role === 'financeiro') {
    return <Navigate to="/reports" />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enviar Comprovante</h1>
          <p className="text-muted-foreground">
            Envie os detalhes da despesa e anexe o comprovante para aprovação
          </p>
        </div>

        <div className="max-w-2xl">
          <ExpenseUploadForm />
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
