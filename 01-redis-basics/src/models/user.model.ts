import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAvatar {
  public_id: string;
  url: string;
  size: number;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      select: false,
      default: null
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
  },
  {
    timestamps: true
  }
);


const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
