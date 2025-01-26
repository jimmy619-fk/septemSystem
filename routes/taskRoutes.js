const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authenticateUser = require("../middlewares/authMiddleware");
const { createTaskLimiter } = require("../config/rateLimiter");
const isAdmin = require("../middlewares/protectedApi");

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Task creation failed
 */
router.post("/", authenticateUser, createTaskLimiter, createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get tasks (users see only their tasks, admins see all)
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of tasks per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed]
 *         description: Filter tasks by status
 *     responses:
 *       200:
 *         description: Paginated list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Task ID
 *                       title:
 *                         type: string
 *                         description: Task title
 *                       description:
 *                         type: string
 *                         description: Task description
 *                       status:
 *                         type: string
 *                         enum: [pending, completed]
 *                         description: Task status
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                         description: Task deadline
 *                       user:
 *                         type: string
 *                         description: User ID assigned to the task
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Task creation timestamp
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Task update timestamp
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 totalTasks:
 *                   type: integer
 *                   description: Total number of tasks
 *       500:
 *         description: Failed to retrieve tasks
 */

router.get("/", authenticateUser, getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task (Users can only update their own tasks. Admins can update any task.)
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put("/:id", authenticateUser, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/:id", authenticateUser, isAdmin, deleteTask);

module.exports = router;
