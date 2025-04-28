import { Router } from "express";
import multer from "multer";
import FilesController from "../controllers/Files";
import { v4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOADS_PATH as string);
  },
  filename: function (req, file, cb) {
    console.log(file);
    return cb(null, v4() + "." + file.mimetype.split("/")[1]);
  },
});
const upload = multer({
  storage,
});
const router = Router();

router.post("/upload", upload.single("content"), FilesController.UploadFile);
router.get("/:id", FilesController.GetFile);
router.get("/edited/:id", FilesController.GetEditedFile);

export default router;
