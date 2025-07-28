import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to', to);
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
  }
};
