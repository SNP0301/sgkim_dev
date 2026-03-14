import Link from "next/link";
import { getDailyData, getDatesForYear } from "../lib/dailyData";

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

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">
          {year} 잔디
          <span className="ml-2 text-xs text-muted-foreground">
            (총 {dates.length}일)
          </span>
        </h2>
        <p className="text-sm text-muted-foreground mb-3">
          오늘 저는 무슨 활동을 했을까요?
        </p>

        <div className="inline-block rounded-md border border-neutral-200 bg-white p-3 text-[0px] dark:border-neutral-800 dark:bg-neutral-950">
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {dates.map((date) => {
              const text = dailyData[date];
              const hasData = Boolean(text);

              return (
                <div
                  key={date}
                  className="relative group h-3 w-3"
                >
                  <div
                    className={[
                      "h-full w-full rounded-[2px] border border-neutral-200 dark:border-neutral-800",
                      hasData
                        ? "bg-emerald-500 group-hover:bg-emerald-400"
                        : "bg-neutral-100 group-hover:bg-neutral-200 dark:bg-neutral-900 dark:group-hover:bg-neutral-800",
                    ].join(" ")}
                  />

                  {/* 커스텀 툴팁 */}
                  <div className="pointer-events-none absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-pre-line rounded-md bg-black/90 px-2 py-1 text-[11px] text-white shadow-lg group-hover:block w-56 max-h-40 overflow-y-auto">
                    <div className="font-mono text-[10px] opacity-80">
                      {date}
                    </div>
                    {hasData && (
                      <div className="mt-1">
                        {text}
                      </div>
                    )}
                    {/* 작은 삼각형 꼬리 */}
                    <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-black/90" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
