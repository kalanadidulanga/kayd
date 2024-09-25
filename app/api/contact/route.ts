// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, message, social, mobile } = await req.json();

  console.log({ name, email, message, social, mobile });

  const transporter = nodemailer.createTransport({
    host: "mail.kalanadidulanga.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "noreply@kalanadidulanga.com",
      pass: "ikgKD@2005",
    },
  });

  const mailOptions = {
    from: "noreply@kalanadidulanga.com", // Ensure this address is verified
    to: "dev.kalanadidulanga@gmail.com",
    replyTo: email, // Set reply-to as the sender's email
    subject: "Contact Form Submission by " + name,
    text: `Message from: ${email}\n\n${message}\n\nMobile: ${mobile}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error sending email", details: error.message },
      { status: 500 }
    );
  }

  // return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
}
