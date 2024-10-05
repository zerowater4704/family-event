import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/User";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("バリデーションエラーです", errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const { name, email, password, sharedUsers } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      res.status(400).json({ message: "emailが既に存在しています。" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      sharedUsers,
    });

    const newUser = await user.save();
    res.status(200).json({ message: "ユーザー生産に成功しました。", newUser });
  } catch (error) {
    console.error("ユーザー作成エラー: ", error);
    res.status(500).json({ message: "createUser apiのエラーです。", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "ユーザーが見つかりません" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "ログインに成功しました", token, user });
  } catch (error) {
    res.status(500).json({ message: "loginUser Apiのエラーです", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "tokenが見つかりません" });
    return;
  }
  try {
    const findUser = await User.findById(userId);
    if (!findUser) {
      res.status(400).json({ message: "ユーザーが見つかりません" });
      return;
    }

    const { name, email, password } = req.body;

    const updateData = { name, email, password };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updateUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({ updateUser });
  } catch (error) {
    res.status(500).json({ message: "updateUser Apiのエラーです", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "tokenがありません" });
    return;
  }
  try {
    const { password } = req.body;

    const findUser = await User.findById(userId);
    if (!findUser) {
      res.status(400).json({ message: "ユーザーが見つかりません" });
      return;
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています。" });
      return;
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "ユーザーが削除できました" });
  } catch (error) {
    res.status(500).json({ message: "deleteUser Apiエラーです" });
  }
};

export const searchUser = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    const users = await User.find({
      $or: [
        { name: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
      ],
    }).select("name email _id");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "searchUser APIにエラーです" });
  }
};

export const addSharedUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { email } = req.body;

    const sharedUser = await User.findOne({ email });
    if (!sharedUser) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    if (
      !user.sharedUsers.includes(
        sharedUser._id as mongoose.Schema.Types.ObjectId
      )
    ) {
      user.sharedUsers.push(sharedUser._id as mongoose.Schema.Types.ObjectId);
      await user.save();
      res.status(200).json({ message: "ユーザーが追加できました。", user });
    } else {
      res.status(400).json({ message: "ユーザーが既にリストに入っています" });
    }
  } catch (error) {
    res.status(500).json({ message: "addSharedUser APiのエラーです" });
  }
};

export const getUserWithSharedUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(404)
        .json({ message: "ユーザーを見つかりません、tokenがありません" });
    }

    const user = await User.findById(userId).populate(
      "sharedUsers",
      "name email"
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "getUserWithSharedUsers apiのエラーです" });
  }
};
