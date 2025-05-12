import { dataSource } from "../config/db";
import { Tasks } from "../entities/tasks.entity";
import { User } from "../entities/user.entity";
import { TaskDto } from "../validators/tasks.validator";

export class TasksService {
  private tasksRepo = dataSource.getRepository(Tasks);
  private userRepo = dataSource.getRepository(User);

  // ✅ Create Task
  async createTask(taskDetails: TaskDto) {
    const { userId, task_name } = taskDetails;

    //  Validate user
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");

    //  Check duplicate task name for the user
    const existingTask = await this.tasksRepo.findOne({
      where: {
        createdBy: { id: userId },
        task_name: task_name.trim().toLowerCase(),
      },
      relations: ["createdBy"],
    });

    if (existingTask) {
      throw new Error("Task with the same name already exists for this user");
    }

    // Create and save task
    const newTask = this.tasksRepo.create({
      category: taskDetails.category,
      task_name: task_name.trim().toLowerCase(),
      description: taskDetails.description,
      expected_start_date: taskDetails.expected_start_date,
      expected_working_hours: taskDetails.expected_working_hours,
      hourly_rate: taskDetails.hourly_rate,
      rate_currency: taskDetails.rate_currency,
      task_completed: false,
      createdBy: user,
    });

    const savedTask = await this.tasksRepo.save(newTask);

    return {
      taskId: savedTask.id,
      category: savedTask.category,
      task_name: savedTask.task_name,
      description: savedTask.description,
      expected_start_date: savedTask.expected_start_date,
      expected_working_hours: savedTask.expected_working_hours,
      hourly_rate: savedTask.hourly_rate,
      rate_currency: savedTask.rate_currency,
      task_completed: savedTask.task_completed,
      userId: savedTask.createdBy.id,
    };
  }

 
  async updateTask(taskDetails: TaskDto) {
    const { taskId } = taskDetails;

    const task = await this.tasksRepo.findOne({
      where: { id: taskId },
      relations: ["createdBy"],
    });

    if (!task) throw new Error("Task not found");

    Object.assign(task, taskDetails);

    const updatedTask = await this.tasksRepo.save(task);

    return {
      taskId: updatedTask.id,
      category: updatedTask.category,
      task_name: updatedTask.task_name,
      description: updatedTask.description,
      expected_start_date: updatedTask.expected_start_date,
      expected_working_hours: updatedTask.expected_working_hours,
      hourly_rate: updatedTask.hourly_rate,
      rate_currency: updatedTask.rate_currency,
      task_completed: updatedTask.task_completed,
      userId: updatedTask.createdBy.id,
    };
  }

  //Delete Task
  async deleteTask(taskId: number) {
    const task = await this.tasksRepo.findOneBy({ id: taskId });
    if (!task) throw new Error("Task not found");

    return await this.tasksRepo.remove(task);
  }

  //Mark Task as Completed
  async markTaskAsCompleted(taskId: number, userId: number) {
    const task:any = await this.tasksRepo.findOne({
      where: { id: taskId },
      relations: ["createdBy"],
    });

    if (!task) throw new Error("Task not found");

    if (task.createdBy.id !== userId) {
      throw new Error("You are not authorized to mark this task as completed");
    }

    task.task_completed = true;

    const updated = await this.tasksRepo.save(task);

    return {
      taskId: updated.id,
      task_completed: updated.task_completed,
    };
  }
}
