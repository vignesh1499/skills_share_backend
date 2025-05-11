import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";
import { RegisterUserDTO, LoginDTO } from "../../validators/user.validator";
import { validate } from "class-validator";

const authService = new AuthService();

export class AuthController {
  //Register User
  static async registerUser(req: Request, res: Response) {

    const userDetails = Object.assign(new RegisterUserDTO(),req.body);
    const errors = await validate(userDetails);
    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }

    try {
      const user = await authService.registerUser({...userDetails});
      res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
      console.log("Error", error.message);
      if (error.message === "User already exists") {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  //Login User
  static async login(req: Request, res: Response) {
    const loginDetails = Object.assign(new LoginDTO(), req.body);
    const errors = await validate(loginDetails);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const result = await authService.login(loginDetails);
      console.log("Result", result);
      res.status(200).json({ message: "User logged in successfully", token: result.token });
    } catch (error: any) {
      // console.log("Error", error.message);
      if (error.message === "Invalid mailId" || error.message === "Invalid Password") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }
}


