import { TasksService } from "../../services/auth/tasks.service";
import { TaskDto } from "../../validators/tasks.validator";
import { Response } from "express";

const tasksService = new TasksService();

export class TasksController {
    // Create Task
    async createTask(req: any, res: Response) {
        const taskDetails = Object.assign(new TaskDto(), req.body);
        const userId = req?.user?.id;
        const role = req?.user?.role;

        if (role !== "user") {
            return res.status(403).json({ message: "Only users with role 'user' can create tasks." });
        }

        const taskCreation = { ...taskDetails, userId };
        try {
            const task = await tasksService.createTask(taskCreation);
            res.status(201).json({ message: "Task created successfully", task });
        } catch (error: any) {
            console.log("Error", error);
            if (error.message.includes("already exists") || error.message.includes("User not found")) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Update Task
    async updateTask(req: any, res: Response) {
        const taskDetails = Object.assign(new TaskDto(), req.body);
        const userId = req?.user?.id;
        const role = req?.user?.role;

        if (role !== "user") {
            return res.status(403).json({ message: "Only users with role 'user' can update tasks." });
        }

        const taskUpdate = { ...taskDetails, userId };
        try {
            const task = await tasksService.updateTask(taskUpdate);
            res.status(200).json({ message: "Task updated successfully", task });
        } catch (error) {
            console.log("Error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Delete Task
    async deleteTask(req: any, res: Response) {
        const taskId = req.body.id;
        const role = req?.user?.role;

        if (role !== "user") {
            return res.status(403).json({ message: "Only users with role 'user' can delete tasks." });
        }

        try {
            await tasksService.deleteTask(taskId);
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (error) {
            console.log("Error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //Mark Task as Completed
    async markTaskAsCompleted(req: any, res: Response) {
    const taskId = parseInt(req.body.id); // e.g., /tasks/:id/complete
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "user") {
      return res.status(403).json({ message: "Only users can complete tasks" });
    }

    try {
      const result = await tasksService.markTaskAsCompleted(taskId, userId);
      return res.status(200).json({
        message: "Task marked as completed",
        task: result,
      });
    } catch (error: any) {
      console.error("Error marking task complete:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }
}
