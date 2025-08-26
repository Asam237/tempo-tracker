export type WorkType = {
  description: string;
  periode: string;
  structure: string;
  lang: string;
  link: string;
};

export const works: WorkType[] = [
  {
    description: "Application for shortening URLs and storing useful links.",
    periode: "Sep 2021",
    structure: "Famdy",
    lang: "TypeScript - Next - Express",
    link: "https://famdy.abbasali.cm",
  },
  {
    description:
      "A Leaderboards (CM) - WakaTime - Programming and time tracking leaderboard",
    periode: "Sep 2021",
    structure: "WakaTime Scrapping",
    lang: "TypeScript - Axios - Cheerio",
    link: "https://github.com/Asam237/wakatime-scraping-nodejs",
  },
  {
    description:
      "This project contains a minimal starter for Node.js project with Typescript, ESLint and Prettier",
    periode: "Sept 2021 - Today",
    structure: "Node Typescript Starter",
    lang: "TypeScript - ExpressJS - MongoDB",
    link: "https://github.com/Asam237/node-restapi-starter",
  },
  {
    description: "A platform brimming with active and diverse talent.",
    periode: "Sep 2021",
    structure: "Gougal App",
    lang: "TypeScript - NextJS - GithubAction",
    link: "https://gougal.abbasali.cm",
  },
];
