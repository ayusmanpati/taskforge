import mailgen from "mailgen";
import nodemailer from "nodemailer";

// Email generation (Content for mailgen) -->
const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app, mate! We're excited to have you on board.",
      action: {
        instructions:
          "To verify your email, please click on the following button or link.",
        button: {
          color: "#22BC66",
          text: "Verify you email, mate :D",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help, mate!",
    },
  };
  // Returns an object
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account, mate.",
      action: {
        instructions:
          "To reset your password, please click on the following button or link.",
        button: {
          color: "#22BC66",
          text: "Reset password, mate :D",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help, mate!",
    },
  };
  // Returns an object
};

// Sending the email -->
const sendEmail = async (options) => {
  /* 
  "options" contains email, subject, and template content (i.e mailgenContent).
   mailgenContent --> forgotPasswordMailgenContent, emailVerificationMailgenContent
   options is received when the function is called along with it.
  */

  const mailGenerator = new mailgen({
    theme: "default",
    product: {
      name: "The GOAT",
      link: "https://taskmanagerlink.com",
    },
  });
  // Creates and initializes the mailgen instance.

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);
  /* 
  Generates:
  1/ Plain text version (fallback for old email clients)
  2/ HTML version (modern styled email)
  => Some email clients don’t support HTML.
  */

  // Creates a connection to an email server (SMTP).
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  // Email Object -->
  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  // Sending email -->
  try {
    await transporter.sendMail(mail);
    // Uses in-buit sendMail() function to send mails.
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure you have provided your Mailtrap credentials in the .env file.",
    );
    console.error("Error: ", error);
  }
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
