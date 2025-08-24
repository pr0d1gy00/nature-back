import cron from "node-cron";
import { updateDollarCache } from "../controllers/sendDollar.controller";

// expresión cron configurable via env (default: cada hora en minuto 0)
const CRON_EXPR = process.env.DOLAR_CRON || "0 * * * *";

(async () => {
  // run once at startup (non-blocking)
  try {
    await updateDollarCache();
    console.log("Initial dollar cache populated");
  } catch (e) {
    console.error("Initial dollar cache error:", e);
  }
})();

cron.schedule(CRON_EXPR, async () => {
  console.log("Scheduled dollar update:", new Date().toISOString());
  try {
    await updateDollarCache();
    console.log("Dollar cache updated");
  } catch (e) {
    console.error("Scheduled update failed:", e);
  }
});