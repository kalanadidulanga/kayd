"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { INTENTS, contactSchema } from "@/lib/contact";

type Values = z.infer<typeof contactSchema>;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; theme?: "auto" | "light" | "dark" }) => string;
      reset: (id?: string) => void;
    };
  }
}

// Cloudflare Turnstile, only when its site key is set (see .env.example).
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const INTENT_LABELS: Record<(typeof INTENTS)[number], string> = {
  project: "A project",
  role: "A role",
  collaboration: "A collaboration",
  question: "A question",
};

const field =
  "w-full rounded-xl border border-border-strong bg-background/60 px-4 text-[16px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-brand focus:shadow-[0_0_0_4px_var(--brand-soft)] aria-[invalid=true]:border-destructive";

/**
 * The contact form. Labels are always visible; each field checks itself once
 * touched; sending shows a pending state; a failure keeps everything typed
 * and says what to do next. The line beside it completes one segment per
 * valid field, and only the real reply from the server shows success.
 */
export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const widget = useRef<HTMLDivElement>(null);
  // Set once the form is usable; the API drops anything sent too soon after.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const form = useForm<Values>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", message: "", intent: "" },
  });
  const { errors } = form.formState;
  // eslint-disable-next-line react-hooks/incompatible-library
  const values = form.watch();
  const valid = (["name", "email", "message"] as const).filter((k) => contactSchema.shape[k].safeParse(values[k]).success).length;

  function renderTurnstile() {
    if (TURNSTILE_KEY && widget.current && !widget.current.childElementCount) {
      window.turnstile?.render(widget.current, { sitekey: TURNSTILE_KEY, theme: "auto" });
    }
  }

  async function onSubmit(data: Values, extra: FormData) {
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: extra.get("website") ?? "",
          startedAt: startedAt.current,
          token: extra.get("cf-turnstile-response") ?? undefined,
        }),
      });
      if (response.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setError(
        response.status === 500
          ? `The message could not be sent right now. Everything you typed is still here: try again, or email me at ${email}.`
          : body.error || "Something went wrong. Check the form and send again."
      );
    } catch {
      setError(`You seem to be offline. Everything you typed is still here: send again once you are back, or email me at ${email}.`);
    } finally {
      window.turnstile?.reset();
      setStatus((s) => (s === "sending" ? "idle" : s));
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-10">
        <svg aria-hidden="true" viewBox="0 0 240 24" className="h-6 w-60 text-brand">
          <path d="M2 12 H200" pathLength={1} className="sent-line" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="214" cy="12" r="6" className="sent-dot" fill="currentColor" />
        </svg>
        <p className="type-title mt-8">Message sent.</p>
        <p className="mt-3 max-w-md text-muted-foreground">It is in my inbox now. Replies go to the email address you gave.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-brand hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  const describe = (name: keyof Values) => (errors[name] ? `${name}-error` : undefined);

  return (
    <form
      // The trap field and Turnstile's token live outside react-hook-form.
      onSubmit={(e) => {
        const extra = new FormData(e.currentTarget);
        return form.handleSubmit((data) => onSubmit(data, extra))(e);
      }}
      noValidate
      aria-busy={status === "sending"}
      className="relative"
    >
      {/* One segment of the path completes for each valid required field. */}
      <span aria-hidden="true" className="absolute -left-6 top-2 bottom-2 hidden w-px bg-border md:block">
        <span
          className="absolute inset-x-0 top-0 origin-top bg-brand transition-[height] duration-500 ease-cine"
          style={{ height: `${(valid / 3) * 100}%` }}
        />
      </span>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-[15px] font-medium">
            Name
          </label>
          <input id="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describe("name")} className={cn(field, "mt-2 h-12")} {...form.register("name")} />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-sm text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className="block text-[15px] font-medium">
            Email
          </label>
          <input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describe("email")} className={cn(field, "mt-2 h-12")} {...form.register("email")} />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-sm text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className="text-[15px] font-medium">
          What is it about? <span className="font-normal text-muted-foreground">Optional</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTENTS.map((intent) => (
            <label key={intent} className="cursor-pointer">
              <input type="radio" value={intent} className="peer sr-only" {...form.register("intent")} />
              <span className="inline-flex rounded-full border border-border-strong px-4 py-2 text-[14px] text-muted-foreground transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-brand">
                {INTENT_LABELS[intent]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7">
        <label htmlFor="message" className="block text-[15px] font-medium">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={describe("message")}
          className={cn(field, "mt-2 min-h-40 py-3 leading-relaxed")}
          {...form.register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-sm text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* A trap for bots: off screen, out of the tab order, hidden from
          screen readers. People leave it empty; bots fill every field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {TURNSTILE_KEY ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={renderTurnstile} />
          <div ref={widget} className="mt-6" />
        </>
      ) : null}

      {error ? (
        <p role="alert" className="mt-6 rounded-xl border border-destructive/40 px-4 py-3 text-[15px] text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-12 items-center rounded-full bg-brand px-7 text-[15px] font-medium text-on-brand transition-transform duration-200 ease-cine active:scale-[0.98] disabled:opacity-70"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-sm text-muted-foreground">Sent straight to my email. Nothing is stored on this site.</p>
      </div>
    </form>
  );
}
