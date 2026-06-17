import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword } from "../helpers/auth.helpers";
import redis from "../configss/redis";
import { emailQueue } from "../queues/email.queue";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
        status: 400
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists",
        status: 409
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    await emailQueue.add("send-mail", {
      subject: "Verify your email",
      email: user.email
    });

    res.status(201).json({
      message: "User created successfully",
      status: 201,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const userID = req.params.id;

    const user = await User.findById(userID).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        status: 404
      });
    }
    res.status(200).json({
      message: "User profile fetched successfully",
      status: 200,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
  }
}

export async function getUserProfileFromRedis(req: Request, res: Response) {
  try {
    const userID = req.params.id;

    const key = `user:${userID}`;

    const cacheUser = (await redis.get(key)) || "";

    if (cacheUser) {
      return res.status(200).json({
        message: "User profile fetched successfully",
        status: 200,
        data: JSON.parse(cacheUser)
      });
    }

    const user = await User.findById(userID).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        status: 404
      });
    }

    await redis.set(key, JSON.stringify(user));
    res.status(200).json({
      message: "User profile fetched successfully",
      status: 200,
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const key = `user:all`;

    const cacheUsers = (await redis.get(key)) || "";

    if (cacheUsers) {
      return res.status(200).json({
        message: "Users fetched successfully",
        status: 200,
        data: JSON.parse(cacheUsers)
      });
    }

    const users = await User.find().select("-password");
    if (!users) {
      return res.status(404).json({
        error: "Users not found",
        status: 404
      });
    }

    await redis.set(key, JSON.stringify(users));
    res.status(200).json({
      message: "Users fetched successfully",
      status: 200,
      data: users
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500
    });
  }
}
