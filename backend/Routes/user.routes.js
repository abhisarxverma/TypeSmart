import { Router } from "express";
import requireAuth from "../Middlewares/requireAuth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => {
    return res.json(req.user)
})

export default router;