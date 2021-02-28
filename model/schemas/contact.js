import mongoose from "mongoose";
const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: [true, "Contact's name required"],
    },
    email: {
      type: String,
      match: /^.*@.*$/,
      required: [true, "Contact's email required"],
    },
    phone: {
      type: String,
      match: /^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/,
      required: [
        true,
        "A phone number is required, in the format: '(099) 333-4444'",
      ],
    },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    password: {
      type: String,
      default: "password",
    },
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("contact", contactSchema);

export default Contact;
