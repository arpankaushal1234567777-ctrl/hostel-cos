const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

// Minimal User Schema for the script
const userSchema = new mongoose.Schema({
  fullName: String,
  studentId: String,
  universityEmail: String,
  phoneNumber: String,
  gender: String,
  course: String,
  department: String,
  academicYear: String,
  dateOfBirth: Date,
  passwordHash: String,
  role: String,
  accountStatus: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const adminType = process.argv[2];
    const adminEmail = process.argv[3];
    const adminPassword = process.argv[4] || "admin1234";

    if (!adminType || !["BOYS_ADMIN", "GIRLS_ADMIN"].includes(adminType)) {
      console.error("Usage: node scripts/createAdmin.js <BOYS_ADMIN|GIRLS_ADMIN> <email> [password]");
      process.exit(1);
    }

    if (!adminEmail) {
      console.error("Please provide an email address.");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ universityEmail: adminEmail });
    if (existingAdmin) {
      console.log(`Admin account with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const admin = new User({
      fullName: adminType === "BOYS_ADMIN" ? "Boys Hostel Admin" : "Girls Hostel Admin",
      studentId: adminType === "BOYS_ADMIN" ? "B_ADMIN_001" : "G_ADMIN_001",
      universityEmail: adminEmail,
      phoneNumber: "+00000000000",
      gender: adminType === "BOYS_ADMIN" ? "male" : "female",
      course: "N/A",
      department: "Administration",
      academicYear: "N/A",
      dateOfBirth: new Date("1980-01-01"),
      passwordHash,
      role: adminType,
      accountStatus: "ACTIVE" // Admin is active by default
    });

    await admin.save();
    console.log(`Successfully created ${adminType} account: ${adminEmail}`);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

createAdmin();
