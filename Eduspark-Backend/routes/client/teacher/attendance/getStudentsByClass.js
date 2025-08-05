const express = require("express");
const getStudentsByClassRouter = express.Router();
const studentSchema = require("../../../../models/student");
const { verifyTokenByRole } = require("../../../../middleware/verifyToken/verify_token");


getStudentsByClassRouter.get(
  "/students/by-class/:className",
  verifyTokenByRole("teacher"),
  async (req, res) => {
    try {
      const { className } = req.params;
      const { udisecode } = req.teacher;

      const response = await studentSchema.find({
        udisecode: udisecode,
        className: className,
      }).select("name studentId className -_id").lean();

      res.status(200).json(response);
    } catch (error) {
      console.error("❌ Error fetching students by class:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching students.",
        error: error.message,
      });
    }
  }
);

module.exports = getStudentsByClassRouter;
