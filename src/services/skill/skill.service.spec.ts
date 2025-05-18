import { validate } from 'class-validator';
import { SkillDto } from '../../validators/skill.dto';
import { NatureOfWork, SkillStatus } from '../../entities/skills.entity';

describe('SkillDto Validation', () => {
  let dto: SkillDto;

  beforeEach(() => {
    dto = new SkillDto();
    dto.id = 1;
    dto.category = 'Programming';
    dto.experience = 5;
    dto.nature_of_work = 'online' as NatureOfWork;
    dto.hourly_rate = 50;
    dto.status = 'open' as SkillStatus;
    dto.completion = true;
    dto.approval = false;
    dto.userId = 'user123';
    dto.providerId = 'provider123';
  });

  it('should validate a valid SkillDto', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should require id to be a number', async () => {
    (dto as any).id = 'not-a-number';
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'id')).toBe(true);
  });

  it('should require category to be a string', async () => {
    (dto as any).category = 123;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'category')).toBe(true);
  });

  it('should require experience to be a number >= 0', async () => {
    dto.experience = -1;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'experience')).toBe(true);
  });

  it('should validate nature_of_work enum correctly', async () => {
    dto.nature_of_work = 'invalid' as any;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'nature_of_work')).toBe(true);
  });

  it('should require hourly_rate to be a number >= 0', async () => {
    dto.hourly_rate = -5;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'hourly_rate')).toBe(true);
  });

  it('should validate optional status enum correctly', async () => {
    dto.status = 'invalid' as any;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'status')).toBe(true);
  });

  it('should accept null status without error', async () => {
    dto.status = null as any;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate optional booleans completion and approval', async () => {
    dto.completion = 'true' as any;
    dto.approval = 'false' as any;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'completion')).toBe(true);
    expect(errors.some(e => e.property === 'approval')).toBe(true);
  });

  it('should validate optional userId and providerId as strings', async () => {
    dto.userId = 123 as any;
    dto.providerId = 456 as any;
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'userId')).toBe(true);
    expect(errors.some(e => e.property === 'providerId')).toBe(true);
  });
});
