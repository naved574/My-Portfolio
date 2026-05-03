import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export const seedAdmin = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required for seeding.");
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    existingAdmin.name = existingAdmin.name || "Portfolio Admin";
    existingAdmin.email = env.ADMIN_EMAIL.toLowerCase();
    existingAdmin.passwordHash = passwordHash;
    await existingAdmin.save();
    console.log(`Updated admin user: ${existingAdmin.email}`);
    return;
  }

  const admin = await User.create({
    name: "Portfolio Admin",
    email: env.ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: "admin",
  });

  console.log(`Created admin user: ${admin.email}`);
};

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  seedAdmin()
    .catch((error) => {
      console.error("Admin seed failed:", error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.connection.close();
    });
}
