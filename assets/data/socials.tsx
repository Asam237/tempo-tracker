import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

export type SocialType = {
  path: string;
  icon: any;
};

export const socials: SocialType[] = [
  {
    icon: <FaGithub size={30} />,
    path: "https://github.com/Asam237",
  },
  {
    icon: <FaLinkedin size={30} />,
    path: "https://www.linkedin.com/in/abba-sali-aboubakar-mamate",
  },
  {
    icon: <FaTwitter size={30} />,
    path: "https://twitter.com/asam_237",
  },
  {
    icon: <FaEnvelope size={30} />,
    path: "mailto:abbasaliaboubakar@gmail.com",
  },
];
