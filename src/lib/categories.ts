export const CATEGORIES = [
  "BOOK",
  "WORKOUT",
  "FINANCE",
  "CAREER_DEV",
  "OTHER",
] as const;

export type Category = (typeof CATEGORIES)[number];
