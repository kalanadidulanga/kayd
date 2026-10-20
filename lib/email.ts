import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";
import type { INTENTS } from "@/lib/contact";

/**
 * The two emails a contact message sends: the notice to Kalana and the copy
 * to the visitor. Table layout and inline styles, because that is what mail
 * clients render; every value a visitor typed is escaped before it is
 * placed in the HTML.
 */
export type ContactMessage = { name: string; email: string; message: string; intent?: (typeof INTENTS)[number] | "" };

const INTENT_LABELS: Record<(typeof INTENTS)[number], string> = {
  project: "A project",
  role: "A role",
  collaboration: "A collaboration",
  question: "A question",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const C = {
  canvas: "#07100d",
  mint: "#67e39b",
  ink: "#102018",
  muted: "#50675a",
  mist: "#f4f8f5",
  field: "#eaf2ed",
  line: "#d5e2da",
};
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const site = siteConfig.url.replace("https://", "");

function rows(fields: [string, string][]) {
  return fields
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:14px 16px 14px 0;border-top:1px solid ${C.line};width:120px;vertical-align:top;font:600 11px/1.6 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${C.muted};">${label}</td>
        <td style="padding:14px 0;border-top:1px solid ${C.line};vertical-align:top;font:400 15px/1.6 ${FONT};color:${C.ink};white-space:pre-wrap;">${value}</td>
      </tr>`
    )
    .join("");
}

function layout({ preheader, kicker, title, accent, greeting, heading, paragraphs, fields, button }: {
  preheader: string;
  kicker: string;
  title: string;
  accent: string;
  greeting: string;
  heading: string;
  paragraphs: string[];
  fields: [string, string][];
  button: { href: string; label: string };
}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${C.field};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.field};">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border-radius:18px;overflow:hidden;">
      <tr><td style="background:${C.canvas};padding:36px 36px 40px;background-image:radial-gradient(circle at 90% 120%, rgba(103,227,155,.28), rgba(7,16,13,0) 55%);">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:12px;"><img src="${siteConfig.url}/apple-icon.png" width="32" height="32" alt="KayD" style="display:block;border-radius:8px;"></td>
          <td style="font:600 11px/1 ${FONT};letter-spacing:.18em;text-transform:uppercase;color:${C.mint};">${kicker}</td>
        </tr></table>
        <p style="margin:28px 0 0;font:600 30px/1.15 ${FONT};letter-spacing:-.02em;color:#ecf7f0;">${title}<br><span style="color:${C.mint};">${accent}</span></p>
        <div style="margin-top:28px;width:56px;height:2px;background:${C.mint};border-radius:2px;"></div>
      </td></tr>
      <tr><td style="background:${C.mist};padding:36px;">
        <p style="margin:0;font:600 12px/1.4 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:#087a46;">${greeting}</p>
        <p style="margin:10px 0 0;font:600 24px/1.25 ${FONT};letter-spacing:-.01em;color:${C.ink};">${heading}</p>
        ${paragraphs.map((p) => `<p style="margin:16px 0 0;font:400 15px/1.7 ${FONT};color:${C.muted};">${p}</p>`).join("")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-bottom:1px solid ${C.line};">${rows(fields)}</table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr>
          <td style="background:${C.canvas};border-radius:999px;">
            <a href="${button.href}" style="display:inline-block;padding:14px 26px;font:600 14px/1 ${FONT};color:#ecf7f0;text-decoration:none;">${button.label} <span style="color:${C.mint};">&rarr;</span></a>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background:${C.canvas};padding:22px 36px;">
        <p style="margin:0;font:400 12px/1.6 ${FONT};color:#a0b6a8;"><span style="color:#ecf7f0;font-weight:600;">${profile.displayName}</span>&nbsp; Full stack engineer. Web, mobile and desktop.</p>
        <p style="margin:4px 0 0;font:400 12px/1.6 ${FONT};"><a href="${siteConfig.url}" style="color:${C.mint};text-decoration:none;">${site}</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function fieldsOf(m: ContactMessage, safe: Record<"name" | "email" | "message", string>): [string, string][] {
  return [
    ["Name", safe.name],
    ["Email", `<a href="mailto:${safe.email}" style="color:#087a46;">${safe.email}</a>`],
    ...(m.intent ? ([["About", INTENT_LABELS[m.intent]]] as [string, string][]) : []),
    ["Message", safe.message],
  ];
}

function textOf(m: ContactMessage) {
  return [`Name: ${m.name}`, `Email: ${m.email}`, ...(m.intent ? [`About: ${INTENT_LABELS[m.intent]}`] : []), "", m.message].join("\n");
}

/** The notice to Kalana. Replying goes to the visitor. */
export function ownerEmail(m: ContactMessage) {
  const safe = { name: escapeHtml(m.name), email: escapeHtml(m.email), message: escapeHtml(m.message) };
  const about = m.intent ? INTENT_LABELS[m.intent].toLowerCase() : "a message";
  return {
    subject: `[KayD] ${m.intent ? INTENT_LABELS[m.intent] : "New message"} from ${m.name}`,
    text: textOf(m),
    html: layout({
      preheader: `${safe.name} sent ${escapeHtml(about)} through ${site}.`,
      kicker: "New message",
      title: `${safe.name} wrote in.`,
      accent: m.intent ? `About ${escapeHtml(about)}.` : "Through the contact form.",
      greeting: "From the site",
      heading: "Here is what they sent.",
      paragraphs: ["Reply to this email and it goes straight to them."],
      fields: fieldsOf(m, safe),
      button: { href: `mailto:${safe.email}?subject=${encodeURIComponent("Re: your message")}`, label: `Reply to ${safe.name.split(" ")[0]}` },
    }),
  };
}

/** The copy to the visitor. Replying reaches Kalana. */
export function visitorEmail(m: ContactMessage) {
  const safe = { name: escapeHtml(m.name), email: escapeHtml(m.email), message: escapeHtml(m.message) };
  return {
    subject: `Your message to ${profile.displayName}`,
    text: [
      `Hi ${m.name},`,
      "",
      "Thanks for your message. It is in my inbox now, and here is a copy for you.",
      "If anything changes, just reply to this email.",
      "",
      textOf(m),
      "",
      `${profile.displayName}, ${siteConfig.url}`,
    ].join("\n"),
    html: layout({
      preheader: "Your message is in my inbox. Here is a copy.",
      kicker: "Message received",
      title: "Thanks for writing.",
      accent: "It is with me now.",
      greeting: `Hi ${safe.name},`,
      heading: "Thanks for your message.",
      paragraphs: [
        "It is in my inbox now, and there is a copy of it below for you.",
        "If anything changes in the meantime, just reply to this email.",
      ],
      fields: fieldsOf(m, safe),
      button: { href: siteConfig.url, label: `Visit ${site}` },
    }),
  };
}
