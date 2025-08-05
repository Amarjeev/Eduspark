// const express = require("express");
// const teacherLoginRouter = express.Router();
// const axios = require("axios");

// // ✅ Your Fast2SMS credentials (Never expose the real API key in public code)
// const apiKey = "R7blbc5EkL3TnAJeLE4CNDdPrxFU78UcVjvNDWLCQtjUeGgb0Zdl8o5KxVf9"; // Replace with your valid API key
// const fast2smsUrl = "https://www.fast2sms.com/dev/bulkV2";

// // ✅ Route to send OTP
// teacherLoginRouter.get("/otp/message", async (req, res) => {
//   const mobile = '7034884827'; // Read number dynamically from request
//   const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP

//   if (!mobile) {
//     return res.status(400).json({ success: false, message: "Mobile number is required" });
//   }

//   try {
//     const response = await axios.get(fast2smsUrl, {
//       params: {
//         authorization: apiKey,
//         variables_values: otp,
//         route: "otp",
//         numbers: mobile, // Eg: "9876543210"
//         sender_id: "TXTIND", // Required for DLT route; register this on Fast2SMS DLT panel
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: `OTP sent to ${mobile}`,
//       otp, // For testing only, remove in production
//       data: response.data,
//     });
//   } catch (error) {
//     console.error("OTP send failed:", error.response?.data || error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send OTP",
//       error: error.response?.data || error.message,
//     });
//   }
// });

// module.exports = teacherLoginRouter;
