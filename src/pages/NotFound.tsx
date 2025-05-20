
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link to="/">
          <Button>Voltar à página inicial</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
