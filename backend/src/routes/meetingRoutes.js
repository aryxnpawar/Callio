import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import { createMeeting,joinMeeting,getParticipants} from "../controllers/meetingController.js";

const router = express.Router();

router.post("/create", authenticateToken, createMeeting);
// router.post("/join",authenticateToken,joinMeeting);
router.get('/:roomId/participants',authenticateToken,getParticipants)
export default router;