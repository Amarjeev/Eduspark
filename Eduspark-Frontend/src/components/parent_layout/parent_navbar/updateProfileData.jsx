import axios from "axios";
import { BaseUrl } from "../../../BaseUrl/BaseUrl";

// 🔒 Change Password or Update Profile Function
const updateProfileData = async (data, role, item) => {
  try {
    let response;

    // ✏️ Profile Edit Mode
    if (item === "profile-Edit") {
      response = await axios.post(
        `${BaseUrl}update/parent-profile`,
        data, // Send the actual profile data payload
        {
          withCredentials: true,
        }
      );
    } 
    // 🔑 Change Password Mode
    else {
      response = await axios.post(
        `${BaseUrl}${role}/change-password`,
        data,
        {
          withCredentials: true,
        }
      );
    }

    return response.data;
  } catch (error) {
    console.error("Profile update or password change failed:", error.response?.data || error.message);
    throw error;
  }
};

export default updateProfileData;
