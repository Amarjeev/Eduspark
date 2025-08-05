const express = require("express");
const schoolFeeStructureRouter = express.Router();

// 🔗 Mongoose model
const feeStructureSchema = require("../../../../models/feeStructure");

// 🔐 Middleware
const { verifyTokenByRole } = require("../../../../middleware/verifyToken/verify_token");
const validateFeeStructure = require("../../../../validators/validateFeeStructure");

schoolFeeStructureRouter.get(
  "/admin/fees/get-structure",
  verifyTokenByRole('admin'),
  async (req, res) => {
    try {
      const { udisecode } = req.admin;

      // 🔍 Find the fee structure document by school UDISE code
      const response = await feeStructureSchema.findOne({ udisecode });

      if (!response || response.feeStructures.length === 0) {
        return res.status(404).json({
          message: "❗No fee structure found for this school.",
          feeStructures: [],
        });
      }

      // 🔠 Sort feeStructures alphabetically like 1-A, 1-B, 2-A, etc.
      const sortedFeeStructures = response.feeStructures.sort((a, b) => {
        return a.className.localeCompare(b.className, 'en', { numeric: true });
      });

      res.status(200).json({
        message: "✅ Fee structure data fetched successfully.",
        feeStructures: sortedFeeStructures,
      });
    } catch (error) {
      console.error("❌ Error fetching fee structure:", error);
      res.status(500).json({
        message: "❌ Internal server error while fetching fee structure.",
      });
    }
  }
);

// 🧾 Save Fee Structure Route
schoolFeeStructureRouter.post(
  "/admin/fees/save-structure/:status",
  verifyTokenByRole('admin'),
  validateFeeStructure,
  async (req, res) => {
    try {
      const { udisecode } = req.admin;
      const { className, date, totalFee, id } = req.body;
      const { status } = req.params;

      // 🔍 Check if school already has a fee document
      const existingDoc = await feeStructureSchema.findOne({ udisecode });

      if (!existingDoc) {
        // 🆕 Create new document if school not found
        const newFee = new feeStructureSchema({
          udisecode,
          feeStructures: [{ className, date, totalFee }],
        });

        await newFee.save();

        res.status(201).json({
          message: "✅ Fee structure created successfully.",
        });
      }

      if (existingDoc) {
        // ✅ Check for duplicate className + date
        const alreadyExists = existingDoc.feeStructures.some(
          (fee) =>
            fee.className === className &&
            new Date(fee.date).toISOString().slice(0, 10) ===
              new Date(date).toISOString().slice(0, 10)
        );

        if (alreadyExists) {
          return res.status(400).json({
            duplicate: `❌ Fee already set for class "${className}" on "${date}" Please choose a different class or date.`,
          });
        }

        if (status === "edit") {
          const { editingId } = req.body;

          const updated = await feeStructureSchema.findOneAndUpdate(
            { udisecode, "feeStructures._id": id },
            {
              $set: {
                "feeStructures.$.className": className,
                "feeStructures.$.date": date,
                "feeStructures.$.totalFee": totalFee,
              },
            },
            { new: true }
          );

          if (!updated) {
            return res
              .status(404)
              .json({ message: "❌ Fee structure not found for update." });
          }

          return res.status(200).json({
            message: "✅ Fee structure updated successfully.",
          });
        }

        if (status === "post") {
          // ✅ Add new fee to existing school doc
          existingDoc.feeStructures.push({ className, date, totalFee });
          await existingDoc.save();

          return res.status(200).json({
            message: " New class fee added successfully.",
          });
        }
      }
    } catch (error) {
      console.error("❌ Error saving fee structure:", error);
      res.status(500).json({
        message: "❌ Internal server error. Please try again.",
      });
    }
  }
);

schoolFeeStructureRouter.delete(
  "/admin/fees/delete-structure/:id",
  verifyTokenByRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { udisecode } = req.admin;

      const updated = await feeStructureSchema.findOneAndUpdate(
        { udisecode: udisecode },
        { $pull: { feeStructures: { _id: id } } },
        { new: true }
      );
      if (!updated) {
        return res
          .status(404)
          .json({ message: "❌ Parent document not found." });
      }

      res
        .status(200)
        .json({ message: "✅ Fee structure deleted successfully." });
    } catch (error) {
      console.error("❌ Error deleting fee structure:", error);
      res
        .status(500)
        .json({ message: "❌ Internal server error. Please try again later." });
    }
  }
);

module.exports = schoolFeeStructureRouter;
