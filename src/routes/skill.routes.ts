import { Router } from "express";
import { SkillController } from "../controllers/skill/skill.controller";
import { authenticateJWT } from "../middlewares/authMiddleware";



/**
 * @swagger
 * tags:
 *   name: Skill
 *   description: Skill management APIs
 */

/**
 * @swagger
 * /skill/create:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill created
 */

/**
 * @swagger
 * /skill/update:
 *   put:
 *     summary: Update an existing skill
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       200:
 *         description: Skill updated
 */

const skillRouters = Router();
const skillController = new SkillController();

skillRouters.post('/create', authenticateJWT, (req, res) => { skillController.createSkill(req, res) });
skillRouters.put('/update', authenticateJWT, (req, res) => { skillController.updateSkill(req, res) });
skillRouters.get('/get', authenticateJWT, (req, res) => { skillController.getSkills(req, res) });
skillRouters.delete('/delete/:id', authenticateJWT, (req, res) => { skillController.deleteSkill(req, res) });
skillRouters.patch("/postoffer/:id", authenticateJWT, (req, res) => { skillController.postOffer(req, res) });

export default skillRouters;