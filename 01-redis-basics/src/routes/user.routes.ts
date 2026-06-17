import { Router } from "express";
import {
  createUser,
  getUserProfile,
  getUserProfileFromRedis,
  getUsers
} from "../controllers/user.controller";
import { rateLimiter } from "../middlewares/rate-limiter";

const router = Router();

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:id", getUserProfile);

router.get(
  "/redis/:id",

  getUserProfileFromRedis
);

export default router;
