import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "トークンが見つかりません" });
    return;
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN as string,
    (err: any, user: any) => {
      if (err) {
        res.status(403).json({ message: "トークンが無効です" });
        return;
      }

      req.user = user as JwtPayload;
      next();
    }
  );
};
