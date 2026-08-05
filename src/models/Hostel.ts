import mongoose, { Schema, Document } from "mongoose";

export interface IHostel extends Document {
  name: string;
  genderAllowed: "MALE" | "FEMALE";
  studentType: "JUNIOR" | "SENIOR";
  totalRooms: number;
  totalCapacity: number;
  createdAt: Date;
  updatedAt: Date;
}

const HostelSchema = new Schema<IHostel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    genderAllowed: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: true,
    },
    studentType: {
      type: String,
      enum: ["JUNIOR", "SENIOR"],
      required: true,
    },
    totalRooms: {
      type: Number,
      required: true,
      default: 20,
    },
    totalCapacity: {
      type: Number,
      required: true,
      default: 50,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Hostel || mongoose.model<IHostel>("Hostel", HostelSchema);
