import cron from "node-cron";
import { runPenaltySystem } from "../utils/penaltyEngine.js";

/* =========================
   RUN EVERY DAY AT 12 AM
========================= */
export default cron.schedule("0 0 * * *", async () => {
  console.log("Running daily penalty system...");
  await runPenaltySystem();
});