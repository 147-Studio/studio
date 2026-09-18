export const course_list = [
  "Linux",
  "Cyber Security",
  "DevOps",
  "Wordpress",
  "Node js",
  "React js",
  "Bash",
  "UI Design",
] as const;

export type Course = (typeof course_list)[number];



export const courses_link = {
  odyssey: "https://academy.147studio.pro/product/odyssey/",
};
