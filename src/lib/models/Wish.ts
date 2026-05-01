import mongoose from "mongoose";

const wishSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderPhoto: {
      type: String,
      default: "",
    },
    hint: {
      type: String,
      default: "",
    },
    revealPhoto: {
      type: String,
      required: true,
    },
    revealMessage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["friend", "family", "you"],
      default: "friend",
    },
    isSpecial: {
      type: Boolean,
      default: false,
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: false }
);

// Delete the old model if it exists to avoid conflicts
if (mongoose.models.Wish) {
  delete mongoose.models.Wish;
}

export const Wish = mongoose.model("Wish", wishSchema);
