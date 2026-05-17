import { getIO } from "../middleware/socket.js";

export const sendNotification = (notification) => {
  const io = getIO();

  // send to user only
  io.to(notification.userId.toString()).emit(
    "notification",
    notification
  );

  // admin sees everything
  io.to("admin").emit("notification", notification);
};