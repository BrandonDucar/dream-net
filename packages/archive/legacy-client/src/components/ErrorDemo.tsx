import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorBoundary, DatabaseErrorFallback } from '@/components/ErrorBoundary';

// Component that throws an error on demand
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("🌪️ Demo error: This is a test React error for ErrorBoundary demonstration");
  }
  
  return (
    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
      <h3 className="text-green-400 font-semibold mb-2">✅ Component Working Normally</h3>
      <p className="text-green-300 text-sm">This component is functioning correctly and not throwing any errors.</p>
    </div>
  );
};

// Component that simulates database errors
const DatabaseErrorComponent = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error("The endpoint has been disabled. Enable it using Neon API and retry.");
  }
  
  return (
    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
      <h3 className="text-blue-400 font-semibold mb-2">🗄️ Database Connected</h3>
      <p className="text-blue-300 text-sm">Database connection is stable and queries are working normally.</p>
    </div>
  );
};

export const ErrorDemo = () => {
  const [throwReactError, setThrowReactError] = useState(false);
  const [throwDbError, setThrowDbError] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-electric-cyan">ErrorBoundary Demonstration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use the buttons below to trigger different types of errors and see how the ErrorBoundary handles them.
          </p>
          
          <div className="flex gap-3">
            <Button 
              variant={throwReactError ? "destructive" : "outline"}
              onClick={() => setThrowReactError(!throwReactError)}
            >
              {throwReactError ? "Stop React Error" : "Trigger React Error"}
            </Button>
            
            <Button 
              variant={throwDbError ? "destructive" : "outline"}
              onClick={() => setThrowDbError(!throwDbError)}
            >
              {throwDbError ? "Stop DB Error" : "Trigger Database Error"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">React Error Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary>
              <ErrorThrowingComponent shouldThrow={throwReactError} />
            </ErrorBoundary>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Database Error Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorBoundary fallback={DatabaseErrorFallback}>
              <DatabaseErrorComponent shouldError={throwDbError} />
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorDemo;