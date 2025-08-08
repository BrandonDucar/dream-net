// ErrorBoundary.tsx
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🔥 DreamCore Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-4xl mb-4">🌪️</div>
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Something went wrong loading dreams
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4 text-center">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={this.retry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Database Error Fallback Component
export const DatabaseErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => {
  const isDatabaseError = error?.message?.includes('endpoint has been disabled') || 
                         error?.message?.includes('DB') ||
                         error?.message?.includes('database');

  if (isDatabaseError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="text-6xl mb-6">🗄️</div>
        <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
          Database Connection Issue
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300 mb-6 text-center max-w-md">
          The database endpoint is currently disabled. Using static dream data while connection is restored.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={retry}
            className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Retry Connection
          </button>
          <button 
            onClick={() => window.location.href = '/dreams'}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View Static Dreams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="text-lg font-semibold mb-2">Application Error</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button 
        onClick={retry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};