export interface educationsInterface {
  title: string;
  description: string;
  where: string;
  link: string;
}

export const educations: educationsInterface[] = [
  {
    title: "OOP Concepts",
    description:
      "Learned about OOP concepts like encapsulation, inheritance, and polymorphism.",
    where: "Java Institute",
    link: "",
  },
  {
    title: "Diploma in Software Engineering",
    description:
      "Studied computer science with a focus on software development.",
    where: "UK Awards | Skills & Education",
    link: "",
  },
  {
    title: "Undergraduation in Software Engineering",
    description:
      "Studied computer science with a focus on software development.",
    where: "IIC University of Technology",
    link: "",
  },
];

export const featuredEducations: educationsInterface[] = educations.slice(0, 3);
