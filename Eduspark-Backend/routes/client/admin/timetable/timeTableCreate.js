const express = require("express");
const timetableConfig = express.Router();

const teacherSchema = require("../../../../models/teacher");
const timetableSchema = require("../../../../models/timetable");
const { verifyTokenByRole } = require("../../../../middleware/verifyToken/verify_token");
const validateTimetableEntry = require("../../../../validators/validateTimetableEntry");

// 📘 Route: Get teacher name by ID (admin access only)
timetableConfig.get(
  "/admin/data/teacher/:id",
  verifyTokenByRole('admin'),
  async (req, res) => {
    const { id } = req.params;
    const { udisecode } = req.admin;

    // ✅ Validate teacher ID (must be 8 digits)
    if (!/^\d{8}$/.test(id)) {
      return res.status(400).json({
        message: "Invalid Teacher ID. Must be exactly 8 digits.",
        warning: "❌ Invalid Teacher ID.",
      });
    }

    try {
      // 🔍 Find teacher by employid and UDISE code, only return name field
      const response = await teacherSchema
        .findOne({ udisecode, employid: id })
        .select("name");

      // ❗ If no teacher found
      if (!response) {
        return res.status(404).json({
          message: "Teacher not found",
          warning: "❌ Invalid Teacher ID.",
        });
      }

      // ✅ Return teacher name
      res.status(200).json(response);
    } catch (error) {
      console.error("❌ Error fetching teacher:", error);
      res.status(500).json({
        message: "Server error",
        warning: "Something went wrong on the server. Please try again later",
      });
    }
  }
);

// 📘 Route: Save timetable entries (admin only)
timetableConfig.post(
  "/admin/timetable/save",
  verifyTokenByRole('admin'),
  validateTimetableEntry,
  async (req, res) => {
    try {
      const timetableData = req.body.entries;
      const { udisecode, schoolname } = req.admin;

      // ❗ Check if data is valid
      if (!Array.isArray(timetableData) || timetableData.length === 0) {
        return res.status(400).json({ error: "No timetable data provided." });
      }

      // 🏷️ Group entries by class name (to handle each class separately)
      const grouped = {};
      for (const entry of timetableData) {
        const key = entry.className.trim();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push({
          day: entry.day,
          time: entry.time,
          subject: entry.subject,
          teacherName: entry.teacherName,
          className: entry.className,
          teacherId: entry.teacherId,
        });
      }

      const inserted = []; // ✅ Track newly inserted classes
      const appended = []; // ✅ Track new entries added to existing classes

      // 🔁 Process each class one-by-one
      for (const className in grouped) {
        const existingDoc = await timetableSchema.findOne({
          udisecode: udisecode,
          className: className,
        });

        // 📝 If timetable already exists for the class
        if (existingDoc) {
          const existingEntries = existingDoc.entries || [];

          // 🔍 Filter out entries with same day + time (to avoid duplicates)
          const newEntries = grouped[className].filter(newEntry => {
            return !existingEntries.some(
              oldEntry =>
                oldEntry.day === newEntry.day && oldEntry.time === newEntry.time
            );
          });

          // ➕ If there are unique new entries, append them
          if (newEntries.length > 0) {

            await timetableSchema.findOneAndUpdate(
              { udisecode: udisecode, className: className },
              {
                $push: {
                  entries: {
                    $each: newEntries, // ✅ Add multiple entries safely
                  },
                },
              },
              { new: true }
            );

            appended.push({ className, added: newEntries.length });
          }

        } else {
          // 🆕 No document found → Create a new timetable for the class
          const newDoc = new timetableSchema({
            udisecode: udisecode,
            schoolname: schoolname,
            className,
            entries: grouped[className],
          });

          await newDoc.save();
          inserted.push(className); // ✅ Track newly created class
        }
      }

      // 📤 Send final response back to client
      res.status(201).json({
        message: "✅ Timetable saved successfully.",
        newlyInsertedClasses: inserted,
        newlyAppendedEntries: appended,
      });
    } catch (error) {
      console.error("❌ Error saving timetable:", error);
      res.status(500).json({
        error: "Something went wrong while saving the timetable.",
      });
    }
  }
);

module.exports = timetableConfig;
