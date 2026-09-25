export type SchoenbergSourceEvent = {
  midi: number | null;
  duration: number;
  barAfter?: boolean;
  accidental?: "♭" | "♯" | "♮";
};

export type SchoenbergAnalysisSegment = {
  label: string;
  detail: string;
  startEvent?: number;
  endEvent?: number;
};

export type SchoenbergSourceScore = {
  kind: "score";
  id: string;
  reference: string;
  title: string;
  attribution: string;
  fidelity: "full-melodic-line" | "verified-excerpt";
  fidelityNote: string;
  clef: "treble" | "bass";
  keyLabel: string;
  meter?: string;
  bpm: number;
  durationUnit?: "eighth" | "sixteenth";
  events: SchoenbergSourceEvent[];
  slurs?: Array<{ start: number; end: number }>;
  annotation?: string;
  analysis?: SchoenbergAnalysisSegment[];
};

export type SchoenbergSourceMap = {
  kind: "map";
  id: string;
  reference: string;
  title: string;
  fidelity: "source-analysis";
  fidelityNote: string;
  segments: SchoenbergAnalysisSegment[];
};

export type SchoenbergSourceMaterial =
  | SchoenbergSourceScore
  | SchoenbergSourceMap;

function map(
  id: string,
  reference: string,
  title: string,
  segments: SchoenbergSourceMap["segments"],
  fidelityNote = "Interactive reconstruction of Schoenberg's own analytical distinctions for this example group. It does not replace the printed notation where a full transcription is still pending.",
): SchoenbergSourceMap {
  return {
    kind: "map",
    id,
    reference,
    title,
    fidelity: "source-analysis",
    fidelityNote,
    segments,
  };
}

export const schoenbergSourceMaterial: Record<
  string,
  SchoenbergSourceMaterial
> = {
  "s01.ex2e": {
    kind: "score",
    id: "s01.ex2e",
    reference: "Ex. 2e",
    title: "Beethoven - Symphony No. 3-I",
    attribution: "Melodic line transcribed from Schoenberg's Ex. 2e",
    fidelity: "full-melodic-line",
    fidelityNote:
      "Native transcription of the complete melodic line reproduced by Schoenberg. Orchestral doubling is not part of the book excerpt.",
    clef: "bass",
    keyLabel: "E♭ major · 3 flats",
    meter: "3/4",
    bpm: 92,
    events: [
      { midi: 51, duration: 4 },
      { midi: 55, duration: 2, barAfter: true },
      { midi: 51, duration: 4 },
      { midi: 46, duration: 2, barAfter: true },
      { midi: 51, duration: 2 },
      { midi: 55, duration: 2 },
      { midi: 58, duration: 2, barAfter: true },
      { midi: 51, duration: 6, barAfter: true },
    ],
    slurs: [
      { start: 0, end: 3 },
      { start: 4, end: 7 },
    ],
    analysis: [
      {
        label: "first span",
        detail:
          "Follow the first four notes as one slurred phrase member rather than separate events.",
        startEvent: 0,
        endEvent: 3,
      },
      {
        label: "answering span",
        detail:
          "The second slur continues the same phrase identity while changing contour and register.",
        startEvent: 4,
        endEvent: 7,
      },
    ],
  },

  "s01.ex4c": map(
    "s01.ex4c",
    "Ex. 4c",
    "Beethoven - Symphony No. 3, Scherzo",
    [
      {
        label: "Repeated-note character",
        detail:
          "Schoenberg chooses a phrase whose identity is strongly rhythmic: repeated notes establish the character before the line begins to climb.",
      },
      {
        label: "Gradual ascent",
        detail:
          "The later part of the excerpt moves upward while the repeated-note character remains perceptible.",
      },
      {
        label: "Phrase, not isolated motive",
        detail:
          "The example belongs in the phrase chapter because the rhythmic characteristic participates in a complete forward-moving unit.",
      },
    ],
    "The source map is verified against Ex. 4c. A clean native note-for-note transcription of the Scherzo line is still pending; the previous raster crop has been removed.",
  ),

  "s01.ex5a": {
    kind: "score",
    id: "s01.ex5a",
    reference: "Ex. 5a",
    title: "Melodic unit from one broken chord",
    attribution: "First F-major broken-chord study as printed by Schoenberg",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Native transcription of Ex. 5a from the supplied book scan: F-A-C over the fixed tonic harmony. This is the actual printed subexample, not the C-major PLAY / LAB application study.",
    clef: "treble",
    keyLabel: "F major · 1 flat",
    meter: "4/4",
    bpm: 84,
    events: [
      { midi: 65, duration: 4 },
      { midi: 69, duration: 4, barAfter: true },
      { midi: 72, duration: 8, barAfter: true },
    ],
    analysis: [
      {
        label: "broken-chord constraint",
        detail:
          "Every sounded pitch belongs to the F-major tonic triad. The compositional problem is contour, not harmony.",
        startEvent: 0,
        endEvent: 2,
      },
    ],
  },

  "s01.ex6a": {
    kind: "score",
    id: "s01.ex6a",
    reference: "Ex. 6a",
    title: "Smaller note values",
    attribution: "Subexample a transcribed from Schoenberg's Ex. 6",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Native transcription of Ex. 6a from the supplied book scan: F-A-C followed by a rest, all in smaller values than Ex. 5a. The book does not print a time signature for this isolated unit, so PLAY / LAB does not add one.",
    clef: "treble",
    keyLabel: "F major · 1 flat",
    bpm: 92,
    events: [
      { midi: 65, duration: 2 },
      { midi: 69, duration: 2 },
      { midi: 72, duration: 2 },
      { midi: null, duration: 2, barAfter: true },
    ],
    analysis: [
      {
        label: "same pitches, smaller values",
        detail:
          "The F-A-C pitch resource stays restricted while the shorter durations create a more active melodic unit.",
        startEvent: 0,
        endEvent: 3,
      },
    ],
  },

  "s01.ex7a": {
    kind: "score",
    id: "s01.ex7a",
    reference: "Ex. 7a",
    title: "Added upbeat and varied note values",
    attribution: "Subexample a transcribed from Schoenberg's Ex. 7",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Native transcription of Ex. 7a from the supplied book scan. The B-flat pickup is followed by the longer F-D span exactly as printed. No time signature is added because the isolated subexample does not print one.",
    clef: "treble",
    keyLabel: "F major · 1 flat",
    bpm: 96,
    events: [
      { midi: 70, duration: 2, accidental: "♭", barAfter: true },
      { midi: 77, duration: 4 },
      { midi: 74, duration: 4, barAfter: true },
    ],
    analysis: [
      {
        label: "upbeat",
        detail:
          "The B-flat pickup begins before the longer F-D span, changing the metric entrance without abandoning the restricted pitch world.",
        startEvent: 0,
        endEvent: 0,
      },
      {
        label: "varied values",
        detail:
          "The longer following notes contrast with the short pickup and create a less square phrase shape.",
        startEvent: 1,
        endEvent: 2,
      },
    ],
  },

  "s01.ex8a": {
    kind: "score",
    id: "s01.ex8a",
    reference: "Ex. 8a",
    title: "Passing note added to Ex. 5",
    attribution: "Subexample a transcribed from Schoenberg's Ex. 8",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Native transcription of Ex. 8a from the supplied book scan: the earlier F-A-C framework is connected by the printed B-flat passing motion. The notation and playback use the same source data.",
    clef: "treble",
    keyLabel: "F major · 1 flat",
    bpm: 92,
    events: [
      { midi: 65, duration: 4 },
      { midi: 69, duration: 3 },
      { midi: 70, duration: 1, accidental: "♭", barAfter: true },
      { midi: 72, duration: 4, barAfter: true },
    ],
    analysis: [
      {
        label: "structural chord tones",
        detail:
          "F, A and C retain the broken-chord framework inherited from Ex. 5.",
        startEvent: 0,
        endEvent: 3,
      },
      {
        label: "passing B-flat",
        detail:
          "The short B-flat fills the motion from A to C, demonstrating the new resource introduced in Ex. 8.",
        startEvent: 1,
        endEvent: 3,
      },
    ],
  },

  "s01.ex5": map(
    "s01.ex5",
    "Ex. 5",
    "Melodic units derived from broken chords",
    [
      {
        label: "One tonic harmony",
        detail:
          "Schoenberg fixes the tonic of F major as the harmonic basis.",
      },
      {
        label: "Rearrange chord tones",
        detail:
          "The small examples create different melodic contours from different arrangements of the same chord tones.",
      },
      {
        label: "Practice constraint",
        detail:
          "The restriction isolates melodic invention from harmonic invention.",
      },
    ],
  ),
  "s01.ex6": map(
    "s01.ex6",
    "Ex. 6",
    "Smaller note values",
    [
      {
        label: "Keep the harmonic basis",
        detail:
          "The pitch material remains restricted to the simple chord-tone world established in Ex. 5.",
      },
      {
        label: "Shorten note values",
        detail:
          "Schoenberg changes rhythmic scale first, producing a more active surface without requiring richer harmony.",
      },
    ],
  ),
  "s01.ex7": map(
    "s01.ex7",
    "Ex. 7",
    "Added upbeats and various note values",
    [
      {
        label: "Chord tones remain",
        detail:
          "The exercise is still harmonically restricted.",
      },
      {
        label: "Add upbeats",
        detail:
          "Pickup motion changes how the phrase enters the metre.",
      },
      {
        label: "Mix note values",
        detail:
          "Different durations make the line more flexible before passing notes are introduced.",
      },
    ],
  ),
  "s01.ex8": map(
    "s01.ex8",
    "Ex. 8",
    "Varying Ex. 5 by adding passing notes",
    [
      {
        label: "Preserve the Ex. 5 skeleton",
        detail:
          "The earlier chord-tone framework remains the structural reference.",
      },
      {
        label: "Insert passing motion",
        detail:
          "Stepwise non-chord tones connect the structural pitches and increase fluency.",
      },
    ],
  ),
  "s01.ex9": map(
    "s01.ex9",
    "Ex. 9",
    "Varying Ex. 7 by passing notes and repetitions",
    [
      {
        label: "Retain Ex. 7's rhythmic flexibility",
        detail:
          "Upbeats and varied values remain part of the model.",
      },
      {
        label: "Add passing notes",
        detail:
          "Connective tones increase melodic flow.",
      },
      {
        label: "Repeat notes locally",
        detail:
          "Note repetitions add articulation inside the more fluent line.",
      },
    ],
  ),
  "s01.ex10-11": map(
    "s01.ex10-11",
    "Exs. 10-11",
    "Embellishment, appoggiaturas and changing notes",
    [
      {
        label: "Richer embellishment",
        detail:
          "Schoenberg adds more elaborate changing-note and appoggiatura-like figures to the earlier studies.",
      },
      {
        label: "Greater flexibility",
        detail:
          "The extra detail can make the melody more fluent and varied.",
      },
      {
        label: "Risk: obscure the harmony",
        detail:
          "Schoenberg explicitly warns that too many small notes can overburden the melody and obscure its harmonic basis.",
      },
    ],
  ),

  "s02.ex12-13": map(
    "s02.ex12-13",
    "Exs. 12-13",
    "What constitutes a motive?",
    [
      {
        label: "Ex. 12a",
        detail:
          "Beethoven Op. 14/1-I: a compact motive can be identified by a small number of characteristic rhythmic and intervallic features.",
      },
      {
        label: "Ex. 12b-c",
        detail:
          "Beethoven Symphony No. 5-I and III: repeated notes and rhythm can dominate motivic identity.",
      },
      {
        label: "Ex. 13",
        detail:
          "Brahms Symphony No. 4-I: a restricted intervallic idea - successive thirds - can generate extended material.",
      },
    ],
  ),
  "s02.ex12b": {
    kind: "score",
    id: "s02.ex12b",
    reference: "Ex. 12b",
    title: "Beethoven - Symphony No. 5-I",
    attribution: "Opening motive as reproduced by Schoenberg",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Native transcription of the famous four-note cell and its immediate answering form shown in Ex. 12b.",
    clef: "treble",
    keyLabel: "C minor · 3 flats",
    meter: "2/4",
    bpm: 108,
    events: [
      { midi: 67, duration: 1 },
      { midi: 67, duration: 1 },
      { midi: 67, duration: 1 },
      { midi: 63, duration: 4, barAfter: true },
      { midi: 65, duration: 1 },
      { midi: 65, duration: 1 },
      { midi: 65, duration: 1 },
      { midi: 62, duration: 4, barAfter: true },
    ],
    slurs: [
      { start: 0, end: 3 },
      { start: 4, end: 7 },
    ],
    analysis: [
      {
        label: "first rhythmic cell",
        detail:
          "Three repeated short notes lead to a longer arrival - one of the characteristic features Schoenberg wants isolated.",
        startEvent: 0,
        endEvent: 3,
      },
      {
        label: "answering cell",
        detail:
          "The pitch level changes, but the same short-short-short-long relation preserves motivic identity.",
        startEvent: 4,
        endEvent: 7,
      },
    ],
  },
  "s02.ex14b": {
    kind: "score",
    id: "s02.ex14b",
    reference: "Ex. 14b",
    title: "Diminution",
    attribution: "Diminution line transcribed from Schoenberg's Ex. 14",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Native transcription of the printed diminution line. The eight pitches are G-E-C-A-F-D-C-sharp-G; Schoenberg compresses them to equal eighth-note values. No time signature is printed for this isolated transformation.",
    clef: "treble",
    keyLabel: "1 sharp · printed key signature",
    bpm: 104,
    events: [
      { midi: 67, duration: 1 },
      { midi: 64, duration: 1 },
      { midi: 60, duration: 1, barAfter: true },
      { midi: 69, duration: 1 },
      { midi: 65, duration: 1 },
      { midi: 62, duration: 1 },
      { midi: 61, duration: 1, accidental: "♯", barAfter: true },
      { midi: 67, duration: 1, barAfter: true },
    ],
    analysis: [
      {
        label: "diminution",
        detail:
          "The complete pitch succession is retained while every value is compressed to the same short duration.",
        startEvent: 0,
        endEvent: 7,
      },
    ],
  },

  "s02.ex14c": {
    kind: "score",
    id: "s02.ex14c",
    reference: "Ex. 14c",
    title: "Augmentation",
    attribution: "Augmentation line transcribed from Schoenberg's Ex. 14",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Native transcription of the printed augmentation line. It preserves the same G-E-C-A-F-D-C-sharp-G pitch succession while expanding every note to a half-note value. No time signature is printed for this isolated transformation.",
    clef: "treble",
    keyLabel: "1 sharp · printed key signature",
    bpm: 80,
    events: [
      { midi: 67, duration: 4 },
      { midi: 64, duration: 4 },
      { midi: 60, duration: 4, barAfter: true },
      { midi: 69, duration: 4 },
      { midi: 65, duration: 4 },
      { midi: 62, duration: 4 },
      { midi: 61, duration: 4, accidental: "♯", barAfter: true },
      { midi: 67, duration: 4, barAfter: true },
    ],
    analysis: [
      {
        label: "augmentation",
        detail:
          "The same pitch succession heard in Ex. 14b is expanded to half-note values, making the proportional transformation directly audible.",
        startEvent: 0,
        endEvent: 7,
      },
    ],
  },

  "s02.ex14": map(
    "s02.ex14",
    "Ex. 14",
    "Exact transformations",
    [
      {
        label: "Inversion",
        detail:
          "Interval directions are reversed while their relationships are preserved systematically.",
      },
      {
        label: "Retrograde",
        detail:
          "The succession is presented in reverse order.",
      },
      {
        label: "Retrograde inversion",
        detail:
          "Both order and interval direction are reversed.",
      },
      {
        label: "Diminution / augmentation",
        detail:
          "Note values are proportionally shortened or lengthened while the pattern remains systematic.",
      },
    ],
  ),
  "s02.ex15-16": map(
    "s02.ex15-16",
    "Exs. 15-16",
    "Several transformations in real continuation",
    [
      {
        label: "Transposition",
        detail:
          "A motive-form appears at another pitch level.",
      },
      {
        label: "Change of direction",
        detail:
          "Intervals can reverse direction while the derivation remains traceable.",
      },
      {
        label: "Embellishment / filling-in",
        detail:
          "Ancillary notes can fill or decorate intervals.",
      },
      {
        label: "Chain / sequence",
        detail:
          "Related motive-forms can be linked and repeated at changing pitch levels.",
      },
    ],
  ),
  "s02.ex17": map(
    "s02.ex17",
    "Ex. 17",
    "Rhythmic changes of one broken-chord motive",
    [
      { label: "Lengthen / shorten notes", detail: "Change duration while the pitch source remains easy to compare." },
      { label: "Repeat notes", detail: "Local repetitions alter the rhythmic profile." },
      { label: "Repeat rhythmic features", detail: "A rhythm itself can become the preserved characteristic." },
    ],
  ),
  "s02.ex18-21": map(
    "s02.ex18-21",
    "Exs. 18-21",
    "Intervallic development",
    [
      { label: "Ex. 18", detail: "Add ancillary notes." },
      { label: "Ex. 19", detail: "Change the original order of the notes." },
      { label: "Ex. 20", detail: "Embellish the reordered form." },
      { label: "Ex. 21", detail: "Reduce, omit and condense material." },
    ],
  ),
  "s02.ex22-24": map(
    "s02.ex22-24",
    "Exs. 22-24",
    "Metric placement",
    [
      { label: "Ex. 22", detail: "Add upbeats and repeat features." },
      { label: "Ex. 23", detail: "Shift familiar features to different beats." },
      { label: "Ex. 24", detail: "Change the metre itself - a device Schoenberg notes is seldom usable within a piece." },
    ],
  ),
  "s02.ex25": map(
    "s02.ex25",
    "Ex. 25",
    "Adaptation to richer harmony",
    [
      { label: "Richer support", detail: "The harmonic context changes rather than remaining a fixed background." },
      { label: "Melodic adaptation", detail: "The motive-form adjusts enough to fit the changed harmony while preserving identity." },
      { label: "Inversions / additions", detail: "Schoenberg lists inversions and additions among the harmonic resources illustrated here." },
    ],
  ),
  "s02.ex26-27": map(
    "s02.ex26-27",
    "Exs. 26-27",
    "Harmonic insertion and substitution",
    [
      { label: "Ex. 26", detail: "Insert harmonic motion in the middle of the span." },
      { label: "Ex. 27", detail: "Substitute another chord or chord succession." },
      { label: "Keep motivic continuity", detail: "The harmonic route changes without requiring abandonment of the motive." },
    ],
  ),
  "s02.ex28-29": map(
    "s02.ex28-29",
    "Exs. 28-29",
    "Adapt melody to a moving context",
    [
      { label: "Ex. 28", detail: "Transpose the melodic material." },
      { label: "Ex. 29 - passing harmonies", detail: "Add harmonic motion that the melody must accommodate." },
      { label: "Ex. 29 - accompaniment", detail: "Treat the accompaniment semi-contrapuntally rather than as inert chord filling." },
    ],
  ),

  "s03.chapter": map(
    "s03.chapter",
    "Chapter IV",
    "Connecting motive-forms",
    [
      { label: "Common content", detail: "Connection depends on factors shared by successive motive-forms." },
      { label: "Contrast", detail: "Enough change is needed to avoid monotony." },
      { label: "Rhythm and harmony", detail: "Rhythmic similarity and coherent harmony can strengthen the connection." },
      { label: "Phrase result", detail: "The goal is not a catalogue of variants but a functioning phrase." },
    ],
  ),
  "s03.ex30": map(
    "s03.ex30",
    "Ex. 30",
    "Phrase built from a broken-chord derivative",
    [
      { label: "Start from derivative d", detail: "Schoenberg begins from the broken-chord derivative already developed in Ex. 21d." },
      { label: "Related forms", detail: "Successive forms remain visibly traceable to the source." },
      { label: "Phrase construction", detail: "The derivatives are ordered so they become a coherent phrase rather than isolated exercises." },
    ],
  ),
  "s03.ex31": map(
    "s03.ex31",
    "Ex. 31",
    "Closely related motive-forms",
    [
      { label: "Retain rhythm", detail: "Essential rhythmic features remain strongly recognizable." },
      { label: "Change pitch detail", detail: "Pitch can vary more freely while the rhythmic connection carries identity." },
      { label: "Chain", detail: "The later forms can be linked into a chain without losing derivation." },
    ],
  ),
  "s03.ex32": map(
    "s03.ex32",
    "Ex. 32",
    "Rhythm strictly preserved",
    [
      { label: "Strict rhythm", detail: "The rhythmic profile is the stable identifying factor." },
      { label: "Direction changes", detail: "Melodic direction changes between motive-forms." },
      { label: "Transposition", detail: "Pitch level changes while the preserved rhythm keeps the forms connected." },
    ],
  ),
  "s03.ex33": map(
    "s03.ex33",
    "Ex. 33",
    "Farther-reaching variation",
    [
      { label: "Combine changes", detail: "Several features change together rather than one at a time." },
      { label: "Trace the derivation", detail: "Despite the larger distance, the connection to the source must remain comprehensible." },
      { label: "Use contrast constructively", detail: "Greater variation becomes useful only when it contributes to phrase progression." },
    ],
  ),
  "s03.ex34": map(
    "s03.ex34",
    "Ex. 34",
    "Remote forms that still function as a phrase",
    [
      { label: "Rhythmic shifts", detail: "Features move to different metric positions." },
      { label: "Added upbeats", detail: "Pickup motion can alter the start of a motive-form." },
      { label: "Reduction / omission", detail: "Features are removed as well as added." },
      { label: "Phrase balance", detail: "Remote forms still have to combine into a balanced, comprehensible phrase." },
    ],
  ),

  "s04.period-sentence": map(
    "s04.period-sentence",
    "Chapter V",
    "Period versus sentence",
    [
      { label: "Sentence", detail: "The opening idea is normally repeated immediately." },
      { label: "Period", detail: "Large-scale repetition is postponed while more remote forms help complete the antecedent." },
      { label: "Continuation differs", detail: "The later treatment, not only the first phrase, distinguishes the two constructions." },
    ],
  ),
  "s04.dominant-form": map(
    "s04.dominant-form",
    "Chapter V",
    "Tonic form and dominant form",
    [
      { label: "Tonic form", detail: "The first appearance is associated with tonic function." },
      { label: "Dominant form", detail: "The answering phrase is adapted to dominant function." },
      { label: "Complementary repetition", detail: "Rhythm and contour can preserve the repetition while harmony supplies contrast." },
    ],
  ),
  "s04.ex35": map(
    "s04.ex35",
    "Ex. 35a-b",
    "The clearest tonic / dominant pair",
    [
      { label: "First phrase", detail: "Schoenberg says the first phrase employs only tonic harmony (I)." },
      { label: "Second phrase", detail: "The second phrase employs only dominant harmony (V)." },
      { label: "Melody adapts", detail: "The melodic line changes enough to conform to the new harmony." },
    ],
  ),
  "s04.ex36-37": map(
    "s04.ex36-37",
    "Exs. 36-37",
    "Richer complementary harmony",
    [
      { label: "Ex. 36 tonic form", detail: "I-V-I." },
      { label: "Ex. 36 dominant form", detail: "V-I-V." },
      { label: "Ex. 37", detail: "The dominant form contains passing harmonies while the larger complementary relationship remains clear." },
    ],
  ),
  "s04.ex38-39": map(
    "s04.ex38-39",
    "Exs. 38-39",
    "Do not answer mechanically",
    [
      { label: "Ex. 38", detail: "Passing harmonies from the tonic form are not mechanically preserved in the dominant form." },
      { label: "Ex. 39", detail: "The tonic form is basically I-IV and the dominant form basically V-I, though elaborate part-writing disguises that simplicity." },
    ],
  ),
  "s04.ex40": map(
    "s04.ex40",
    "Ex. 40a-c",
    "What carries identity?",
    [
      { label: "40a", detail: "The dominant-form melody follows the contour of the tonic phrase exactly." },
      { label: "40b-c", detail: "Rhythm is preserved while contour is treated more freely." },
      { label: "Comparison", detail: "Schoenberg uses the group to show that different features can carry the relationship." },
    ],
  ),
  "s04.ex41": map(
    "s04.ex41",
    "Ex. 41a-c",
    "Answer main harmonies, not every detail",
    [
      { label: "Problem", detail: "A tonic form with too many harmonies can make literal answering impracticable." },
      { label: "Solution", detail: "Answer only the main harmonies - for example I-V with V-I." },
      { label: "Accompaniment", detail: "A definite, regular accompanimental characteristic can animate the harmony and strongly unify the passage." },
    ],
  ),

  "s05.chapter": map(
    "s05.chapter",
    "Chapter VIII",
    "Completion of the sentence",
    [
      {
        label: "Continuation needs remoter forms",
        detail:
          "Because the sentence beginning already contains repetition, Schoenberg says the continuation demands more remotely varied motive-forms rather than another presentation.",
      },
      {
        label: "Development can also reduce",
        detail:
          "Development includes growth, augmentation and extension, but also reduction, condensation and intensification.",
      },
      {
        label: "Liquidation",
        detail:
          "Characteristic features are gradually eliminated until only less characteristic residues remain and no longer strongly demand continuation.",
      },
      {
        label: "Shortening + cadence",
        detail:
          "Liquidation is generally supported by shorter phrase units and can combine with a cadence or half cadence to delimit the sentence.",
      },
    ],
    "This interactive map follows Schoenberg's Chapter VIII text directly. It is conceptual source material, not a substitute for any numbered score example.",
  ),
  "s05.ex52": map(
    "s05.ex52",
    "Ex. 52",
    "Reduction, condensation and melodic residues",
    [
      {
        label: "Tonic form → dominant form",
        detail:
          "Schoenberg labels the opening phrase forms explicitly before the continuation begins.",
      },
      {
        label: "Climactic ascension",
        detail:
          "Ex. 52a intensifies the continuation through an ascending passage before the material is shortened.",
      },
      {
        label: "Reduction / condensation",
        detail:
          "The two-measure phrases are reduced to one measure; in Ex. 52c four measures are condensed into two.",
      },
      {
        label: "Melodic residues",
        detail:
          "The final small units retain little of the full motive and help prepare the boundary of the sentence.",
      },
      {
        label: "Cadential destination can vary",
        detail:
          "Schoenberg notes that a sentence may close on I, V or III with a suitable full, half, Phrygian, plagal, perfect or imperfect cadence according to function.",
      },
    ],
    "The labels and reduction process are taken from Schoenberg's text and the printed annotations in Ex. 52. A complete native two-staff transcription remains pending.",
  ),
  "s05.ex53": map(
    "s05.ex53",
    "Ex. 53",
    "Remote motive-forms can justify a longer sentence",
    [
      {
        label: "53a: tonic form → mediant form",
        detail:
          "The printed analysis shows the opening changing harmonic/formal role before later material is reduced to residues.",
      },
      {
        label: "53a: reduced → residues",
        detail:
          "The continuation shortens the material rather than merely adding another full phrase.",
      },
      {
        label: "53b: remote variation",
        detail:
          "Schoenberg says the motive-form in m. 5 is a very remote variation, based on a third and indirectly derived from the marked figure b.",
      },
      {
        label: "Repetition explains the length",
        detail:
          "Because the remote form needs establishment, its repetitions account for the twelve-measure length.",
      },
    ],
    "This map follows Schoenberg's comment on Ex. 53 and the labels printed in the score. Full native piano notation remains pending.",
  ),
  "s05.ex54-56": map(
    "s05.ex54-56",
    "Exs. 54-56",
    "Progressive variation, sequence-like treatment and alternative endings",
    [
      {
        label: "One broken-chord source",
        detail:
          "Schoenberg states that Exs. 54-56 are based on the broken-chord form Ex. 7b.",
      },
      {
        label: "Progressive variation",
        detail:
          "Ex. 54a-c progressively varies the source until a motive-form is reached that can build sharply contrasting sentences.",
      },
      {
        label: "Sequence-like continuation",
        detail:
          "The pattern is usually a transformation or condensation of preceding motive-forms and may begin on different scale degrees when the harmony permits.",
      },
      {
        label: "Free transposition",
        detail:
          "The quasi-sequential repetitions in Exs. 54-56 are mostly free transpositions by a whole tone or semitone; Ex. 56b includes a fourth downward.",
      },
      {
        label: "Alternative cadential regions",
        detail:
          "Schoenberg supplies alternatives because the main endings lead to V and III in major and v and III in minor; the alternatives move toward the relative-major region.",
      },
    ],
    "The interactive map preserves Schoenberg's explicit comment on Exs. 54-56. The dense multi-voice examples themselves still await verified native transcription.",
  ),
  "s05.ex57-58": map(
    "s05.ex57-58",
    "Exs. 57-58",
    "Literature sentences depart from the eight-measure practice form",
    [
      {
        label: "Practice form is an abstraction",
        detail:
          "Schoenberg warns that masterworks often differ considerably from the simple eight-measure scheme.",
      },
      {
        label: "Condensed continuation",
        detail:
          "In almost all of Exs. 57-61, continuation after the repeated first phrase is carried by condensed phrases giving way to a cadence contour.",
      },
      {
        label: "Closing residues",
        detail:
          "The closing measures generally employ only residues of the basic motive.",
      },
      {
        label: "57a: remote derivative + sequence",
        detail:
          "After a twofold statement of the basic phrase, remote derivatives can appear; Schoenberg says the extension in 57a is produced by the sequence in m. 6.",
      },
    ],
    "This map follows the opening of Schoenberg's 'Illustrations from the literature' discussion and his later generalization of Ex. 57a. Native literature transcriptions remain pending.",
  ),
  "s05.ex59": map(
    "s05.ex59",
    "Ex. 59",
    "Mozart: irregularity through inserted repetition",
    [
      {
        label: "59a: interpolation",
        detail:
          "After two one-measure phrases in mm. 5-6, a three-measure segment appears and is repeated with slight variation.",
      },
      {
        label: "Omission test",
        detail:
          "Schoenberg proposes omitting measures to discover what causes the extension: removing mm. 7-11 reduces 59a to the eight measures of the practice form.",
      },
      {
        label: "59b / 59c",
        detail:
          "In 59b, mm. 5-6 could be omitted; in 59c, omission of mm. 7-8 reduces ten measures to eight.",
      },
      {
        label: "59d: overlap + sequence",
        detail:
          "The sentence overlaps the beginning of a repetition and is extended by a sequence in mm. 6-7.",
      },
      {
        label: "59h: remote forms need repetition",
        detail:
          "Remote motive-forms in mm. 5-6 are followed by a modified repetition in mm. 7-8; Schoenberg calls such repetitions consequences of comprehensibility.",
      },
    ],
    "This source map reproduces Schoenberg's measure-by-measure explanation of the Mozart examples in Ex. 59. Full native piano notation remains pending.",
  ),
  "s05.ex60": map(
    "s05.ex60",
    "Ex. 60",
    "Unusual sentence endings, beginnings and extensions",
    [
      {
        label: "60a: unusual VI ending",
        detail:
          "Schoenberg calls the ending on VI unusual and the anticipation of VI through a deceptive cadence still more unusual.",
      },
      {
        label: "60c: remarkable beginning",
        detail:
          "He points out the beginning on VII-II and compares it with the Finale of Beethoven's String Quartet Op. 130.",
      },
      {
        label: "60e: short segment + condensation",
        detail:
          "Quasi-sequential repetition of a short segment and condensation in the cadence show similarity to the practice form.",
      },
      {
        label: "60f: three-measure units",
        detail:
          "Its two three-measure units are not created by reduction or extension, but by quasi-sequential insertions and repetitions.",
      },
      {
        label: "60h: independent addition",
        detail:
          "Omitting mm. 7-11 and m. 13 would reduce it to eight measures, but mm. 7-14 can also be heard as an independent four-measure addition with varied repetition.",
      },
    ],
    "This map follows Schoenberg's explicit comments on the subexamples of Ex. 60. It deliberately does not invent the omitted piano texture or harmony.",
  ),
  "s05.ex61": map(
    "s05.ex61",
    "Ex. 61",
    "Developing variation, exchange of voices and cadential reduction",
    [
      {
        label: "61a: theme less complicated than it looks",
        detail:
          "Schoenberg says the analysis shows a less complicated theme than first glance suggests; melody need not always remain in the highest voice.",
      },
      {
        label: "Melody and accompaniment exchange",
        detail:
          "Accompaniment and melody may exchange places; Schoenberg also remarks on the unusual bass treatment below mm. 6-7.",
      },
      {
        label: "61b: developing variation",
        detail:
          "The example has little in common with the practice form except repeated smaller segments and the cadential process.",
      },
      {
        label: "One-measure phrases → half-measure residues",
        detail:
          "The one-measure phrases of mm. 3-4 are reduced to half-measure residues in mm. 7-8, reinforced by accompaniment phrasing.",
      },
      {
        label: "61d: insertion and refrain-like return",
        detail:
          "Schoenberg says 61d would be eight measures without insertion of motive-form b and repetition b¹; the opening phrase then returns refrain-like in mm. 8-9.",
      },
    ],
    "This map follows Schoenberg's analysis of Ex. 61, including his explicit use of the term 'developing variation'. Full multi-voice transcription remains pending.",
  ),

};

export function getSchoenbergSourceMaterial(
  id: string,
): SchoenbergSourceMaterial | undefined {
  return schoenbergSourceMaterial[id];
}
