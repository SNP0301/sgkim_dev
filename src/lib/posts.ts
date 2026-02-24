import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type Post = {
  slug: string;
  title: string;
  date: string;
  contentHtml: string;
};

export function getAllSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) =>
    fileName.replace(/\.md$/, "")
  );
}

export async function getPost(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? "",
    contentHtml: processed.toString(),
  };
}