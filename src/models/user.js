import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Import bcrypt
import { UserRoleEnum } from "../enums/userRoleEnum.js";

const userSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    middleName: {
      type: String,
      required: [true, "Middle name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    visitsCount: { type: Number, default: 0 },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRoleEnum),
        message: "Invalid role",
      },
      default: UserRoleEnum.USER,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: function () {
        return this.role === UserRoleEnum.MANAGER;
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`Hashed password for ${this.email}: ${this.password}`);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

export default mongoose.model("User", userSchema);