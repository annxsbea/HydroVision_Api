import mongoose, { Schema, Document } from "mongoose";

interface IMeasure extends Document {
  customer_code: string;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";
  measure_value?: number;
  image_url?: string;
  measure_uuid: string;
  has_confirmed: boolean;
}

const MeasureSchema: Schema = new Schema({
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, enum: ["WATER", "GAS"], required: true },
  measure_value: { type: Number },
  image_url: { type: String },
  measure_uuid: { type: String, required: true, unique: true },
  has_confirmed: { type: Boolean, default: false },
});

const Measure = mongoose.model<IMeasure>("Measure", MeasureSchema);

export default Measure;
