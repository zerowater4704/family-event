"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getSharedUsers = exports.createEvent = void 0;
const Event_1 = __importDefault(require("../model/Event"));
const User_1 = __importDefault(require("../model/User"));
const createEvent = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res
                .status(400)
                .json({ message: "tokenがありません、ログインしてください" });
            return;
        }
        const { title, date, startTime, finishTime, sharedWith } = req.body;
        const event = await new Event_1.default({
            title,
            date,
            startTime,
            finishTime,
            createdBy: userId,
            sharedWith,
        });
        const savedEvent = await event.save();
        res.status(200).json({ savedEvent });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "createEvent APi のエラーです" });
    }
};
exports.createEvent = createEvent;
const getSharedUsers = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(404).json({ message: "ユーザーを見つかりません" });
            return;
        }
        const user = await User_1.default.findById(userId).populate("sharedUsers", "name email");
        res.status(200).json(user === null || user === void 0 ? void 0 : user.sharedUsers);
    }
    catch (error) {
        res.status(500).json({ message: "getSharedUsers api のエラーです" });
    }
};
exports.getSharedUsers = getSharedUsers;
const updateEvent = async (req, res) => {
    try {
        const findId = req.params.id;
        if (!findId) {
            res.status(400).json({ message: "eventを見つかりません" });
            return;
        }
        const { title, date, startTime, finishTime, sharedWith } = req.body;
        const updateEvent = { title, date, startTime, finishTime, sharedWith };
        const updatedEvent = await Event_1.default.findByIdAndUpdate(findId, updateEvent, {
            new: true,
        });
        res.status(200).json(updatedEvent);
    }
    catch (error) {
        res.status(500).json({ message: "updateEvent apiのエラーです" });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const findId = req.params.id;
        if (!findId) {
            res.status(400).json({ message: "eventを見つかりません" });
            return;
        }
        await Event_1.default.findByIdAndDelete(findId);
        res.status(200).json({ message: "eventを削除しました" });
    }
    catch (error) {
        res.status(500).json({ message: "deleteEvent apiのエラーです" });
    }
};
exports.deleteEvent = deleteEvent;
