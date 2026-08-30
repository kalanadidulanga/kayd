export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export const routesConfig: { mainNav: NavItem[] } = {
    mainNav: [
        {
            title: "Skills",
            href: "/skills",
        },
        {
            title: "Experience",
            href: "/experience",
        },
        {
            title: "Contributions",
            href: "/contributions",
        },
        {
            title: "Contact",
            href: "/contact",
        },
    ],
};
