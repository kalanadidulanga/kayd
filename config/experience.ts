import { ValidCategory, ValidExpType, ValidSkills } from "./constants";

interface PagesInfoInterface {
  title: string;
  imgArr?: string[];
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
    id: "2048-game",
    companyName: "2048 Game",
    type: "Personal Project",
    category: ["Web Dev"],
    shortDescription:
      "A classic 2048 game where players combine numbered tiles to reach the elusive 2048 tile.",
    websiteLink: "https://lnkd.in/gnRykQk8",
    githubLink: "https://lnkd.in/gtCkY_NX",
    techStack: ["HTML", "CSS", "Javascript"],
    startDate: new Date("2024-09-15"),
    endDate: new Date("2024-09-20"),
    companyLogoImg: "/experience/2048game/logo.jpg",
    pagesInfoArr: [
      {
        title: "Game Demo",
        description: "Play the classic 2048 game online.",
        imgArr: ["/experience/2048game/1.jpg"],
      },
      {
        title: "Game Demo",
        description: "Play the classic 2048 game online.",
        imgArr: ["/experience/2048game/2.jpg"],
      },
      {
        title: "Mobile Responsive",
        description: "Play the classic 2048 game online.",
        imgArr: ["/experience/2048game/3.jpg"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "I recently completed a classic 2048 game as a fun side project, where players combine numbered tiles to reach the elusive 2048 tile. It might sound simple, but this game calls for serious strategy and quick reflexes to climb the high-score ladder!",
        "Built entirely from scratch with HTML, CSS, and JavaScript, this game features a fully responsive design for both desktop and mobile. The controls are optimized for a seamless experience, allowing players to use arrow keys on desktop or swipe on mobile devices.",
        "This project let me dive deep into game mechanics and polish my web development skills while having fun creating a sleek, engaging puzzle game. It was a fantastic way to blend logic, design, and user experience into a project that’s both challenging and rewarding.",
      ],
      bullets: [
        "Classic puzzle gameplay",
        "Responsive design for all devices",
        "Optimized controls for desktop and mobile",
        "Engaging user interface and experience",
        "Challenging mechanics that test strategy and reflexes",
      ],
    },
  },
  {
    id: "ascii-donut-animation",
    companyName: "ASCII Donut Animation",
    type: "Personal Project",
    category: ["Web Dev"],
    shortDescription:
      "An animated ASCII donut that spins endlessly in the browser.",
    websiteLink: "https://kalanadidulanga.github.io/Donut-Animation/",
    githubLink: "https://github.com/kalanadidulanga/Donut-Animation.git",
    techStack: ["Javascript", "CSS", "HTML"],
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-03"),
    companyLogoImg: "/experience/asciidonut/logo.PNG",
    pagesInfoArr: [
      {
        title: "Demo",
        description: "Interactive demo of the spinning ASCII donut.",
        imgArr: ["/experience/asciidonut/logo.PNG"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Introducing my latest playful project: an animated ASCII donut that spins endlessly in the browser! This project showcases a mesmerizing, rotating donut shape using only JavaScript and CSS, inspired by the creative world of ASCII art and retro-style animations.",
        "The animation utilizes trigonometric functions to dynamically render the donut shape and create a smooth spinning effect. It’s a fun exploration of how simple characters can create engaging visual experiences on the web.",
        "This project taught me a lot about optimizing animations for performance and understanding the intricacies of rendering ASCII characters dynamically. Sometimes, the best way to learn is through having fun with code!",
      ],
      bullets: [
        "Endless spinning animation",
        "Dynamic rendering of ASCII characters",
        "Utilizes JavaScript for animation logic",
        "CSS for styling and layout",
        "Fun exploration of ASCII art techniques",
      ],
    },
  },
  {
    id: "uniguru",
    companyName: "Uniguru",
    type: "Professional",
    category: ["Full Stack", "Next js", "Typescript"],
    shortDescription:
      "Education and Healthcare Recruitment Consultancy Platform - Full Stack Development",
    websiteLink: "https://uniguru.co/",
    githubLink: "",
    techStack: ["Next.js", "Prisma", "MySQL", "Tailwind CSS", "Node.js"],
    startDate: new Date("2024-08-15"),
    endDate: new Date("2023-11-02"),
    companyLogoImg: "/experience/uniguru/logo.PNG",
    pagesInfoArr: [
      {
        title: "Home Page",
        description:
          "Overview of services offered by Uniguru. Visit uniguru.co for more details.",
        imgArr: ["/experience/uniguru/homepage.png"],
      },
      {
        title: "User Dashboards",
        description:
          "Three types of user dashboards for students, partners, and superadmins.",
        imgArr: ["/experience/uniguru/dashboards.PNG"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "I developed the full-stack platform for Uniguru, a consultancy agency specializing in education and healthcare recruitment. The platform connects students with universities and healthcare professionals with job opportunities, streamlining the application and recruitment processes.",
        "Utilizing Next.js for server-side rendering and Prisma with MySQL for database management, I ensured the application was efficient and scalable. The architecture supports dynamic content delivery and real-time updates for users.",
        "The user interface was designed using Tailwind CSS, providing a responsive and modern look that enhances user experience across devices. Features include a comprehensive dashboard for students and recruiters, facilitating easy navigation and access to essential services.",
        "The platform includes three types of user dashboards:",
        "- Student Dashboard: Students can view their university tracking status, manage their uploaded documents, and access personalized information through their student portal.",
        "- Partner Dashboard: Partners can monitor their engagement with Uniguru using their unique partner code and track relevant metrics.",
        "- Superadmin Dashboard: Superadmins have full control over the platform, managing all universities, students, partners, intakes, accommodations, and other critical operations.",
        "By focusing on user engagement and efficient service delivery, I created a solution that meets the needs of both students seeking educational opportunities and healthcare professionals looking for employment.",
      ],
      bullets: [
        "Comprehensive Education Consultancy Services",
        "Healthcare Recruitment Solutions",
        "Responsive Design with Tailwind CSS",
        "Dynamic Content Delivery with Next.js",
        "Efficient Database Management with Prisma and MySQL",
        "User-Friendly Dashboard for Easy Navigation",
        "Three User Types: Student, Partner, Superadmin",
        "Student Portal for Tracking Status and Document Management",
        "Partner Dashboard for Engagement Monitoring",
        "Superadmin Controls for Comprehensive Management",
      ],
    },
  },
  {
    id: "lapelcreatecustom",
    companyName: "Lapel Create Custom",
    type: "Professional",
    category: ["Frontend", "REST API", "Intigration"],
    shortDescription:
      "Lapel Custom Clothing Design Platform - Client-Side Development",
    websiteLink:
      "https://www.linkedin.com/posts/kalana-didulanga_webdevelopment-reactjs-typescript-activity-7263961633025064960-yxi_?utm_source=share&utm_medium=member_android",
    githubLink: "",
    techStack: [
      "React",
      "Typescript",
      "Tailwind CSS",
      "Shadcn UI",
      "REST API",
      "Node.js",
    ],
    startDate: new Date("2024-04-25"),
    endDate: new Date("2024-06-2"),
    companyLogoImg: "/experience/lapelcreatecustom/logo.PNG",
    pagesInfoArr: [
      {
        title: "Create custom",
        description: "Watch the video for more details",
        // imgArr: ["/experience/jobhereadminpannel/1.PNG"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "I developed the client-side platform for Lapel, a custom clothing design and ordering solution, where customers can personalize their outfits by selecting fabrics, styles, and other design options. This intuitive interface allows users to visualize their creations in real-time and place orders seamlessly. The project was designed to deliver a smooth, interactive, and visually appealing user experience.",
        "To achieve this, I used React.js and TypeScript, ensuring the system was highly scalable and efficient. Advanced public state management techniques such as Context API and Redux were utilized to handle dynamic updates and data synchronization across the application. This approach enabled real-time customization and pricing updates based on user selections.",
        "The platform's responsive design was built using Tailwind CSS and Shadcn UI, providing a modern, clean, and user-friendly aesthetic that works seamlessly across devices. The inclusion of features like 3D visualization enhanced the overall engagement, offering users a preview of their custom designs before confirming orders.",
        "By focusing on real-time interaction, efficient state management, and a polished UI, I was able to create a solution that not only meets user expectations but also aligns with Lapel's commitment to delivering a superior custom clothing experience.",
      ],
      bullets: [
        "Custom Clothing Personalization",
        "Real-Time 3D Visualization",
        "Advanced State Management with Context API and Redux",
        "Responsive and Modern UI",
        "Dynamic Pricing and Option Updates",
        "Scalable Frontend Architecture",
      ],
    },
  },
  {
    id: "jobhereadminpannel",
    companyName: "JobHere admin pannel",
    type: "Professional",
    category: ["Frontend", "REST API", "Intigration"],
    shortDescription:
      "Lapel Custom Config Admin Panel, React, Typescript, Tailwind CSS, Shadcn UI",
    websiteLink:
      "https://www.linkedin.com/posts/kalana-didulanga_nextjs-react-adminpanel-activity-7263937664041533440-wWlY?utm_source=share&utm_medium=member_android",
    githubLink: "",
    techStack: [
      "React",
      "Typescript",
      "Tailwind CSS",
      "Shadcn UI",
      "REST API",
      "Next.js",
      "Node.js",
    ],
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-04-18"),
    companyLogoImg: "/experience/jobhereadminpannel/logo.PNG",
    pagesInfoArr: [
      {
        title: "Dashboard",
        description: "Watch the video for more details",
        imgArr: ["/experience/jobhereadminpannel/1.PNG"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "I developed an admin panel for JobHere, a job listing and candidate management platform. This system enables administrators to manage advertisements, users, packages, and transactions while providing a seamless backend operation for both job seekers and employers. The project was built using Next.js for the frontend and integrated with a REST API for backend communication, ensuring high performance and scalability.",
        "The admin panel was developed using Next.js, incorporating modern state management techniques for smooth and efficient data handling. The user interface was designed using Tailwind CSS, ensuring a clean, responsive, and user-friendly experience.",
        "I worked closely with the JobHere product team to implement key features like dynamic advertisement management, user verification, and transaction tracking, delivering a robust and comprehensive admin experience.",
      ],
      bullets: [
        "Dynamic Advertisement Management: Manage and track all job advertisements, including pending, expired, and renewed ads.",
        "User Management: Handle candidate and company accounts, including user verification and report resolution.",
        "Package Management: Create, edit, and confirm subscription packages with detailed configurations.",
        "Transaction Tracking: Monitor transactions by type (e.g., bank, online) for improved financial oversight.",
        "Scalable and Interactive UI: Built a responsive admin panel capable of handling large datasets efficiently.",
      ],
    },
  },
  {
    id: "lapelcustomconfig",
    companyName: "Lapel  Custom Config",
    type: "Professional",
    category: ["Frontend", "REST API", "Intigration"],
    shortDescription:
      "Lapel Custom Config Admin Panel, React, Typescript, Tailwind CSS, Shadcn UI",
    websiteLink:
      "https://www.linkedin.com/posts/kalana-didulanga_reactjs-webdevelopment-tailwindcss-activity-7263898345566273536-5mAi?utm_source=share&utm_medium=member_android",
    githubLink: "",
    techStack: ["React", "Typescript", "Tailwind CSS", "Shadcn UI"],
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-03-05"),
    companyLogoImg: "/experience/lapelcustomconfig/logo.PNG",
    pagesInfoArr: [
      {
        title: "Paackages Page",
        description: "",
        imgArr: ["/experience/lapelcustomconfig/1.PNG"],
      },
      {
        title: "Add Option",
        description: "",
        imgArr: ["/experience/lapelcustomconfig/2.PNG"],
      },
      {
        title: "Shirt Options Page",
        description: "",
        imgArr: ["/experience/lapelcustomconfig/3.PNG"],
      },
      {
        title: "Order Change Page",
        description: "",
        imgArr: ["/experience/lapelcustomconfig/4.PNG"],
      },
      {
        title: "View Option",
        description: "",
        imgArr: ["/experience/lapelcustomconfig/5.PNG"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "I developed an admin panel for the Lapel company's custom clothing design and ordering platform. This system enables the company's administrators to manage clothing options, sub-options, and their attributes while also providing customers the ability to design and order custom outfits through their website. The project was built using React.js for the frontend and integrated with a REST API for backend communication. It focuses on handling large datasets efficiently, ensuring high performance and scalability.",
        "I developed the admin panel using React.js and incorporated modern state management techniques for seamless data handling. Tailwind CSS was utilized for creating a clean and responsive user interface, ensuring both functionality and aesthetics. The integration of REST APIs allowed smooth communication between the frontend and the backend, making operations like CRUD functionalities highly efficient.",
        "Throughout the project, I collaborated with the Lapel product team to understand the requirements and deliver scalable solutions. The admin panel provided the team with essential tools to streamline operations such as clothing package management, dynamic option configuration, and fabric customization, ultimately enhancing the overall efficiency and user experience.",
      ],
      bullets: [
        "Dynamic Package Management: Enables admins to create, edit, and manage clothing packages with detailed attributes like images, pricing, and categories.",
        "Option Configuration: Provides customizable sub-options with attributes such as styles, contrast, and visibility settings using advanced rule-based configurations.",
        "Fabric Management: Facilitates uploading and managing fabric images for various clothing categories, ensuring precision in design visualization.",
        "Scalable and Interactive UI: Developed a responsive and user-friendly admin interface to handle large datasets and dynamic content seamlessly.",
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
