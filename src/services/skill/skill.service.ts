import { dataSource } from "../../config/db";
import { Skill } from "../../entities/skills.entity";
import { User } from "../../entities/user.entity";
import { SkillDto } from "../../validators/skill.dto";

export class SkillService {

  constructor(private skillRepo = dataSource.getRepository(Skill), private userRepo = dataSource.getRepository(User)
  ) { }

  private formatSkill(skill: Skill) {
    return {
      id: skill.id,
      category: skill.category,
      experience: skill.experience,
      nature_of_work: skill.nature_of_work,
      hourly_rate: skill.hourly_rate,
      providerId: skill.provider?.id,
      userId: skill.acceptedBy?.id ?? undefined,
      status: skill.status ?? null,
      completion: skill.completion,
      approval: skill.approval,
      created_at: skill.created_at,
      updated_at: skill.updated_at,
    };
  }

  // Create Skill
  async createSkill(skillDetails: SkillDto) {
    const user = await this.userRepo.findOneBy({ id: skillDetails.providerId });
    if (!user) throw new Error("Provider not found");

    const skill = this.skillRepo.create({ ...skillDetails, provider: user });
    const createdSkill = await this.skillRepo.save(skill);
    return this.formatSkill(createdSkill);
  }

  // Update Skill
  async updateSkill(skillId: number, skillDetails: SkillDto) {
    const existingSkill = await this.skillRepo.findOne({
      where: { id: skillId },
      relations: ["provider", "acceptedBy"],
    });

    if (!existingSkill) throw new Error("Skill not found");

    if (skillDetails?.providerId) {
      const user = await this.userRepo.findOneBy({ id: skillDetails.providerId });
      if (!user) throw new Error("Provider not found");
      existingSkill.provider = user;
    }

    Object.assign(existingSkill, {
      category: skillDetails.category ?? existingSkill.category,
      experience: skillDetails.experience ?? existingSkill.experience,
      nature_of_work: skillDetails.nature_of_work ?? existingSkill.nature_of_work,
      hourly_rate: skillDetails.hourly_rate ?? existingSkill.hourly_rate,
    });

    const updatedSkill = await this.skillRepo.save(existingSkill);
    return this.formatSkill(updatedSkill);
  }

  // Delete Skill
  async deleteSkill(skillId: number) {
    const skill = await this.skillRepo.findOneBy({ id: skillId });
    if (!skill) throw new Error("Skill not found");

    await this.skillRepo.remove(skill);
    return { message: "Skill deleted successfully" };
  }

  // Get Skills
  async getSkills(role: string) {
    const where: Partial<Record<keyof Skill, any>> = {};

    if (role === 'user') {
      where.status = 'open';
    }

    const skills = await this.skillRepo.find({
      where,
      relations: ['provider', 'acceptedBy'],
      order: { created_at: 'DESC' },
    });

    return skills.map(skill => this.formatSkill(skill));
  }

  // Post Offer
  async postOffer(skillId: number, providerId: string) {
    const skill = await this.skillRepo.findOne({
      where: { id: skillId },
      relations: ['provider'],
    });

    if (!skill) throw new Error("Skill not found");

    if (skill.provider.id !== providerId) {
      throw new Error("You are not authorized to post this Skill");
    }

    skill.status = 'open';
    const postedOffer = await this.skillRepo.save(skill);

    return {
      skillId: postedOffer.id,
      status: postedOffer.status,
    };
  }
}
