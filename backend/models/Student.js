import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    maritalStatus: {
      type: String,
    },
    employmentStatus: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;
