import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken/authenticateToken";
import {
  createEvent,
  deleteEvent,
  getSharedUsers,
  updateEvent,
} from "../controllers/eventControllers";

const router = Router();

router.post("/createEvent", authenticateToken, createEvent);

router.get("/sharedUsers", authenticateToken, getSharedUsers);

router.put("/:id/update", updateEvent);
router.delete("/:id/delete", deleteEvent);

export default router;
