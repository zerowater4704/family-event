import { Request, Response } from "express";
import Event from "../model/Event";
import User from "../model/User";

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

    const event = await new Event({
      title,
      date,
      startTime,
      finishTime,
      createdBy: userId,
      sharedWith,
    });

    const savedEvent = await event.save();
    res.status(200).json({ savedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "createEvent APi のエラーです" });
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

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const findId = req.params.id;

    if (!findId) {
      res.status(400).json({ message: "eventを見つかりません" });
      return;
    }

    await Event.findByIdAndDelete(findId);
    res.status(200).json({ message: "eventを削除しました" });
  } catch (error) {
    res.status(500).json({ message: "deleteEvent apiのエラーです" });
  }
};
