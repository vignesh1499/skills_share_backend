import { Request, Response } from "express";
import { SkillController } from "./skill.controller";
import { SkillService } from "../../services/skill/skill.service";

jest.mock("../../services/skill/skill.service");

describe("SkillController", () => {
    let controller: SkillController;
    let req: Partial<Request> & { user?: any };
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        controller = new SkillController();

        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));
        res = {
            status: statusMock,
        };

        req = {};
        jest.clearAllMocks();
    });

    // Helper to set req.user and req.body/params
    const setRequest = (user: any, body?: any, params?: any) => {
        req.user = user;
        if (body) req.body = body;
        if (params) req.params = params;
    };

    describe("createSkill", () => {
        it("should return 403 if user role is not provider", async () => {
            setRequest({ role: "user" });
            await controller.createSkill(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(403);
        });

        it("should return 201 when skill is created", async () => {
            setRequest({ role: "provider", id: 1 }, { name: "Skill A", hourlyRate: 50 });
            (SkillService.prototype.createSkill as jest.Mock).mockResolvedValue({ id: 1 });

            await controller.createSkill(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(expect.any(Function));
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: "Skill created successfully" }));

        });

        it("should return 500 on internal error", async () => {
            setRequest({ role: "provider", id: 1 }, { name: "Skill A", hourlyRate: 50 });
            (SkillService.prototype.createSkill as jest.Mock).mockRejectedValue(new Error("DB error"));

            await controller.createSkill(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(500);
        });
    });

    describe("updateSkill", () => {
        it("should return 403 if not provider", async () => {
            setRequest({ role: "user" }, { id: "1" });
            await controller.updateSkill(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(403);
        });

        it("should return 400 if skill ID is invalid", async () => {
            setRequest({ role: "provider" }, { id: "abc" });
            await controller.updateSkill(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
        });

        it("should return 200 on successful update", async () => {
            setRequest({ role: "provider" }, { id: "1", name: "Updated Skill" });
            (SkillService.prototype.updateSkill as jest.Mock).mockResolvedValue({ id: 1 });

            await controller.updateSkill(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(200);
        });
    });

    describe("deleteSkill", () => {
        it("should return 403 if not provider", async () => {
            setRequest({ role: "user" }, undefined, { id: "1" });
            await controller.deleteSkill(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(403);
        });

        it("should return 400 if ID is invalid", async () => {
            setRequest({ role: "provider" }, undefined, { id: "abc" });
            await controller.deleteSkill(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
        });

        it("should return 200 on successful deletion", async () => {
            setRequest({ role: "provider" }, undefined, { id: "1" });
            (SkillService.prototype.deleteSkill as jest.Mock).mockResolvedValue({ success: true });

            await controller.deleteSkill(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(200);
        });
    });

    describe("getSkills", () => {
        it("should return 400 if role is missing", async () => {
            req.user = undefined;
            await controller.getSkills(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
        });

        it("should return 200 with skills list", async () => {
            setRequest({ role: "provider" });
            (SkillService.prototype.getSkills as jest.Mock).mockResolvedValue([{ id: 1, name: "Skill" }]);

            await controller.getSkills(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(expect.any(Array) as any);
        });
    });

    describe("postOffer", () => {
        it("should return 403 if not provider", async () => {
            setRequest({ role: "user" }, undefined, { id: "1" });
            await controller.postOffer(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(403);
        });

        it("should return 200 if offer is posted", async () => {
            setRequest({ role: "provider", id: 1 }, undefined, { id: "2" });
            (SkillService.prototype.postOffer as jest.Mock).mockResolvedValue({ id: 2 });

            await controller.postOffer(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: "Skill Offer Posted Successfully" }));
        });

        it("should return 400 on error", async () => {
            setRequest({ role: "provider", id: 1 }, undefined, { id: "2" });
            (SkillService.prototype.postOffer as jest.Mock).mockRejectedValue(new Error("Invalid skill"));

            await controller.postOffer(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
        });
    });
});
