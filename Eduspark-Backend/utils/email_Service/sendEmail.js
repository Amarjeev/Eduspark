const ses = require("../../config/email/awsSES");

const sendEmail = async (to, subject, messageText, htmlContent) => {
  const params = {
    Source: process.env.SES_SENDER_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: messageText }, // optional fallback
        Html: { Data: htmlContent }, // ✅ the HTML part
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendEmail };
