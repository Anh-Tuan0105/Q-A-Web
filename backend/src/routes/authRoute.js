import express  from "express";
import { signUp, signIn, logOut, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", logOut);

router.post("/refresh", refreshToken);

export default router;