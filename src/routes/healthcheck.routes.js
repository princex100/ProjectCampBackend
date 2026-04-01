

import { healthcheck } from "../controllers/healthcheck.controller.js";
import { Router } from "express";


export const router=Router();


router.get("/healthcheck",healthcheck
)