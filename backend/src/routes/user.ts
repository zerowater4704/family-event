import { Router } from "express";
import {
  addSharedUser,
  createUser,
  deleteUser,
  getUser,
  getUserWithSharedUsers,
  loginUser,
  searchUser,
  updateUser,
} from "../controllers/userControllers";
import { check } from "express-validator";
import { authenticateToken } from "../middlewares/authenticateToken/authenticateToken";

const router = Router();

router.post(
  "/register",
  [
    check("name").notEmpty().withMessage("名前を入力してください"),
    check("email")
      .isEmail()
      .withMessage("有効なメールアドレスを入力してください"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("パスワードが6文字以上にしてください"),
  ],
  createUser
);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("有効なメールアドレスを入力してください"),
    check("password").notEmpty().withMessage("パスワードが間違っています"),
  ],
  loginUser
);

router.get("/getuser", authenticateToken, getUser);

router.put(
  "/update",
  [
    check("name").notEmpty().withMessage("名前を入力してください"),
    check("email")
      .optional()
      .isEmail()
      .withMessage("有効なメールアドレスを入力してください"),
  ],
  authenticateToken,
  updateUser
);

router.delete(
  "/delete",
  [check("password").notEmpty().withMessage("パスワードが間違っています")],
  authenticateToken,
  deleteUser
);

router.post("/search", authenticateToken, searchUser);

router.post("/sharedUsers", authenticateToken, addSharedUser);

router.get("/sharedUsers", authenticateToken, getUserWithSharedUsers);

export default router;
