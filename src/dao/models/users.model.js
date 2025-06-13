import { Schema, model } from "mongoose";

const collection = "users";
const schema = new Schema(
  {
    name: { type: String },
    date: { type: Date },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "https://google.com.ar" },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN", "PREM"],
      index: true,
    },
  },
  { timestamps: true }
);

const User = model(collection, schema);
export default User;
