import express from "express";

import {
  getAllJasa,
  getJasaById,
  createJasa,
  updateJasa,
  deleteJasa,
} from "../controllers/jasa.controller.js";

const router = express.Router();

router.get("/", getAllJasa);
router.get("/:id", getJasaById);
router.post("/", createJasa);
router.put("/:id", updateJasa);
router.delete("/:id", deleteJasa);

export default router;
