import { Router } from "express";
import requireAuth from "../Middlewares/requireAuth.js";
import { addInGroup, createGroup, getLibrary, removeFromGroup, uploadText, editText  } from "../Controllers/library.controller.js";

const router = Router();

router.post("/add_text", requireAuth, uploadText);

router.post("/edit_text", requireAuth, editText)

router.get("/library", requireAuth, getLibrary);

router.post("/create_group", requireAuth, createGroup)

router.post("/add_in_group", requireAuth, addInGroup)

router.post("/remove_from_group", requireAuth, removeFromGroup)

export default router;