import express from "express";

import {
  createNotification,
  markNotificationAsRead,
  markNotificationAsUnread,
  getAllNotifications,
  getNotificationById,
  getNotificationsByUserId,
} from "../controllers/notificationController.js";

const router = express.Router();


router.post("/", createNotification);
router.get("/", getAllNotifications);
router.get("/:id", getNotificationById);
router.get("/user/:userId", getNotificationsByUserId);
router.put("/read/:id", markNotificationAsRead);
router.put("/unread/:id", markNotificationAsUnread);

export default router;