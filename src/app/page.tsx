import Link from "next/link";
import { getDailyData, getDatesForYear } from "../lib/dailyData";
import ContributionGrid from "../components/ContributionGrid";

export default async function Home() {
  const year = new Date().getFullYear();
  const dates = getDatesForYear(year); // 365 또는 366개
  const dailyData = await getDailyData();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">sgkim.dev</h1>
      <p className="mt-4 text-muted-foreground">
        옳은 길로 바르게
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

      <ContributionGrid dates={dates} dailyData={dailyData} />
    </main>
  );
}
