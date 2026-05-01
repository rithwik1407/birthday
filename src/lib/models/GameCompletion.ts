import mongoose from "mongoose";

const gameCompletionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const GameCompletion =
  mongoose.models.GameCompletion ||
  mongoose.model("GameCompletion", gameCompletionSchema);
