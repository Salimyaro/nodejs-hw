import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";
import { Subscription } from "../../helpers/constants.js";

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
      enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
      default: Subscription.FREE,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.plugin(mongoosePaginate);
const Contact = model("contact", contactSchema);

export default Contact;
