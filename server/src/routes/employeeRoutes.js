import { Router } from "express";
import multer from "multer";
import path from "path";
import authMiddleware from "../middleware/auth.js";
import { createEmployee, listEmployees, metaOptions } from "../controllers/employeeController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 3 * 1024 * 1024 } });

router.get("/meta", authMiddleware, metaOptions);
router.get("/", authMiddleware, listEmployees);
router.post("/", authMiddleware, upload.single("photo"), createEmployee);

export default router;
