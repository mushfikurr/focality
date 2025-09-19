import { httpRouter } from "convex/server";
import { createAuth } from "../lib/auth";
import { authComponent } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

export default http;
