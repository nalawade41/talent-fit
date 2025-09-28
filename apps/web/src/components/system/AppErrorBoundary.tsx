import React from 'react';

interface Props { children: React.ReactNode }
interface State { hasError: boolean }

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Placeholder for logging (Sentry, etc.)
    // eslint-disable-next-line no-console
    console.error('AppErrorBoundary caught error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center space-y-4">
            <h1 className="text-xl font-semibold text-red-600">Something went wrong</h1>
            <p className="text-gray-600 text-sm">An unexpected error occurred. Please refresh the page or try again later.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >Retry</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
