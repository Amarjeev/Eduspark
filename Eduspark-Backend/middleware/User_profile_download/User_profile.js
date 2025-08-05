const express = require("express");
const userProfileRouter = express.Router();

const teacherSchema = require("../../models/teacher");
const adminSchema = require("../../models/admin");
const studentSchema = require("../../models/student");
const parentSchema = require("../../models/parent");

const { verifyTokenByRole } = require("../verifyToken/verify_token");

// Map role to schema
const roleSchemaMap = {
  admin: adminSchema,
  teacher: teacherSchema,
  student: studentSchema,
  parent: parentSchema,
};

userProfileRouter.get(
  "/get/:role/user-profile",
  verifyTokenByRole(),
  async (req, res) => {
    try {
      const { role } = req.params;

      // Validate role
      const UserSchema = roleSchemaMap[role];
      if (!UserSchema) {
        return res.status(400).json({ message: "Invalid user role" });
      }

      // Extract user info from token (set by middleware)
      const {_id} = req[role];

      if (!_id) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

          const userData = await UserSchema.findOne({ _id })
            .select("-password")
            .lean();

      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ userData });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

userProfileRouter.get(
  "/get/teacher-profile/:role",
  verifyTokenByRole(),
  async (req, res) => {
    try {
      const { role } = req.params;
      const { udisecode } = req[role];

      const userData = await teacherSchema
        .find({ udisecode, isDeleted: false }) // ✅ use isDeleted: false to fetch active records
        .select("name subject department profilePicUrl email phonenumber")
        .lean();
      return res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      console.error("❌ Error fetching teacher profile:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);


module.exports = userProfileRouter;
