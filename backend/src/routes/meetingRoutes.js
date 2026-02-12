import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import { createMeeting,getParticipants,endMeeting} from "../controllers/meetingController.js";

const router = express.Router();

router.post("/create", authenticateToken, createMeeting);
// router.post("/join",authenticateToken,joinMeeting);
router.get('/:roomId/participants',authenticateToken,getParticipants)
router.post('/:roomId/end',authenticateToken,endMeeting)

export default router;