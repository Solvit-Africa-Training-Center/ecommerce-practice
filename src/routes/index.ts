import { Router } from "express";
import { userRouter } from "./userRoutes";
import { orderRoutes } from "./orderRoutes";

const routers = Router();
const allRoutes = [userRouter,orderRoutes];
routers.use("/api", ...allRoutes);
export { routers };
