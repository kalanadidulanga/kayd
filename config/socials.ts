import { Icons } from "@/components/icons";

interface SocialInterface {
  name: string;
  username: string;
  icon: any;
  link: string;
}

export const SocialLinks: SocialInterface[] = [
  {
    name: "Github",
    username: "@kalanadidulanga",
    icon: Icons.gitHub,
    link: "https://github.com/kalanadidulanga/",
  },
  {
    name: "Facebook",
    username: "Kalana Didulanga",
    icon: Icons.facebook,
    link: "https://facebook.com/profile.php?id=100072829954538",
  },
  {
    name: "LinkedIn",
    username: "Kalana Didulanga",
    icon: Icons.linkedin,
    link: "https://www.linkedin.com/in/kalana-didulanga/",
  },
  {
    name: "Gmail",
    username: "dev.kalanadidulanga",
    icon: Icons.gmail,
    link: "mailto:dev.kalanadidulanga@gmail.com",
  },
];
