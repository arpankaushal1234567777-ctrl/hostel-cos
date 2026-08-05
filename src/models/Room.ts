import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBed {
  bedIdentifier: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  assignedStudent?: Types.ObjectId;
}

export interface IRoom extends Document {
  roomNumber: string;
  hostel: Types.ObjectId;
  roomType: "2-sharing" | "3-sharing";
  capacity: number;
  currentOccupancy: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  beds: IBed[];
  createdAt: Date;
  updatedAt: Date;
}

const BedSchema = new Schema<IBed>(
  {
    bedIdentifier: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"],
      default: "AVAILABLE",
      required: true,
    },
    assignedStudent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: true } // Creates unique IDs for beds too, just in case
);

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: true,
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    roomType: {
      type: String,
      enum: ["2-sharing", "3-sharing"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"],
      default: "AVAILABLE",
      required: true,
    },
    beds: [BedSchema],
  },
  { timestamps: true }
);

// Compound index to ensure room numbers are unique within a single hostel
RoomSchema.index({ roomNumber: 1, hostel: 1 }, { unique: true });

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);
