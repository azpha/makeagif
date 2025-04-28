import type { Request, Response, NextFunction } from "express";
import Ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

async function GenerateEditedFile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    if (!req.body || !req.body.id || !req.body.start || !req.body.end) {
      return res.status(400).json({
        status: 400,
        message: "Missing required field",
      });
    }
    if (
      !fs.existsSync(path.join(process.env.UPLOADS_PATH as string, req.body.id))
    ) {
      return res.status(404).json({
        status: 404,
        message: "No file found with that id",
      });
    }
    if (
      fs.existsSync(
        path.join(
          process.env.UPLOADS_PATH as string,
          "edited",
          req.body.id.split(".")[0] + "-edited.gif"
        )
      )
    ) {
      return res.status(409).json({
        status: 409,
        message: "File has already been edited",
      });
    }

    const duration = parseInt(req.body.end) - parseInt(req.body.start);
    const cropDimensions =
      req.body.dimensions &&
      `${req.body.dimensions.width}:${req.body.dimensions.height}:${req.body.dimensions.x}:${req.body.dimensions.y}`;
    console.log(cropDimensions);
    Ffmpeg()
      .input(path.join(process.env.UPLOADS_PATH as string, req.body.id))
      .output(
        path.join(
          process.env.UPLOADS_PATH as string,
          "edited",
          req.body.id.split(".")[0] + "-edited.gif"
        )
      )
      .outputOptions(
        "-vf",
        `${
          req.body.dimensions ? `crop=${cropDimensions},` : ""
        }fps=10,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        "-loop",
        "0"
      )
      .setStartTime(req.body.start)
      .setDuration(duration)
      .on("start", (cli) => {
        console.log("started encode", cli);
      })
      .on("end", () => {
        console.log("ended encode");
      })
      .on("error", (err) => {
        console.error("failed encode", err);
      })
      .run();

    return res.status(200).json({
      status: 200,
      message: "Started encode",
    });
  } catch (e) {
    next(e);
  }
}

export default {
  GenerateEditedFile,
};
