// // module.exports = subjectsRoute;
// const express = require("express");
// const subjectConfigSchema = require("../models/SubjectConfig");
// const redisClient = require("../config/redisClient");
// const { verifyTokenByRole } = require("../middleware/verify_token");
// const subjectsRoute = express.Router();

// // 📌 GET /admin/data/subjects - Fetch and format subject names
// subjectsRoute.get(
//   "/school/subjects/:role",
//   (req, res, next) => {
//     const { role } = req.params;
//     const middleware = verifyTokenByRole(role);
//     middleware(req, res, next);
//   },
//   async (req, res) => {
//     try {
//       const { role } = req.params;
//       const { udisecode } = req[role];

//       // 📥 Fetch subjects from DB
//       const response = (
//         await subjectConfigSchema.find({ udisecode }, { subjects: 1, _id: 0 })
//       ).splice();

//       // 🚫 If no subjects found
//       if (!response.length) {
//         return res
//           .status(404)
//           .json({ message: "No subject data found for this UDISE code." });
//       }

//       const subjectNames = response[0].subjects.map((subject) => {
//         const rawName = subject?.name ?? ""; // Safely access name
//         const prettyName =
//           typeof rawName === "string"
//             ? rawName
//                 .split(" ")
//                 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                 .join(" ")
//             : "";

//         return { name: prettyName, _id: subject._id };
//       });

//       const subject = subjectNames.map((item) => item.name);

//       // 💾 Store in Redis cache
//       await redisClient.set(
//         `subjectNames:${udisecode}`,
//         JSON.stringify(subject)
//       );

//       // 📤 Send formatted subject list
//       return res.status(200).json(subject);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// module.exports = subjectsRoute;
