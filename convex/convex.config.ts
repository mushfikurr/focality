import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config";
import betterAuth from "@convex-dev/better-auth/convex.config";

const app = defineApp();
app.use(aggregate);
app.use(aggregate, { name: "aggregateDurationByUser" });
app.use(aggregate, { name: "aggregateSessionCompletionByUser" });
app.use(betterAuth);

export default app;
