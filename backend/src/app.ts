import express from "express";
import cors from "cors";
import connectDB from "./db";
import userRouter from "./routes/user";
import eventRouter from "./routes/event";

const app = express();
const PORT = 3000;
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);

app.listen(PORT, () => {
  console.log("サーバー起動しました");
});
