import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken/authenticateToken";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getSharedUsers,
  updateEvent,
} from "../controllers/eventControllers";

const router = Router();

router.post("/createEvent", authenticateToken, createEvent);

router.get("/get-event", authenticateToken, getEvent);
router.get("/sharedUsers", authenticateToken, getSharedUsers);

router.put("/:id/update", updateEvent);
router.delete("/delete/:id", authenticateToken, deleteEvent);

export default router;
