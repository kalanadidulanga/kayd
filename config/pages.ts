import { ValidPages } from "./constants";

type PagesConfig = {
  [key in ValidPages]: {
    title: string;
    description: string;
    // featuredDescription: string;
  };
};

export const pagesConfig: PagesConfig = {
  skills: {
    title: "Skills",
    description: "Key skills that define my professional identity.",
    // featuredDescription: "Skill Showcase",
  },
  experience: {
    title: "Experience",
    description: "Highlighting career journey and impactful projects.",
    // featuredDescription: "Work Timeline",
  },
  contact: {
    title: "Contact",
    description: "Let's connect and explore collaborations.",
    // featuredDescription: "Get in Touch",
  },
  contributions: {
    title: "Contributions",
    description: "Open-source contributions and community involvement.",
    // featuredDescription: "Contributions Showcase",
  },
  educations: {
    title: "Educations",
    description: "My educational journey and certifications.",
    // featuredDescription: "Contributions Showcase",
  },
  aboutme: {
    title: "About Me",
    description:
      "A versatile Full Stack Software Engineer, Kalana Didulanga specializes in frontend development within the MERN stack, with mastery in React. Beyond web technologies, he also develops native mobile applications and software for Windows. Whether building dynamic web interfaces, mobile apps, or desktop solutions, Kalana delivers robust, scalable code that meets the demands of modern digital experiences.",
    // featuredDescription: "Contributions Showcase",
  },
};
