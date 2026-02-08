import { partnerFilePlaceholderCron } from "./partnerFilePlaceholder.cron";

export const startCronJobs = () => {
  console.log("⏰ Initializing cron jobs...");
  partnerFilePlaceholderCron();
};
