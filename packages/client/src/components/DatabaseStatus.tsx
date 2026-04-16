import { useDatabaseFallback } from '@/hooks/use-database-fallback';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, AlertTriangle } from 'lucide-react';

export function DatabaseStatus() {
  const { 
    isDatabaseError, 
    isUsingFallback, 
    errorMessage, 
    hasConnection,
    enableFallbackMode,
    disableFallbackMode 
  } = useDatabaseFallback();

  if (hasConnection && !isDatabaseError) {
    return null; // Don't show anything when database is working
  }

  if (isDatabaseError && !isUsingFallback) {
    return (
      <Alert className="mb-4 border-red-200 dark:border-red-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>Database Connection Issue:</strong> {errorMessage}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={enableFallbackMode}
            >
              Use Static Data
            </Button>
            <Button 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (isUsingFallback) {
    return (
      <Alert className="mb-4 border-yellow-200 dark:border-yellow-800">
        <Database className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>Fallback Mode:</strong> Using static dream data while database reconnects
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={disableFallbackMode}
          >
            Try Database Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}