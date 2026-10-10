import type { ValidSkills } from "./constants";

/**
 * Where each skill is shown. The Skills page lists a skill only alongside
 * the projects that use it (see lib/skills.ts), so this file says where a
 * skill goes, never how good it is.
 */
export interface SkillGroup {
  title: string;
  skills: ValidSkills[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    skills: [
      "Next.js",
      "React",
      "Typescript",
      "Javascript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Shadcn UI",
      "Redux",
      "GSAP",
      "Material UI",
      "Bootstrap",
      "Angular",
    ],
  },
  {
    title: "Backend",
    skills: [
      "Node.js",
      "express.js",
      "Nest.js",
      "Go",
      "PHP",
      "Laravel",
      "REST API",
      "GraphQL",
      "Socket.io",
      "Google Auth",
      "Vercel AI SDK",
      "JAVA",
      "ASP.NET",
      "Python",
    ],
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Prisma", "Supabase"],
  },
  { title: "Mobile", skills: ["React Native", "Expo", "Flutter", "Android"] },
  { title: "Desktop", skills: ["Rust", "Tauri", "Electron", "C#", ".NET", "C++", "Java desktop"] },
  { title: "Platforms and DevOps", skills: ["Docker", "Shopify", "AWS", "GCP"] },
  { title: "Architecture and security", skills: ["Microservices", "Microfrontends", "Security"] },
];

/**
 * Skills Kalana states he has: those on his old Skills page, and those he
 * named on 2026-10-11 from his company work. Any of them that no listed
 * project uses is shown in its group without a count: it is his own
 * statement, so it is shown as one.
 */
export const declaredSkills: ValidSkills[] = [
  "Next.js",
  "React",
  "GraphQL",
  "Nest.js",
  "express.js",
  "Node.js",
  "MongoDB",
  "Typescript",
  "Javascript",
  "HTML",
  "PHP",
  "CSS",
  "React Native",
  "Angular",
  "Redux",
  "Socket.io",
  "Material UI",
  "Tailwind CSS",
  "AWS",
  "Bootstrap",
  "MySQL",
  "JAVA",
  "ASP.NET",
  "Java desktop",
  "Android",
  "Flutter",
  "C#",
  ".NET",
  "C++",
  "Microservices",
  "Microfrontends",
  "Security",
  "GCP",
];
