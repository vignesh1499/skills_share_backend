import { Router } from "express";
import { TasksController } from "../controllers/tasks.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";


/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * /tasks/create:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Task created
 */

/**
 * @swagger
 * /tasks/update:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */

/**
 * @swagger
 * /tasks/delete:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID to delete
 *     responses:
 *       200:
 *         description: Task deleted
 */

/**
 * @swagger
 * /tasks/markAscompleteTask:
 *   patch:
 *     summary: Mark task as completed
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task marked as completed
 */


const tasksRouters = Router();
const tasksController = new TasksController();

tasksRouters.post('/create',authenticateJWT, (req, res) => {tasksController.createTask(req, res)});
tasksRouters.put("/update",authenticateJWT, (req, res) => {tasksController.updateTask(req, res)});
tasksRouters.delete("/delete",authenticateJWT, (req, res) => {tasksController.deleteTask(req, res)});
tasksRouters.patch("/markAscompleteTask",authenticateJWT, (req, res) => {tasksController.markTaskAsCompleted(req, res)});

export default tasksRouters;