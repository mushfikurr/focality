import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

export function useGuest({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [authLoading, setAuthLoading] = useState(!isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      actions.signIn("anonymous").finally(() => {
        setAuthLoading(false);
      });
    } else {
      setAuthLoading(false);
    }
  }, [actions, isAuthenticated]);

  const user = useQuery(api.auth.getCurrentUser);

  return { user, isLoading: authLoading };
}
