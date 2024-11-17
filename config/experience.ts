import { ValidCategory, ValidExpType, ValidSkills } from "./constants";

interface PagesInfoInterface {
  title: string;
  imgArr: string[];
  description?: string;
}

interface DescriptionDetailsInterface {
  paragraphs?: string[];
  bullets?: string[];
}

export interface ExperienceInterface {
  id: string;
  type: ValidExpType;
  companyName: string;
  category: ValidCategory[];
  shortDescription: string;
  websiteLink?: string;
  githubLink?: string;
  techStack: ValidSkills[];
  startDate?: Date;
  endDate?: Date;
  companyLogoImg: any;
  descriptionDetails?: DescriptionDetailsInterface;
  pagesInfoArr: PagesInfoInterface[];
}

const experiences: ExperienceInterface[] = [
  {
    id: "LapelCustomConfigAdminPanel",
    companyName: "Lapel  Custom Config",
    type: "Professional",
    category: ["Frontend", "REST API", "Intigration"],
    shortDescription:
      "Lapel Custom Config Admin Panel, React, Typescript, Tailwind CSS, Shadcn UI",
    websiteLink: "https://www.slpersonalchauffeurs.com/",
    githubLink: "",
    techStack: ["React", "Typescript", "Tailwind CSS", "Shadcn UI"],
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-29"),
    companyLogoImg: "/experience/slpersonalchauffeurs/logo.webp",
    pagesInfoArr: [
      {
        title: "Landing Page",
        description: "",
        imgArr: ["/experience/slpersonalchauffeurs/landing.webp"],
      },
      {
        title: "Tours Page",
        description: "",
        imgArr: ["/experience/slpersonalchauffeurs/tours.webp"],
      },
      {
        title: "Gallery Page",
        description: "",
        imgArr: ["/experience/slpersonalchauffeurs/gallery.webp"],
      },
      {
        title: "Contact Page",
        description: "",
        imgArr: ["/experience/slpersonalchauffeurs/contact.webp"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "During my time working on SL Personal Chauffeurs, I played a crucial role in designing and developing a professional tour booking platform tailored for travelers in Sri Lanka. My focus was on building an intuitive, fast, and mobile-friendly website that simplified tour planning for users.",
        "I developed the website using React and TypeScript, ensuring smooth performance and scalability. Tailwind CSS and Shadcn UI were utilized for designing clean and responsive user interfaces, enhancing both usability and aesthetics.",
        "I worked closely with the product team to implement key features like seamless tour selection, gallery exploration, and contact forms to create a comprehensive user experience.",
      ],
    },
  },
  {
    id: "slpersonalchauffeurs",
    companyName: "SL Personal Chauffeurs",
    type: "Professional",
    category: ["Web Dev", "Frontend", "UI/UX"],
    shortDescription: "An online Sri Lanka Tour booking and Planning platform",
    websiteLink: "https://www.slpersonalchauffeurs.com/",
    githubLink: "",
    techStack: ["React", "Typescript", "Tailwind CSS", "Shadcn UI"],
    startDate: new Date("2024-01-02"),
    endDate: new Date("2024-01-29"),
    companyLogoImg: "/experience/slpersonalchauffeurs/logo.webp",
    pagesInfoArr: [
      {
        title: "Landing Page",
        description: "",
        imgArr: ["/experience/slpersonalchauffeurs/landing.webp"],
      },
      {
        title: "Tours Page",
        description: "",
        imgArr: ["/experience/slpersonalchauffeurs/tours.webp"],
      },
      {
        title: "Gallery Page",
        description: "",
        imgArr: ["/experience/slpersonalchauffeurs/gallery.webp"],
      },
      {
        title: "Contact Page",
        description: "",
        imgArr: ["/experience/slpersonalchauffeurs/contact.webp"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "During my time working on SL Personal Chauffeurs, I played a crucial role in designing and developing a professional tour booking platform tailored for travelers in Sri Lanka. My focus was on building an intuitive, fast, and mobile-friendly website that simplified tour planning for users.",
        "I developed the website using React and TypeScript, ensuring smooth performance and scalability. Tailwind CSS and Shadcn UI were utilized for designing clean and responsive user interfaces, enhancing both usability and aesthetics.",
        "I worked closely with the product team to implement key features like seamless tour selection, gallery exploration, and contact forms to create a comprehensive user experience.",
      ],
      bullets: [
        "Delivered a professional, high-performance web platform for an efficient tour booking experience.",
        "Enhanced the frontend design and functionality with modern technologies, focusing on speed and accessibility.",
        "Implemented a structured and maintainable codebase to support future feature expansions.",
      ],
    },
  },
  {
    id: "bestbirdersl",
    companyName: "Best Birder SL",
    type: "Professional",
    category: ["Web Dev", "Full Stack", "UI/UX"],
    shortDescription:
      "A birdwatching tours and wildlife exploration platform in Sri Lanka",
    websiteLink: "https://bestbirdersl.com/",
    techStack: [
      "React",
      "Typescript",
      "Tailwind CSS",
      "Shadcn UI",
      "PHP",
      "MySQL",
      "REST API",
    ],
    startDate: new Date("2023-11-10"),
    endDate: new Date("2023-12-15"),
    companyLogoImg: "/experience/bestbirdersl/logo.webp",
    pagesInfoArr: [
      {
        title: "Landing Page",
        description: "",
        imgArr: ["/experience/bestbirdersl/landing.webp"],
      },
      {
        title: "Other Pages",
        description:
          "Visit the website to watch more of https://bestbirdersl.com/",
        imgArr: [],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "While working on Best Birder SL, I contributed to building a platform that connects birdwatching enthusiasts with tours and wildlife exploration experiences across Sri Lanka. My primary role was to design an engaging user interface while ensuring that the website delivered a seamless and informative experience for users.",
        "Using technologies like React, TypeScript, and Next.js, I built the website to be fast, scalable, and optimized for search engines. Tailwind CSS was employed to ensure a modern and responsive design, enabling a clean layout across devices.",
        "I collaborated closely with the client to implement interactive features like a tour booking system, gallery for wildlife photographs, and detailed tour descriptions.",
      ],
      bullets: [
        "Developed an optimized, responsive birdwatching tours platform for wildlife enthusiasts.",
        "Implemented interactive tour booking, gallery features, and rich tour details for enhanced user experience.",
        "Utilized modern web technologies for high performance, scalability, and SEO optimization.",
      ],
    },
  },
  {
    id: "hilink",
    companyName: "Hilink",
    type: "Personal Project",
    category: ["UI/UX", "Frontend"],
    shortDescription:
      "Personal Project for Improving my Frontend Development Skills",
    websiteLink: "",
    techStack: ["React", "Typescript", "Tailwind CSS"],
    startDate: new Date("2023-11-10"),
    endDate: new Date("2023-11-12"),
    companyLogoImg: "/experience/hilink/logo.png",
    pagesInfoArr: [
      {
        title: "Home Page",
        description: "",
        imgArr: ["/experience/hilink/home.webp"],
      },
    ],
    descriptionDetails: {
      paragraphs: [],
      bullets: [
        "Fully Responsive Web Application uning React and Tailwind CSS.",
        "Modern and Interactive Web Application",
        "Built with React and Typescript.",
      ],
    },
  },
];

export const Experiences = experiences.sort(
  (a, b) => (b?.startDate?.getTime() ?? 0) - (a?.startDate?.getTime() ?? 0)
);

export const featuredExperiences = Experiences.slice(0, 3).sort(
  (a, b) => (b?.startDate?.getTime() ?? 0) - (a?.startDate?.getTime() ?? 0)
);
