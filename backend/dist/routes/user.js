"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const express_validator_1 = require("express-validator");
const authenticateToken_1 = require("../middlewares/authenticateToken/authenticateToken");
const router = (0, express_1.Router)();
router.post("/register", [
    (0, express_validator_1.check)("name").notEmpty().withMessage("名前を入力してください"),
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("パスワードが6文字以上にしてください"),
], userControllers_1.createUser);
router.post("/login", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
    (0, express_validator_1.check)("password").notEmpty().withMessage("パスワードが間違っています"),
], userControllers_1.loginUser);
router.get("/getuser", authenticateToken_1.authenticateToken, userControllers_1.getUser);
router.put("/update", [
    (0, express_validator_1.check)("name").notEmpty().withMessage("名前を入力してください"),
    (0, express_validator_1.check)("email")
        .optional()
        .isEmail()
        .withMessage("有効なメールアドレスを入力してください"),
], authenticateToken_1.authenticateToken, userControllers_1.updateUser);
router.delete("/delete", [(0, express_validator_1.check)("password").notEmpty().withMessage("パスワードが間違っています")], authenticateToken_1.authenticateToken, userControllers_1.deleteUser);
router.post("/search", authenticateToken_1.authenticateToken, userControllers_1.searchUser);
router.post("/sharedUsers", authenticateToken_1.authenticateToken, userControllers_1.addSharedUser);
router.get("/sharedUsers", authenticateToken_1.authenticateToken, userControllers_1.getUserWithSharedUsers);
exports.default = router;
