import express from "express";
import { registerUser, sendMail } from "./mail.controller.js";

const router = express.Router();

router.get("/register", registerUser);
router.post("/send", sendMail);

export default router;
