const cron = require("node-cron");
const Task = require("../models/Task");
const { sendDeadlineNotification } = require("./notificationService");

const checkUpcomingDeadlines = async () => {
  try {
    const tasks = await Task.find({
      deadline: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      },
      status: { $ne: "completed" },
    }).populate("user");

    const notificationPromises = tasks
      .filter((task) => task.deadline.getTime() - Date.now() <= 60 * 60 * 1000)
      .map(sendDeadlineNotification);

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Deadline check failed:", error);
  }
};

const startDeadlineMonitoring = () => {
  // Run every 15 minutes
  return cron.schedule("*/15 * * * *", checkUpcomingDeadlines);
};

module.exports = { startDeadlineMonitoring };
