import cron from "node-cron";
import { updateShipmentStatusAutomatically } from "../utils/shipmentStatusUpdater";

cron.schedule("0 0 * * *", async () => {
  console.log("Running Shipment Status Auto Update...");
  await updateShipmentStatusAutomatically();
});
