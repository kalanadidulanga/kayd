export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

/**
 * Real quotes from real people only. Empty means the section does not
 * render. Do not add sample or illustrative entries here.
 */
export const testimonials: Testimonial[] = [];
