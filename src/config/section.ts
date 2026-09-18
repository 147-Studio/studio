export const oddysseySections = [
  {
    title: "",
    slug: "hero",
  },
  {
    title: "",
    slug: "detail",
  },
  {
    title: "",
    slug: "portfolio",
  },
  {
    title: "معرفی دوره",
    slug: "introduction",
  },
  {
    title: "سرفصل‌ها",
    slug: "chapters",
  },
  {
    title: "روش پرداخت",
    slug: "payment",
  },
  {
    title: "سوالات متداول",
    slug: "faq",
  },
] as const;

export type OddysseyPageSection = (typeof oddysseySections)[number]["slug"];
