"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMeasures = exports.confirmMeasure = exports.uploadMeasure = void 0;
const measureModel_1 = __importDefault(require("../models/measureModel"));
const geminiService_1 = require("../services/geminiService");
const uploadMeasure = async (req, res) => {
    console.log("uploadMeasure");
    try {
        const { image, customer_code, measure_datetime, measure_type } = req.body;
        // Validate input
        if (!image || !customer_code || !measure_datetime || !measure_type) {
            return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Dados inválidos.' });
        }
        // Check if the measure already exists
        const existingMeasure = await measureModel_1.default.findOne({
            customer_code,
            measure_type,
            measure_datetime: {
                $gte: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth(), 1),
                $lt: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth() + 1, 0),
            },
        });
        if (existingMeasure) {
            return res.status(409).json({ error_code: 'DOUBLE_REPORT', error_description: 'Leitura do mês já realizada.' });
        }
        // Get measure value from image
        const { image_url, measure_value, measure_uuid } = await (0, geminiService_1.getMeasureValueFromImage)(image);
        // Save the new measure
        const newMeasure = new measureModel_1.default({
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
    }
    catch (error) {
        res.status(500).json({ error_code: 'SERVER_ERROR', error_description: 'Erro interno do servidor.' });
    }
};
exports.uploadMeasure = uploadMeasure;
const confirmMeasure = async (req, res) => {
    try {
        const { measure_uuid, confirmed_value } = req.body;
        // Validate input
        if (!measure_uuid || !confirmed_value) {
            return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'Dados inválidos.' });
        }
        // Find the measure
        const measure = await measureModel_1.default.findOne({ _id: measure_uuid });
        if (!measure) {
            return res.status(404).json({ error_code: 'MEASURE_NOT_FOUND', error_description: 'Leitura não encontrada.' });
        }
        if (measure.has_confirmed) {
            return res.status(409).json({ error_code: 'CONFIRMATION_DUPLICATE', error_description: 'Leitura já confirmada.' });
        }
        // Update the measure
        measure.measure_value = confirmed_value;
        measure.has_confirmed = true;
        await measure.save();
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error_code: 'SERVER_ERROR', error_description: 'Erro interno do servidor.' });
    }
};
exports.confirmMeasure = confirmMeasure;
const listMeasures = async (req, res) => {
    try {
        const { customer_code } = req.params;
        const { measure_type } = req.query;
        const query = { customer_code };
        if (measure_type) {
            if (!['WATER', 'GAS'].includes(measure_type)) {
                return res.status(400).json({ error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida.' });
            }
            query.measure_type = measure_type;
        }
        const measures = await measureModel_1.default.find(query);
        if (measures.length === 0) {
            return res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada.' });
        }
        res.status(200).json({
            customer_code,
            measures: measures.map(m => ({
                measure_uuid: m._id,
                measure_datetime: m.measure_datetime,
                measure_type: m.measure_type,
                has_confirmed: m.has_confirmed,
                image_url: m.image_url,
            })),
        });
    }
    catch (error) {
        res.status(500).json({ error_code: 'SERVER_ERROR', error_description: 'Erro interno do servidor.' });
    }
};
exports.listMeasures = listMeasures;
