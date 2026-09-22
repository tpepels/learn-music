import {
  initialFormSettings,
  type FormSectionLabel,
  type FormSettings,
} from "../music/model";

const FORM_SECTIONS = 4;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function migrateFormSettings(value: unknown): FormSettings {
  const record = isRecord(value) ? value : {};

  const sections =
    Array.isArray(record.sections) && record.sections.length === FORM_SECTIONS
      ? (record.sections.filter(
          (item): item is FormSectionLabel =>
            item === "A" || item === "A′" || item === "B" || item === "C",
        ).length === FORM_SECTIONS
          ? [...(record.sections as FormSectionLabel[])]
          : [...initialFormSettings.sections])
      : [...initialFormSettings.sections];

  const validRoles = new Set(["statement", "answer", "contrast", "return"]);
  const roles =
    Array.isArray(record.roles) &&
    record.roles.length === FORM_SECTIONS &&
    record.roles.every(
      (item) => typeof item === "string" && validRoles.has(item),
    )
      ? [...record.roles] as FormSettings["roles"]
      : [...initialFormSettings.roles];

  const layers =
    Array.isArray(record.layers) && record.layers.length === FORM_SECTIONS
      ? record.layers.map((entry, index) => {
          if (!isRecord(entry)) {
            return { ...initialFormSettings.layers[index] };
          }

          return {
            drums: isBoolean(entry.drums)
              ? entry.drums
              : initialFormSettings.layers[index].drums,
            bass: isBoolean(entry.bass)
              ? entry.bass
              : initialFormSettings.layers[index].bass,
            chords: isBoolean(entry.chords)
              ? entry.chords
              : initialFormSettings.layers[index].chords,
            melody: isBoolean(entry.melody)
              ? entry.melody
              : initialFormSettings.layers[index].melody,
          };
        })
      : initialFormSettings.layers.map((entry) => ({ ...entry }));

  return { sections, roles, layers };
}
