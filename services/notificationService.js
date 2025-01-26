const nodemailer = require("nodemailer");
const Task = require("../models/Task");

const createEmailTransport = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
};

const sendDeadlineNotification = async (task) => {
  const transporter = createEmailTransport();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: task.user.email,
      subject: "Upcoming Task Deadline",
      text: `Your task "${task.title}" is due soon. Deadline: ${task.deadline}`,
    });
  } catch (error) {
    console.error("Email notification failed:", error);
  }
};

module.exports = { sendDeadlineNotification };
