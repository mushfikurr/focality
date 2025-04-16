import { query } from "../_generated/server";

export const getCurrentServerTime = query({
  handler: async () => {
    return Date.now();
  },
});
