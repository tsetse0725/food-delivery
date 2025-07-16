// src/middlewares/multer.ts
import multer from "multer";

// DiskStorage → локалд хадгалах (одоо Cloudinary байхгүй гэж үзье)
const storage = multer.memoryStorage(); // Cloudinary ашиглах бол энэ тохиромжтой

const upload = multer({ storage });

export default upload;
