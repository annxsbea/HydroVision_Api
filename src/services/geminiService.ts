import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined. Please set the API key as an environment variable."
  );
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface MeasureResponse {
  image_url: string;
  measure_value: string;
  measure_uuid: string;
}

export const getMeasureValueFromImage = async (
  image: string
): Promise<MeasureResponse> => {
  try {
    console.log("Sending image to API:", image);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const uploadResponse = await uploadImage(image);

    if (!uploadResponse || !uploadResponse.file) {
      throw new Error("File upload failed or file data is missing");
    }

    const { mimeType, uri } = uploadResponse.file;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType,
          fileUri: uri,
        },
      },
      { text: "Describe how this product might be manufactured." },
    ]);

    console.log("API response:", result);

    const measureValue = result.response?.text();
    if (!measureValue) {
      throw new Error("Measure value not found in response");
    }

    return {
      image_url: uri,
      measure_value: measureValue,
      measure_uuid: "some-uuid",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to get measure value from image:", error.message);
    } else {
      console.error("Failed to get measure value from image:", error);
    }
    throw new Error("Failed to get measure value from image");
  }
};

const uploadImage = async (image: string) => {
  return {
    file: {
      mimeType: "image/png",
      uri: "data:image/png;base64," + image,
    },
  };
};
