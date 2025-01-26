require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const connectDatabase = require("./config/database");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { startDeadlineMonitoring } = require("./services/deadlineMonitor");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
connectDatabase();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Cron job (checking upcoming deadlines)
const deadlineMonitor = startDeadlineMonitoring();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
