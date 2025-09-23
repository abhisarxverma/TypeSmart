import { Router } from "express";
import { sendEmail } from "../utils/sendEmail.js";

const router = Router()

router.post("/send_feedback", async (req, res) => {
    const { text } = req.body;

    const success = await sendEmail(text);

    if (success) res.status(200).json({ ok: true });
    else res.status(500).json({ ok: false, error: "Failed to send email" });
})

export default router;