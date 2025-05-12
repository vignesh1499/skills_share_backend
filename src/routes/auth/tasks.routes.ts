import { Router } from "express";
import { TasksController } from "../../controllers/auth/tasks.controller";
import { authenticateJWT } from "../../middlewares/authMiddleware";

const tasksRouters = Router();
const tasksController = new TasksController();

tasksRouters.post('/create',authenticateJWT, (req, res) => {tasksController.createTask(req, res)});
tasksRouters.put("/update",authenticateJWT, (req, res) => {tasksController.updateTask(req, res)});
tasksRouters.delete("/delete",authenticateJWT, (req, res) => {tasksController.deleteTask(req, res)});
tasksRouters.patch("/markAscompleteTask",authenticateJWT, (req, res) => {tasksController.markTaskAsCompleted(req, res)});

export default tasksRouters;