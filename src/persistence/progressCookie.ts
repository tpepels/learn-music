export type LearningProgressCookie = {
  version: 2;
  currentLessonId: string;
  exerciseIndexByLesson: Record<string, number>;
  completedExerciseIds: string[];
  completedLessonIds: string[];
};

export const PROGRESS_COOKIE_NAME = "play_lab_progress_v1";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const EXERCISE_LETTERS = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function completedMasks(ids: string[]): Record<string, number> {
  const masks: Record<string, number> = {};

  ids.forEach((id) => {
    const separator = id.lastIndexOf(".");
    if (separator <= 0) return;

    const lessonId = id.slice(0, separator);
    const letter = id.slice(separator + 1);
    const bit = EXERCISE_LETTERS.indexOf(
      letter as (typeof EXERCISE_LETTERS)[number],
    );

    if (bit < 0) return;
    masks[lessonId] = (masks[lessonId] ?? 0) | (1 << bit);
  });

  return masks;
}

function expandMasks(masks: Record<string, unknown>): string[] | null {
  const ids: string[] = [];

  for (const [lessonId, rawMask] of Object.entries(masks)) {
    if (
      typeof rawMask !== "number" ||
      !Number.isInteger(rawMask) ||
      rawMask < 0 ||
      rawMask > (1 << EXERCISE_LETTERS.length) - 1
    ) {
      return null;
    }

    EXERCISE_LETTERS.forEach((letter, bit) => {
      if (rawMask & (1 << bit)) {
        ids.push(lessonId + "." + letter);
      }
    });
  }

  return ids;
}

export function encodeLearningProgress(progress: LearningProgressCookie): string {
  const compact = {
    v: 2,
    c: progress.currentLessonId,
    i: progress.exerciseIndexByLesson,
    m: completedMasks(progress.completedExerciseIds),
    l: progress.completedLessonIds,
  };

  return encodeURIComponent(JSON.stringify(compact));
}

export function decodeLearningProgress(
  value: string,
): LearningProgressCookie | null {
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value));
    if (!isRecord(parsed)) return null;

    if (parsed.v === 2) {
      if (typeof parsed.c !== "string") return null;
      if (!isRecord(parsed.i) || !isRecord(parsed.m)) return null;
      if (
        !Object.values(parsed.i).every(
          (index) =>
            typeof index === "number" &&
            Number.isInteger(index) &&
            index >= 0,
        )
      ) {
        return null;
      }
      if (
        !Array.isArray(parsed.l) ||
        !parsed.l.every((id) => typeof id === "string")
      ) {
        return null;
      }

      const completedExerciseIds = expandMasks(parsed.m);
      if (!completedExerciseIds) return null;

      return {
        version: 2,
        currentLessonId: parsed.c,
        exerciseIndexByLesson: parsed.i as Record<string, number>,
        completedExerciseIds,
        completedLessonIds: parsed.l,
      };
    }

    // Backward compatibility with the original verbose v1 cookie.
    if (parsed.version !== 1) return null;
    if (typeof parsed.currentLessonId !== "string") return null;
    if (!isRecord(parsed.exerciseIndexByLesson)) return null;
    if (
      !Object.values(parsed.exerciseIndexByLesson).every(
        (index) =>
          typeof index === "number" &&
          Number.isInteger(index) &&
          index >= 0,
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
      version: 2,
      currentLessonId: parsed.currentLessonId,
      exerciseIndexByLesson:
        parsed.exerciseIndexByLesson as Record<string, number>,
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
