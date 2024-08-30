import express from "express";
import {
  uploadMeasure,
  confirmMeasure,
  listMeasures,
} from "../controllers/measureController";

const router = express.Router();
router.get("/test", (req, res) => {
  res.status(200).json({ message: "testeee" });
});
router.post("/upload", uploadMeasure);
router.patch("/confirm", confirmMeasure);
router.get("/:customer_code/list", listMeasures);

export default router;
