import { dataSource } from "../config/db";
import { Skill } from "../entities/skills.entity";
import { SkillDTO } from "../validators/skill.validator";
import { User } from "../entities/user.entity";

export class skillservice {
    private skillRepo = dataSource.getRepository(Skill);
    private userRepo = dataSource.getRepository(User);

    //Create Skill  -- create separate DB repo for provider
    async createSkill(skillDetails: SkillDTO) {
        const { provider_Id } = skillDetails;
        const user = await this.userRepo.findOneBy({ id: provider_Id });
        if (!user) {
            throw new Error("Provider not found");
        }

        const skill = this.skillRepo.create({ ...skillDetails, provider: user });

        return this.skillRepo.save(skill);
    }



    //Update Skill
    async updateSkill(skillId: number, skillDetails: SkillDTO) {
    const existingSkill = await this.skillRepo.findOne({
        where: { id: skillId },
        relations: ['provider'], // optional, if you need provider info
    });

    if (!existingSkill) {
        throw new Error('Skill not found');
    }

    // If updating provider as well
    if (skillDetails.provider_Id) {
        const user = await this.userRepo.findOneBy({ id: skillDetails.provider_Id });
        if (!user) {
            throw new Error('Provider not found');
        }
        existingSkill.provider = user;
    }

    // Update skill properties
    existingSkill.category = skillDetails.category ?? existingSkill.category;
    existingSkill.experience = skillDetails.experience ?? existingSkill.experience;
    existingSkill.nature_of_work = skillDetails.nature_of_work ?? existingSkill.nature_of_work;
    existingSkill.hourly_rate = skillDetails.hourly_rate ?? existingSkill.hourly_rate;

    const updated = await this.skillRepo.save(existingSkill);

     return {
        id: updated.id,
        category: updated.category,
        experience: updated.experience,
        nature_of_work: updated.nature_of_work,
        hourly_rate: updated.hourly_rate,
        providerId: updated.provider.id,
    };
}

}