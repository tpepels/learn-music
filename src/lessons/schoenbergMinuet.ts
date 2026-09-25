import {
  activeLayerCount,
  arrangementLayers,
  type ArrangementBar,
} from "../music/model";
import { changedControl, heardPlayback } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function signature(layers: ArrangementBar): string {
  return arrangementLayers.map((layer) => (layers[layer] ? "1" : "0")).join("");
}

function differenceCount(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] !== right[layer]).length;
}

function sharedCount(left: ArrangementBar, right: ArrangementBar): number {
  return arrangementLayers.filter((layer) => left[layer] && right[layer]).length;
}

function formLayerEdits(experiments: LessonContext["experiments"]): number {
  return Object.entries(experiments).reduce(
    (total, [key, value]) =>
      total + (key.startsWith("form.layer.") ? value.changes : 0),
    0,
  );
}

function analysed(
  experiments: LessonContext["experiments"],
  sourceId: string,
  minimum: number,
): boolean {
  const values = experiments["source.analysis"]?.values ?? [];
  return new Set(values.filter((value) => value.startsWith(sourceId + ":"))).size >= minimum;
}

function soundingNotes(sequence: Array<number | null>): number[] {
  return sequence.filter((note): note is number => note !== null);
}

function activeHarmonyBars(sequence: number[][]): number {
  return Array.from({ length: 4 }, (_, bar) =>
    sequence.slice(bar * 8, bar * 8 + 8).some((entry) => entry.length > 0),
  ).filter(Boolean).length;
}

const lesson = lessonContentSchema.parse({
  id: "schoenberg.minuet",
  number: 13,
  title: "The minuet",
  eyebrow: "Schoenberg · Small forms",
  hero:
    "Control a moderate dance character, then enlarge the design through trio contrast and return.",
  description:
    "The minuet is more than a label for triple metre. Its measured pace, relatively active harmony and restrained rhythmic character support a larger ternary movement in which a contrasting trio refreshes the ear before the minuet returns.",
  overview:
    "Compose with proportion and manner in mind: establish a poised principal section, make the trio different in a controlled way, and let the return regain the first section's identity without confusing contrast with exaggeration.",
});

export const schoenbergMinuetLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.minuet.a",
        letter: "A",
        title: "Shape a measured character",
        learn:
          "Create a moderate, balanced melodic manner rather than relying on speed or extreme accent for identity.",
        explanation:
          "The minuet is associated with triple metre, but its character is not produced by metre alone. Compared with the scherzo, its pace is moderate and its rhythmic manner is usually less aggressively accented. That leaves room for smaller note values, more frequent harmonic articulation and a melodic surface that can be lyrical, graceful, firm or even insistent without becoming breathless. The central quality is control.

A useful minuet idea therefore benefits from balanced contour and clear punctuation. Repetition can establish the dance character, but constant identical figures make the phrase mechanical. Likewise, an enormous register or abrupt succession of accents can overwhelm the measured manner. The aim is not softness; it is proportion. Each gesture should feel deliberate enough that a later contrasting trio has somewhere meaningful to depart from.",
        instruction:
          "Study the four characteristics of the minuet, then revise your current melody into a controlled principal idea. Keep between eight and fourteen sounding notes, use at least four different pitches, and keep the total range between five and fourteen semitones. Make at least five melody edits while listening. Avoid a long run of one repeated pitch or an uninterrupted climb across the whole phrase. Play the final line twice and decide whether its character feels poised and internally balanced rather than merely slow or sparse.",
        recognition:
          "Does the line establish a definite measured manner through contour, pacing and repetition, or would its identity disappear if the tempo changed?",
        source: {
          reference: "Chapter XV - The Minuet",
          focus:
            "Moderate triple-metre character, relatively active harmony and controlled rhythmic accentuation define the minuet before trio contrast is added.",
          exampleIds: ["s13.minuet-form"],
        },
        terms: [
          {
            term: "Minuet",
            definition:
              "A moderate dance form traditionally associated with triple metre and commonly paired with a contrasting trio.",
          },
          {
            term: "Measured character",
            definition:
              "A controlled sense of pace and accent in which gestures feel proportioned rather than extreme.",
          },
          {
            term: "Dance character",
            definition:
              "The recurring metre, accent, pacing and gesture that make a movement feel connected to a dance type.",
          },
        ],
        workspace: "melody",
        checksLabel: "Establish the minuet manner",
        successLabel: "The principal idea now has a controlled dance character",
      }),
      evaluate: ({ melody, experiments }) => {
        const notes = soundingNotes(melody);
        const range = notes.length ? Math.max(...notes) - Math.min(...notes) : 0;
        return [
          {
            label: "You studied the minuet's characteristic features",
            complete: analysed(experiments, "s13.minuet-form", 4),
          },
          {
            label: "You shaped the melody in this exercise",
            complete: changedControl(experiments, "melody.edit", 5),
          },
          { label: "You listened to the complete line", complete: heardPlayback(experiments) },
          {
            label: "The melody has enough substance without overcrowding",
            complete: notes.length >= 8 && notes.length <= 14,
          },
          {
            label: "The melody uses a controlled but audible range",
            complete: range >= 5 && range <= 14 && new Set(notes).size >= 4,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.minuet.b",
        letter: "B",
        title: "Let harmony articulate the dance",
        learn:
          "Use harmonic motion to support the moderate pace instead of filling every subdivision with surface activity.",
        explanation:
          "At a moderate tempo, harmony can change relatively frequently and still remain perceptible. This is one reason the minuet can sustain more harmonic articulation than a very rapid scherzo: the listener has time to register changes within or across measures without the progression becoming a blur. Harmonic rhythm becomes part of the movement's poise, giving weight to phrases and cadences.

Frequent change does not mean constant novelty. A progression still needs hierarchy. Stable harmony can support the opening of a phrase, greater movement can carry continuation, and a cadence can slow or clarify the harmonic route. If every available position changes chord, the line loses proportion; if harmony never moves, the dance can feel static. The useful question is where change helps the phrase articulate its measured steps.",
        instruction:
          "Study the minuet-form analysis again, then revise the Harmony sequencer so all four bars contain harmonic material. Make at least six harmony edits. Use at least two different rhythmic placements of harmony across the four bars rather than stamping the same block everywhere, and leave some positions empty so the harmonic rhythm can breathe. Play the entire progression with the melody and listen for whether changes support phrase motion rather than competing with it.",
        recognition:
          "Can you hear stable areas, moving areas and cadential weight in the harmony, or does every moment carry the same harmonic importance?",
        source: {
          reference: "Chapter XV - harmonic pace in the minuet",
          focus:
            "Moderate tempo permits relatively frequent harmonic change while the movement retains clarity and proportion.",
          exampleIds: ["s13.minuet-form"],
        },
        terms: [
          {
            term: "Harmonic rhythm",
            definition:
              "The rate at which the governing harmony changes, independent of the number of melodic notes sounding above it.",
          },
          {
            term: "Articulation",
            definition:
              "A musical event that clarifies a boundary, accent or formal division.",
          },
        ],
        workspace: "harmony-song",
        checksLabel: "Shape harmonic pace",
        successLabel: "The harmony now articulates the phrase without overcrowding it",
      }),
      evaluate: ({ harmonySequence, experiments }) => {
        const barPatterns = Array.from({ length: 4 }, (_, bar) =>
          harmonySequence
            .slice(bar * 8, bar * 8 + 8)
            .map((entry) => (entry.length ? "1" : "0"))
            .join(""),
        );
        return [
          {
            label: "You revised the harmonic rhythm here",
            complete: changedControl(experiments, "harmony.note-edit", 6),
          },
          { label: "You listened through all four bars", complete: heardPlayback(experiments) },
          {
            label: "All four bars contain harmonic information",
            complete: activeHarmonyBars(harmonySequence) === 4,
          },
          {
            label: "The harmonic rhythm is not mechanically identical in every bar",
            complete: new Set(barPatterns).size >= 2,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.minuet.c",
        letter: "C",
        title: "Make a contrasting trio",
        learn:
          "Change character clearly in the trio while preserving enough formal scale and continuity for the return to make sense.",
        explanation:
          "The trio supplies large-scale contrast. It can change melody, texture, register, mode, harmonic region or rhythmic character, but contrast works best when it remains proportionate to the minuet around it. The trio is not an interruption from another composition; it is the middle part of a larger ternary movement, and its difference gains meaning because the minuet returns afterward.

That means some dimensions can remain stable while others change decisively. A common pulse or layer can preserve continuity while texture and harmony shift. The trio can also prepare the return by thinning, settling harmonically or recalling a feature of the minuet. The stronger the initial contrast, the more valuable such a connective gesture becomes near the end.",
        instruction:
          "Study all four trio principles, then use Phrase & Form to set the first three sections to A → B → A. Give A at least two active layers. Make B differ from A by at least two layers but preserve at least one shared layer. Make the returning A restore the exact opening layer plan. Edit the form at least three times while comparing the boundary into the trio and the boundary back into the minuet. Play through both transitions without stopping.",
        recognition:
          "Does the trio announce a new character immediately, and does the return of A feel refreshed rather than merely repeated?",
        source: {
          reference: "Chapter XV - The Trio",
          focus:
            "The trio creates contrast in character, texture or harmony while preserving proportion and preparing the return of the minuet.",
          exampleIds: ["s13.trio", "s13.minuet-form"],
        },
        terms: [
          {
            term: "Trio",
            definition:
              "The contrasting middle member of a minuet-trio-minuet or scherzo-trio-scherzo movement.",
          },
          {
            term: "Da capo return",
            definition:
              "The return of the principal dance section after the trio.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Create minuet and trio contrast",
        successLabel: "The trio now contrasts and the minuet returns clearly",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, trio, aReturn] = formSettings.layers;
        return [
          {
            label: "You studied the trio's contrasting role",
            complete: analysed(experiments, "s13.trio", 4),
          },
          {
            label: "You edited the minuet-trio relation",
            complete: formLayerEdits(experiments) >= 3,
          },
          { label: "You listened through both transitions", complete: heardPlayback(experiments) },
          {
            label: "The first three labels read A → B → A",
            complete:
              formSettings.sections[0] === "A" &&
              formSettings.sections[1] === "B" &&
              formSettings.sections[2] === "A",
          },
          {
            label: "The trio contrasts but shares at least one layer",
            complete: differenceCount(a, trio) >= 2 && sharedCount(a, trio) >= 1,
          },
          {
            label: "The returning minuet restores the opening texture",
            complete: activeLayerCount(a) >= 2 && signature(a) === signature(aReturn),
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "schoenberg.minuet.d",
        letter: "D",
        title: "Build minuet - trio - return",
        learn:
          "Coordinate principal character, trio contrast and return across one complete dance movement.",
        explanation:
          "A minuet movement becomes convincing when the large ternary relation is audible on more than one level. The principal section has its own internal phrasing and harmonic shape; the trio establishes a different character; the return restores the first manner after the ear has spent enough time away from it. The contrast should therefore feel significant but not disproportionate.

The return also changes the meaning of the opening. Material that first sounded like a beginning is now heard as restoration and completion. That is why a simple da capo can work so strongly even without rewriting the notes: context has changed. At the same time, extensions, altered repetitions or codettas can refine the ending when they reinforce the principal character rather than starting another formal episode.",
        instruction:
          "Keep A → B → A across the first three sections and use section 4 as a short extension of the returning minuet. The opening A must contain at least two layers. B should differ in at least two layers while retaining one common layer. The returning A should restore the opening exactly, and the extension should share at least two layers with that return. Make at least four formal edits and play all sixteen bars. Listen for a complete large arc: principal manner, contrasting trio, restoration, completion.",
        recognition:
          "Does the last A feel different in meaning from the first even when its material is restored, because the trio has made the return necessary?",
        source: {
          reference: "Chapter XV - complete minuet and trio design",
          focus:
            "Minuet, contrasting trio and da capo return form a larger ternary movement whose sections remain proportionate and connected.",
          exampleIds: ["s13.minuet-form", "s13.trio"],
        },
        terms: [
          {
            term: "Large ternary relation",
            definition:
              "A three-part movement-level design in which a complete principal section returns after a contrasting middle section.",
          },
          {
            term: "Codetta",
            definition:
              "A short closing addition that reinforces a cadence or ending without functioning as a new principal section.",
          },
        ],
        workspace: "phrase-form",
        checksLabel: "Complete the dance movement",
        successLabel: "The minuet, trio and return now form one complete arc",
      }),
      evaluate: ({ formSettings, experiments }) => {
        const [a, trio, aReturn, extension] = formSettings.layers;
        return [
          {
            label: "You made a substantial formal revision",
            complete: formLayerEdits(experiments) >= 4,
          },
          { label: "You listened through the whole movement", complete: heardPlayback(experiments) },
          {
            label: "The first three labels read A → B → A",
            complete:
              formSettings.sections[0] === "A" &&
              formSettings.sections[1] === "B" &&
              formSettings.sections[2] === "A",
          },
          {
            label: "The trio creates coherent contrast",
            complete: differenceCount(a, trio) >= 2 && sharedCount(a, trio) >= 1,
          },
          {
            label: "The minuet returns exactly in the third section",
            complete: signature(a) === signature(aReturn) && activeLayerCount(a) >= 2,
          },
          {
            label: "The extension remains connected to the return",
            complete: sharedCount(aReturn, extension) >= 2,
          },
        ];
      },
    },
  ],
};
