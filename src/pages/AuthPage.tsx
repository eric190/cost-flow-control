
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from '../components/layout/Layout';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Expense Track</h1>
          <p className="text-muted-foreground">Sistema de controle de despesas</p>
        </div>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AuthPage;
