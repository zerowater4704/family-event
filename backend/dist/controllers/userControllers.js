"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWithSharedUsers = exports.addSharedUser = exports.searchUser = exports.deleteUser = exports.updateUser = exports.loginUser = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../model/User"));
const express_validator_1 = require("express-validator");
const createUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("バリデーションエラーです", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { name, email, password, sharedUsers } = req.body;
        const existUser = await User_1.default.findOne({ email });
        if (existUser) {
            res.status(400).json({ message: "emailが既に存在しています。" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            sharedUsers,
        });
        const newUser = await user.save();
        res.status(200).json({ message: "ユーザー生産に成功しました。", newUser });
    }
    catch (error) {
        console.error("ユーザー作成エラー: ", error);
        res.status(500).json({ message: "createUser apiのエラーです。", error });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "ユーザーが見つかりません" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: "1h",
        });
        res.status(200).json({ message: "ログインに成功しました", token, user });
    }
    catch (error) {
        res.status(500).json({ message: "loginUser Apiのエラーです", error });
    }
};
exports.loginUser = loginUser;
const updateUser = async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(400).json({ message: "tokenが見つかりません" });
        return;
    }
    try {
        const findUser = await User_1.default.findById(userId);
        if (!findUser) {
            res.status(400).json({ message: "ユーザーが見つかりません" });
            return;
        }
        const { name, email, password } = req.body;
        const updateData = { name, email, password };
        if (password) {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            updateData.password = hashedPassword;
        }
        const updateUser = await User_1.default.findByIdAndUpdate(userId, updateData, {
            new: true,
        });
        res.status(200).json({ updateUser });
    }
    catch (error) {
        res.status(500).json({ message: "updateUser Apiのエラーです", error });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(400).json({ message: "tokenがありません" });
        return;
    }
    try {
        const { password } = req.body;
        const findUser = await User_1.default.findById(userId);
        if (!findUser) {
            res.status(400).json({ message: "ユーザーが見つかりません" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, findUser.password);
        if (!isMatch) {
            res.status(400).json({ message: "パスワードが間違っています。" });
            return;
        }
        await User_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: "ユーザーが削除できました" });
    }
    catch (error) {
        res.status(500).json({ message: "deleteUser Apiエラーです" });
    }
};
exports.deleteUser = deleteUser;
const searchUser = async (req, res) => {
    try {
        const { query } = req.body;
        const users = await User_1.default.find({
            $or: [
                { name: new RegExp(query, "i") },
                { email: new RegExp(query, "i") },
            ],
        }).select("name email _id");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "searchUser APIにエラーです" });
    }
};
exports.searchUser = searchUser;
const addSharedUser = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { email } = req.body;
        const sharedUser = await User_1.default.findOne({ email });
        if (!sharedUser) {
            res.status(404).json({ message: "ユーザーが見つかりません" });
            return;
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません" });
            return;
        }
        if (!user.sharedUsers.includes(sharedUser._id)) {
            user.sharedUsers.push(sharedUser._id);
            await user.save();
            res.status(200).json({ message: "ユーザーが追加できました。", user });
        }
        else {
            res.status(400).json({ message: "ユーザーが既にリストに入っています" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "addSharedUser APiのエラーです" });
    }
};
exports.addSharedUser = addSharedUser;
const getUserWithSharedUsers = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res
                .status(404)
                .json({ message: "ユーザーを見つかりません、tokenがありません" });
        }
        const user = await User_1.default.findById(userId).populate("sharedUsers", "name email");
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "getUserWithSharedUsers apiのエラーです" });
    }
};
exports.getUserWithSharedUsers = getUserWithSharedUsers;
