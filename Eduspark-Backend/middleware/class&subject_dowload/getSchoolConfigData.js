const express = require("express");
const getSchoolConfigDataRoute = express.Router();

const SubjectConfigSchema = require("../../models/classDivision");
const subjectConfigSchema = require("../../models/subjectConfig");

const redisClient = require("../../config/redis/redisClient");
const { verifyTokenByRole } = require("../verifyToken/verify_token");

// 📌 GET /school/config-data/:role - Fetch both class names and subject names
getSchoolConfigDataRoute.get(
  "/school/config-data/:role",
  verifyTokenByRole(),
  async (req, res) => {
    try {
      const { role } = req.params;
      const { udisecode, employid } = req[role];

      // Run both MongoDB queries at the same time
      const [subjectResponse, classResponse] = await Promise.all([
        subjectConfigSchema.find({ udisecode }, { subjects: 1, _id: 0 }),
        SubjectConfigSchema.find({ udisecode }).lean(),
      ]);

      // === Handle Subject Response ===
      // ✅ Check if both subject and class data are empty
      if (!subjectResponse.length && !classResponse.length) {
        return res.status(200).json({
          subjects: ["No subjects available"],
          classes: ["No classes available"],
          message: "No subject or class data found for this UDISE code.",
        });
      }

      const subjectNames = subjectResponse[0].subjects.map((subject) => {
        const rawName = subject?.name ?? "";
        const prettyName =
          typeof rawName === "string"
            ? rawName
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : "";
        return { name: prettyName, _id: subject._id };
      });

      const subjectList = subjectNames.map((item) => item.name);

      await redisClient.set(
        `subject-List:${udisecode}${employid}`,
        JSON.stringify(subjectList)
      );

      // === Handle Class Response ===
      if (!classResponse.length) {
        return res
          .status(404)
          .json({ message: "No class data found for this UDISE code." });
      }

      const classList = classResponse[0].className
        .map((item) => item.value)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      await redisClient.set(
        `class-List:${udisecode}${employid}`,
        JSON.stringify(classList)
      );

      // ✅ Send both
      return res.status(200).json({
        subjects: subjectList || [],
        classes: classList || [],
      });
    } catch (error) {
      console.error("❌ Error fetching config data:", error);
      return res.status(500).json({
        message: "Server error while fetching class & subject data.",
        error,
      });
    }
  }
);
module.exports = getSchoolConfigDataRoute;
