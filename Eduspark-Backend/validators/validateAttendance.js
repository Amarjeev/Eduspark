const redisClient = require("../config/redis/redisClient");

const validateAttendanceSummary = async (req, res, next) => {
  const { teacherId, teacherName, date, className, attendanceRecords,udisecode } =
    req.body;

  try {

    // ❗ Validate basic fields
    if (
      !teacherId ||
      !teacherName ||
      !date ||
      !className ||
      !attendanceRecords||!udisecode
    ) {
      return res
        .status(400)
        .json({
          error:
            "All fields (teacherId, teacherName, date, className, attendanceRecords) are required.",
        });
    }

    // ❗ Validate attendance array
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res
        .status(400)
        .json({ error: "Attendance records must be a non-empty array." });
    }

    const missingStatuses = attendanceRecords.filter((r) => !r.status).length;
    if (missingStatuses > 0) {
      return res
        .status(400)
        .json({
          error: `⚠️ ${missingStatuses} student(s) have no attendance status.`,
        });
    }

    // ✅ All validations passed
    next();
  } catch (err) {
    console.error("❌ Redis validation error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error during attendance validation." });
  }
};

module.exports = validateAttendanceSummary;
