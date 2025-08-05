const express = require("express");
const studentFeesHistoryRouter = express.Router();
const studentFeeSchema = require("../../../models/studentFee");
const {
  verifyTokenByRole,
} = require("../../../middleware/verifyToken/verify_token");

studentFeesHistoryRouter.get(
  "/get/student-fees/History/:role",
  verifyTokenByRole(),
  async (req, res) => {
    try {
      const { role } = req.params;
      const { employid, className, udisecode } = req[role];
       const { studentId, studentClass } = req?.query;

      const student = await studentFeeSchema
        .findOne({
          udisecode,
          "studentData.studentId": employid || studentId,
          "studentData.className": className || studentClass,
        }).select('paymentHistory balancePaying totalFee studentData')
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({
        success: true,
        data: student || {},
      });
    } catch (error) {
      console.error("Error fetching student fee history:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = studentFeesHistoryRouter;
