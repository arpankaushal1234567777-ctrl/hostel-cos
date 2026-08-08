import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  studentId: string;
  universityEmail: string;
  phoneNumber: string;
  gender: string;
  course: string;
  department: string;
  academicYear: string;
  dateOfBirth: Date;
  passwordHash: string;
  role: "STUDENT" | "ADMIN";
  accountStatus: "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "SUSPENDED";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Please provide a full name"],
    },
    studentId: {
      type: String,
      required: [true, "Please provide a student ID / enrollment number"],
      unique: true,
    },
    universityEmail: {
      type: String,
      required: [true, "Please provide a university email"],
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    gender: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["STUDENT", "BOYS_ADMIN", "GIRLS_ADMIN"],
      default: "STUDENT",
    },
    accountStatus: {
      type: String,
      enum: ["PENDING_APPROVAL", "ACTIVE", "REJECTED", "SUSPENDED"],
      default: "PENDING_APPROVAL",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Prevent model overwrite upon hot reloads in Next.js
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
