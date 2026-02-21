import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    photoPath: { type: String, required: true },
    photoOriginalName: { type: String, required: true }
  },
  { timestamps: true }
);

employeeSchema.index({ fullName: "text", email: "text", department: "text" });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
