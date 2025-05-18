import { Request, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";
import { RegisterUserDto, LoginDto } from "../../validators/user.dto";
import { validate } from "class-validator";

const authService = new AuthService();

const success = (res: Response, statusCode: number, message: string, data: any = null) => {
  return res.status(statusCode).json({ statusCode, message, ...(data ? { data } : {}) });
};

const error = (res: Response, statusCode: number, message: string, errors: any = null) => {
  return res.status(statusCode).json({ statusCode, message, ...(errors ? { errors } : {}) });
};

export class AuthController {
  // Register User
  static async registerUser(req: Request, res: Response) {
    const userDetails = Object.assign(new RegisterUserDto(), req.body);
    const errors = await validate(userDetails);
    if (errors.length > 0) {
      return error(res, 400, "Validation failed", errors);
    }

    try {
      const user = await authService.registerUser(userDetails);
      return success(res, 201, "User registered successfully", { user });
    } catch (error: any) {
      console.error("Register Error:", error.message);
      if (error.message === "User already exists") {
        return error(res, 409, error.message);
      }
      return error(res, 500, "Internal server error");
    }
  }

  // Login User
  static async login(req: Request, res: Response) {
    const loginDetails = Object.assign(new LoginDto(), req.body);
    const errors = await validate(loginDetails);
    if (errors.length > 0) {
      return error(res, 400, "Validation failed", errors);
    }

    try {
      const result = await authService.login(loginDetails);
      return success(res, 200, "User logged in successfully", { token: result.token });
    } catch (error: any) {
      console.error("Login Error:", error.message);
      if (["Invalid mailId", "Invalid Password"].includes(error.message)) {
        return error(res, 400, error.message);
      }
      return error(res, 500, "Internal server error");
    }
  }

  // Refresh Token
  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return error(res, 400, "Refresh token is required");
    }

    try {
      const result = await authService.refreshToken(refreshToken);
      return success(res, 200, "Token refreshed successfully", { token: result.accessToken });
    } catch (error: any) {
      console.error("Refresh Token Error:", error.message);
      return error(res, 500, "Internal server error");
    }
  }
}
