import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import "dotenv/config";

// routes
import FilesRouter from "./routes/Files";
import GenerationRouter from "./routes/Generate";

const app = express();
app.use(express.json());
app.use(cors());

// create uploads dir if it doesn't exist
if (!fs.existsSync(path.join(process.env.UPLOADS_PATH as string, "edited"))) {
  console.log(path.join(process.env.UPLOADS_PATH as string, "edited"));
  fs.mkdirSync(path.join(process.env.UPLOADS_PATH as string, "edited"));
}

// routes
app.use("/files", FilesRouter);
app.use("/generate", GenerationRouter);

app.listen(3001, () => {
  console.log("server started");
});
