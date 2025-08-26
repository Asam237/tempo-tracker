import {
  FaReact,
  FaNodeJs,
  FaNpm,
  FaDatabase,
  FaDocker,
  FaYarn,
  FaUbuntu,
  FaCss3,
} from "react-icons/fa";

export type TechType = {
  icon: any;
  name: string;
};

export const techs: TechType[] = [
  {
    icon: <FaReact size={40} color="#1f2937" />,
    name: "React.js",
  },
  {
    icon: <FaNodeJs size={40} color="#1f2937" />,
    name: "Node.js",
  },
  {
    icon: <FaNpm size={40} color="#1f2937" />,
    name: "NPM",
  },
  {
    icon: <FaYarn size={40} color="#1f2937" />,
    name: "Yarn",
  },
  {
    icon: <FaDatabase size={40} color="#1f2937" />,
    name: "MongoDB",
  },
  {
    icon: <FaDocker size={40} color="#1f2937" />,
    name: "Docker",
  },
  {
    icon: <FaUbuntu size={40} color="#1f2937" />,
    name: "Ubuntu",
  },
  {
    icon: <FaCss3 size={40} color="#1f2937" />,
    name: "Tailwind",
  },
];
