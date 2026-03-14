"use client";

import { useState } from "react";
import { CATEGORIES } from "../lib/categories";
import type { DailyDataMap } from "../lib/dailyData";

// 카테고리별 색상 매핑 (명도/채도 비슷한 톤)
const CATEGORY_COLORS: Record<string, string> = {
  BOOK: "#FF8C42", // 주황색
  WORKOUT: "#9D4EDD", // 보라색
  FINANCE: "#10B981", // 초록색
  CAREER_DEV: "#3B82F6", // 파란색
  OTHER: "#FFFFFF", // 하얀색
};

type FilterOption = "전체" | (typeof CATEGORIES)[number];

interface ContributionGridProps {
  dates: string[];
  dailyData: DailyDataMap;
}

export default function ContributionGrid({ dates, dailyData }: ContributionGridProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("전체");

  const filterOptions: FilterOption[] = ["전체", ...CATEGORIES];

  const getCellColor = (date: string) => {
    const day = dailyData[date];
    if (!day) return null;

    if (selectedFilter === "전체") {
      // 전체 필터: 기존 초록색 유지
      const hasAnyData = Object.values(day).some(Boolean);
      return hasAnyData ? "bg-emerald-500 group-hover:bg-emerald-400" : null;
    } else {
      // 특정 카테고리 필터: 해당 카테고리 데이터가 있으면 해당 색상
      const hasFilteredData = Boolean(day[selectedFilter]);
      if (!hasFilteredData) return null;
      const color = CATEGORY_COLORS[selectedFilter];
      return { backgroundColor: color };
    }
  };

  const getTooltipContent = (date: string) => {
    const day = dailyData[date];
    if (!day) return null;

    if (selectedFilter === "전체") {
      // 전체 필터: 모든 카테고리 표시
      return (
        <div className="mt-1 space-y-0.5">
          {CATEGORIES.map((category) => {
            const value = day[category];
            if (!value) return null;
            const color = CATEGORY_COLORS[category] || "#FFFFFF";
            return (
              <div key={category}>
                <span className="font-semibold" style={{ color }}>
                  {category}:
                </span>{" "}
                <span style={{ color }}>{value}</span>
              </div>
            );
          })}
        </div>
      );
    } else {
      // 특정 카테고리 필터: 해당 카테고리만 표시
      const value = day[selectedFilter];
      if (!value) return null;
      const color = CATEGORY_COLORS[selectedFilter];
      return (
        <div className="mt-1">
          <span className="font-semibold" style={{ color }}>
            {selectedFilter}:
          </span>{" "}
          <span style={{ color }}>{value}</span>
        </div>
      );
    }
  };

  const hasDataForDate = (date: string) => {
    const day = dailyData[date];
    if (!day) return false;

    if (selectedFilter === "전체") {
      return Object.values(day).some(Boolean);
    } else {
      return Boolean(day[selectedFilter]);
    }
  };

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {new Date().getFullYear()} 잔디
            <span className="ml-2 text-xs text-muted-foreground">
              (총 {dates.length}일)
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            오늘 저는 무슨 활동을 했을까요?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">
            필터:
          </label>
          <select
            id="category-filter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as FilterOption)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="inline-block rounded-md border border-neutral-200 bg-white p-3 text-[0px] dark:border-neutral-800 dark:bg-neutral-950">
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {dates.map((date) => {
            const hasData = hasDataForDate(date);
            const cellColor = getCellColor(date);

            return (
              <div key={date} className="relative group h-3 w-3">
                <div
                  className={[
                    "h-full w-full rounded-[2px] border border-neutral-200 dark:border-neutral-800",
                    cellColor && typeof cellColor === "string"
                      ? cellColor
                      : "bg-neutral-100 group-hover:bg-neutral-200 dark:bg-neutral-900 dark:group-hover:bg-neutral-800",
                  ].join(" ")}
                  style={
                    cellColor && typeof cellColor === "object"
                      ? cellColor
                      : undefined
                  }
                />

                {/* 커스텀 툴팁 */}
                {hasData && (
                  <div className="pointer-events-none absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-pre-line rounded-md bg-black/90 px-2 py-1 text-[11px] text-white shadow-lg group-hover:block w-56 max-h-40 overflow-y-auto">
                    <div className="font-mono text-[10px] opacity-80">
                      {date}
                    </div>
                    {getTooltipContent(date)}
                    {/* 작은 삼각형 꼬리 */}
                    <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-black/90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
