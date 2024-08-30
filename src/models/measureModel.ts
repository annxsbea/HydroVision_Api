import { Schema, model } from 'mongoose';

interface IMeasure {
  customer_code: string;
  measure_datetime: Date;
  measure_type: 'WATER' | 'GAS';
  measure_value?: number;
  image_url?: string;
  has_confirmed?: boolean;
}

const measureSchema = new Schema<IMeasure>({
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, enum: ['WATER', 'GAS'], required: true },
  measure_value: { type: Number },
  image_url: { type: String },
  has_confirmed: { type: Boolean, default: false },
});

const Measure = model<IMeasure>('Measure', measureSchema);

export default Measure;
