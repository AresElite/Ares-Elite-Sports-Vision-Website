import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message: string;
}

// Catches render-time errors so one broken component can't blank the whole site.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown) {
    // Surface to the console for diagnostics without taking the page down.
    console.error('App error boundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-[var(--color-ares-bg)] px-6 text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-white mb-3">Something went wrong loading this page.</h1>
            <p className="text-[var(--color-ares-muted)] mb-6">
              Please refresh. If it keeps happening, our team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[var(--color-ares-teal)] text-[var(--color-ares-bg)] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
