import { Request, Response } from "express";
import Event from "../model/Event";
import User from "../model/User";
import moment from "moment-timezone";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(400)
        .json({ message: "tokenがありません、ログインしてください" });
      return;
    }

    const { title, date, startTime, finishTime, sharedWith } = req.body;

    // JSTに変換してフォーマットする（ISO8601形式の文字列）
    const jstDate = moment(date).tz("Asia/Tokyo").format(); // ISO8601形式でJSTを保持

    const event = new Event({
      title,
      date: jstDate, // JSTに変換された日付を文字列として保存
      startTime,
      finishTime,
      createdBy: userId,
      sharedWith,
    });
    console.log("変換後のJST日付:", jstDate);

    const savedEvent = await event.save();
    res.status(200).json({ savedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "createEvent API のエラーです" });
  }
};

export const getSharedUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(404).json({ message: "ユーザーを見つかりません" });
      return;
    }

    const user = await User.findById(userId).populate(
      "sharedUsers",
      "name email"
    );

    res.status(200).json(user?.sharedUsers);
  } catch (error) {
    res.status(500).json({ message: "getSharedUsers api のエラーです" });
  }
};

export const getSharedEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(404).json({ message: "ユーザーを見つかりません" });
      return;
    }

    const sharedEvents = await Event.find({ sharedWith: userId })
      .populate("sharedWith", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(sharedEvents);
    return;
  } catch (error) {
    res.status(500).json({ message: "getSharedEvents api のエラーです" });
    return;
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "ユーザーを見つかりません" });
      return;
    }

    const findEvent = await Event.find({ createdBy: userId })
      .populate("sharedWith", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(findEvent);
    return;
  } catch (error) {
    res.status(500).json({ message: "getEvent api のエラーです" });
    return;
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const findId = req.params.id;
    if (!findId) {
      res.status(400).json({ message: "eventを見つかりません" });
      return;
    }

    const { title, date, startTime, finishTime, sharedWith } = req.body;

    const updateEvent = { title, date, startTime, finishTime, sharedWith };

    const updatedEvent = await Event.findByIdAndUpdate(findId, updateEvent, {
      new: true,
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "updateEvent apiのエラーです" });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const eventId = req.params.id;

    if (!userId) {
      res.status(400).json({ message: "ユーザーを見つかりません" });
      return;
    }

    const findEventByUser = await Event.findOne({
      createdBy: userId,
      _id: eventId,
    });

    if (!findEventByUser) {
      res.status(404).json({ message: "イベントが見つかりません" });
      return;
    }

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: "eventを削除しました" });
  } catch (error) {
    res.status(500).json({ message: "deleteEvent apiのエラーです" });
  }
};
