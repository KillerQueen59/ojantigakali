export type FactItem = {
  emoji?: string;
  icon: string;
  key: string;
  value: string;
};

export type AboutData = {
  name: string;
  title: string;
  bio: string;
  facts: FactItem[];
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  points: string[];
};

export type Project = {
  name: string;
  type: string;
  desc: string;
  stack: string[];
  url: string;
  icon: string;
  highlights: string[];
  images?: string[];
  location?: string;
  countryCode?: string;
};

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
  location: string;
  gpa?: string;
  highlights: string[];
};

export type Achievement = {
  name: string;
  year: string;
  org: string;
  desc?: string;
  stack?: string[];
  highlights?: string[];
};

export type EducationData = {
  education: EducationEntry[];
  achievements: Achievement[];
};

export type ContactData = {
  email: string;
  location: string;
  github: string;
  linkedin: string;
};

export type GitHubRepo = {
  name: string;
  desc: string;
  lang: string;
  stars: number;
  forks: number;
  color: string;
};

export type GitHubData = {
  username: string;
  url: string;
  repos: number;
  stars: number;
  followers: number;
  pinned: GitHubRepo[];
};

export type ResumeExperience = {
  role: string;
  company: string;
  period: string;
};

export type ResumeData = {
  name: string;
  subtitle: string;
  summary: string;
  experiences: ResumeExperience[];
  skills: string;
};

export type LinkItem = {
  name: string;
  url: string;
  desc: string;
  icon: string;
};

export type LinkCategory = {
  category: string;
  items: LinkItem[];
};

export type LinksData = {
  categories: LinkCategory[];
};

export type PortfolioData = {
  about: AboutData;
  experiences: Experience[];
  projects: Project[];
  education: EducationData;
  contact: ContactData;
  github: GitHubData;
  resume: ResumeData;
  links: LinksData;
};
