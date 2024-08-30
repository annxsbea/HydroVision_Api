"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const measureSchema = new mongoose_1.Schema({
    customer_code: { type: String, required: true },
    measure_datetime: { type: Date, required: true },
    measure_type: { type: String, enum: ['WATER', 'GAS'], required: true },
    measure_value: { type: Number },
    image_url: { type: String },
    has_confirmed: { type: Boolean, default: false },
});
const Measure = (0, mongoose_1.model)('Measure', measureSchema);
exports.default = Measure;
