import Link from "next/link";
import { getAllSlugs } from "@/lib/posts";

export default function BlogPage() {
  const slugs = getAllSlugs();

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h1>Blog</h1>
      <ul>
        {slugs.map((slug) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>
              {slug}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}