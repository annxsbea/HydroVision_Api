import express from "express";
import {
  uploadMeasure,
  confirmMeasure,
  listMeasures,
} from "../controllers/measureController";

const router = express.Router();

router.post("/upload", uploadMeasure);
router.patch("/confirm", confirmMeasure);
router.get("/:customer_code/list", listMeasures);

export default router;
