import { Request, Response } from "express";
import Measure from "../models/measureModel";
import { getMeasureValueFromImage } from "../services/geminiService";

export const uploadMeasure = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Dados inválidos.",
      });
    }

    const existingMeasure = await Measure.findOne({
      customer_code,
      measure_type,
      measure_datetime: {
        $gte: new Date(
          new Date(measure_datetime).getFullYear(),
          new Date(measure_datetime).getMonth(),
          1
        ),
        $lt: new Date(
          new Date(measure_datetime).getFullYear(),
          new Date(measure_datetime).getMonth() + 1,
          0
        ),
      },
    });

    if (existingMeasure) {
      return res.status(409).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada.",
      });
    }

    const { image_url, measure_value, measure_uuid } =
      await getMeasureValueFromImage(image);

    const newMeasure = new Measure({
      customer_code,
      measure_datetime,
      measure_type,
      measure_value,
      image_url,
      has_confirmed: false,
    });

    await newMeasure.save();

    res.status(200).json({
      image_url,
      measure_value,
      measure_uuid,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in uploadMeasure:", error.message, error.stack);
      res.status(500).json({
        error_code: "SERVER_ERROR",
        error_description: "Erro interno do servidor.",
      });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({
        error_code: "SERVER_ERROR",
        error_description: "Erro interno do servidor.",
      });
    }
  }
};

export const confirmMeasure = async (req: Request, res: Response) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    // Validate input
    if (!measure_uuid || !confirmed_value) {
      return res
        .status(400)
        .json({
          error_code: "INVALID_DATA",
          error_description: "Dados inválidos.",
        });
    }

    // Find the measure
    const measure = await Measure.findOne({ _id: measure_uuid });

    if (!measure) {
      return res
        .status(404)
        .json({
          error_code: "MEASURE_NOT_FOUND",
          error_description: "Leitura não encontrada.",
        });
    }

    if (measure.has_confirmed) {
      return res
        .status(409)
        .json({
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: "Leitura já confirmada.",
        });
    }

    // Update the measure
    measure.measure_value = confirmed_value;
    measure.has_confirmed = true;

    await measure.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({
        error_code: "SERVER_ERROR",
        error_description: "Erro interno do servidor.",
      });
  }
};

export const listMeasures = async (req: Request, res: Response) => {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    const query: any = { customer_code };

    if (measure_type) {
      if (!["WATER", "GAS"].includes(measure_type as string)) {
        return res
          .status(400)
          .json({
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida.",
          });
      }
      query.measure_type = measure_type;
    }

    const measures = await Measure.find(query);

    if (measures.length === 0) {
      return res
        .status(404)
        .json({
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada.",
        });
    }

    res.status(200).json({
      customer_code,
      measures: measures.map((m) => ({
        measure_uuid: m._id,
        measure_datetime: m.measure_datetime,
        measure_type: m.measure_type,
        has_confirmed: m.has_confirmed,
        image_url: m.image_url,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error_code: "SERVER_ERROR",
        error_description: "Erro interno do servidor.",
      });
  }
};
