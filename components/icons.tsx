import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export type IconType = React.ComponentType<{
  className?: string;
  size?: string | number;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/** Brand marks only. Interface glyphs come from lucide-react. */
export const Icons = {
  gitHub: FaGithub,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  gmail: SiGmail,
};
