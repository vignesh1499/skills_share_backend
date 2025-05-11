import { Request, Response } from "express";
import { skillservice } from "../../services/auth/skill. service";
import { SkillDTO } from "../../validators/skill.validator";
import { Validate } from "class-validator";

const service = new skillservice();

export class SkillController {

    //Create Skill
    async createSkill(req: any, res: Response) {

        const skillDetails = Object.assign(new SkillDTO(), req.body);
        const providerId = req?.user?.id;
        const skillCreation = { ...skillDetails, providerId: providerId };
        try {
            const skill = await service.createSkill({ ...skillCreation });
            res.status(201).json({ message: "Skill created successfully", skill });
        } catch (error) {
            console.log("Error", error);
            res.status(500).json({ message: "Internal server error" });
        }

    }

    // //Update Skill
    async updateSkill(req: Request, res: Response) {
        console.log(req.body.id)
        try {
            const skillId = parseInt(req.body.id);
            if (isNaN(skillId)) {
                return res.status(400).json({ message: 'Invalid skill ID' });
            }

            const updatedSkill = await service.updateSkill(skillId, req.body);
            return res.status(200).json({ message: "Skill Updated successfully", updatedSkill });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

}