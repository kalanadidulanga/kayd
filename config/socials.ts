import { Icons, type IconType } from "@/components/icons";

interface SocialInterface {
  name: string;
  username: string;
  icon: IconType;
  link: string;
}

export const SocialLinks: SocialInterface[] = [
  {
    name: "GitHub",
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
    name: "Instagram",
    username: "@i_m_kayd",
    icon: Icons.instagram,
    link: "https://www.instagram.com/i_m_kayd",
  },
  {
    name: "Gmail",
    username: "dev.kalanadidulanga",
    icon: Icons.gmail,
    link: "mailto:dev.kalanadidulanga@gmail.com",
  },
];
