# EduSpark - School Management Platform

## 👤 Author  
**Name:** Amarjeev  

## 📌 Project Description  
EduSpark is a **School Management Platform** built with the MERN stack.  
It provides **secure authentication, admin & student management, email notifications**, and a scalable architecture with professional frontend and backend.  

---

## ⚙️ Tech Stack  

### Backend  
- Node.js  
- Express.js  
- MongoDB Atlas  
- Brevo (Email service)  
- AWS EC2 (Deployment)  

### Frontend  
- React.js  
- Tailwind CSS  
- Axios (for API calls)  
- AWS S3 (Hosting & Image Storage)  
- Cloudflare (Domain & DNS)  

---

## 🚀 Features  
- Admin & Superadmin authentication  
- Email notifications using Brevo  
- Student profile & data management  
- Exam marks entry and retrieval  
- Profile image upload stored on **AWS S3**  
- Secure backend with environment variables  
- Backend deployed on **AWS EC2**  
- Frontend hosted on **AWS S3 bucket**  
- Domain & SSL configured via **Cloudflare**  

---

## 🌐 Deployment Details  

### Backend (AWS EC2)  
1. Node.js + Express APIs running on **AWS EC2**  
2. Connected to **MongoDB Atlas**  
3. Environment variables:  
   ```env
   MONGO_URI=your_mongo_connection_string
   BREVO_API_KEY=your_brevo_api_key
