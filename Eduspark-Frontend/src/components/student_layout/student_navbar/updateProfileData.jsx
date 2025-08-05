// 🛠️ Axios is used to send the password change request
import axios from "axios";
import { BaseUrl } from "../../../BaseUrl/BaseUrl";

// ChangePassword API Call Function
const updateProfileData = async (item, role) => {
  try {
    const response = await axios.post(
      `${BaseUrl}${role}/change-password`,
      item,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Password change failed:", error.response?.data || error.message);
    throw error;
  }
};

export default updateProfileData;
