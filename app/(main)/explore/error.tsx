"use client";

import { NextErrorBoundary } from "@/components/common/error-boundary";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <NextErrorBoundary
      error={error}
      resetAction={reset}
      title=":("
      message="We couldn&apos;t load the session list. Please check your connection and try again."
    />
  );
}