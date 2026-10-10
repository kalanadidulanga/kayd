import type { StaticImageData } from "next/image";
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
  /** Set only when several projects belong to one client, so counts dedupe. */
  client?: string;
  category: ValidCategory[];
  shortDescription: string;
  websiteLink?: string;
  githubLink?: string;
  techStack: ValidSkills[];
  startDate?: Date;
  endDate?: Date;
  /** A real logo. Only logos feed the client strip. Omitted when there is none. */
  companyLogoImg?: StaticImageData | string;
  /** A real screenshot for the card and page header, preferred over the logo. */
  coverImg?: string;
  descriptionDetails?: DescriptionDetailsInterface;
  pagesInfoArr?: PagesInfoInterface[];
  featured?: boolean;
  caseStudy?: {
    problem: string;
    approach: string;
    /** Omitted rather than invented. "Shipped and in production" is valid. */
    outcome?: string;
  };
}

const experiences: ExperienceInterface[] = [
  // The entries from here to "2048-game" were written on 2026-10-08 from a
  // read of each repository (code, schema, commit history) plus the owner's
  // answers. Dates are the owner's own first and last commits, or the
  // repository's dates where a team member wrote the code. At the owner's
  // request no personal names of client contacts appear, and the hotel
  // system's clients are not named. Team-built work says so.
  {
    id: "operations-crm-platform",
    companyName: "Uniguru Operations Platform",
    // Same client as the "uniguru" entry below, so the client count dedupes.
    client: "Uniguru",
    type: "Professional",
    category: ["Full Stack", "Next js", "Typescript"],
    shortDescription:
      "The internal operations and CRM platform of Uniguru, a UK study-abroad consultancy: leads, admissions, partners, staff and compliance in one system.",
    websiteLink: "https://ops.uniguru.co",
    techStack: [
      "Next.js",
      "React",
      "Typescript",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "REST API",
    ],
    startDate: new Date("2026-03-04"),
    coverImg: "/experience/operations-crm-platform/cover.png",
    featured: true,
    caseStudy: {
      problem:
        "Uniguru, a study-abroad consultancy, needed one system for its lead pipeline, a staged admissions process, its partner agents and staff oversight, replacing an older system whose partner records had to be carried over.",
      approach:
        "A Next.js app on Supabase Postgres with row-level security. Access is permission based and checked on every route and on the server. SLA clocks run as scheduled jobs and record breaches, a public lead API feeds it from the marketing site, and a versioned mobile API serves the student and partner app.",
      outcome: "In production.",
    },
    pagesInfoArr: [
      {
        title: "Landing page",
        description: "The sign-in landing page of the platform.",
        imgArr: ["/experience/operations-crm-platform/cover.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "I am the main developer of the operations platform of Uniguru, a UK study-abroad consultancy. Staff work their leads, students and partners from one place, leadership has its own dashboards, and students and partner agents each get a portal.",
        "It is a Next.js App Router application on Supabase: Postgres with row-level security, Auth and Storage. Every user has a system role, roles map to permission groups, and each route and server action checks the permissions it needs.",
        "Background work runs as scheduled jobs on Vercel, with a GitHub Actions fallback for the SLA clock. The codebase is covered by Vitest unit tests and Playwright end-to-end tests.",
      ],
      bullets: [
        "CRM lead pipeline with stages, SLA queues, follow-ups and consultations",
        "Student case management: applications, documents, visa, payments and deadlines",
        "Permission-based access: system roles, permission groups and per-route checks",
        "SLA monitoring that records compliance breaches on a schedule",
        "Click-to-call softphone with call-log sync",
        "Public lead-capture API with spam protection and deduplication",
        "Mobile REST API with push notifications for the companion app",
        "Task boards, an independent auditor module and a knowledge hub",
        "Student and partner portals",
      ],
    },
  },
  {
    id: "student-partner-mobile-app",
    companyName: "Uniguru Mobile App",
    client: "Uniguru",
    type: "Professional",
    category: ["Mobile Dev", "Typescript"],
    shortDescription:
      "A native Android and iOS app that keeps Uniguru's students and partner agents up to date from the operations platform.",
    techStack: ["React Native", "Expo", "Typescript", "Supabase"],
    startDate: new Date("2026-09-16"),
    endDate: new Date("2026-09-20"),
    descriptionDetails: {
      paragraphs: [
        "The companion app to the operations platform above. Students and partner agents get push notifications for events recorded in the platform, and see the same data as their web portal: a student's journey, documents and inbox, or a partner's students, commissions and updates.",
        "Built with Expo Router on React Native. It talks to the platform's versioned mobile API through typed contracts synced from the platform repository, keeps the session in secure storage, and turns staff accounts away at sign-in.",
      ],
      bullets: [
        "Push notification registration and tap routing",
        "Document upload from the camera or files",
        "Separate student and partner areas",
        "Typed API contracts synced from the platform",
        "Store-ready config: iOS privacy manifest, EAS build profiles, over-the-air updates",
        "Jest unit tests and Maestro end-to-end flows",
      ],
    },
  },
  {
    id: "consultancy-website-v2",
    companyName: "Uniguru Website v2",
    client: "Uniguru",
    type: "Professional",
    category: ["Full Stack", "Next js", "Typescript"],
    shortDescription:
      "The redesigned public website of Uniguru, a UK study-abroad consultancy, wired into its operations platform. Built with a developer on my team.",
    websiteLink: "https://www.uniguru.co",
    techStack: [
      "Next.js",
      "Typescript",
      "Prisma",
      "MySQL",
      "Tailwind CSS",
      "Shadcn UI",
    ],
    startDate: new Date("2026-03-01"),
    endDate: new Date("2026-06-17"),
    coverImg: "/experience/consultancy-website-v2/cover.png",
    pagesInfoArr: [
      {
        title: "Home page",
        description: "The redesigned home page with its eligibility form.",
        imgArr: ["/experience/consultancy-website-v2/cover.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "A redesign of Uniguru's public site, built as a team. A developer on my team did most of the page restyling; my part was the integration and content work below.",
        "Every enquiry form posts into the operations platform's lead API, with live intake options and campaign attribution on each lead: UTM tags, partner code, referrer and landing page.",
      ],
      bullets: [
        "Lead submission to the operations platform, with live intake options",
        "Campaign attribution on every lead",
        "Honeypot spam protection",
        "Immigration and regulation pages",
        "Enquiry email handlers by enquiry type",
        "AI course search refactored onto Google Gemini",
        "Compliance copy changes applied across the site from a client audit",
      ],
    },
  },
  {
    id: "college-lms",
    companyName: "Langford College LMS",
    // Langford College and Uniguru are two companies of one client (confirmed
    // by the site owner on 2026-10-09), so they count as one client.
    client: "Uniguru",
    type: "Professional",
    category: ["Full Stack", "Next js", "Typescript"],
    shortDescription:
      "A learning management system for Langford College in the UK, with a regulated assessment and certification chain. Built by a developer on my team, under my supervision, for my client.",
    techStack: [
      "Next.js",
      "Typescript",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Shadcn UI",
    ],
    startDate: new Date("2026-03-04"),
    descriptionDetails: {
      paragraphs: [
        "I took this project on for my client and assigned a developer on my team to build it under my supervision. The code is his.",
        "Students move through courses, cohorts, assignments, quizzes and live lectures. Assessed work follows a regulated chain: the student submits, an assessor marks, an internal quality assurer signs off, the result is released, and the certificate is issued with two-key approval.",
      ],
      bullets: [
        "Courses, modules and topics with a learning view",
        "Assignments with structured marking and a grade book",
        "Quizzes with attempt logging",
        "Lectures scheduled on Zoom automatically",
        "Internal quality assurance sampling and sign-off",
        "Two-key certificate issuance with an issuance log",
        "One-click evidence pack export",
        "Web push and email reminders",
      ],
    },
  },
  {
    id: "headless-shopify-store",
    companyName: "YANA23 Online Store",
    type: "Professional",
    category: ["Frontend", "Next js", "Typescript"],
    shortDescription:
      "A custom Next.js storefront for the clothing brand YANA23 on Shopify, with customer accounts and prices in two currencies.",
    websiteLink: "https://www.yana23.com",
    techStack: [
      "Next.js",
      "React",
      "Typescript",
      "Shopify",
      "GraphQL",
      "Tailwind CSS",
    ],
    startDate: new Date("2026-05-17"),
    endDate: new Date("2026-08-13"),
    coverImg: "/experience/headless-shopify-store/cover.png",
    pagesInfoArr: [
      {
        title: "Home page",
        description: "The storefront home page.",
        imgArr: ["/experience/headless-shopify-store/cover.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "A headless storefront for the clothing brand YANA23. The shop, product pages, cart and customer accounts are a Next.js app; Shopify holds the catalogue and runs checkout and payment, reached through its Storefront GraphQL API.",
        "Prices follow Shopify Markets, so shoppers switch between Sri Lankan rupees and British pounds. I also restyled the store to the brand book and wrote a guide for matching Shopify's checkout to it.",
      ],
      bullets: [
        "Storefront GraphQL data layer",
        "Cart drawer and cart page with discount codes, handing off to Shopify checkout",
        "LKR and GBP pricing through Shopify Markets, with a currency switcher",
        "Customer accounts: sign-up, password recovery, addresses and order history",
        "Shop filters, server-side pagination and search",
        "Wishlist, recently viewed, re-order and quick add",
        "Contact form with rate limiting",
        "Sitemap, robots and page metadata",
      ],
    },
  },
  {
    id: "online-pharmacy",
    companyName: "PNM Online Pharmacy",
    type: "Professional",
    category: ["Full Stack", "REST API", "Typescript"],
    shortDescription:
      "A full-stack online store for Polpithigama New Medical (PNM), a pharmacy, with card payments through iPay, branch pickup and an admin panel.",
    websiteLink: "https://pharmacy-v1-jade.vercel.app",
    techStack: [
      "React",
      "Typescript",
      "express.js",
      "Node.js",
      "Prisma",
      "MySQL",
      "Tailwind CSS",
      "REST API",
    ],
    startDate: new Date("2025-04-05"),
    endDate: new Date("2025-06-07"),
    coverImg: "/experience/online-pharmacy/cover.png",
    pagesInfoArr: [
      {
        title: "About page",
        description: "The store's About page.",
        imgArr: ["/experience/online-pharmacy/cover.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "I built the whole system on my own: the storefront, the admin panel and the REST API behind them.",
        "Customers order for delivery or pick up at a branch, and pay by card or at the branch. Card payments go through iPay: the API generates the payment form checksum, and a webhook verifies the payment notification before it marks the order paid.",
      ],
      bullets: [
        "iPay card payments with checksum verification",
        "Delivery or branch pickup at checkout",
        "Admin pages for products, categories, orders, customers, branches and settings",
        "Dashboard statistics with charts",
        "Product image upload with re-encoding",
        "JWT auth with roles and protected routes",
        "Contact form email",
      ],
    },
  },
  {
    id: "hotel-management-system",
    companyName: "Hotel Management System",
    // The two C-Lento projects count as one client.
    client: "C-Lento",
    type: "Professional",
    category: ["Full Stack", "Next js", "Typescript"],
    shortDescription:
      "An all-in-one hotel system: reservations, front office, restaurant and bar, inventory, HR and double-entry accounting.",
    techStack: [
      "Next.js",
      "React",
      "Typescript",
      "Prisma",
      "MySQL",
      "Socket.io",
      "Docker",
    ],
    startDate: new Date("2025-09-12"),
    featured: true,
    caseStudy: {
      problem:
        "Hotels needed one system for rooms and reservations, the front office, restaurant and bar, stock, staff and double-entry accounts.",
      approach:
        "As the largest single contributor to a team-built system, I worked mostly on the accounting core: the general ledger became the single source for revenue reports, reconciliation scripts for debtors, agents and creditors run as a dry run first, opening balances link to ledger entities, and inventory cost is recognised when stock is issued rather than when it is bought.",
      outcome: "Running live at several hotels.",
    },
    descriptionDetails: {
      paragraphs: [
        "A team-built hotel system, now running live at several hotels. It covers rooms and reservations, the front office, restaurant, cafe and bar point of sale with kitchen order tickets, inventory, HR, assets, banquets, laundry and full double-entry accounting with a night audit.",
        "I am the largest single contributor. My work is mostly in accounting, reports and reservations, listed below.",
      ],
      bullets: [
        "General ledger as the single source for revenue reports, with tests",
        "Dry-run-first reconciliation for debtors, agents and creditors, and a trial balance check",
        "Journal entries under vouchers, and opening balances linked to ledger entities",
        "Inventory cost recognised at issue rather than at purchase",
        "Reservation amendments before check-in, OTA confirmation numbers and occupancy types",
        "Daily sheet, long forecast, and revenue, sales and stock movement reports",
        "Recipe wastage, staff meals, and restaurant credit bills charged to travel agents",
      ],
    },
  },
  {
    id: "cloud-erp-pos",
    companyName: "Hyda ERP",
    client: "C-Lento",
    type: "Professional",
    category: ["Full Stack", "Backend", "Typescript"],
    shortDescription:
      "A multi-tenant cloud ERP and point of sale for retail businesses, with a Go API, a React client and a super admin console. I lead it as project manager and full-stack developer.",
    techStack: [
      "Go",
      "PostgreSQL",
      "Redis",
      "React",
      "Typescript",
      "Tailwind CSS",
      "Docker",
    ],
    startDate: new Date("2026-06-04"),
    descriptionDetails: {
      paragraphs: [
        "A cloud ERP and point of sale for retail businesses, built by a small team. I am the project manager and the full-stack lead for the POS, the dashboard, the front-end design system and the marketplace.",
        "It is contract-first: one OpenAPI spec generates both the Go server stubs and the TypeScript types. Each customer company is provisioned from a business-type template and moves through an enforced lifecycle, with plans, entitlements, platform payments and an audit log.",
      ],
      bullets: [
        "Client app: login, Sinhala and English UI, POS, inventory, purchasing, sales, accounting and reporting",
        "Super admin console for companies, plans, payments, expiry and audit",
        "Go control plane: access model, provisioning, lifecycle, audit log and plan entitlements",
        "Public marketplace app",
        "Two-factor authentication",
        "Postgres migrations and a Redis-backed job worker",
      ],
    },
  },
  {
    id: "zeropos",
    companyName: "ZeroPos",
    type: "Personal Project",
    category: ["Desktop App", "Backend"],
    shortDescription:
      "An offline-first Windows point of sale that a friend and I build together and install at retail shops.",
    techStack: ["C#", ".NET", "SQLite"],
    startDate: new Date("2026-04-04"),
    descriptionDetails: {
      paragraphs: [
        "Our own product: a point of sale for small Sri Lankan retail shops that keeps working without the internet. A friend and I build it together and install it at shops. Most of the code is his.",
        "Each shop runs an ASP.NET Core API on SQLite, cashiers use a WPF desktop client, and terminals find the shop's server on the local network over mDNS. It has setups for bakeries, electronics, grocery, PC and pharmacy shops.",
        "My parts include per-batch pricing with a batch picker at the till, an owner-only audit of price overrides, weight presets for scale items, stock adjustments with inline approval, stock history by user and terminal, keyboard-only cashier fixes and an offline admin recovery command.",
      ],
      bullets: [
        "Works offline, with the shop's own server on the local network",
        "ESC/POS receipt and barcode printing, and a customer display",
        "Gift cards, loyalty, cheques, returns and day-end",
        "Purchase orders and goods received notes",
        "CD-key licensing tied to the machine",
        "MSI installer",
      ],
    },
  },
  {
    id: "kendara",
    companyName: "Kendara",
    type: "Personal Project",
    category: ["Full Stack", "Next js", "Typescript"],
    shortDescription:
      "Builds a Vedic birth chart from birth details or from a photo of a Sri Lankan kendaraya, and writes a reading in Sinhala, English or Tamil.",
    techStack: [
      "Next.js",
      "React",
      "Typescript",
      "PostgreSQL",
      "Tailwind CSS",
      "Google Auth",
      "Vercel AI SDK",
    ],
    startDate: new Date("2026-09-07"),
    endDate: new Date("2026-09-09"),
    websiteLink: "https://kendara.kalanadidulanga.com",
    coverImg: "/experience/kendara/cover.png",
    pagesInfoArr: [
      {
        title: "Home page",
        description: "The home page in Sinhala.",
        imgArr: ["/experience/kendara/cover.png"],
      },
    ],
    featured: true,
    caseStudy: {
      problem:
        "Reading a Sri Lankan kendaraya means calculating a sidereal chart correctly, including the time zone changes Sri Lanka went through, and then explaining it in the reader's own language.",
      approach:
        "The chart comes from the Swiss Ephemeris with the Lahiri ayanamsa and whole-sign houses, with the historical Sri Lankan time zone resolved for each birth instant. A photo of an existing chart can be read by AI into an editable table first. Readings come from Gemini models behind a fallback chain and an output guard, and marriage matching reports the checks it cannot compute as unknown rather than guessing them.",
    },
    descriptionDetails: {
      paragraphs: [
        "My own product. Enter birth details, or photograph an existing kendaraya, and Kendara builds the sidereal chart, then writes a reading and lets you ask questions about it, in Sinhala, English or Tamil.",
      ],
      bullets: [
        "Chart calculation with the Swiss Ephemeris: dasha, varga, dignity and yoga rules",
        "Historical Sri Lankan time zones resolved for each birth instant",
        "Photo-to-chart extraction with an editable review table",
        "Porondam matching: 12 of the 20 checks, the rest reported as unknown",
        "AI readings and chat with the chart, behind a model fallback chain and an output guard",
        "Sinhala, English and Tamil interface with a translation parity test",
        "Saved charts with Google sign-in, read-only share links and a print view",
        "Installable as a PWA",
        "Unit, end-to-end and accessibility tests",
      ],
    },
  },
  {
    id: "project-mouse",
    companyName: "Project Mouse",
    type: "Personal Project",
    category: ["Desktop App", "Backend"],
    shortDescription:
      "A Windows tray app that keeps the PC awake only while a rule says so, using Windows power requests, with mouse movement only as an opt-in.",
    githubLink: "https://github.com/kalanadidulanga/project-mouse",
    techStack: ["Rust", "Tauri", "React", "Typescript"],
    startDate: new Date("2026-08-22"),
    endDate: new Date("2026-08-28"),
    descriptionDetails: {
      paragraphs: [
        "A task-bound wake lock for Windows. It keeps the PC awake while a rule holds, such as a process running, a time window, AC power or a battery level, and lets go when the rule stops holding. It uses Windows power requests, with separate keep running and keep presenting modes.",
        "The core is Rust on Tauri v2 with a React settings window. Releases ship as signed installers through GitHub Releases with auto-update, and CI blocks a merge on formatting, Clippy warnings, failing tests or an oversized executable.",
      ],
      bullets: [
        "Rules engine: process, time window, expiry, AC power, battery, unlocked session and foreground app",
        "A \"why is my PC awake?\" report",
        "Optional input simulation, off by default",
        "Command-line control",
        "Imports Move Mouse settings",
        "Signed auto-updates from GitHub Releases",
      ],
    },
  },
  {
    id: "kayd-invoice-studio",
    companyName: "KayD Invoice Studio",
    type: "Personal Project",
    category: ["Frontend", "Next js", "Typescript"],
    shortDescription:
      "A free invoicing app that runs entirely in the browser: no login, no backend, PDF export.",
    techStack: ["Next.js", "React", "Typescript", "Tailwind CSS", "Shadcn UI"],
    startDate: new Date("2025-03-16"),
    endDate: new Date("2026-09-20"),
    websiteLink: "https://kayd-invoice-generator.vercel.app",
    coverImg: "/experience/kayd-invoice-studio/cover.png",
    pagesInfoArr: [
      {
        title: "Invoice editor",
        description: "The editor with its live A4 preview.",
        imgArr: ["/experience/kayd-invoice-studio/cover.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Create, save and export invoices without an account. Everything stays in the browser's storage, with JSON backups to move it elsewhere.",
        "Invoices support six currencies, item and invoice discounts, tax and part payments, and their status updates itself: unpaid, part paid, paid or overdue. PDFs are generated in the browser, with a print fallback for Sinhala and other non-Latin scripts.",
      ],
      bullets: [
        "Multiple invoices with autosave, search, duplicate and undoable delete",
        "Versioned local storage with migration and cross-tab conflict detection",
        "JSON backup export and validated restore",
        "A4 PDF with pagination and repeated headers",
        "Logo upload with resizing",
        "Playwright tests",
      ],
    },
  },
  {
    id: "kaydrix-digital-cards",
    companyName: "KayDrix Digital Business Cards",
    type: "Personal Project",
    category: ["Full Stack", "Backend"],
    shortDescription:
      "My NFC and QR digital business card platform: public profiles with vCard download, a dashboard for card owners and an admin panel for renewals.",
    techStack: ["Laravel", "PHP", "Tailwind CSS"],
    startDate: new Date("2025-10-11"),
    endDate: new Date("2025-10-24"),
    descriptionDetails: {
      paragraphs: [
        "Each card opens a public profile page where people can save the contact as a vCard. Card owners edit their profile, links and gallery from a dashboard, and an admin panel handles users, payments and renewals.",
        "Built on Laravel with Breeze and Blade. Renewal reminder emails go out at set points before and after the due date.",
      ],
      bullets: [
        "Public profile with vCard download, hidden when an account is inactive or suspended",
        "Owner dashboard: profile, social links, photo and an ordered gallery",
        "Personal and company profiles with business hours, services, map and video",
        "Admin: users, payments and renewals (record payment, remind, suspend, reactivate)",
        "Welcome, receipt and contact emails",
        "One-time web installer for shared hosting",
      ],
    },
  },
  {
    id: "pos-inventory-system",
    companyName: "POS & Inventory System",
    type: "Personal Project",
    category: ["Desktop App", "Full Stack", "Typescript"],
    shortDescription:
      "A point of sale and inventory system with IMEI and warranty tracking, packaged as a Windows desktop app.",
    techStack: [
      "Next.js",
      "React",
      "Typescript",
      "Electron",
      "Prisma",
      "SQLite",
      "Tailwind CSS",
    ],
    startDate: new Date("2026-03-03"),
    descriptionDetails: {
      paragraphs: [
        "A full point of sale for retail shops, built as a Next.js app and packaged with Electron as a Windows desktop app on a local SQLite database.",
        "Phone and electronics stock is tracked down to the IMEI, from purchase through sale and return, together with warranties and their expiry.",
      ],
      bullets: [
        "POS screen with variants, customers, payments and printable receipts",
        "Products, variants, brands and categories, with barcode and SKU lookup and barcode labels",
        "IMEI tracking across purchases, sales and returns",
        "Purchases, purchase returns, sale returns and warranties",
        "Coupons, gift cards and customer loyalty",
        "JWT auth with refresh tokens, roles and per-user permissions",
        "Data backup and purchase order PDFs",
        "Windows installer build with electron-builder",
      ],
    },
  },
  {
    id: "resumint",
    companyName: "ResuMint",
    type: "Personal Project",
    category: ["Frontend", "Typescript", "UI/UX"],
    shortDescription:
      "A CV builder: fill in your details, pick a template, style it and download a PDF. Built with a developer on my team.",
    websiteLink: "https://resumint-nine.vercel.app",
    techStack: ["React", "Typescript", "Redux", "Tailwind CSS"],
    startDate: new Date("2025-03-14"),
    endDate: new Date("2025-06-25"),
    coverImg: "/experience/resumint/cover.png",
    pagesInfoArr: [
      {
        title: "Template picker",
        description: "Choosing one of the three CV templates.",
        imgArr: ["/experience/resumint/cover.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "A browser-based CV builder. Fill in personal, professional, education, skills and reference sections, choose one of three templates, adjust colours and fonts, and download the result as a PDF.",
        "A developer on my team built the original builder. I added the photo tools (upload, crop and filters) and redesigned the home page and navigation.",
      ],
      bullets: [
        "Multi-section CV data",
        "Three templates with colour palettes and font choice",
        "PDF export",
        "Photo upload, crop and filters",
        "Drafts saved in the browser",
      ],
    },
  },
  {
    id: "snake-game",
    companyName: "Neon Snake",
    type: "Personal Project",
    category: ["Web Dev", "Frontend"],
    shortDescription:
      "Snake on an HTML5 canvas, with a neon look, synthesised sound effects and swipe controls on phones.",
    websiteLink: "https://snake-game-kayd.vercel.app",
    githubLink: "https://github.com/kalanadidulanga/snake-game",
    techStack: ["Javascript", "HTML", "CSS"],
    startDate: new Date("2026-01-03"),
    endDate: new Date("2026-01-03"),
    coverImg: "/experience/snake-game/cover.png",
    pagesInfoArr: [
      {
        title: "Start screen",
        description: "The game's start screen.",
        imgArr: ["/experience/snake-game/cover.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Snake drawn on an HTML5 canvas in plain JavaScript and bundled with Vite. The snake speeds up with every piece of food it eats, and the best score stays in the browser.",
        "The sound effects are generated with the Web Audio API rather than loaded from files, and can be switched off. On a phone the snake follows swipes; on a desktop, the arrow keys.",
      ],
      bullets: [
        "Arrow keys on desktop, swipe controls on mobile",
        "Speeds up each time the snake eats",
        "High score saved in local storage",
        "Eat, move and game-over sounds from the Web Audio API, with a sound toggle",
        "Wall and self collisions, and a neon glow on the snake and the food",
      ],
    },
  },
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
    // Year corrected from 2023, which put the end before the start. The
    // exact end date should be confirmed by the site owner.
    endDate: new Date("2024-11-02"),
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
        imgArr: ["/experience/uniguru/dashboards.png"],
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
    // Both Lapel projects are counted as one client, inferred from the
    // project names. The shared client should be confirmed by the site owner.
    client: "Lapel",
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
    // Both Lapel projects are counted as one client, inferred from the
    // project names. The shared client should be confirmed by the site owner.
    client: "Lapel",
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

export const featuredCaseStudies = Experiences.filter(
  (e) => e.featured && e.caseStudy
);
