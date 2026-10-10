import { testimonials } from "@/config/testimonials";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";

/** Real, attributed quotes only. An empty config renders nothing at all. */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials">
      <SectionHeading eyebrow="Testimonials" title="What people" serif="say." />
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={`${t.name}-${t.company}-${i}`} delay={i * 60}>
            <figure className="h-full rounded-3xl border border-border-strong bg-surface p-8">
              <blockquote className="serif-accent text-2xl leading-snug">{t.quote}</blockquote>
              <figcaption className="mt-6 text-[0.9375rem] text-muted-foreground">
                <span className="text-foreground">{t.name}</span>
                {", "}
                {t.role}, {t.company}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
