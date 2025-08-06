// const express = require("express");
// const SubjectConfigSchema = require("../models/ClassDivision");
// const departmentsRoute = express.Router();
// const redisClient = require("../config/redisClient");
// const { verifyTokenByRole } = require("../middleware/verify_token");

// // departmentsRoute.get(
// //   "/school/class-division/:role",
// //   (req, res, next) => {
// //     const { role } = req.params;
// //     const middleware = verifyTokenByRole(role);
// //     middleware(req, res, next);
// //   },
// //   async (req, res) => {
// //     try {
// //       const { role } = req.params;
// //       const { udisecode } = req[role];

// //       const response = await SubjectConfigSchema.find({ udisecode }).lean();
// //       // 🧪 Debug log: Show the result of subject config query

// //       if (!response.length) {
// //         const emptyClassArray = [];
// //           res.status(200).send(emptyClassArray);
// //           return;
// //       }

// //       const classNames = response[0].className
// //         .map((item) => item.value)
// //         .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// //       // Save class names to Redis without expiration
// //       await redisClient.set(
// //         `classNames:${udisecode}`,
// //         JSON.stringify(classNames)
// //       );
// //       res.status(200).send(classNames);
// //       return;
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// // );

// module.exports = departmentsRoute;
