import { Router } from "express";
import requireAuth from "../Middlewares/requireAuth.js";
import { getUser } from "../Controllers/auth.controller.js";

const router = Router();

router.get("/getuser", requireAuth, getUser)

export default router;