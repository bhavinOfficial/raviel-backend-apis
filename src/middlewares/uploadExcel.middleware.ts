import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public");


// ✅ Create folder if it does not exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`)
  }
})

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedMime =
    ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];

  // if (file.mimetype === allowedMime) {
  if (allowedMime.includes(file.mimetype)  ) {
    cb(null, true);
  } else {
    cb(new Error("  ") as any, false);
  }
};

const uploadExcel = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 5 MB (optional)
  },
});

export default uploadExcel;