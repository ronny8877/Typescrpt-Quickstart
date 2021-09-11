import mongoose, { Schema } from "mongoose";
import Sample from "../interfaces/sample";

const SampleSchema = new Schema({ title: { type: String } });

export default mongoose.model<Sample>("Sample", SampleSchema);
