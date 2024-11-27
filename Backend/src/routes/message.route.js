import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", protectRoute,getUsersForSidebar);
router.get("/:id", protectRoute, getMessages)
router.get("/:id", protectRoute, sendMessages)


export default router;