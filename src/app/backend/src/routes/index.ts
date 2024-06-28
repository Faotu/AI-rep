import { Router } from "express";
import userRoutes from "./user-router.js";
import chatRoutes from "./chat-routes.js";

const appRouter = Router();

appRouter.use("/user", userRoutes);
appRouter.use("/chat", chatRoutes);

export default appRouter;
