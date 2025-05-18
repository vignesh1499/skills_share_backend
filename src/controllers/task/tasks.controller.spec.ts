import { TasksController } from "../../../src/controllers/task/tasks.controller";
import { TasksService } from "../../../src/services/task/tasks.service";
import { Request, Response } from "express";
import { TaskDto } from "../../../src/validators/tasks.dto";

jest.mock("../../../src/services/task/tasks.service");

describe("TasksController", () => {
  let tasksController: TasksController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    tasksController = new TasksController();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRes = {
      status: statusMock,
    };
  });

  const mockUser = { id: 1, role: "user" };
  const mockTask = { id: 1, title: "Test Task", completed: false };

  describe("createTask", () => {
    it("should create a task for user role", async () => {
      const createTaskMock = jest.fn().mockResolvedValue(mockTask);
      (TasksService.prototype.createTask as jest.Mock) = createTaskMock;

      mockReq = { body: mockTask, user: mockUser };

      await tasksController.createTask(mockReq as Request, mockRes as Response);

      expect(createTaskMock).toHaveBeenCalledWith(expect.any(TaskDto), mockUser.id);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: "Task created successfully",
        data: { task: mockTask },
      }));
    });

    it("should return 403 for non-user role", async () => {
      mockReq = { body: {}, user: { role: "provider" } };

      await tasksController.createTask(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
    });

    it("should handle service error", async () => {
      const createTaskMock = jest.fn().mockRejectedValue(new Error("DB error"));
      (TasksService.prototype.createTask as jest.Mock) = createTaskMock;

      mockReq = { body: mockTask, user: mockUser };

      await tasksController.createTask(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: "Internal server error",
      }));
    });
  });

  describe("updateTask", () => {
    it("should update a task for user", async () => {
      const updateTaskMock = jest.fn().mockResolvedValue(mockTask);
      (TasksService.prototype.updateTask as jest.Mock) = updateTaskMock;

      mockReq = { body: mockTask, user: mockUser };

      await tasksController.updateTask(mockReq as Request, mockRes as Response);

      expect(updateTaskMock).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: "Task updated successfully",
        data: { task: mockTask },
      }));
    });
  });

  describe("deleteTask", () => {
    it("should delete a task for user", async () => {
      const deleteTaskMock = jest.fn().mockResolvedValue(undefined);
      (TasksService.prototype.deleteTask as jest.Mock) = deleteTaskMock;

      mockReq = { params: { id: "1" }, user: mockUser };

      await tasksController.deleteTask(mockReq as Request, mockRes as Response);

      expect(deleteTaskMock).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: "Task deleted successfully",
      }));
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks for user", async () => {
      const tasks = [mockTask];
      const getAllTasksMock = jest.fn().mockResolvedValue(tasks);
      (TasksService.prototype.getAllTasks as jest.Mock) = getAllTasksMock;

      mockReq = { user: mockUser };

      await tasksController.getAllTasks(mockReq as Request, mockRes as Response);

      expect(getAllTasksMock).toHaveBeenCalledWith(mockUser.id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        data: { tasks },
      }));
    });
  });

  describe("markTaskAsCompleted", () => {
    it("should mark task as completed", async () => {
      const result = { ...mockTask, completed: true };
      const markTaskMock = jest.fn().mockResolvedValue(result);
      (TasksService.prototype.markTaskAsCompleted as jest.Mock) = markTaskMock;

      mockReq = { params: { id: "1" }, user: mockUser };

      await tasksController.markTaskAsCompleted(mockReq as Request, mockRes as Response);

      expect(markTaskMock).toHaveBeenCalledWith(1, mockUser.id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: "Task marked as completed",
        data: { task: result },
      }));
    });
  });
});
