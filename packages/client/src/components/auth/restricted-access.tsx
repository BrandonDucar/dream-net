import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function RestrictedAccess() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-red-500/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-lg flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-red-400">Access Restricted</CardTitle>
            <p className="text-muted-foreground">Your wallet address is not authorized for admin access</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Only authorized admin wallets can access the Dream Network Dashboard.
            Please contact an administrator if you believe this is an error.
          </p>
          <Button 
            variant="outline" 
            onClick={logout}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}