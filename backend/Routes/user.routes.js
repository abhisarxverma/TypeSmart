import { Router } from "express";
import requireAuth from "../Middlewares/requireAuth.js";
import { createFolder, getLibrary, uploadFile } from "../Controllers/user.controller.js";

const router = Router();

router.post("/upload_file", requireAuth, uploadFile);

router.get("/library", requireAuth, getLibrary);

router.post("/create_folder", requireAuth, createFolder)

router.post("/increment_avg_wpm", requireAuth, async (req, res) => {
    try {
        const {new_avg_wpm} = req.body;
        const { data, error } = await req.sb
            .from('users')
            .update({ avg_wpm: new_avg_wpm }) 
            .eq("id", req.user.id)
            .select('*')
            .single();

        if (error) {
            console.log("Error in Avg wpm increment : ", error);
            return res.json({ error: "Unexpected server error" })
        }
        else {
            return res.json(data);
        }

    } catch (error) {
        console.log("Error in Avg wpm increment fetch : ", error);
        return res.json({ error: "Unexpected server error" })
    }
})

export default router;