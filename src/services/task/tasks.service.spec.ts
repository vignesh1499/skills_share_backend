import { TasksService } from "./tasks.service";
import { dataSource } from "../../config/db";
import { TaskDto } from "../../validators/tasks.dto";
import { User } from "../../entities/user.entity";
import { Skill } from "../../entities/skills.entity";
import { Tasks } from "../../entities/tasks.entity";
import { DataSource } from "typeorm";

jest.mock("../../config/db", () => ({
  dataSource: {
    getRepository: jest.fn(),
  },
}));

const mockSkillRepo = {
  findOneBy: jest.fn(),
  update: jest.fn(),
};
const mockUserRepo = {
  findOneBy: jest.fn(),
};
const mockTasksRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe("TasksService", () => {
  let service: TasksService;

  beforeEach(() => {
    (dataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Skill) return mockSkillRepo;
      if (entity === User) return mockUserRepo;
      if (entity === Tasks) return mockTasksRepo;
    });

    service = new TasksService();
  });

  it("should create task successfully", async () => {
    const userId = "user-1";
    const taskDto: TaskDto = {
      providerId: "provider-1",
      skillId: 1,
      task_name: "Sample Task",
      category: "Development",
      description: "Test description",
      expected_start_date: "2025-05-18",
      expected_working_hours: 10,
      hourly_rate: 100,
      rate_currency: "USD",
    };

    const mockProvider = { id: "provider-1" };
    const mockSkill = { id: 1 };
    const createdTask = {
      ...taskDto,
      id: 123,
      task_completed: false,
      provider: mockProvider,
      skill: mockSkill,
      userId,
    };

    mockUserRepo.findOneBy.mockResolvedValue(mockProvider);
    mockSkillRepo.findOneBy.mockResolvedValue(mockSkill);
    mockTasksRepo.findOne.mockResolvedValue(null);
    mockTasksRepo.create.mockReturnValue(createdTask);
    mockTasksRepo.save.mockResolvedValue(createdTask);

    const result = await service.createTask(taskDto, userId);

    expect(result.task_completed).toBe(false);
    expect(mockTasksRepo.save).toHaveBeenCalled();
  });
});
