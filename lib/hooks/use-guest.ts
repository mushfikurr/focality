import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

export function useGuest({ isAuthenticated }: { isAuthenticated: boolean }) {
  const actions = useAuthActions();
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

  const user = useQuery(api.user.currentUser);

  return { user, isLoading: authLoading };
}
