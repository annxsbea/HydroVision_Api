"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeasureValueFromImage = void 0;
const axios_1 = __importDefault(require("axios"));
const geminiApiKey = process.env.GEMINI_API_KEY;
const getMeasureValueFromImage = async (imageBase64) => {
    try {
        const response = await axios_1.default.post('https://ai.google.com/gemini-api/v1/vision/generative', {
            image: imageBase64,
        }, {
            headers: {
                'Authorization': `Bearer ${geminiApiKey}`,
                'Content-Type': 'application/json',
            }
        });
        const { data } = response;
        return {
            image_url: data.image_url,
            measure_value: data.measure_value,
            measure_uuid: data.measure_uuid,
        };
    }
    catch (error) {
        throw new Error('Failed to get measure value from image');
    }
};
exports.getMeasureValueFromImage = getMeasureValueFromImage;
