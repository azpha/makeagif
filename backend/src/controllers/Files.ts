import type { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

async function UploadFile(req: Request, res: Response): Promise<any> {
  return res.status(200).json({
    status: 200,
    id: req.file?.filename,
  });
}

async function GetFile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    if (
      !fs.existsSync(
        path.join(process.env.UPLOADS_PATH as string, req.params.id)
      )
    ) {
      return res.status(404).json({
        status: 404,
        message: "No file with that ID found",
      });
    }

    res.set("Content-Type", "video/mp4");
    return res.sendFile(
      path.join(process.env.UPLOADS_PATH as string, req.params.id)
    );
  } catch (e) {
    next(e);
  }
}

async function GetEditedFile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const fileId = req.params.id.split(".")[0];

    if (
      !fs.existsSync(
        path.join(
          process.env.UPLOADS_PATH as string,
          "edited",
          fileId + "-edited.gif"
        )
      )
    ) {
      return res.status(404).json({
        status: 404,
        message: "No file with that ID found",
      });
    }

    res.set("Content-Type", "image/gif");
    return res.sendFile(
      path.join(
        process.env.UPLOADS_PATH as string,
        "edited",
        fileId + "-edited.gif"
      )
    );
  } catch (e) {
    next(e);
  }
}

export default {
  UploadFile,
  GetFile,
  GetEditedFile,
};
