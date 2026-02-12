import Meeting from "../models/Meeting.js";
import crypto from "crypto";
import { meetingParticipants } from "./socketManager.js";

export const createMeeting = async (req, res) => {
  try {
    const meetingCode = crypto.randomBytes(5).toString("hex");
    const newMeeting = new Meeting({
      meetingCode,
      host: req.user.userId,
    });

    await newMeeting.save();
    res.status(201).json({ meetingCode: newMeeting.meetingCode });
  } catch (err) {
    console.log("Error Occured : ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinMeeting = async (req, res) => {
  try {
    const { meetingCode } = req.body;
    if (!meetingCode) {
      return res.status(400).json({ message: "Meeting code required" });
    }
    const meeting = await Meeting.findOne({
      meetingCode: meetingCode,
      isActive: true,
    });
    if (!meeting) {
      return res
        .status(403)
        .json({ message: "Meeting not found or has ended" });
    }
    return res.status(200).json({
      message: "Joined meeting successfully",
      meetingId: meeting._id,
      meetingCode: meeting.meetingCode,
      host: meeting.host._id,
    });
  } catch (err) {
    console.log("Error Occured : ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getParticipants = (req, res) => {
  const { roomId } = req.params;
  if (!roomId) {
    return res.status(400).json({ message: "Room id not provided" });
  }

  const participants = meetingParticipants.get(roomId);
  if (!participants) {
    return res.json({ participants: [] });
  }

  return res.status(200).json({ participants: Array.from(participants) });
};
