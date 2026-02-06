import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RequireAuthProps {
  children: React.ReactNode;
  message?: string;
}

export default function RequireAuth({ children, message = 'Please log in to continue' }: RequireAuthProps) {
  const { identity, login, loginStatus } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription className="mt-2">
              {message}
            </AlertDescription>
          </Alert>
          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            className="w-full mt-4"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login with Internet Identity'}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
