import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import { createMeeting,joinMeeting} from "../controllers/meetingController.js";

const router = express.Router();

router.post("/create", authenticateToken, createMeeting);
router.post("/join",authenticateToken,joinMeeting);

export default router;