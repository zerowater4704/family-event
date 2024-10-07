import { Router } from "express";

import { authenticateToken } from "../middlewares/authenticateToken/authenticateToken";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getSharedEvents,
  getSharedUsers,
  updateEvent,
} from "../controllers/eventControllers";

const router = Router();

router.post("/createEvent", authenticateToken, createEvent);

router.get("/get-event", authenticateToken, getEvent);
router.get("/sharedUsers", authenticateToken, getSharedUsers);
router.get("/sharedEvents", authenticateToken, getSharedEvents);

router.put("/:id/update", updateEvent);
router.delete("/delete/:id", authenticateToken, deleteEvent);

export default router;
