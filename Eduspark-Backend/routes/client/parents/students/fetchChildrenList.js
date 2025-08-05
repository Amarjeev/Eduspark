// 📦 Import required modules
const express = require("express");
const fetchChildrenListRouter = express.Router();
const redisClient = require("../../../../config/redis/redisClient");
const mongoose = require("mongoose");

// 🔐 Middleware to verify parent's token
const {
  verifyTokenByRole,
} = require("../../../../middleware/verifyToken/verify_token");

// 🧾 Student schema from MongoDB models
const studentSchema = require("../../../../models/student");

// 📘 GET API: Fetch list of children for the logged-in parent
fetchChildrenListRouter.get(
  "/parents/get-studentdata",
  verifyTokenByRole("parent"), // ✅ Ensure the request is from a verified parent
  async (req, res) => {
    try {
      const { studentIds, udisecode, _id } = req.parent;

      if (!Array.isArray(studentIds) || !udisecode) {
        return res.status(400).json({ message: "Invalid request data." });
      }

      const cacheKey = `parent:${_id}:students`;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        return res.status(200).json({ students: cached });
      }

      const studentList = await studentSchema
        .find({ studentId: { $in: studentIds }, udisecode })
        .select("name className profilePicUrl schoolname studentId")
        .lean();

      // ⚠️ If no students found, return 404
      if (!studentList || studentList.length === 0) {
        return res.status(404).json({ message: "No students found" });
      }

      await redisClient.set(cacheKey, JSON.stringify(studentList), { ex: 300 });

      res.status(200).json({ students: studentList });
    } catch (error) {
      // ❌ Handle unexpected errors
      console.error("Error fetching student list:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

fetchChildrenListRouter.get(
  "/students/:studentId/:role",
  verifyTokenByRole(), // ✅ Ensure only parents can access
  async (req, res) => {
    try {
      const { studentId, role } = req.params;
      const { udisecode } = req[role];

         // ⚠️ 3. If not found
      if (!studentId || !udisecode) {
        return res.status(404).json({ message: "studentId or udisecode not found" });
      }

      const cacheKey = `student_profile:${studentId}_${udisecode}`;

      // 🧠 1. Try fetching from Redis cache first
      const cached = await redisClient.get(cacheKey);
      if (cached) {
          return res.status(200).json( cached );
        }

      const studentData = await studentSchema
        .findOne({ studentId: studentId, udisecode: udisecode })
        .select("-password")
        .lean();
      // ⚠️ 3. If not found
      if (!studentData) {
        return res.status(404).json({ message: "Student not found" });
      }

      // 💾 4. Save to Redis for 5 minutes
      await redisClient.set(cacheKey, JSON.stringify(studentData), { ex: 300 });

      // ✅ 5. Return response
      res.status(200).json( studentData );
    } catch (error) {
      console.error("Error fetching student data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// 📤 Export the router
module.exports = fetchChildrenListRouter;
