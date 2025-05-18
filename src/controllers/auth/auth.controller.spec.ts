import { Request, Response } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "../../services/auth/auth.service";
import { validate } from "class-validator";

// Mock dependencies
jest.mock("../../services/auth/auth.service");
jest.mock("class-validator", () => ({
  validate: jest.fn(),
}));

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe("AuthController", () => {
  let req: Partial<Request>;
  let res: Response;

  beforeEach(() => {
    req = {};
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should return 400 if validation fails", async () => {
      (validate as jest.Mock).mockResolvedValue(["error"]);

      req.body = { mailId: "invalid", password: "123" };
      await AuthController.registerUser(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: "Validation failed",
        errors: ["error"],
      });
    });

    it("should register user and return 201", async () => {
      (validate as jest.Mock).mockResolvedValue([]);

      const mockUser = { id: 1, mailId: "test@test.com" };
      (AuthService.prototype.registerUser as jest.Mock).mockResolvedValue(mockUser);

      req.body = { mailId: "test@test.com", password: "password" };
      await AuthController.registerUser(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 201,
        message: "User registered successfully",
        data: { user: mockUser },
      });
    });

    it("should return 409 if user already exists", async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      (AuthService.prototype.registerUser as jest.Mock).mockRejectedValue(new Error("User already exists"));

      req.body = { mailId: "existing@test.com", password: "password" };
      await AuthController.registerUser(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 409,
        message: "User already exists",
      });
    });
  });

  describe("login", () => {
    it("should return 400 if validation fails", async () => {
      (validate as jest.Mock).mockResolvedValue(["error"]);

      req.body = { mailId: "invalid" };
      await AuthController.login(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: "Validation failed",
        errors: ["error"],
      });
    });

    it("should log in user and return token", async () => {
      (validate as jest.Mock).mockResolvedValue([]);

      const mockToken = { token: "abc123" };
      (AuthService.prototype.login as jest.Mock).mockResolvedValue(mockToken);

      req.body = { mailId: "test@test.com", password: "password" };
      await AuthController.login(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "User logged in successfully",
        data: { token: mockToken.token },
      });
    });

    it("should return 400 on invalid credentials", async () => {
      (validate as jest.Mock).mockResolvedValue([]);
      (AuthService.prototype.login as jest.Mock).mockRejectedValue(new Error("Invalid Password"));

      req.body = { mailId: "wrong@test.com", password: "wrong" };
      await AuthController.login(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: "Invalid Password",
      });
    });
  });

  describe("refreshToken", () => {
    it("should return 400 if no refresh token", async () => {
      req.body = {};
      await AuthController.refreshToken(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: "Refresh token is required",
      });
    });

    it("should refresh token and return access token", async () => {
      const mockAccessToken = { accessToken: "newToken" };
      (AuthService.prototype.refreshToken as jest.Mock).mockResolvedValue(mockAccessToken);

      req.body = { refreshToken: "validRefreshToken" };
      await AuthController.refreshToken(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        message: "Token refreshed successfully",
        data: { token: mockAccessToken.accessToken },
      });
    });

    it("should return 500 if service throws error", async () => {
      (AuthService.prototype.refreshToken as jest.Mock).mockRejectedValue(new Error("Some error"));

      req.body = { refreshToken: "badToken" };
      await AuthController.refreshToken(req as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 500,
        message: "Internal server error",
      });
    });
  });
});
