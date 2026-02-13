import Meeting from "../models/Meeting.js";
import crypto from "crypto";
import { meetingParticipants } from "./socketManager.js";
import { getIo } from "./socketManager.js";

export const createMeeting = async (req, res) => {
  try {
    const roomId = crypto.randomBytes(5).toString("hex");
    const newMeeting = new Meeting({
      roomId: roomId,
      host: req.user.userId,
    });

    await newMeeting.save();
    res.status(201).json({ roomId: newMeeting.roomId });
  } catch (err) {
    console.log("Error Occured : ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const endMeeting = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    if (!roomId)
      return res.status(400).json({ message: "Room Id is required" });

    const meeting = await Meeting.findOne({ roomId: roomId });
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    if (meeting.host.toString() !== userId)
      return res.status(403).json({ message: "only hosts can end meeting" });

    if (!meeting.isActive)
      return res.status(400).json({ message: "meeting already ended" });

    meeting.isActive = false;
    await meeting.save();

    const io = getIo();
    io.to(roomId).emit("meeting-ended"); //but what does this do

    meetingParticipants.delete(roomId);

    return res.status(200).json({ message: "Meeting ended successfully" });
  } catch (err) {
    console.error("Error ending meeting:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkMeeting = async (req, res) => {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      return res.status(400).json({ message: "Meeting Id required" });
    }
    const meeting = await Meeting.findOne({
      roomId: roomId,
      isActive: true,
    });
    if (!meeting) {
      return res
        .status(403)
        .json({ message: "Meeting not found or has ended" });
    }
    return res.status(200).json({
      message: "Meeting is Active",
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
