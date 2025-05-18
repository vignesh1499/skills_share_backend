import { Request, response, Response } from "express";
import { SkillService } from "../../services/skill/skill.service";
import { SkillDto } from "../../validators/skill.dto";

const service = new SkillService();

export class SkillController {

  private success(res: Response, status: number, message: string, data: any = null) {
    return res.status(status).json({
      status_code: status,
      message,
      data,
    });
  }

  private error(res: Response, status: number, message: string) {
    return res.status(status).json({
      status_code: status,
      message,
      data: null,
    });
  }

  // Create Skill
  async createSkill(req: Request & { user?: any }, res: Response) {
    const { role, id: providerId } = req.user || {};
    if (role !== "provider") {
      return this.error(res, 403, "Only 'provider' role can create skills.");
    }

    try {
      const skillDetails = Object.assign(new SkillDto(), req.body);
      const skill = await service.createSkill({ ...skillDetails, providerId });
      return this.success(res, 201, "Skill created successfully", skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      return this.error(res, 500, "Internal server error");
    }
  }

  // Update Skill
  async updateSkill(req: Request & { user?: any }, res: Response) {
    const { role } = req.user || {};
    const skillId = parseInt(req.body?.id);

    if (role !== "provider") {
      return this.error(res, 403, "Only 'provider' role can update skills.");
    }

    if (isNaN(skillId)) {
      return this.error(res, 400, "Invalid skill ID");
    }

    try {
      const updatedSkill = await service.updateSkill(skillId, req.body);
      return this.success(res, 200, "Skill updated successfully", updatedSkill);
    } catch (error: any) {
      console.error("Error updating skill:", error);
      return this.error(res, 500, error.message || "Internal server error");
    }
  }

  // Delete Skill
  async deleteSkill(req: Request & { user?: any }, res: Response) {
    const { role } = req.user || {};
    const skillId = parseInt(req.params?.id);

    if (role !== "provider") {
      return this.error(res, 403, "Only providers can delete skills.");
    }

    if (isNaN(skillId)) {
      return this.error(res, 400, "Invalid skill ID");
    }

    try {
      const result = await service.deleteSkill(skillId);
      return this.success(res, 200, "Skill deleted successfully", result);
    } catch (error: any) {
      console.error("Error deleting skill:", error);
      return this.error(res, 500, error.message || "Internal server error");
    }
  }

  // Get Skills
  async getSkills(req: Request & { user?: any }, res: Response) {
    try {
      const {role, id} = req?.user;
      console.log(role, id)

      if (!role) return res.status(400).json({ error: 'User role not found in token' });
      const skills = await service.getSkills(role, id);
      res.status(200).json({ data: skills });
    } catch (err) {
      console.error('Error fetching skills:', err);
      res.status(500).json({ error: 'Failed to fetch skills' });
    }
  }

  //Poster Offer
  async postOffer(req: any, res: Response) {
    const skillId = req.params?.id
    const providerId = req.user?.id
    const role = req.user?.role

    if (role !== "provider") {
      return res.status(403).json({ message: "Only Provider can post offers" });
    }

    try {
      const skill = await service.postOffer(skillId, providerId);
      return this.success(res, 200, "Skill Offer Posted Successfully", skill);
    } catch (error: any) {
      console.error("Error Post Offer:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }
}
