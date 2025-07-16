import type { Request } from "express";

declare global {
  namespace Express {
    interface MulterFile {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    }

    interface Request {
      file?: MulterFile;
    }
  }
}
