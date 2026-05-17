import cron from "node-cron";
import { runPenaltySystem } from "./penaltyEngine.js";

export default cron.schedule("*/1 * * * *", async () => {
  console.log("Running daily penalty system...");
  await runPenaltySystem();
});