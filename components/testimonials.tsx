import { testimonials } from "@/config/testimonials";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="container py-16 md:py-24">
      <SectionHeader index="06" label="Testimonials" title="What people say" />
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={`${t.name}-${t.company}-${i}`} delay={i * 60}>
            <figure className="border-l-2 border-brand pl-6">
              <blockquote className="text-lg leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t.name}</span>
                {", "}
                {t.role}, {t.company}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
