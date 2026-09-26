import type {
  BookSourceMap,
  BookSourceMaterial,
  BookSourceScore,
} from "./bookSourceMaterial";

export type LevineSourceMaterial = BookSourceMaterial;
export type LevineSourceScore = BookSourceScore;
export type LevineSourceMap = BookSourceMap;

function map(
  id: string,
  reference: string,
  title: string,
  segments: BookSourceMap["segments"],
  fidelityNote: string,
): BookSourceMap {
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

export const levineSourceMaterial: Record<string, LevineSourceMaterial> = {
  "l01.fig1-1": {
    kind: "score",
    id: "l01.fig1-1",
    reference: "Chapter One, Figure 1-1",
    title: "Intervals from middle C",
    attribution: "Interval chart reproduced from Chapter One",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Structured transcription of the complete interval chart in Figure 1-1, from the minor second through the octave. Every dyad keeps middle C as the lower note and uses the spelling shown in the source.",
    clef: "treble",
    keyLabel: "C · no key signature",
    bpm: 76,
    events: [
      { midi: [60, 61], duration: 2, accidentals: [null, "♭"] },
      { midi: [60, 62], duration: 2 },
      { midi: [60, 63], duration: 2, accidentals: [null, "♭"] },
      { midi: [60, 64], duration: 2 },
      { midi: [60, 65], duration: 2 },
      { midi: [60, 66], duration: 2, accidentals: [null, "♯"] },
      { midi: [60, 67], duration: 2 },
      { midi: [60, 68], duration: 2, accidentals: [null, "♭"] },
      { midi: [60, 69], duration: 2 },
      { midi: [60, 70], duration: 2, accidentals: [null, "♭"] },
      { midi: [60, 71], duration: 2 },
      { midi: [60, 72], duration: 2 },
    ],
    analysis: [
      {
        label: "Seconds and thirds",
        detail:
          "Keep the lower C fixed and compare the compact sound of minor and major seconds with the wider minor and major thirds.",
        startEvent: 0,
        endEvent: 3,
      },
      {
        label: "Fourth, tritone, fifth",
        detail:
          "The perfect fourth and fifth frame the tritone, the augmented fourth or diminished fifth exactly halfway through the octave.",
        startEvent: 4,
        endEvent: 6,
      },
      {
        label: "Sixths and sevenths",
        detail:
          "Minor and major sixths and sevenths continue the same comparison of interval quality as the upper note moves farther from C.",
        startEvent: 7,
        endEvent: 10,
      },
      {
        label: "Octave",
        detail:
          "The octave returns to the same pitch class at the next register and closes the chart.",
        startEvent: 11,
        endEvent: 11,
      },
    ],
  },

  "l01.interval-inversion": map(
    "l01.interval-inversion",
    "Chapter One, Figures 1-2 through 1-4",
    "Inverting intervals",
    [
      {
        label: "Move the lower note up",
        detail:
          "Invert an interval by moving the bottom note above the top note, or the top note below the bottom note.",
      },
      {
        label: "Quality changes",
        detail:
          "Major becomes minor, minor becomes major, perfect remains perfect, and a tritone remains a tritone.",
      },
      {
        label: "Numbers add to nine",
        detail:
          "The old and new interval numbers add to nine: a third becomes a sixth, a second becomes a seventh, and so on.",
      },
    ],
    "Interactive reconstruction of the interval-inversion rules printed beside Figures 1-2 through 1-4. The source rules are represented directly; no additional interval examples are attributed to the book.",
  ),

  "l01.fig1-6": {
    kind: "score",
    id: "l01.fig1-6",
    reference: "Chapter One, Figure 1-6",
    title: "Four C triad qualities",
    attribution: "Four triads reproduced from Figure 1-6",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Structured transcription of the four root-position triads in Figure 1-6: C major, C minor, C diminished and C augmented.",
    clef: "treble",
    keyLabel: "C · no key signature",
    bpm: 68,
    events: [
      { midi: [60, 64, 67], duration: 4 },
      { midi: [60, 63, 67], duration: 4, accidentals: [null, "♭", null] },
      { midi: [60, 63, 66], duration: 4, accidentals: [null, "♭", "♭"] },
      { midi: [60, 64, 68], duration: 4, accidentals: [null, null, "♯"] },
    ],
    analysis: [
      {
        label: "Major",
        detail:
          "C-E-G stacks a major third below a minor third.",
        startEvent: 0,
        endEvent: 0,
      },
      {
        label: "Minor",
        detail:
          "C-E-flat-G reverses that order: minor third below, major third above.",
        startEvent: 1,
        endEvent: 1,
      },
      {
        label: "Diminished",
        detail:
          "C-E-flat-G-flat stacks two minor thirds.",
        startEvent: 2,
        endEvent: 2,
      },
      {
        label: "Augmented",
        detail:
          "C-E-G-sharp stacks two major thirds.",
        startEvent: 3,
        endEvent: 3,
      },
    ],
  },

  "l01.fig1-7": {
    kind: "score",
    id: "l01.fig1-7",
    reference: "Chapter One, Figure 1-7",
    title: "C major and C minor inversions",
    attribution: "Major and minor inversion chart reproduced from Figure 1-7",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Structured transcription of the root-position, first-inversion and second-inversion C-major and C-minor triads shown in Figure 1-7.",
    clef: "treble",
    keyLabel: "C · no key signature",
    bpm: 66,
    events: [
      { midi: [60, 64, 67], duration: 4 },
      { midi: [64, 67, 72], duration: 4 },
      { midi: [67, 72, 76], duration: 4 },
      { midi: [60, 63, 67], duration: 4, accidentals: [null, "♭", null] },
      { midi: [63, 67, 72], duration: 4, accidentals: ["♭", null, null] },
      { midi: [67, 72, 75], duration: 4, accidentals: [null, null, "♭"] },
    ],
    analysis: [
      {
        label: "C major",
        detail:
          "Follow C-E-G, E-G-C and G-C-E as root position, first inversion and second inversion.",
        startEvent: 0,
        endEvent: 2,
      },
      {
        label: "C minor",
        detail:
          "The same three bass positions appear with E-flat: C-E-flat-G, E-flat-G-C and G-C-E-flat.",
        startEvent: 3,
        endEvent: 5,
      },
      {
        label: "What inversion changes",
        detail:
          "The chord tones remain the same; only their vertical order and lowest note change.",
      },
    ],
  },

  "l02.fig2-1": map(
    "l02.fig2-1",
    "Chapter Two, Figure 2-1",
    "The C-major scale and its modes",
    [
      {
        label: "I - C Ionian",
        detail:
          "Begin the C-major note collection on C. Ionian is the mode on scale degree I.",
      },
      {
        label: "II - D Dorian",
        detail:
          "Begin the same note collection on D. Dorian is the mode on scale degree II.",
      },
      {
        label: "III - E Phrygian",
        detail:
          "Begin the same note collection on E. Phrygian is the mode on scale degree III.",
      },
      {
        label: "IV - F Lydian",
        detail:
          "Begin the same note collection on F. Lydian is the mode on scale degree IV.",
      },
      {
        label: "V - G Mixolydian",
        detail:
          "Begin the same note collection on G. Mixolydian is the mode on scale degree V.",
      },
      {
        label: "VI - A Aeolian",
        detail:
          "Begin the same note collection on A. Aeolian is the mode on scale degree VI.",
      },
      {
        label: "VII - B Locrian",
        detail:
          "Begin the same note collection on B. Locrian is the mode on scale degree VII.",
      },
    ],
    "Interactive representation of the seven modes and Roman scale degrees shown in Figure 2-1. The complete stacked page layout is not reproduced as a single native staff yet.",
  ),

  "l02.fig2-2": {
    kind: "score",
    id: "l02.fig2-2",
    reference: "Chapter Two, Figure 2-2",
    title: "C Ionian to C major seventh",
    attribution: "Scale and chord-tone extraction reproduced from Figure 2-2",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Structured transcription of the C-Ionian scale and the C-major-seventh chord formed from its root, third, fifth and seventh as shown in Figure 2-2.",
    clef: "treble",
    keyLabel: "C major · no sharps or flats",
    bpm: 82,
    events: [
      { midi: 60, duration: 1 },
      { midi: 62, duration: 1 },
      { midi: 64, duration: 1 },
      { midi: 65, duration: 1 },
      { midi: 67, duration: 1 },
      { midi: 69, duration: 1 },
      { midi: 71, duration: 1 },
      { midi: 72, duration: 1, barAfter: true },
      { midi: [60, 64, 67, 71], duration: 4 },
    ],
    analysis: [
      {
        label: "Scale",
        detail:
          "C Ionian is the C-major scale from C to C.",
        startEvent: 0,
        endEvent: 7,
      },
      {
        label: "1-3-5-7",
        detail:
          "Taking root, third, fifth and seventh from the mode produces C-E-G-B.",
        startEvent: 8,
        endEvent: 8,
      },
      {
        label: "Major seventh quality",
        detail:
          "The chord has a major third, perfect fifth and major seventh above its root.",
        startEvent: 8,
        endEvent: 8,
      },
    ],
  },

  "l02.fig2-4": {
    kind: "score",
    id: "l02.fig2-4",
    reference: "Chapter Two, Figure 2-4",
    title: "D Dorian to D minor seventh",
    attribution: "Scale and chord-tone extraction reproduced from Figure 2-4",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Structured transcription of D Dorian and the D-minor-seventh chord formed from its root, third, fifth and seventh.",
    clef: "treble",
    keyLabel: "C-major pitch collection · D as tonic",
    bpm: 82,
    events: [
      { midi: 62, duration: 1 },
      { midi: 64, duration: 1 },
      { midi: 65, duration: 1 },
      { midi: 67, duration: 1 },
      { midi: 69, duration: 1 },
      { midi: 71, duration: 1 },
      { midi: 72, duration: 1 },
      { midi: 74, duration: 1, barAfter: true },
      { midi: [62, 65, 69, 72], duration: 4 },
    ],
    analysis: [
      {
        label: "Scale",
        detail:
          "D Dorian uses the same notes as C major but begins and resolves its octave on D.",
        startEvent: 0,
        endEvent: 7,
      },
      {
        label: "1-3-5-7",
        detail:
          "Root, third, fifth and seventh give D-F-A-C.",
        startEvent: 8,
        endEvent: 8,
      },
      {
        label: "Minor seventh quality",
        detail:
          "The chord has a minor third, perfect fifth and minor seventh above D.",
        startEvent: 8,
        endEvent: 8,
      },
    ],
  },

  "l02.fig2-6": {
    kind: "score",
    id: "l02.fig2-6",
    reference: "Chapter Two, Figure 2-6",
    title: "G Mixolydian to G dominant seventh",
    attribution: "Scale and chord-tone extraction reproduced from Figure 2-6",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Structured transcription of G Mixolydian and the G-dominant-seventh chord formed from its root, third, fifth and seventh.",
    clef: "treble",
    keyLabel: "C-major pitch collection · G as tonic",
    bpm: 82,
    events: [
      { midi: 67, duration: 1 },
      { midi: 69, duration: 1 },
      { midi: 71, duration: 1 },
      { midi: 72, duration: 1 },
      { midi: 74, duration: 1 },
      { midi: 76, duration: 1 },
      { midi: 77, duration: 1 },
      { midi: 79, duration: 1, barAfter: true },
      { midi: [67, 71, 74, 77], duration: 4 },
    ],
    analysis: [
      {
        label: "Scale",
        detail:
          "G Mixolydian uses the C-major note collection with G as its starting and reference note.",
        startEvent: 0,
        endEvent: 7,
      },
      {
        label: "1-3-5-7",
        detail:
          "Root, third, fifth and seventh give G-B-D-F.",
        startEvent: 8,
        endEvent: 8,
      },
      {
        label: "Dominant seventh quality",
        detail:
          "The chord has a major third, perfect fifth and minor seventh above G.",
        startEvent: 8,
        endEvent: 8,
      },
    ],
  },

  "l02.ii-v-i": map(
    "l02.ii-v-i",
    "Chapter Two, p. 16",
    "The major-key II-V-I",
    [
      {
        label: "II - minor seventh",
        detail:
          "In C major, II is D minor seventh. Its defining third and seventh are both minor intervals above the root.",
      },
      {
        label: "V - dominant seventh",
        detail:
          "V is G dominant seventh. It combines a major third with a minor seventh.",
      },
      {
        label: "I - major seventh",
        detail:
          "I is C major seventh. It combines a major third with a major seventh.",
      },
      {
        label: "Move the pattern to every key",
        detail:
          "The chapter treats II-V-I as a transposable relationship and recommends memorizing it in every major key.",
      },
    ],
    "Source-grounded analysis of the II-V-I explanation and practice instruction on the final page of Chapter Two. This is not presented as a note-for-note figure transcription.",
  ),

  "l03.fig3-2": {
    kind: "score",
    id: "l03.fig3-2",
    reference: "Chapter Three, Figure 3-2",
    title: "Three-note II-V-I voice leading in C",
    attribution: "Three-note voicing diagram reproduced from Figure 3-2",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Structured grand-staff transcription of Figure 3-2: roots D-G-C in the left hand and thirds/sevenths in the right hand. The two upper voices preserve common tones and move by half step exactly as the diagram describes.",
    clef: "treble",
    keyLabel: "C major · no sharps or flats",
    bpm: 68,
    events: [
      { midi: 50, duration: 4, at: 0, staff: "bass" },
      { midi: [65, 72], duration: 4, at: 0, staff: "treble" },
      { midi: 43, duration: 4, at: 4, staff: "bass" },
      { midi: [65, 71], duration: 4, at: 4, staff: "treble" },
      { midi: 48, duration: 4, at: 8, staff: "bass" },
      { midi: [64, 71], duration: 4, at: 8, staff: "treble" },
    ],
    barlines: [4, 8, 12],
    analysis: [
      {
        label: "D minor seventh shell",
        detail:
          "The root is D in the left hand; the right hand keeps only F, the third, and C, the seventh.",
        startEvent: 0,
        endEvent: 1,
      },
      {
        label: "D minor seventh to G7",
        detail:
          "F stays in place while C, the seventh of D minor seventh, moves down a half step to B, the third of G7.",
        startEvent: 0,
        endEvent: 3,
      },
      {
        label: "G7 to C major seventh",
        detail:
          "B stays in place while F, the seventh of G7, moves down a half step to E, the third of C major seventh.",
        startEvent: 2,
        endEvent: 5,
      },
    ],
  },

  "l03.fig3-4": {
    kind: "score",
    id: "l03.fig3-4",
    reference: "Chapter Three, Figure 3-4",
    title: "The second three-note II-V-I position",
    attribution: "Reversed right-hand position reproduced from Figure 3-4",
    fidelity: "verified-excerpt",
    fidelityNote:
      "Structured grand-staff transcription of Figure 3-4. The left hand again plays roots D-G-C, while the right hand reverses the two guide tones so the third of the II chord begins on top.",
    clef: "treble",
    keyLabel: "C major · no sharps or flats",
    bpm: 68,
    events: [
      { midi: 50, duration: 4, at: 0, staff: "bass" },
      { midi: [60, 65], duration: 4, at: 0, staff: "treble" },
      { midi: 43, duration: 4, at: 4, staff: "bass" },
      { midi: [59, 65], duration: 4, at: 4, staff: "treble" },
      { midi: 48, duration: 4, at: 8, staff: "bass" },
      { midi: [59, 64], duration: 4, at: 8, staff: "treble" },
    ],
    barlines: [4, 8, 12],
    analysis: [
      {
        label: "Reverse the guide tones",
        detail:
          "The same third and seventh are used, but their vertical order is reversed so F is above C on D minor seventh.",
        startEvent: 0,
        endEvent: 1,
      },
      {
        label: "II to V",
        detail:
          "F stays while C moves down a half step to B.",
        startEvent: 0,
        endEvent: 3,
      },
      {
        label: "V to I",
        detail:
          "B stays while F moves down a half step to E.",
        startEvent: 2,
        endEvent: 5,
      },
    ],
  },

  "l03.fig3-3": map(
    "l03.fig3-3",
    "Chapter Three, Figure 3-3",
    "Cycle-of-fifths practice route",
    [
      {
        label: "Start in C",
        detail:
          "Begin with D minor seventh-G7-C major seventh and listen to the two right-hand guide tones.",
      },
      {
        label: "Move to F",
        detail:
          "Continue counterclockwise to the key of F, then to B-flat, E-flat and onward around the cycle.",
      },
      {
        label: "Practice every key",
        detail:
          "The purpose of the cycle is to force the same II-V-I voice-leading problem through all twelve major keys.",
      },
      {
        label: "Stay smooth",
        detail:
          "Keep the third and seventh close from chord to chord rather than rebuilding every harmony in a new register.",
      },
    ],
    "Interactive reconstruction of the cycle-of-fifths practice route and accompanying instructions around Figure 3-3.",
  ),

  "l03.extensions": map(
    "l03.extensions",
    "Chapter Three, Figures 3-9 through 3-11",
    "Extensions and altered chord tones",
    [
      {
        label: "Sixth and thirteenth",
        detail:
          "The sixth and thirteenth name the same pitch class at different octave levels; chord symbols may use either term according to harmonic context.",
      },
      {
        label: "Ninth, eleventh, thirteenth",
        detail:
          "Jazz chord symbols continue counting thirds beyond the seventh, so 9, 11 and 13 name extensions above the basic seventh chord.",
      },
      {
        label: "Altered notes",
        detail:
          "A chord tone may be raised or lowered, producing symbols such as flat-nine, sharp-nine, flat-five or sharp-five.",
      },
      {
        label: "Context matters",
        detail:
          "The same pitch can receive different numerical names depending on the chord and its function.",
      },
    ],
    "Source-grounded summary of the terminology illustrated by Figures 3-9 through 3-11. The individual printed voicing examples remain pending for native transcription.",
  ),
  "l04.sus-construction": map(
    "l04.sus-construction",
    "Chapter Four, Figures 4-1 through 4-3",
    "Build and name the suspended sound",
    [
      {
        label: "Bass plus upper triad",
        detail:
          "A simple sus voicing places the chord root in the bass and a major triad a whole step below that root above it. For Gsus, the upper triad is F major and is commonly placed in second inversion.",
      },
      {
        label: "The suspended fourth",
        detail:
          "The name sus refers to the fourth above the root. Unlike a traditional suspension, the fourth in this jazz sonority does not have to resolve down to the third.",
      },
      {
        label: "Several symbols",
        detail:
          "The same family may appear as Gsus, G7sus4, Gsus4, F/G or Dm7/G. The slash-chord spellings emphasize the upper structure and bass separately.",
      },
      {
        label: "II and V together",
        detail:
          "Dm7/G makes the functional compression audible: the upper D-minor-seventh material supplies II while G in the bass supplies the V root.",
      },
    ],
    "Source-grounded map of the suspended-chord construction and alternate symbols explained with Figures 4-1 through 4-3; no tune excerpt is reconstructed.",
  ),
  "l04.sus-third": map(
    "l04.sus-third",
    "Chapter Four, Figures 4-5 and 4-6",
    "The third can coexist with the fourth",
    [
      {
        label: "Voicings can vary",
        detail:
          "Suspended voicings can double a note or reinforce the fifth in the left hand while preserving the characteristic fourth.",
      },
      {
        label: "The third is not forbidden",
        detail:
          "The third may be included with the suspended fourth when the voicing places the third above the fourth.",
      },
      {
        label: "Duration changes the effect",
        detail:
          "The fourth-and-third combination can sound very dissonant on a short chord; a longer-lasting sus chord gives more room for that colour to settle.",
      },
      {
        label: "Resolution remains available",
        detail:
          "Although the fourth need not resolve, a suspended dominant can still move smoothly into its tonic when the progression calls for it.",
      },
    ],
    "Source-grounded summary of the suspended voicing variants and fourth-plus-third discussion around Figures 4-5 and 4-6.",
  ),
  "l04.phrygian": map(
    "l04.phrygian",
    "Chapter Four, Figure 4-7",
    "Dominant colour over the thirteenth",
    [
      {
        label: "Change the bass",
        detail:
          "A Phrygian chord here is a dominant seventh with its thirteenth used in the bass instead of the dominant root. Putting E under G7 gives the central example.",
      },
      {
        label: "Several accepted labels",
        detail:
          "The same sonority may be written G7/E, Esusb9 or E Phrygian; the chapter notes that no single chord symbol is universally accepted.",
      },
      {
        label: "Modal connection",
        detail:
          "E Phrygian uses the pitch collection of C major beginning on its third degree, which explains the close relation to G7 over E.",
      },
      {
        label: "New dominant direction",
        detail:
          "With E in the bass, the chord resolves smoothly to A major seventh, so the bass E-A becomes the functional dominant-to-tonic motion.",
      },
    ],
    "Source-grounded map of the Phrygian-chord definition, spellings and E-to-A resolution presented with Figure 4-7.",
  ),
  "l04.ii-v-compression": map(
    "l04.ii-v-compression",
    "Chapter Four, Figure 4-8 and practice discussion",
    "Compress a II-V into one colour",
    [
      {
        label: "Two functions, one sonority",
        detail:
          "Sus and Phrygian sonorities can combine the material of a II-V pair into one sustained chord instead of stating II and V separately.",
      },
      {
        label: "Bass defines the reading",
        detail:
          "A slash-chord bass can preserve the dominant direction while the upper structure retains notes associated with the preceding II chord.",
      },
      {
        label: "Use it as reharmonization",
        detail:
          "The chapter presents this as a practical way to reharmonize standards rather than as a requirement that every II-V be compressed.",
      },
    ],
    "Source-grounded analysis of the Chapter Four reharmonization principle; the licensed tune passage in Figure 4-8 is deliberately not reproduced.",
  ),

  "l05.add-to-shells": map(
    "l05.add-to-shells",
    "Chapter Five, Figures 5-1 through 5-3",
    "Add one note to the three-note shell",
    [
      {
        label: "II gets its fifth",
        detail:
          "For an unaltered II chord, the first easy addition to the root-third-seventh shell is the fifth.",
      },
      {
        label: "V gets its ninth",
        detail:
          "For the dominant, add the ninth or flat ninth to the basic shell.",
      },
      {
        label: "I gets its fifth",
        detail:
          "For the tonic major-seventh chord, the first straightforward addition is again the fifth.",
      },
      {
        label: "One pitch can stay",
        detail:
          "The fifth of II and the ninth of V are the same pitch, so that added note can remain stationary across the II-to-V move.",
      },
    ],
    "Source-grounded summary of the first added-note procedure in Chapter Five, including the common-tone relation between II's fifth and V's ninth.",
  ),
  "l05.dominant-colour": map(
    "l05.dominant-colour",
    "Chapter Five, Figures 5-11a through 5-11h",
    "Dominant additions and alterations",
    [
      {
        label: "Natural ninth",
        detail:
          "A dominant seventh can add the natural ninth while keeping its third and minor seventh intact.",
      },
      {
        label: "Alter the ninth",
        detail:
          "The ninth may be lowered to flat nine or raised to sharp nine, producing a direct chromatic change above the same dominant framework.",
      },
      {
        label: "Other dominant colours",
        detail:
          "The chapter's dominant family also includes sharp eleven, thirteenth, flat thirteen or sharp five, and an altered-dominant symbol.",
      },
      {
        label: "Alt means more than one note",
        detail:
          "The altered symbol implies a broader collection of altered dominant tones rather than merely one isolated sharp-nine or flat-thirteen change.",
      },
    ],
    "Source-grounded map of the dominant additions and alterations displayed across Figures 5-11a through 5-11h; dense printed voicings are not reconstructed.",
  ),
  "l05.major-colour-context": map(
    "l05.major-colour-context",
    "Chapter Five, Figures 5-8 through 5-12",
    "Choose added notes by musical context",
    [
      {
        label: "Major-chord options",
        detail:
          "Major-seventh voicings can add or emphasize the fifth, sixth, ninth, sharp fourth or raised fifth in different contexts.",
      },
      {
        label: "Sixth can replace the seventh",
        detail:
          "On a tonic-major chord the sixth can be used in place of the major seventh, and sixth plus ninth can be heard together.",
      },
      {
        label: "Melody may supply a tone",
        detail:
          "If the melody already contains a chord tone, the accompaniment does not always need to duplicate it.",
      },
      {
        label: "No fixed formula",
        detail:
          "Density, darkness or brightness, register, melody and musical context all influence which extra notes make a convincing voicing.",
      },
    ],
    "Source-grounded synthesis of the added-note choices and explicit no-hard-rules discussion in the second half of Chapter Five.",
  ),
  "l05.special-chords": map(
    "l05.special-chords",
    "Chapter Five, Figures 5-10 through 5-16",
    "Four special seventh-chord structures",
    [
      {
        label: "Half-diminished",
        detail:
          "A half-diminished chord is a minor seventh chord with a flattened fifth and commonly functions as II in a minor-key II-V-I.",
      },
      {
        label: "Minor-major seventh",
        detail:
          "A minor-major chord combines a minor third and perfect fifth with a major seventh and normally functions as a tonic-minor chord rather than as II.",
      },
      {
        label: "Diminished seventh",
        detail:
          "The diminished seventh is built as a series of stacked minor thirds and uses the small-circle chord symbol.",
      },
      {
        label: "Whole-tone dominant",
        detail:
          "The whole-tone chord shown is a dominant seventh with an augmented fifth: major third, augmented fifth and minor seventh, often used in a dominant function.",
      },
    ],
    "Source-grounded map of the half-diminished, minor-major, diminished-seventh and augmented-dominant definitions at the end of Chapter Five.",
  ),

  "l06.basic-substitution": map(
    "l06.basic-substitution",
    "Chapter Six, Figures 6-1 through 6-3",
    "Replace G7 with D-flat7",
    [
      {
        label: "Substitute dominant",
        detail:
          "In a C-major II-V-I, D-flat7 can substitute for G7 because the two dominant roots are a tritone apart.",
      },
      {
        label: "Same destination",
        detail:
          "Both versions can resolve into C major, so the substitute changes the route without changing the target tonic.",
      },
      {
        label: "Chromatic bass",
        detail:
          "Replacing G7 with D-flat7 changes the bass from D-G-C to the smooth semitone descent D-D-flat-C.",
      },
    ],
    "Source-grounded map of the first tritone-substitution comparison in Chapter Six; no licensed tune excerpt is reconstructed.",
  ),
  "l06.shared-tritone": map(
    "l06.shared-tritone",
    "Chapter Six, Figures 6-4 and 6-5",
    "The shared third-and-seventh tritone",
    [
      {
        label: "G7 guide tones",
        detail:
          "The third and seventh of G7 are B and F, a tritone apart.",
      },
      {
        label: "D-flat7 guide tones",
        detail:
          "The third and seventh of D-flat7 are F and C-flat. C-flat is enharmonically the same sounding pitch as B.",
      },
      {
        label: "Functions exchange",
        detail:
          "The same two sounding pitches trade chord roles: B is the third of G7 while its enharmonic C-flat is the seventh of D-flat7; F is the seventh of G7 and the third of D-flat7.",
      },
      {
        label: "Roots mirror the interval",
        detail:
          "The roots G and D-flat are themselves a tritone apart, giving a practical root-level way to locate the substitute.",
      },
    ],
    "Source-grounded explanation of why G7 and D-flat7 share their defining tritone, as demonstrated in Figures 6-4 and 6-5.",
  ),
  "l06.dual-resolution": map(
    "l06.dual-resolution",
    "Chapter Six, Figures 6-6 through 6-9",
    "Each dominant has its own tonic",
    [
      {
        label: "Dominant instability",
        detail:
          "A dominant seventh and its internal tritone are unstable and strongly seek resolution.",
      },
      {
        label: "G7 to C",
        detail:
          "G7 resolves to C as the ordinary V-I in C major.",
      },
      {
        label: "D-flat7 to G-flat",
        detail:
          "D-flat7 can also resolve normally to G-flat, its own tonic, before it is heard in a substitute role.",
      },
      {
        label: "Context selects the meaning",
        detail:
          "The same D-flat7 therefore has an ordinary dominant reading toward G-flat and a substitute-dominant reading toward C.",
      },
    ],
    "Source-grounded map of the ordinary dominant resolutions used in Chapter Six to establish the substitute chord's dual harmonic reading.",
  ),
  "l06.substitute-ii-v": map(
    "l06.substitute-ii-v",
    "Chapter Six, Figures 6-12 and 6-13",
    "Precede the substitute dominant with its II",
    [
      {
        label: "Treat the substitute as V",
        detail:
          "Once D-flat7 replaces G7, it can be approached as a real dominant by placing its own II chord, A-flat minor seventh, before it.",
      },
      {
        label: "A-flat minor to D-flat7",
        detail:
          "A-flat-minor7-D-flat7 forms a II-V whose dominant can then resolve unexpectedly to C instead of continuing to G-flat.",
      },
      {
        label: "The device can continue",
        detail:
          "Bebop practice extends the idea through additional substitute II-V motion and tritone-substitution chains.",
      },
      {
        label: "Do not apply it mechanically",
        detail:
          "The chapter warns that excessive substitution can create an awkward bass line or clash with the melody, so the actual musical context remains decisive.",
      },
    ],
    "Source-grounded map of the extended substitute-II-V procedure and the chapter's caution against overusing tritone substitution.",
  ),

};

export function getLevineSourceMaterial(
  id: string,
): LevineSourceMaterial | undefined {
  return levineSourceMaterial[id];
}
