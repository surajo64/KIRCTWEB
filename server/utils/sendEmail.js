import nodemailer from "nodemailer";

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    // Configure Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"KIRCT HR" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
