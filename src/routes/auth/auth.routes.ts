import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";

const authRouters = Router();

authRouters.post('/register', (req, res) => {AuthController.registerUser(req, res)});
authRouters.post('/login',(req, res) => {AuthController.login(req, res)})


export default authRouters;
