import * as z from "zod";

/** What a message is about. Optional: a plain hello needs no label. */
export const INTENTS = ["project", "role", "collaboration", "question"] as const;

/** What a visitor types. Shared by the form and the API, so both enforce the same limits. */
export const contactSchema = z.object({
  name: z.string().trim().min(3, "Name must contain at least 3 characters.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(200),
  message: z.string().trim().min(10, "Please write something more descriptive.").max(5000),
  intent: z.enum(INTENTS).optional().or(z.literal("")),
});

/** What the form posts: the fields, plus what the spam checks need. */
export const contactRequestSchema = contactSchema.extend({
  /** A field people never see. Bots fill it in. */
  website: z.string().optional(),
  /** When the form became usable, in ms since the epoch. */
  startedAt: z.number(),
  /** Cloudflare Turnstile's answer, when Turnstile is set up. */
  token: z.string().optional(),
});

/** People take longer than this to fill the form; scripts do not. */
export const MIN_FILL_MS = 3000;

/**
 * True for what is almost certainly a bot: the hidden field filled in, a
 * form sent faster than anyone can type, or a message that is mostly links.
 */
export function isSpam(req: z.infer<typeof contactRequestSchema>, now = Date.now()): boolean {
  if (req.website) return true;
  if (now - req.startedAt < MIN_FILL_MS) return true;
  const links = req.message.match(/https?:\/\/|www\./gi)?.length ?? 0;
  return links > 3;
}
