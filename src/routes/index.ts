import { Router } from "express";
import authRoutes         from "./auth.routes";
import userRoutes         from "./user.routes";
import presentationRoutes from "./presentation.routes";
import slideRoutes        from "./slide.routes";
import templateRoutes     from "./template.routes";
import aiRoutes           from "./ai.routes";
import billingRoutes      from "./billing.routes";

export const apiRouter = Router();

apiRouter.use("/auth",          authRoutes);
apiRouter.use("/user",          userRoutes);
apiRouter.use("/presentations", presentationRoutes);
apiRouter.use("/slides",        slideRoutes);
apiRouter.use("/templates",     templateRoutes);
apiRouter.use("/ai",            aiRoutes);
apiRouter.use("/billing",       billingRoutes);
