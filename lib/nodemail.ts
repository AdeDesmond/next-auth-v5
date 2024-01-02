import nodemailer from "nodemailer";

export const sendEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `${process.env.DOMAIN}/auth/new-verification?token=${token}`;
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0bd918ba8a2a88",
        pass: "dffd6f99725196",
      },
    });

    const mailOptions = {
      from: "desmond@email.com",
      to: email,
      subject: "Confirm your email",
      html: `<p> Click <a href="${confirmLink}">here </a> to confirm 
       </p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${process.env.DOMAIN}/auth/new-password?token=${token}`;
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0bd918ba8a2a88",
        pass: "dffd6f99725196",
      },
    });

    const mailOptions = {
      from: "desmond@email.com",
      to: email,
      subject: "Reset your password",
      html: `<p> Click <a href="${resetLink}">here </a> to reset your password 
       </p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0bd918ba8a2a88",
        pass: "dffd6f99725196",
      },
    });

    const mailOptions = {
      from: "desmond@email.com",
      to: email,
      subject: "2FA CODE",
      html: `<p> Your 2FA code ${token} 
       </p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.log(error.message);
  }
};
