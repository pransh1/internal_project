// import nodemailer from "nodemailer";
// export const sendMail = async (to, subject, html) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     html,
//   });

//   console.log("✅ MAIL RESPONSE:", info);
// };


import dotenv from "dotenv";
dotenv.config();
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;

// 🔐 API KEY
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const sendMail = async (to, subject, html) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const email = {
      sender: {
        name: "Admin Panel",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    const response = await apiInstance.sendTransacEmail(email);

    console.log("✅ BREVO MAIL SENT:", response.messageId);
  } catch (error) {
    console.error(
      "❌ BREVO ERROR:",
      error.response?.body || error.message
    );
    throw error;
  }
};
