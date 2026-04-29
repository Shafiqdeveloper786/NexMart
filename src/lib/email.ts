import nodemailer from "nodemailer";

// Transporter — Gmail account that SENDS the mail.
// muhammadshafiqchohan12@gmail.com is used ONLY here (auth + from).
// It never appears as a recipient.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,  // muhammadshafiqchohan12@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char App Password from Google
  },
});

/**
 * Sends an email to whatever address the user typed in the form.
 * @param to   — the user's actual email address (dynamic, from the form)
 * @param subject — email subject line
 * @param html    — HTML body
 */
export async function sendEmail(to: string, subject: string, html: string) {
  // Proof in the terminal that OTP is going to the right person
  console.log("Verification email is being sent to: " + to);

  await transporter.sendMail({
    from: `"NexMart" <${process.env.GMAIL_USER}>`,
    to,        // ← the email the user typed — never hardcoded
    subject,
    html,
  });
}
