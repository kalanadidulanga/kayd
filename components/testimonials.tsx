import { testimonials } from "@/config/testimonials";

/** Real, attributed quotes only. An empty config renders nothing at all. */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="container py-24">
      <h2 id="testimonials-title" className="type-section">
        What people say
      </h2>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <figure key={`${t.name}-${t.company}-${i}`} className="border-l border-brand pl-6">
            <blockquote className="text-2xl leading-snug">{t.quote}</blockquote>
            <figcaption className="mt-6 text-[15px] text-muted-foreground">
              <span className="text-foreground">{t.name}</span>
              {", "}
              {t.role}, {t.company}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
