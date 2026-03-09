import fs from "fs/promises";
import path from "path";

export type DailyDataMap = Record<string, string>;

/**
 * DATA.md 파싱해서 날짜별 데이터 맵으로 변환
 * 형식:
 *
 * ## 2026-01-01
 * 오늘 한 일...
 *
 * ## 2026-01-02
 * ...
 */
export async function getDailyData(): Promise<DailyDataMap> {
  try {
    const filePath = path.join(process.cwd(), "DATA.md");
    const raw = await fs.readFile(filePath, "utf8");

    const lines = raw.split(/\r?\n/);
    const map: DailyDataMap = {};

    let currentDate: string | null = null;
    let buffer: string[] = [];

    const flush = () => {
      if (currentDate) {
        const text = buffer.join("\n").trim();
        if (text) {
          map[currentDate] = text;
        }
      }
      buffer = [];
    };

    for (const line of lines) {
      const headingMatch = line.match(/^##\s+(\d{4}-\d{2}-\d{2})\s*$/);
      if (headingMatch) {
        // 새로운 날짜 블록 시작
        flush();
        currentDate = headingMatch[1];
      } else {
        if (currentDate) {
          buffer.push(line);
        }
      }
    }

    // 마지막 블록 비우기
    flush();

    return map;
  } catch (e) {
    // DATA.md 가 아직 없거나 문제가 있어도 화면은 깨지지 않도록
    console.error("[getDailyData] Failed to read DATA.md", e);
    return {};
  }
}

export function getDatesForYear(year: number): string[] {
  const dates: string[] = [];
  const date = new Date(year, 0, 1); // 1월 1일

  while (date.getFullYear() === year) {
    dates.push(formatDateKey(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

