export interface NavItem {
  title: string;
  href: string;
}

export const routesConfig: { mainNav: NavItem[] } = {
  mainNav: [
    { title: "Work", href: "/work" },
    { title: "Experience", href: "/experience" },
    { title: "Skills", href: "/skills" },
    { title: "Contact", href: "/contact" },
  ],
};
