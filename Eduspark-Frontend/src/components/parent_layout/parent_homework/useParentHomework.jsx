// 🛠️ Axios is used to send the password change request
import axios from "axios";
import { BaseUrl } from "../../../BaseUrl/BaseUrl";

// 📦 Custom hook to handle all homework-related API interactions for students
const useParentHomework = async (status, role, data , className) => {

  // 📥 Fetch all homework assigned to the student
  if (status === 'get') {
    try {
      
      const homeworkData = await axios.get(
        `${BaseUrl}get-homework/${role}?studentClassName=${className}`,
        { withCredentials: true } // 🧾 Send cookies for authentication
      );

      return homeworkData.data;
    } catch (error) {
      console.error("❌ Error fetching homework:", error);
      throw error;
    }
  }

  // 📤 Submit a student's homework answer to the backend
  if (status === 'post') {
    try {
      const homeworkData = await axios.post(
        `${BaseUrl}post-homework/answer/${role}`,
        data, // 📦 Contains answer, homework info, and student data
        { withCredentials: true }
      );
      return homeworkData.data;
    } catch (error) {
      console.error("❌ Error submitting homework:", error);
      throw error;
    }
  }

  // 📄 Fetch a previously submitted answer for a specific homework
  if (status === 'get-answer') {
    try {
      const homeworkData = await axios.get(
        `${BaseUrl}get-homework/answer/${role}/${data}`,
        { withCredentials: true }
      );
      return homeworkData.data.data; // ✅ Return only the answerText object
    } catch (error) {
      console.error("❌ Error fetching submitted answer:", error);
      throw error;
    }
  }

};

export default useParentHomework;
