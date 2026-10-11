import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { contactRequestSchema, isSpam } from "@/lib/contact";

const WINDOW_MS = 10 * 60 * 1000;
const PER_WINDOW = 5;
// ponytail: per-instance memory, so a flood spread across serverless
// instances gets through; Turnstile is the real gate. Move this to a shared
// store (Vercel KV, Upstash) if spam still lands.
const recent = new Map<string, number[]>();

function rateLimited(ip: string, now = Date.now()): boolean {
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > PER_WINDOW;
}

async function passesTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Not set up: the other checks stand alone.
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

export async function POST(req: Request) {
  const parsed = contactRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }
  const form = parsed.data;

  // Answer bots as if it worked, so they have nothing to learn from.
  if (isSpam(form)) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }
  if (!(await passesTurnstile(form.token, ip))) {
    return NextResponse.json({ error: "Please complete the check and send again." }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.error("Contact form: SMTP env vars not configured");
    return NextResponse.json({ error: "Mail is not configured" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 465,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const name = form.name.replace(/\s+/g, " ");
  try {
    await transporter.sendMail({
      from: { name: "KayD contact form", address: SMTP_USER },
      to: CONTACT_TO,
      // Reply in the mail app and it goes to the visitor.
      replyTo: { name, address: form.email },
      subject: `[KayD] New message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${form.email}`,
        `Mobile: ${form.mobile}`,
        `Social: ${form.social || "-"}`,
        "",
        form.message,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
