import { Router } from "express";
import { SkillController } from "../../controllers/auth/skill.controller";
import { authenticateJWT } from "../../middlewares/authMiddleware";

const skillRouters = Router();
const skillController = new SkillController();

skillRouters.post('/create',authenticateJWT, (req, res) => {skillController.createSkill(req, res)});
skillRouters.put('/update',authenticateJWT, (req, res) => {skillController.updateSkill(req, res)});

export default skillRouters;