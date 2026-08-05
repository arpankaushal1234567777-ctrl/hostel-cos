import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Construct __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

// Define Schemas manually for the script to avoid Next.js imports compilation issues
const HostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    genderAllowed: { type: String, enum: ["MALE", "FEMALE"], required: true },
    studentType: { type: String, enum: ["JUNIOR", "SENIOR"], required: true },
    totalRooms: { type: Number, required: true, default: 20 },
    totalCapacity: { type: Number, required: true, default: 50 },
  },
  { timestamps: true }
);

const BedSchema = new mongoose.Schema(
  {
    bedIdentifier: { type: String, required: true },
    status: { type: String, enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"], default: "AVAILABLE" },
    assignedStudent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  }
);

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
    roomType: { type: String, enum: ["2-sharing", "3-sharing"], required: true },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    status: { type: String, enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"], default: "AVAILABLE" },
    beds: [BedSchema],
  },
  { timestamps: true }
);
RoomSchema.index({ roomNumber: 1, hostel: 1 }, { unique: true });

const Hostel = mongoose.models.Hostel || mongoose.model("Hostel", HostelSchema);
const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

const HOSTELS_TO_CREATE = [
  { name: "Junior Boys Hostel", genderAllowed: "MALE", studentType: "JUNIOR" },
  { name: "Senior Boys Hostel", genderAllowed: "MALE", studentType: "SENIOR" },
  { name: "Junior Girls Hostel", genderAllowed: "FEMALE", studentType: "JUNIOR" },
  { name: "Senior Girls Hostel", genderAllowed: "FEMALE", studentType: "SENIOR" },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const hostelData of HOSTELS_TO_CREATE) {
      // Check if hostel already exists
      let hostel = await Hostel.findOne({ name: hostelData.name });

      if (hostel) {
        console.log(`[SKIPPED] ${hostelData.name} already exists.`);
        continue; // Skip room generation if hostel exists to prevent duplication
      }

      // Create Hostel
      hostel = new Hostel({
        ...hostelData,
        totalRooms: 20,
        totalCapacity: 50,
      });
      await hostel.save();
      console.log(`[CREATED] ${hostel.name}`);

      const rooms = [];
      
      // Generate 10 2-sharing rooms (e.g. 101 to 110)
      for (let i = 1; i <= 10; i++) {
        const roomNumber = `${i < 10 ? '10' : '1'}${i}`; // 101, 102... 110
        rooms.push({
          roomNumber,
          hostel: hostel._id,
          roomType: "2-sharing",
          capacity: 2,
          beds: [
            { bedIdentifier: "A", status: "AVAILABLE" },
            { bedIdentifier: "B", status: "AVAILABLE" }
          ]
        });
      }

      // Generate 10 3-sharing rooms (e.g. 201 to 210)
      for (let i = 1; i <= 10; i++) {
        const roomNumber = `${i < 10 ? '20' : '2'}${i}`; // 201, 202... 210
        rooms.push({
          roomNumber,
          hostel: hostel._id,
          roomType: "3-sharing",
          capacity: 3,
          beds: [
            { bedIdentifier: "A", status: "AVAILABLE" },
            { bedIdentifier: "B", status: "AVAILABLE" },
            { bedIdentifier: "C", status: "AVAILABLE" }
          ]
        });
      }

      // Insert all 20 rooms at once
      await Room.insertMany(rooms);
      console.log(`  -> Generated 20 rooms and 50 beds for ${hostel.name}`);
    }

    console.log("\nSeeding complete! 4 Hostels, 80 Rooms, and 200 Beds are ready.");

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedDatabase();
