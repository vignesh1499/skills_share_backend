import { TasksService } from "../../services/task/tasks.service";
import { TaskDto } from "../../validators/tasks.dto";
import { Response, Request } from "express";

const tasksService = new TasksService();

function success(res: Response, statusCode: number, message: string, data: any = null) {
  return res.status(statusCode).json({
    status_code: statusCode,
    message,
    data,
  });
}

function error(res: Response, statusCode: number, err: any, message?: string) {
  const errorMessage = message || (err?.message ? err.message : String(err));
  const errorResponse = {
    status_code: statusCode,
    message: errorMessage,
    // error: process.env.NODE_ENV === "development" ? err : undefined, // optional
  };
  return res.status(statusCode).json(errorResponse);
}

export class TasksController {
  // Create Task
  async createTask(req: Request & { user?: any }, res: Response) {
    const taskDetails = Object.assign(new TaskDto(), req.body);
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "user") {
      return success(res, 403, "Only users with role 'user' can create tasks.");
    }

    try {
      const task = await tasksService.createTask({ ...taskDetails}, userId);
      return success(res, 201, "Task created successfully", { task });
    } catch (err:any) {
      console.error("Error creating task:", err);
      if (
        err?.message?.includes("already exists") ||
        err?.message?.includes("User not found")
      ) {
        return error(res, 400, err);
      }
      return error(res, 500, err, "Internal server error");
    }
  }

  // Update Task
  async updateTask(req: Request & { user?: any }, res: Response) {
    const taskDetails = Object.assign(new TaskDto(), req.body);
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "user") {
      return success(res, 403, "Only users with role 'user' can update tasks.");
    }

    try {
      const task = await tasksService.updateTask({ ...taskDetails, userId });
      return success(res, 200, "Task updated successfully", { task });
    } catch (err) {
      console.error("Error updating task:", err);
      return error(res, 500, err, "Internal server error");
    }
  }

  // Delete Task
  async deleteTask(req: Request & { user?: any }, res: Response) {
    const taskId = parseInt(req.params?.id, 10);
    const role = req.user?.role;

    if (role !== "user") {
      return success(res, 403, "Only users with role 'user' can delete tasks.");
    }

    try {
      await tasksService.deleteTask(taskId);
      return success(res, 200, "Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      return error(res, 500, err, "Internal server error");
    }
  }

  // Get All Tasks for User
  async getAllTasks(req: Request & { user?: any }, res: Response) {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "user") {
      return success(res, 403, "Only users can view their tasks.");
    }

    try {
      const tasks = await tasksService.getAllTasks(userId);
      return success(res, 200, "Tasks fetched successfully", { tasks });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      return error(res, 500, err, "Internal server error");
    }
  }

  // Mark Task as Completed
  async markTaskAsCompleted(req: Request & { user?: any }, res: Response) {
    const taskId = parseInt(req.params?.id, 10);
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "user") {
      return success(res, 403, "Only users can complete tasks.");
    }

    try {
      const result = await tasksService.markTaskAsCompleted(taskId, userId);
      return success(res, 200, "Task marked as completed", { task: result });
    } catch (err) {
      console.error("Error marking task complete:", err);
      return error(res, 400, err);
    }
  }
}
