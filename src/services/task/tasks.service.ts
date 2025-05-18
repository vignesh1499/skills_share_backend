import { dataSource } from "../../config/db";
import { Tasks } from "../../entities/tasks.entity";
import { User } from "../../entities/user.entity";
import { Skill } from "../../entities/skills.entity";
import { TaskDto } from "../../validators/tasks.dto";

export class TasksService {


  constructor(private skillRepo = dataSource.getRepository(Skill), private tasksRepo = dataSource.getRepository(Tasks), private userRepo = dataSource.getRepository(User)) { }

  private formatTask(task: Tasks) {
    return {
      taskId: task.id,
      category: task.category,
      task_name: task.task_name,
      description: task.description,
      expected_start_date: task.expected_start_date,
      expected_working_hours: task.expected_working_hours,
      hourly_rate: task.hourly_rate,
      rate_currency: task.rate_currency,
      task_completed: task.task_completed,
      providerId: task.providerId,
      skillId: task.skill?.id,
    };
  }

  async createTask(taskDetails: TaskDto, userId: string) {
    const { providerId, skillId, task_name } = taskDetails;

    // 1. Validate Provider
    const provider = providerId
      ? await this.userRepo.findOneBy({ id: providerId })
      : null;
    if (!provider) throw new Error("Provider not found");

    // 2. Validate Skill
    const skill = skillId
      ? await this.skillRepo.findOneBy({ id: skillId })
      : null;
    if (!skill) throw new Error("Skill not found");

    // 3. Check for existing task with same name under same provider
    const normalizedTaskName = task_name.trim().toLowerCase();
    const existingTask = await this.tasksRepo.findOne({
      where: {
        provider: { id: providerId },
        task_name: normalizedTaskName,
      },
      relations: ["provider"],
    });

    if (existingTask) {
      throw new Error("Task with the same name already exists for this provider");
    }

    // 4. Create and Save Task
    const newTask = this.tasksRepo.create({
      ...taskDetails,
      task_name: normalizedTaskName,
      task_completed: false,
      provider,
      skill,
      userId,
    });

    const savedTask = await this.tasksRepo.save(newTask);

    // 5. Update Skill Status and AcceptedBy only if skillId is valid
    if (skillId !== null && skillId !== undefined) {
      await this.skillRepo.update(skillId, {
        acceptedBy: { id: userId } as User,
        status: "accepted",
      });
    }

    // 6. Return Formatted Task
    return this.formatTask(savedTask);
  }


  async updateTask(taskDetails: TaskDto) {
    const { taskId, skillId, providerId, ...updateData } = taskDetails;

    if (!taskId) throw new Error("Task ID is required");

    const task = await this.tasksRepo.findOne({
      where: { id: taskId },
      relations: ["provider", "skill"],
    });

    if (!task) throw new Error("Task not found");

    // Update provider
    if (providerId) {
      const provider = await this.userRepo.findOneBy({ id: providerId });
      if (!provider) throw new Error("Provider not found");
      task.provider = provider;
    }

    // Update skill
    if (skillId) {
      const skill = await this.skillRepo.findOneBy({ id: skillId });
      if (!skill) throw new Error("Skill not found");
      task.skill = skill;
    }

    Object.assign(task, updateData);

    const savedTask = await this.tasksRepo.save(task);
    return this.formatTask(savedTask);
  }

  async getAllTasks(userId: string) {
    const tasks = await this.tasksRepo.find({
      where: { userId },
    });

    return tasks.map(this.formatTask);
  }

  async deleteTask(taskId: number) {
    // 1. Find the task with related skill
    const task = await this.tasksRepo.findOne({
      where: { id: taskId },
      relations: ["skill"],
    });

    if (!task) throw new Error("Task not found");

    // 2. Update skill status to 'open' and remove acceptedBy if skill is assigned
    if (task.skill) {
      await this.skillRepo.update(task.skill.id, {
        status: "open",
        acceptedBy: null,
      });
    }

    // 3. Delete the task
    await this.tasksRepo.remove(task);

    return { message: "Task deleted successfully" };
  }

  async markTaskAsCompleted(taskId: number, userId: string) {
    const task = await this.tasksRepo.findOne({
      where: { id: taskId },
      relations: ["provider", "skill"],
    });

    if (!task) throw new Error("Task not found");
    if (task.userId !== userId) throw new Error("Unauthorized to complete this task");

    task.task_completed = true;
    const updated = await this.tasksRepo.save(task);

    if (task.skill) {
      task.skill.completion = true;
      task.skill.status = "completed";
      await this.skillRepo.save(task.skill);
    }

    return {
      taskId: updated.id,
      task_completed: updated.task_completed,
    };
  }
}
