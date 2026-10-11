"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModalStore } from "@/hooks/use-modal-store";
import { contactSchema } from "@/lib/contact";
import { Icons } from "../icons";

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

const FIELDS: { name: keyof Values; label: string; placeholder: string; type?: string; long?: boolean }[] = [
  { name: "name", label: "Name", placeholder: "Enter your name" },
  { name: "email", label: "Email", placeholder: "Enter your email", type: "email" },
  { name: "mobile", label: "Mobile", placeholder: "Enter your mobile number", type: "tel" },
  { name: "message", label: "Message", placeholder: "Enter your message", long: true },
  { name: "social", label: "Social (optional)", placeholder: "Link for social account", type: "url" },
];

export function ContactForm() {
  const storeModal = useModalStore();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const widget = useRef<HTMLDivElement>(null);
  // Set once the form is usable; the API drops anything sent too soon after.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const form = useForm<Values>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", mobile: "", message: "", social: "" },
  });

  function renderTurnstile() {
    if (TURNSTILE_KEY && widget.current && !widget.current.childElementCount) {
      window.turnstile?.render(widget.current, { sitekey: TURNSTILE_KEY, theme: "auto" });
    }
  }

  async function onSubmit(values: Values, extra: FormData) {
    setIsSending(true);
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: extra.get("website") ?? "",
          startedAt: startedAt.current,
          token: extra.get("cf-turnstile-response") ?? undefined,
        }),
      });
      if (response.ok) {
        form.reset();
        storeModal.onOpen({
          title: "Thank you!",
          description: "Your message has been received. I appreciate you reaching out and will get back to you shortly.",
          icon: Icons.successAnimated,
        });
      } else {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(
          response.status === 500
            ? "The message could not be sent right now. Please email me at dev.kalanadidulanga@gmail.com."
            : data.error || "Something went wrong. Please try again."
        );
      }
    } catch {
      setError("You seem to be offline. Please try again, or email me at dev.kalanadidulanga@gmail.com.");
    } finally {
      window.turnstile?.reset();
      setIsSending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        // The trap field and Turnstile's token live outside react-hook-form.
        onSubmit={(e) => {
          const extra = new FormData(e.currentTarget);
          return form.handleSubmit((values) => onSubmit(values, extra))(e);
        }}
        className="min-w-full space-y-8"
        noValidate
      >
        {FIELDS.map((f) => (
          <FormField
            key={f.name}
            control={form.control}
            name={f.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{f.label}</FormLabel>
                <FormControl>
                  {f.long ? (
                    <Textarea placeholder={f.placeholder} {...field} />
                  ) : (
                    <Input type={f.type ?? "text"} placeholder={f.placeholder} {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

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
            <div ref={widget} />
          </>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={isSending}>
          {isSending ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
