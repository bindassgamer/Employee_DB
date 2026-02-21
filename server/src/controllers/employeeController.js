import Employee from "../models/Employee.js";

const DEPARTMENTS = ["HR", "Engineering", "Sales", "Marketing", "Finance", "Admin"];
const DESIGNATIONS = ["Manager", "Lead", "Developer", "Analyst", "Intern"];
const GENDERS = ["Male", "Female", "Other"];

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const isValidPhone = (value) => /^\d{10}$/.test(value);

export const createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      email,
      department,
      phoneNumber,
      designation,
      gender
    } = req.body;

    if (!fullName || !dateOfBirth || !email || !department || !phoneNumber || !designation || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(phoneNumber)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    if (!DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: "Department must be a valid selection" });
    }

    if (!DESIGNATIONS.includes(designation)) {
      return res.status(400).json({ message: "Designation must be a valid selection" });
    }

    if (!GENDERS.includes(gender)) {
      return res.status(400).json({ message: "Gender must be a valid selection" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Employee photo is required" });
    }

    const parsedDate = new Date(dateOfBirth);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date of birth" });
    }

    const employee = await Employee.create({
      fullName,
      dateOfBirth: parsedDate,
      email: email.toLowerCase(),
      department,
      phoneNumber,
      designation,
      gender,
      photoPath: `/uploads/${req.file.filename}`,
      photoOriginalName: req.file.originalname
    });

    return res.status(201).json(employee);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create employee" });
  }
};

export const listEmployees = async (req, res) => {
  try {
    const { search, department, designation, gender } = req.query;

    const filters = {};

    if (department) {
      filters.department = department;
    }
    if (designation) {
      filters.designation = designation;
    }
    if (gender) {
      filters.gender = gender;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filters.$or = [
        { fullName: regex },
        { email: regex },
        { department: regex }
      ];
    }

    const employees = await Employee.find(filters).sort({ createdAt: -1 });
    return res.json(employees);
  } catch (err) {

    return res.status(500).json({ message: "Failed to fetch employees" });
  }
};

export const metaOptions = async (req, res) => {
  return res.json({ departments: DEPARTMENTS, designations: DESIGNATIONS, genders: GENDERS });
};
