  // ==============================
  // AWS S3 File Upload Middleware
  // ==============================

  const multer = require("multer"); // Handles multipart/form-data for file uploads
  const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3"); // AWS S3 SDK v3
  const { Upload } = require("@aws-sdk/lib-storage"); // Enables efficient multipart uploads
  const { v4: uuidv4 } = require("uuid"); // Generates unique filenames
  const path = require("path"); // Utility for handling file paths
  const dotenv = require("dotenv"); // Loads environment variables
  const { getSignedUrl } = require("@aws-sdk/s3-request-presigner"); // Creates secure access URLs

  dotenv.config(); // Load environment variables from .env file

  // ==================================
  // Configure Multer (Memory Storage)
  // ==================================


  // Store uploaded file in memory instead of disk
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // ===========================
  // AWS S3 Client Configuration
  // ===========================

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // ========================================
  // Upload File to S3 Using Multipart Upload
  // ========================================

  const uploadToS3 = async (file) => {
    const fileExtension = path.extname(file.originalname); // Get file extension
    const uniqueFileName = `${uuidv4()}${fileExtension}`; // Unique filename
    const key = `adminProfile/${uniqueFileName}`; // S3 file path

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Perform multipart upload (faster, more reliable for larger files)
    const parallelUpload = new Upload({
      client: s3,
      params: uploadParams,
      queueSize: 4, // Max parallel uploads
      partSize: 5 * 1024 * 1024, // 5MB per part
    });

    await parallelUpload.done();
    return key; // Return the uploaded file's S3 key
  };

  // ==========================================
  // Generate Temporary Presigned S3 Access URL
  // ==========================================

  const generatePresignedUrl = async (key) => {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 18000 }); //5 houre
    return url;
  };

  // ==============
  // Export Modules
  // ==============

  module.exports = {
    upload,               // Multer middleware
    uploadToS3,           // Upload function for S3
    generatePresignedUrl, // Function to generate download link
  };
