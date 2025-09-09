import User from "../models/user.js";
import { UserRoleEnum } from "../enums/userRoleEnum.js";
import bcrypt from "bcryptjs";

export const initializeAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@drycleaning.com";
    const existingAdmin = await User.findOne({ role: UserRoleEnum.ADMIN, email: adminEmail }).lean();

    if (existingAdmin) {
      console.log(`Admin user found: ${existingAdmin.email}`);
      return;
    }

    const adminData = {
      lastName: "Admin",
      firstName: "System",
      middleName: "Default",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || "Admin123!",
      role: UserRoleEnum.ADMIN,
      visitsCount: 0,
    };

    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    const admin = new User(adminData);
    await admin.save();
    console.log(`Default admin created: ${admin.email}`);
  } catch (error) {
    console.error("Error initializing admin:", error);
    throw error;
  }
};