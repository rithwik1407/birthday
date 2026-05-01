import mongoose from "mongoose";

const gameImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
      max: 7,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const GameImage =
  mongoose.models.GameImage || mongoose.model("GameImage", gameImageSchema);
