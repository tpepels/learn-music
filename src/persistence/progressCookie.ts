export type LearningProgressCookie = {
  version: 1;
  currentLessonId: string;
  exerciseIndexByLesson: Record<string, number>;
  completedExerciseIds: string[];
  completedLessonIds: string[];
};

export const PROGRESS_COOKIE_NAME = "play_lab_progress_v1";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function encodeLearningProgress(progress: LearningProgressCookie): string {
  return encodeURIComponent(JSON.stringify(progress));
}

export function decodeLearningProgress(
  value: string,
): LearningProgressCookie | null {
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value));
    if (!isRecord(parsed) || parsed.version !== 1) return null;
    if (typeof parsed.currentLessonId !== "string") return null;
    if (!isRecord(parsed.exerciseIndexByLesson)) return null;
    if (
      !Object.values(parsed.exerciseIndexByLesson).every(
        (index) => typeof index === "number" && Number.isInteger(index) && index >= 0,
      )
    ) {
      return null;
    }
    if (
      !Array.isArray(parsed.completedExerciseIds) ||
      !parsed.completedExerciseIds.every((id) => typeof id === "string")
    ) {
      return null;
    }
    if (
      !Array.isArray(parsed.completedLessonIds) ||
      !parsed.completedLessonIds.every((id) => typeof id === "string")
    ) {
      return null;
    }

    return {
      version: 1,
      currentLessonId: parsed.currentLessonId,
      exerciseIndexByLesson: parsed.exerciseIndexByLesson as Record<string, number>,
      completedExerciseIds: parsed.completedExerciseIds,
      completedLessonIds: parsed.completedLessonIds,
    };
  } catch {
    return null;
  }
}

export function readLearningProgressCookie(): LearningProgressCookie | null {
  if (typeof document === "undefined") return null;

  const prefix = PROGRESS_COOKIE_NAME + "=";
  const raw = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!raw) return null;
  return decodeLearningProgress(raw.slice(prefix.length));
}

export function writeLearningProgressCookie(
  progress: LearningProgressCookie,
): void {
  if (typeof document === "undefined") return;

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie =
    PROGRESS_COOKIE_NAME +
    "=" +
    encodeLearningProgress(progress) +
    "; Max-Age=" +
    ONE_YEAR_SECONDS +
    "; Path=/; SameSite=Lax" +
    secure;
}
