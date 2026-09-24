export type SchoenbergSourceEvent = {
  midi: number | null;
  duration: number;
  barAfter?: boolean;
  accidental?: "♭" | "♯" | "♮";
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
  meter: string;
  bpm: number;
  events: SchoenbergSourceEvent[];
  slurs?: Array<{ start: number; end: number }>;
  annotation?: string;
};

export type SchoenbergSourceMap = {
  kind: "map";
  id: string;
  reference: string;
  title: string;
  fidelity: "source-analysis";
  fidelityNote: string;
  segments: Array<{
    label: string;
    detail: string;
  }>;
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
      { label: "Beginning established", detail: "The basic idea has already been presented and repeated." },
      { label: "Continuation", detail: "More remote motive-forms develop the established material." },
      { label: "Liquidation", detail: "Characteristic features are progressively eliminated, often with shortening." },
      { label: "Cadence", detail: "The reduced material and cadential process delimit the sentence." },
    ],
  ),
  "s05.ex52": map(
    "s05.ex52",
    "Ex. 52",
    "Annotated sentence functions",
    [
      { label: "Tonic form", detail: "The opening establishes the basic material in tonic function." },
      { label: "Dominant form", detail: "The answering phrase restates the material in complementary dominant function." },
      { label: "Climactic ascension", detail: "The continuation intensifies through rising treatment." },
      { label: "Reduction", detail: "The motive-forms become shorter and less characteristic." },
      { label: "Melodic residues", detail: "Only residues remain as the cadence is approached." },
    ],
    "This map reproduces Schoenberg's printed analytical labels for Ex. 52a. A full native two-staff transcription is still pending.",
  ),
  "s05.ex53-56": map(
    "s05.ex53-56",
    "Exs. 53-56",
    "Continuation can extend beyond a compact practice model",
    [
      { label: "Remote motive-forms", detail: "More distant derivatives may require extra repetitions before the cadence is ready." },
      { label: "Sequence / extension", detail: "Sequential treatment can lengthen the continuation while preserving motivic connection." },
      { label: "Practice to literature", detail: "Schoenberg relates the more complicated structures back to the same tonic/dominant foundation used in the practice forms." },
    ],
  ),
  "s05.ex57-61": map(
    "s05.ex57-61",
    "Exs. 57-61",
    "Literature examples of sentence completion",
    [
      { label: "Unequal proportions", detail: "Real sentences need not fit a mechanically equal 4+4 plan." },
      { label: "Inserted repetitions", detail: "Extra repetitions can explain apparent irregularity without destroying formal logic." },
      { label: "Developing variation", detail: "Later motive-forms may grow gradually out of tiny initial features." },
      { label: "Residues and cadence", detail: "Reduction and residual material prepare the final delimitation." },
    ],
  ),
};

export function getSchoenbergSourceMaterial(
  id: string,
): SchoenbergSourceMaterial | undefined {
  return schoenbergSourceMaterial[id];
}
