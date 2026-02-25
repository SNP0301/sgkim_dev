import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">sgkim.dev</h1>
      <p className="mt-4 text-muted-foreground">
        개발 블로그 준비 중입니다.
      </p>
            <Link
        href="/blog"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "10px 14px",
          border: "1px solid #ddd",
          borderRadius: 10,
          textDecoration: "none",
        }}
      >
        📚 Posts 보러가기
      </Link>
    </main>
  );
}
