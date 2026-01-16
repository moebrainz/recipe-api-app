import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log(
          `Cron Job: Successful health check ping at ${new Date().toISOString()}`
        );
      } else {
        console.error(
          `Cron Job: Unsuccessful health check ping at ${new Date().toISOString()} - Status Code: ${
            res.statusCode
          }`
        );
      }
    })
    .on("error", (e) => {
      console.error(`Cron Job: Error during health check ping: ${e.message}`);
    });
});

export default job;
