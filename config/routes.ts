export interface NavItem {
  title: string;
  href: string;
}

export const routesConfig: { mainNav: NavItem[] } = {
  mainNav: [
    { title: "Work", href: "/work" },
    { title: "About", href: "/about" },
    { title: "Lab", href: "/lab" },
    { title: "Notes", href: "/notes" },
    { title: "Contact", href: "/contact" },
  ],
};
