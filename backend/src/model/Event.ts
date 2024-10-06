import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
  title: string;
  date: Date;
  startTime: string;
  finishTime: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  sharedWith: mongoose.Schema.Types.ObjectId[];
}

const eventSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String },
  finishTime: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IEvent>("Event", eventSchema);
