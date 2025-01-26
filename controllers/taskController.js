const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const deadlineDate = new Date(deadline);
    if (deadlineDate < new Date()) {
      return res.status(400).json({
        message: "Deadline must be a future date.",
      });
    }

    const task = new Task({
      title,
      description,
      deadline,
      user: req.userId,
    });

    await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({
      message: "Task creation failed",
      error: error.message,
    });
  }
};

// gettings tasks with pagination
const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    // If admin, allow fetching all tasks
    const filter = req.userRole === "admin" ? {} : { user: req.userId };
    if (status) filter.status = status;

    // Fetch tasks with optimized query using indexes
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"), //no need to return this key from db
      Task.countDocuments(filter),
    ]);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve tasks",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, status } = req.body;

    // For admins, allow updating any task
    // For users, only allow updating their own tasks
    const task = await Task.findOneAndUpdate(
      req.userRole === "admin" ? { _id: id } : { _id: id, user: req.userId },
      { title, description, deadline, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({
      message: "Task update failed",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Task deletion failed",
      error: error.message,
    });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
