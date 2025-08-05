const express = require("express");
const announcementsRouter = express.Router();
const announcementSchema = require("../../../../models/announcement");
const {
  verifyTokenByRole,
} = require("../../../../middleware/verifyToken/verify_token");
const sendAnnouncementToRoles = require("../../../../utils/emails_ui/sendAnnouncementToRoles");

// const Student = require("../../../../models/Student");
const Teacher = require("../../../../models/teacher");
// const Parent = require("../../../../models/Parent");
const Admin = require("../../../../models/admin");

announcementsRouter.post(
  "/announcements-create",
  verifyTokenByRole("admin"),
  async (req, res) => {
    try {
      const { date, message } = req.body;
      const { udisecode, schoolname, email } = req.admin;

      if (!date || !message.trim()) {
        return res
          .status(400)
          .json({ error: "Date and message are required." });
      }

      const newAnnouncement = new announcementSchema({
        date,
        message,
        udisecode,
        schoolname,
      });

      const savedAnnouncement = await newAnnouncement.save();

      await sendAnnouncementToRoles({
        models: [Teacher, Admin],
        udisecode,
        savedAnnouncement,
      });

      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

announcementsRouter.get(
  "/announcements-get/:pagecount/:date/:role",
  verifyTokenByRole(),
  async (req, res) => {
    try {
      const { role } = req.params;
      const { udisecode } = req[role];
      const { pagecount, date } = req.params;

      const page = pagecount;
      const limit = 10;
      const skip = (page - 1) * limit;

      const query = { udisecode };
      if (date && date !== "null" && date !== "undefined") {
        query.date = date;
      }

      const count = await announcementSchema.countDocuments(query);

      const response = await announcementSchema
        .find(query)
        .select("-udisecode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(10);

      res.status(200).json({ response, count });
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({
        error:
          "Something went wrong while fetching announcements. Please try again later.",
      });
    }
  }
);

announcementsRouter.put(
  "/announcements-edit/:id",
  verifyTokenByRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { date, message } = req.body;
      const { udisecode, schoolname } = req.admin;

      const response = await announcementSchema.findByIdAndUpdate(
        id,
        { $set: { date, message } },
        { new: true }
      );

      if (!response) {
        return res.status(404).json({ error: "Announcement not found." });
      }

      const savedAnnouncement = {
        date,
        message,
        udisecode,
        schoolname,
      };

      await sendAnnouncementToRoles({
        models: [Teacher, Admin],
        udisecode,
        savedAnnouncement,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(500).json({
        error:
          "Something went wrong while updating the announcement. Please try again later.",
      });
    }
  }
);

announcementsRouter.delete(
  "/announcements-delete/:id",
  verifyTokenByRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const response = await announcementSchema.findByIdAndDelete(id);

      if (!response) {
        return res.status(404).json({ error: "Announcement not found." });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting announcement:", error);
      res.status(500).json({
        error:
          "Something went wrong while deleting the announcement. Please try again later.",
      });
    }
  }
);

module.exports = announcementsRouter;
