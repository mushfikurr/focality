"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  message?: string;
  showRetry?: boolean;
  showBackToDashboard?: boolean;
  backHref?: string;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error & { digest?: string };
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const {
        title = ":(",
        message,
        showRetry = true,
        showBackToDashboard = true,
        backHref = "/dashboard",
      } = this.props;

      const error = this.state.error;

      return (
        <div className="container -mt-9 flex w-full max-w-2xl grow flex-col space-y-6 pb-8">
          <h1 className="text-4xl">{title}</h1>
          <div className="space-y-2">
            <h2>Something went wrong</h2>
            {message && <p className="text-muted-foreground">{message}</p>}
            {error && (
              <p className="text-muted-foreground text-sm">
                Error: {error.digest || error.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {showRetry && (
              <Button onClick={this.handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            )}
            {showBackToDashboard && (
              <Link
                className={buttonVariants({ variant: "outline" })}
                href={backHref}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to dashboard
              </Link>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper for common use cases
export function PageErrorBoundary({
  children,
  title,
  message,
}: {
  children: ReactNode;
  title?: string;
  message?: string;
}) {
  return (
    <ErrorBoundary
      title={title}
      message={message}
      showRetry={true}
      showBackToDashboard={true}
    >
      {children}
    </ErrorBoundary>
  );
}

// For components that should show minimal error UI
export function ComponentErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={fallback}
      showRetry={false}
      showBackToDashboard={false}
    >
      {children}
    </ErrorBoundary>
  );
}

// Wrapper for Next.js error.tsx files to use our ErrorBoundary
export function NextErrorBoundary({
  error,
  reset,
  title = ":(",
  message,
  showRetry = true,
  showBackToDashboard = true,
  backHref = "/dashboard",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
  showBackToDashboard?: boolean;
  backHref?: string;
}) {
  return (
    <div className="container mx-auto -mt-9 flex w-full max-w-2xl grow flex-col justify-center space-y-6 pb-8">
      <h1 className="text-4xl">{title}</h1>
      <div className="space-y-2">
        <h2>Something went wrong</h2>
        {message && <p className="text-muted-foreground">{message}</p>}
        {error && (
          <p className="text-muted-foreground text-sm">
            Error: {error.digest || error.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {showRetry && (
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
        {showBackToDashboard && (
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={backHref}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
