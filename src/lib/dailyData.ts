import fs from "fs/promises";
import path from "path";
import { CATEGORIES, type Category } from "./categories";

export type DailyCategoryData = Partial<Record<Category, string>>;
export type DailyDataMap = Record<string, DailyCategoryData>;

async function parseCategoryFile(category: Category): Promise<DailyCategoryData> {
  const map: DailyCategoryData = {};

  try {
    const filePath = path.join(process.cwd(), "data", `${category}.md`);
    const raw = await fs.readFile(filePath, "utf8");

    const lines = raw.split(/\r?\n/);

    let currentDate: string | null = null;
    let buffer: string[] = [];

    const flush = () => {
      if (currentDate) {
        const text = buffer.join("\n").trim();
        if (text) {
          map[currentDate as keyof DailyCategoryData] = text;
        }
      }
      buffer = [];
    };

    for (const line of lines) {
      const headingMatch = line.match(/^##\s+(\d{4}-\d{2}-\d{2})\s*$/);
      if (headingMatch) {
        flush();
        currentDate = headingMatch[1];
      } else {
        if (currentDate) {
          buffer.push(line);
        }
      }
    }

    flush();
  } catch (e) {
    // 해당 카테고리 파일이 없거나 읽기 실패해도 전체 흐름에는 영향 없도록
    console.error(`[parseCategoryFile] Failed for ${category}`, e);
  }

  return map;
}

/**
 * data/ 하위의 각 카테고리별 .md 파일을 파싱해서
 * 날짜별로 BOOK/WORKOUT/FINANCE/CAREER_DEV/OTHER 데이터를 합친 맵을 만든다.
 */
export async function getDailyData(): Promise<DailyDataMap> {
  const result: DailyDataMap = {};

  for (const category of CATEGORIES) {
    const perDate = await parseCategoryFile(category);

    for (const [date, text] of Object.entries(perDate)) {
      if (!result[date]) {
        result[date] = {};
      }
      result[date][category] = text;
    }
  }

  return result;
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

