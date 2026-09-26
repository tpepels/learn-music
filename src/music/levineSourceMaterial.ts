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


  "l07.rootless-purpose": map(
    "l07.rootless-purpose",
    "Chapter Seven, Figure 7-1 and opening discussion",
    "Why the root disappears",
    [
      {
        label: "Free the right hand",
        detail:
          "Left-hand voicings move the harmony into one hand so the right hand can play melody, a line, or improvisation.",
      },
      {
        label: "No root is required",
        detail:
          "The basic shapes omit the root. In an ensemble the bass player often supplies it, and the harmonic context can make the chord clear even when no one states the root at every moment.",
      },
      {
        label: "Use the middle register",
        detail:
          "Without the low root, the left hand can move higher and include colour tones such as ninths and thirteenths without becoming muddy.",
      },
      {
        label: "Check the root, then remove it",
        detail:
          "A practical way to learn the sound is to add the root briefly elsewhere on the keyboard, then return to the rootless shape and hear the same harmonic identity without it.",
      },
    ],
    "Source-grounded analysis of the opening Chapter Seven discussion and Figure 7-1. The licensed tune melody is not reproduced.",
  ),
  "l07.a-position": map(
    "l07.a-position",
    "Chapter Seven, Figures 7-2 and 7-3",
    "Third-seventh-third",
    [
      {
        label: "D minor seventh",
        detail:
          "The first rootless II shape is F-A-C-E: third, fifth, seventh and ninth of D minor seventh.",
      },
      {
        label: "One half-step creates G7",
        detail:
          "C, the seventh of D minor seventh, falls to B, the third of G7. F, A and E remain in place, producing F-A-B-E.",
      },
      {
        label: "Tonic without the root",
        detail:
          "A compact C-major arrival can be E-G-A-D, heard as third, fifth, sixth and ninth. E-G-B-D is another available tonic-major colour.",
      },
      {
        label: "Lowest-note pattern",
        detail:
          "The little finger follows third of II, seventh of V, third of I. This pattern is commonly called the A position.",
      },
    ],
    "Source-grounded map of the first basic rootless II-V-I position in Figures 7-2 and 7-3.",
  ),
  "l07.b-position": map(
    "l07.b-position",
    "Chapter Seven, Figures 7-4 through 7-6",
    "Seventh-third-seventh",
    [
      {
        label: "Rearrange the II chord",
        detail:
          "The same D-minor material is inverted to C-E-F-A: seventh, ninth, third and fifth.",
      },
      {
        label: "The seventh still falls",
        detail:
          "C again falls by a half step to B, producing the G7 shape B-E-F-A while the other notes remain fixed.",
      },
      {
        label: "Tonic with the seventh below",
        detail:
          "The tonic can be B-C-E-G, read as major seventh, root, third and fifth. Replacing C with D gives the alternative B-D-E-G colour.",
      },
      {
        label: "Reverse lowest-note pattern",
        detail:
          "The little finger now follows seventh of II, third of V, seventh of I. This complementary pattern is called the B position.",
      },
    ],
    "Source-grounded map of the second basic rootless II-V-I position and its tonic options in Figures 7-4 through 7-6.",
  ),
  "l07.cycle-practice": map(
    "l07.cycle-practice",
    "Chapter Seven, Tune-Up discussion and practice tips",
    "Make the positions automatic",
    [
      {
        label: "Use all twelve keys",
        detail:
          "Practice both positions around the cycle of fifths so the same voice-leading rule becomes available in every key.",
      },
      {
        label: "Keep a useful register",
        detail:
          "The little finger should remain roughly between middle C and the C an octave below, avoiding voicings that become muddy or unnecessarily high.",
      },
      {
        label: "Recognize II-V motion",
        detail:
          "When the change is II to V, the seventh of the II chord falls by a half step. That motion is more reliable than rebuilding the next chord from zero.",
      },
      {
        label: "Choose the nearest position",
        detail:
          "For other chord changes, choose the closest available shape with the little finger on the third or seventh, favouring smooth motion and comfortable hand placement.",
      },
    ],
    "Source-grounded summary of the Chapter Seven all-keys routine, Tune-Up application discussion, and printed practice tips.",
  ),

  "l08.half-diminished": map(
    "l08.half-diminished",
    "Chapter Eight, Figures 8-1 and 8-2",
    "Flatten the fifth inside a known shape",
    [
      {
        label: "Start from minor seventh",
        detail:
          "Half-diminished means a minor seventh chord with a flattened fifth, so familiar minor-seven left-hand positions can be altered rather than relearned from scratch.",
      },
      {
        label: "Two familiar positions",
        detail:
          "The first two half-diminished shapes correspond directly to the earlier D-minor positions with A lowered to A-flat.",
      },
      {
        label: "More than two choices",
        detail:
          "Additional positions place the root, flat fifth, or fourth in the little finger, expanding the available register choices.",
      },
      {
        label: "Context selects the voicing",
        detail:
          "The best choice depends on the previous and next chord, keyboard position, melody note and smoothness of motion.",
      },
    ],
    "Source-grounded map of the five half-diminished options introduced in Figures 8-1 and 8-2.",
  ),
  "l08.dominant-alterations": map(
    "l08.dominant-alterations",
    "Chapter Eight, Figures 8-3 through 8-7",
    "Alter ninths and thirteenths",
    [
      {
        label: "Flat ninth",
        detail:
          "The basic dominant positions can lower the ninth by a semitone while keeping the rest of the rootless framework intact.",
      },
      {
        label: "Sharp five equals flat thirteen",
        detail:
          "On a dominant chord the sharp fifth and flat thirteenth are enharmonically the same piano key, so a sharp-five symbol changes the thirteenth in these left-hand shapes.",
      },
      {
        label: "Altered means a collection",
        detail:
          "The altered symbol implies more than one isolated change: the chapter points to flat nine, sharp nine, sharp eleven and flat thirteen as part of the altered dominant vocabulary.",
      },
      {
        label: "Tritone substitution reappears",
        detail:
          "Altered G7 and D-flat7 can use exactly the same sounding notes, with different spellings and harmonic readings, because the two dominants share their tritone.",
      },
    ],
    "Source-grounded map of the altered-dominant left-hand vocabulary and enharmonic tritone-substitution connection in Figures 8-3 through 8-7.",
  ),
  "l08.sharp-eleven-minor-major": map(
    "l08.sharp-eleven-minor-major",
    "Chapter Eight, Figures 8-8 through 8-11",
    "Sharp eleven and a second harmonic identity",
    [
      {
        label: "Move the nearest note",
        detail:
          "For G7 sharp eleven, C-sharp is the target. In one compact position the nearest note is B, so B moves to C-sharp while F, A and E stay.",
      },
      {
        label: "The third can disappear",
        detail:
          "The resulting sharp-eleven voicing may omit the ordinary third of the dominant. Once alterations are introduced, the exact set of defining tones becomes more flexible.",
      },
      {
        label: "Minor-major uses the same upper notes",
        detail:
          "F-A-C-sharp-E can also function as a rootless D minor-major-nine structure: minor third, fifth, major seventh and ninth.",
      },
      {
        label: "Context changes the label",
        detail:
          "The same pitch set can therefore support altered dominant or tonic-minor colour depending on the bass and surrounding harmony.",
      },
    ],
    "Source-grounded map of the G7 sharp-eleven and D minor-major relationship shown in Figures 8-8 through 8-11.",
  ),
  "l08.diminished-derivation": map(
    "l08.diminished-derivation",
    "Chapter Eight, Figure 8-12",
    "Raise the top of the diminished stack",
    [
      {
        label: "Begin with minor thirds",
        detail:
          "A diminished seventh chord is formed by stacking minor thirds.",
      },
      {
        label: "Raise the top note",
        detail:
          "Starting from F diminished seventh, raising the top note by a whole step creates a more practical left-hand voicing.",
      },
      {
        label: "The result is familiar",
        detail:
          "That transformed pitch set is exactly the same rootless voicing already used for G7 flat nine.",
      },
    ],
    "Source-grounded analysis of the diminished-to-dominant transformation in Figure 8-12.",
  ),
  "l08.sus-phrygian-selection": map(
    "l08.sus-phrygian-selection",
    "Chapter Eight, Figures 8-13 through 8-15 and concluding discussion",
    "Reuse shapes, then choose by motion",
    [
      {
        label: "Sus reuses D-minor shapes",
        detail:
          "Two of the practical Gsus voicings are identical to the earlier D-minor left-hand positions because the suspended dominant combines the sound of II and V.",
      },
      {
        label: "Phrygian has a compact formula",
        detail:
          "The E-Phrygian left-hand voicing is read from the bottom as root, flat ninth, fourth and fifth.",
      },
      {
        label: "Smooth motion comes first",
        detail:
          "When several voicings are available, prefer the one that moves smoothly from the previous chord and toward the next chord.",
      },
      {
        label: "Protect the register and melody",
        detail:
          "Avoid voicings that are too low, too high, or collide with the right hand. If the melody already supplies an optional colour tone, the left hand may omit it.",
      },
    ],
    "Source-grounded synthesis of the sus and Phrygian left-hand shapes plus the selection criteria applied in the Chapter Eight tune discussion. The licensed tune excerpt is not reproduced.",
  ),


  "l09.major-scale-harmony": map(
    "l09.major-scale-harmony",
    "Chapter Nine, Figures 9-2 through 9-10",
    "Chord and scale as one pitch field",
    [
      {
        label: "Modes generate chord qualities",
        detail:
          "The same major-scale collection produces different seventh-chord qualities when a different degree becomes the root: major seventh on Ionian, minor seventh on Dorian, and dominant seventh on Mixolydian.",
      },
      {
        label: "The fourth needs care on major seventh",
        detail:
          "Holding the natural fourth over a major-seventh chord produces a conspicuous clash. The source treats the label 'avoid note' as contextual rather than absolute: passing or resolving use can still be musical.",
      },
      {
        label: "Lydian raises the fourth",
        detail:
          "Lydian differs from the ordinary major mode by its raised fourth, giving the major-seventh harmony a sharp-eleven colour without the same semitone friction against the third.",
      },
      {
        label: "Harmony decides the reading",
        detail:
          "A pitch collection becomes useful only in relation to the chord underneath it; scale names are shorthand for that chord-scale relationship, not a substitute for listening.",
      },
    ],
    "Source-grounded synthesis of the major-scale harmony discussion, the contextual avoid-note explanation, and the Lydian comparison in Chapter Nine.",
  ),
  "l09.melodic-minor-harmony": map(
    "l09.melodic-minor-harmony",
    "Chapter Nine, Figures 9-19 through 9-25",
    "Rotate melodic minor into new chord colours",
    [
      {
        label: "Minor third with major seventh",
        detail:
          "Melodic minor begins with a minor third but keeps a major seventh, so its first mode supports minor-major harmony rather than an ordinary minor seventh chord.",
      },
      {
        label: "Fourth mode is Lydian dominant",
        detail:
          "Starting the collection on its fourth degree creates a dominant mode with a raised fourth: major third, minor seventh and sharp eleven.",
      },
      {
        label: "Seventh mode is altered",
        detail:
          "Starting the same collection on its seventh degree produces the altered mode, containing flat nine, sharp nine, sharp eleven and flat thirteen around the dominant guide tones.",
      },
      {
        label: "One collection supports several roots",
        detail:
          "The melodic-minor modes share one set of notes while their roots and chord functions change; the source emphasizes the practical interchangeability of the upper voicing material when the root is supplied separately.",
      },
    ],
    "Source-grounded map of the melodic-minor harmony chart and its minor-major, Lydian-dominant and altered applications.",
  ),
  "l09.half-diminished-modes": map(
    "l09.half-diminished-modes",
    "Chapter Nine, Figures 9-13, 9-22 and 9-23",
    "Two half-diminished scale choices",
    [
      {
        label: "Locrian supplies flat nine",
        detail:
          "Ordinary Locrian from major-scale harmony fits the half-diminished chord tones but places a flat second, heard as flat nine, above the root.",
      },
      {
        label: "Locrian sharp-two supplies natural nine",
        detail:
          "The sixth mode of melodic minor raises that second while preserving the minor third, flat fifth and minor seventh of the half-diminished chord.",
      },
      {
        label: "Both remain usable",
        detail:
          "The natural-nine version is presented as a common modern choice, while the older Locrian sound is explicitly retained as a valid option.",
      },
    ],
    "Source-grounded comparison of Locrian and Locrian sharp-two for half-diminished harmony.",
  ),
  "l09.diminished-harmony": map(
    "l09.diminished-harmony",
    "Chapter Nine, Figures 9-27 through 9-39",
    "Minor-third symmetry in diminished harmony",
    [
      {
        label: "Alternate half and whole steps",
        detail:
          "The diminished scale alternates semitones and whole tones. Beginning with the opposite interval order produces the companion diminished form used for different harmonic contexts.",
      },
      {
        label: "Minor-third transposition preserves the set",
        detail:
          "Because the pattern is symmetrical, moving the starting point by a minor third produces the same eight pitch classes in a new order.",
      },
      {
        label: "Several dominant-flat-nine roots share one scale",
        detail:
          "Dominant-flat-nine chords whose roots are separated by minor thirds can be drawn from the same diminished collection, making their upper structures closely interchangeable.",
      },
      {
        label: "Bass context still matters",
        detail:
          "The source cautions against calling every diminished sonority a substitute dominant. The bass and surrounding progression can give the same notes a different harmonic role.",
      },
    ],
    "Source-grounded synthesis of the diminished-scale symmetry, dominant-flat-nine interchangeability, and bass-context cautions in Chapter Nine.",
  ),
  "l09.whole-tone-harmony": map(
    "l09.whole-tone-harmony",
    "Chapter Nine, Figures 9-40 through 9-42",
    "Two whole-tone collections",
    [
      {
        label: "Only whole steps",
        detail:
          "A whole-tone scale contains six notes separated entirely by whole steps, so every interval pattern repeats uniformly through the collection.",
      },
      {
        label: "Only two distinct scales",
        detail:
          "Transposing by a whole step merely rotates the same six pitch classes. The chromatic octave therefore divides into only two different whole-tone collections.",
      },
      {
        label: "Dominant raised-five colour",
        detail:
          "The scale naturally supports a dominant with raised fifth and raised fourth or sharp eleven, with no single scale tone treated as an avoid note inside that symmetrical sound.",
      },
      {
        label: "Use the colour briefly",
        detail:
          "The source notes that whole-tone harmony can become monotonous because its notes have such equal status, so it is especially effective in shorter spans.",
      },
    ],
    "Source-grounded map of the whole-tone symmetry, dominant raised-five application, and practice guidance at the end of Chapter Nine.",
  ),

  "l10.sequence-linking": map(
    "l10.sequence-linking",
    "Chapter Ten, Figures 10-1 through 10-5",
    "Carry a melodic cell through changing scales",
    [
      {
        label: "Repeat a recognizable cell",
        detail:
          "A sequence repeats a melodic idea at a different pitch level, giving the line continuity while the harmony underneath it changes.",
      },
      {
        label: "Link one scale into the next",
        detail:
          "The practice goal is to move directly from the current note into the pitch collection required by the next chord rather than stopping between scales.",
      },
      {
        label: "Use the current register",
        detail:
          "A new chord does not require the line to return to the root or to a memorized starting position; the next scale begins where the phrase has actually arrived.",
      },
      {
        label: "Hearing and fingering develop together",
        detail:
          "The exercise simultaneously trains the scale for each harmony and the physical transition between those scales.",
      },
    ],
    "Source-grounded summary of the sequence exercise and its chord-to-chord linking purpose in the opening of Chapter Ten.",
  ),
  "l10.continuous-entry": map(
    "l10.continuous-entry",
    "Chapter Ten, discussion around Figures 10-1 through 10-5",
    "Enter a scale on any available note",
    [
      {
        label: "Do not wait for the root",
        detail:
          "Fluent chord-scale playing requires immediate access to the scale from whatever note is nearest to the ongoing melodic line.",
      },
      {
        label: "Preserve direction when useful",
        detail:
          "If the line is already rising or falling, the next scale can continue that motion rather than resetting its contour at the chord boundary.",
      },
      {
        label: "Same collection can change meaning",
        detail:
          "When two adjacent chords draw from the same parent collection, continuity of the notes makes the shift in harmonic emphasis easier to hear.",
      },
    ],
    "Source-grounded analysis of the chapter's instruction to know each scale from any starting point and connect scales without root resets.",
  ),
  "l10.pattern-variants": map(
    "l10.pattern-variants",
    "Chapter Ten, Figures 10-6 through 10-10",
    "Transform the scale pattern",
    [
      {
        label: "Begin with straight motion",
        detail:
          "Straight eighth-note scale motion establishes the pitch collection and a clear baseline pattern.",
      },
      {
        label: "Break the scale into thirds",
        detail:
          "Alternating notes a third apart turns adjacent scale motion into a more intervallic melodic shape.",
      },
      {
        label: "Reverse the third pattern",
        detail:
          "Changing the direction of successive thirds creates another contour while preserving the same underlying scale.",
      },
      {
        label: "Use triplet cells",
        detail:
          "Triplets and triplet figures combining a step with a skip add rhythmic and intervallic variety to the same practice material.",
      },
    ],
    "Source-grounded map of the pattern variations shown in the second half of Chapter Ten.",
  ),
  "l10.musical-use": map(
    "l10.musical-use",
    "Chapter Ten, discussion after Figures 10-6 through 10-10 and practice tips",
    "Use patterns without sounding mechanical",
    [
      {
        label: "Patterns can be musical",
        detail:
          "A repeated cell can organize a line and create expectation, making it useful material for improvisation rather than merely a technical drill.",
      },
      {
        label: "Too much repetition becomes mechanical",
        detail:
          "Running a sequence continuously can make an otherwise melodic line feel automatic, so the pattern should be varied or abandoned when the phrase calls for it.",
      },
      {
        label: "Practice through real progressions",
        detail:
          "The chapter directs the player to carry these transformations through many chords and progressions so the pattern adapts to harmony rather than remaining a fixed lick.",
      },
    ],
    "Source-grounded synthesis of the chapter's warning against mechanical sequencing and its practice guidance.",
  ),

  "l11.starting-notes": map(
    "l11.starting-notes",
    "Chapter Eleven, Figures 11-1 through 11-3",
    "Make every scale degree an entrance",
    [
      {
        label: "Root-to-root drills are too narrow",
        detail:
          "Traditional long scale runs begin and end on the root, but improvisation requires access to every note as a possible beginning.",
      },
      {
        label: "Start on successive scale degrees",
        detail:
          "The exercise moves the starting point through the scale so the hand experiences the same collection from different modal entrances.",
      },
      {
        label: "Reverse direction",
        detail:
          "Changing from ascending to descending motion prevents the hand from relying on one fixed motor pattern.",
      },
      {
        label: "De-program the fingers",
        detail:
          "The stated goal is to undo root-only conditioning so the scale becomes available under many melodic circumstances.",
      },
    ],
    "Source-grounded map of the flexible-start major-scale routine at the beginning of Chapter Eleven.",
  ),
  "l11.key-rotation": map(
    "l11.key-rotation",
    "Chapter Eleven, practice discussion following Figures 11-1 through 11-3",
    "Rotate the routine through keys",
    [
      {
        label: "Change key from day to day",
        detail:
          "The source suggests practicing the flexible-start exercise in a different major key on successive days rather than exhausting every key in one session.",
      },
      {
        label: "Preserve the exercise, change the pitches",
        detail:
          "The same starting-note and direction-changing routine is transferred intact while the key signature changes.",
      },
      {
        label: "Aim for equal access",
        detail:
          "The long-term purpose is to remove the special status of the most familiar keys and make the whole keyboard feel usable.",
      },
    ],
    "Source-grounded summary of the daily key-rotation plan in Chapter Eleven.",
  ),
  "l11.symmetric-practice": map(
    "l11.symmetric-practice",
    "Chapter Eleven, Figures 11-4 through 11-7",
    "Practice symmetrical scales on their own terms",
    [
      {
        label: "Diminished has eight notes",
        detail:
          "The diminished scale's eight-note structure and alternating interval pattern require a practice shape different from the seven-note major and melodic-minor routines.",
      },
      {
        label: "Whole tone has six notes",
        detail:
          "The six-note whole-tone collection likewise receives its own directional pattern rather than being forced into a major-scale template.",
      },
      {
        label: "The pattern should expose the symmetry",
        detail:
          "Practicing these scales through their characteristic interval structures helps the ear and hand recognize the symmetry directly.",
      },
    ],
    "Source-grounded map of the diminished- and whole-tone-specific scale exercises in Chapter Eleven.",
  ),
  "l11.fingering": map(
    "l11.fingering",
    "Chapter Eleven, Figures 11-8 through 11-10 and fingering discussion",
    "Use conventional fingering intelligently",
    [
      {
        label: "Traditional fingering is a strong default",
        detail:
          "The source recommends conventional scale fingerings because they have proved practical for fluent keyboard motion across the main scale families.",
      },
      {
        label: "Charts mark reliable hand landmarks",
        detail:
          "Separate fingering tables are supplied for major, melodic-minor, diminished and whole-tone scales, including useful fourth-finger anchor notes in many keys.",
      },
      {
        label: "The phrase can override the default",
        detail:
          "If the musical line stops before the normal thumb-under point or has a different range, common sense may make a different fingering more efficient.",
      },
      {
        label: "Fingering serves movement",
        detail:
          "The practical aim is comfortable, continuous playing, not obedience to a fingering pattern after it stops helping the phrase.",
      },
    ],
    "Source-grounded synthesis of the fingering charts and the explicit discussion of when conventional fingering should be adapted.",
  ),


  "l12.basic-shape": map(
    "l12.basic-shape",
    "Chapter Twelve, Figures 12-2 through 12-4",
    "Three fourths and a major third",
    [
      {
        label: "Read the chord intervallically",
        detail:
          "The basic D voicing is D-G-C-F-A. The first four notes form three perfect fourths and the final interval F-A is a major third.",
      },
      {
        label: "Chord tones remain visible",
        detail:
          "Relative to D, the same notes are root, eleventh, minor seventh, minor third and fifth, so the interval shape and the chord spelling describe the same sound from different angles.",
      },
      {
        label: "Move the shape as one object",
        detail:
          "Because the voicing is easy to recognize by spacing, it can be transposed intact while preserving its characteristic colour.",
      },
    ],
    "Source-grounded map of the interval construction and transposable five-note shape introduced at the start of Chapter Twelve.",
  ),
  "l12.inversions": map(
    "l12.inversions",
    "Chapter Twelve, Figures 12-16 and 12-17",
    "Five positions of one pitch collection",
    [
      {
        label: "Every chord tone can reach the bottom",
        detail:
          "The five-note voicing has five inversions, each keeping the same pitch classes while changing the bass and register.",
      },
      {
        label: "The major third moves through the stack",
        detail:
          "The one major third changes location in each inversion while the remaining adjacent intervals retain the fourth-based character.",
      },
      {
        label: "Use inversions for sustained harmony",
        detail:
          "When a modal chord lasts long enough, changing inversion creates movement without requiring a new harmonic function.",
      },
    ],
    "Source-grounded analysis of the five inversions and their use for sustained modal harmony at the end of Chapter Twelve.",
  ),
  "l12.parallel-motion": map(
    "l12.parallel-motion",
    "Chapter Twelve, Figures 12-10 through 12-15",
    "Move the voicing in parallel",
    [
      {
        label: "Preserve the complete shape",
        detail:
          "Parallel motion moves every note together rather than voice-leading each chord tone independently.",
      },
      {
        label: "Half steps intensify the colour",
        detail:
          "Sliding the whole structure by semitone gives each voice a chromatic neighbour at the same time, producing a strong but highly organized shift.",
      },
      {
        label: "Structure makes dissonance coherent",
        detail:
          "Repeating the same interval pattern before and after the move gives the ear a stable reference even when the passing harmony is sharply dissonant.",
      },
    ],
    "Source-grounded map of the parallel-motion examples and structural explanation in the middle of Chapter Twelve; licensed melodies are not reproduced.",
  ),
  "l12.diatonic-extension": map(
    "l12.diatonic-extension",
    "Chapter Twelve, Figure 12-7 and surrounding discussion",
    "Extend the voicing through the major scale",
    [
      {
        label: "Move each voice diatonically",
        detail:
          "The five-note structure can be shifted through the notes of C major rather than transposed by identical chromatic intervals.",
      },
      {
        label: "The interval pattern changes",
        detail:
          "Because the major scale has unequal step sizes, some derived voicings contain tritones or minor ninths instead of only perfect fourths and one major third.",
      },
      {
        label: "Modal context can absorb the tension",
        detail:
          "The resulting shapes are not all conventional minor-seventh voicings, but they can be used as deliberate modal colours over a sustained tonal area.",
      },
    ],
    "Source-grounded summary of the diatonic extension of the five-note voicing and the discussion of its more dissonant modal variants.",
  ),

  "l13.c69-fourths": map(
    "l13.c69-fourths",
    "Chapter Thirteen, Figure 13-4",
    "A six-nine chord as pure fourths",
    [
      {
        label: "Start on the third",
        detail:
          "The C six-nine voicing begins on E, the third of the chord, and rises E-A-D-G-C.",
      },
      {
        label: "Four perfect fourths",
        detail:
          "The notes form a continuous stack of perfect fourths, making the hand shape easier to remember than a list of chord degrees.",
      },
      {
        label: "Root on top",
        detail:
          "The root C appears at the top of the voicing instead of the bass, leaving the lower register open for another harmonic layer.",
      },
    ],
    "Source-grounded map of the C six-nine fourth voicing in Figure 13-4.",
  ),
  "l13.diatonic-fourths": map(
    "l13.diatonic-fourths",
    "Chapter Thirteen, Figure 13-5",
    "Extend fourth voicings through C major",
    [
      {
        label: "Move the stack through the scale",
        detail:
          "Each voice moves to the next scale degree, generating a chain of related fourth-based voicings across C major.",
      },
      {
        label: "Not every fourth stays perfect",
        detail:
          "The major scale naturally introduces the tritone F-B, so some shapes contain an augmented fourth among the otherwise quartal intervals.",
      },
      {
        label: "Tension is part of the vocabulary",
        detail:
          "The more dissonant shapes can be used selectively in modal playing to create movement and colour without changing the underlying tonal field.",
      },
    ],
    "Source-grounded map of the diatonically extended fourth voicings shown in Figure 13-5.",
  ),
  "l13.melody-omission": map(
    "l13.melody-omission",
    "Chapter Thirteen, Figure 13-6 and surrounding discussion",
    "Let the melody supply the top note",
    [
      {
        label: "Do not duplicate automatically",
        detail:
          "A five- or six-note fourth voicing can be reduced when the melody already supplies its highest chord tone.",
      },
      {
        label: "The lower structure still identifies the colour",
        detail:
          "Removing the top note leaves enough fourth-based information for the accompaniment to retain its harmonic character.",
      },
      {
        label: "Create more register choices",
        detail:
          "The reduced shape frees space near the melody and gives the pianist more practical voicing positions.",
      },
    ],
    "Source-grounded summary of the melody-note omission principle demonstrated after Figure 13-5.",
  ),
  "l13.combined-fourths": map(
    "l13.combined-fourths",
    "Chapter Thirteen, Figures 13-7 and 13-8",
    "Combine fourth voicings with different tritone placement",
    [
      {
        label: "Fourth voicings can follow one another",
        detail:
          "Successive quartal shapes retain a family resemblance even when their internal interval content is not identical.",
      },
      {
        label: "A tritone can sit high or low",
        detail:
          "Moving the augmented fourth to a different register changes the tension profile of the voicing without abandoning fourth-based harmony.",
      },
      {
        label: "Use spacing as orchestration",
        detail:
          "The position of the dissonant interval matters as much as its presence, allowing the pianist to choose a sharper or softer colour from related shapes.",
      },
    ],
    "Source-grounded map of the paired fourth voicings and tritone placement discussed in Figures 13-7 and 13-8.",
  ),

  "l14.basic-upper-structure": map(
    "l14.basic-upper-structure",
    "Chapter Fourteen, Figures 14-2 and 14-3",
    "A triad above the dominant tritone",
    [
      {
        label: "Keep the guide tones below",
        detail:
          "For C7, E and B-flat form the third-and-seventh tritone that anchors the dominant quality.",
      },
      {
        label: "Add a familiar triad",
        detail:
          "Placing D major above that tritone adds D, F-sharp and A: the ninth, sharp eleventh and thirteenth of C7.",
      },
      {
        label: "Name the structure by its triad root",
        detail:
          "Because D lies a major second above C, the D-major triad is called upper structure II.",
      },
    ],
    "Source-grounded map of the upper-structure definition and the D-major-over-C7 example.",
  ),
  "l14.basic-family": map(
    "l14.basic-family",
    "Chapter Fourteen, Figures 14-2 through 14-6",
    "Four foundational upper structures",
    [
      {
        label: "Upper structure II",
        detail:
          "D major over the C7 tritone supplies ninth, sharp eleventh and thirteenth colour.",
      },
      {
        label: "Upper structure flat VI",
        detail:
          "A-flat major over the same guide tones produces an altered dominant colour associated with the flat-six upper-triad root.",
      },
      {
        label: "Upper structure VI",
        detail:
          "A major over the C7 guide tones supplies another dominant colour whose upper-triad root is a major sixth above C.",
      },
      {
        label: "Upper structure sharp IV minor",
        detail:
          "F-sharp minor adds a minor upper triad rooted a tritone above C and is used with flat-nine/sharp-eleven dominant colour.",
      },
    ],
    "Source-grounded summary of the four upper structures introduced first in Chapter Fourteen.",
  ),
  "l14.inversions": map(
    "l14.inversions",
    "Chapter Fourteen, Figure 14-3 and inversion discussion",
    "Invert the triad while the core stays fixed",
    [
      {
        label: "The upper structure remains the same triad",
        detail:
          "Root position, first inversion and second inversion all retain the same upper-structure identity.",
      },
      {
        label: "The guide-tone core can remain stationary",
        detail:
          "Changing only the right-hand triad position alters register and top note without requiring the left-hand dominant tritone to move.",
      },
      {
        label: "Choose the inversion for the melody",
        detail:
          "The inversion whose top note and spacing best fit the melodic register is often the most useful one in practice.",
      },
    ],
    "Source-grounded map of the upper-triad inversion principle presented with Figure 14-3.",
  ),
  "l14.scale-families": map(
    "l14.scale-families",
    "Chapter Fourteen, Figures 14-14 and 14-15",
    "Trace upper structures back to scale families",
    [
      {
        label: "Lydian dominant",
        detail:
          "Upper structures such as D major over C7 can be understood as triads drawn from the Lydian-dominant collection.",
      },
      {
        label: "Altered",
        detail:
          "Other upper structures come from the altered collection and package several altered tensions into one familiar triad.",
      },
      {
        label: "Half-step/whole-step diminished",
        detail:
          "Diminished-derived upper structures organize another set of dominant-flat-nine colours from a symmetrical scale.",
      },
      {
        label: "Scale and voicing are linked",
        detail:
          "The comparison shows that upper-structure choices are not isolated tricks: each belongs to a larger chord-scale system.",
      },
    ],
    "Source-grounded synthesis of the complete upper-structure chart and the three scale families compared in Figures 14-14 and 14-15.",
  ),
  "l14.diminished-symmetry": map(
    "l14.diminished-symmetry",
    "Chapter Fourteen, Figures 14-11 and 14-17 through 14-22",
    "Move upper structures by minor thirds",
    [
      {
        label: "Diminished harmony repeats by minor third",
        detail:
          "A half-step/whole-step diminished collection reproduces the same pitch classes when its reference point moves by three semitones.",
      },
      {
        label: "Related dominants share upper material",
        detail:
          "Dominant-flat-nine chords with roots a minor third apart can use closely related or interchangeable upper structures because they come from the same diminished collection.",
      },
      {
        label: "Minor-third motion creates a voicing path",
        detail:
          "Moving upper material by minor thirds gives the pianist a systematic way to create motion through sustained or related dominant harmony.",
      },
      {
        label: "Context still decides the root",
        detail:
          "The shared collection does not erase harmonic function; the bass and progression determine which dominant interpretation is active.",
      },
    ],
    "Source-grounded map of the diminished-derived upper-structure interchangeability and minor-third motion developed in the later part of Chapter Fourteen.",
  ),


  "l15.major-pentatonic": map(
    "l15.major-pentatonic",
    "Chapter Fifteen, Figures 15-2 through 15-5",
    "Five-note major and minor centers",
    [
      {
        label: "Remove fourth and seventh",
        detail:
          "The familiar major pentatonic contains scale degrees one, two, three, five and six, omitting the fourth and seventh of the major scale.",
      },
      {
        label: "Hear the interval pattern",
        detail:
          "Its spacing is whole step, whole step, minor third, whole step before the octave closes.",
      },
      {
        label: "Rotate the same five notes",
        detail:
          "Like any scale, the pentatonic collection has modes. Starting from its fifth degree produces the commonly named minor pentatonic sound without changing the pitch set.",
      },
    ],
    "Source-grounded map of the basic pentatonic construction and modal rotation in the opening of Chapter Fifteen.",
  ),
  "l15.in-key-pentatonics": map(
    "l15.in-key-pentatonics",
    "Chapter Fifteen, Figures 15-6 through 15-9",
    "Three pentatonic collections inside one major key",
    [
      {
        label: "C, F and G stay inside C major",
        detail:
          "Major pentatonic scales rooted on C, F and G all use only notes from the C-major collection.",
      },
      {
        label: "The labels show derivation",
        detail:
          "Calling them I, IV and V pentatonic identifies their roots inside the key; the names are practical orientation rather than separate chord functions.",
      },
      {
        label: "Different roots emphasize different colour tones",
        detail:
          "Over D minor seventh, G pentatonic includes B and E, heard as the sixth and ninth of the chord, giving a more extended colour than a collection centered on the chord itself.",
      },
    ],
    "Source-grounded synthesis of the three pentatonic collections occurring naturally in C major and their use over diatonic harmony.",
  ),
  "l15.v-pentatonic-ii-v-i": map(
    "l15.v-pentatonic-ii-v-i",
    "Chapter Fifteen, Figure 15-10 and surrounding discussion",
    "One pentatonic across II-V-I",
    [
      {
        label: "Use the dominant pentatonic",
        detail:
          "In C major, G pentatonic can be retained across D minor seventh, G7 and C major rather than changing scale with every chord.",
      },
      {
        label: "The notes change function",
        detail:
          "G, A, B, D and E become different chord tones and extensions as the harmony moves underneath them.",
      },
      {
        label: "Continuity is the benefit",
        detail:
          "The five-note field gives the improvised line a common melodic language across the entire progression.",
      },
    ],
    "Source-grounded map of the V-pentatonic II-V-I strategy demonstrated in Chapter Fifteen.",
  ),
  "l15.avoid-note-derivation": map(
    "l15.avoid-note-derivation",
    "Chapter Fifteen, Figures 15-13 and 15-14",
    "Derive the pentatonic by removing friction",
    [
      {
        label: "D minor seventh accepts the C-major field",
        detail:
          "Within the C-major II-V-I discussion, the II chord does not introduce an avoid note that must be removed from the parent major collection.",
      },
      {
        label: "G7 makes C the strongest clash",
        detail:
          "On the dominant, the fourth C is the note singled out for special care.",
      },
      {
        label: "C major seventh makes F the strongest clash",
        detail:
          "On the tonic major-seventh chord, the fourth F creates the corresponding sustained friction.",
      },
      {
        label: "Remove C and F",
        detail:
          "Deleting those two notes from C major leaves D, E, G, A and B: exactly the G-major-pentatonic pitch set.",
      },
    ],
    "Source-grounded derivation of the V pentatonic from the avoid-note discussion near the end of the main pentatonic section.",
  ),
  "l15.other-five-note-scales": map(
    "l15.other-five-note-scales",
    "Chapter Fifteen, Figures 15-17 through 15-21",
    "In-sen and altered pentatonic colours",
    [
      {
        label: "In-sen uses uneven spacing",
        detail:
          "The E in-sen example uses E, F, A, B and D, producing half step, major third, whole step and minor third.",
      },
      {
        label: "In-sen links to larger scales",
        detail:
          "The collection can be derived from both major and melodic-minor material depending on which note is treated as the parent-scale reference.",
      },
      {
        label: "Altered pentatonic changes the final step",
        detail:
          "The E altered-pentatonic example uses E, F, A, B and C-sharp, changing the last interval to a whole step.",
      },
      {
        label: "Melodic minor supplies the altered form",
        detail:
          "The altered pentatonic is presented as a five-note subset derived from the second degree of melodic minor and used over altered dominant colour.",
      },
    ],
    "Source-grounded map of the alternative five-note scales presented after the major-pentatonic material in Chapter Fifteen.",
  ),

  "l16.mixed-voicing-ii-v-i": map(
    "l16.mixed-voicing-ii-v-i",
    "Chapter Sixteen, Figures 16-1 through 16-6",
    "Combine voicing systems inside one progression",
    [
      {
        label: "Start with a So What minor voicing",
        detail:
          "The II chord can use the five-note fourth-based voicing learned earlier rather than a conventional rootless shell.",
      },
      {
        label: "Switch to an upper-structure dominant",
        detail:
          "The V chord can use an upper-structure voicing, including altered or flat-nine colour, without requiring the same construction as the II chord.",
      },
      {
        label: "Resolve into a fourth-based tonic",
        detail:
          "The I chord can use a quartal major voicing, creating three distinct construction methods across one II-V-I.",
      },
      {
        label: "Judge the result by connection",
        detail:
          "The chapter emphasizes smooth voice leading and a convincing harmonic background rather than loyalty to one voicing formula.",
      },
    ],
    "Source-grounded synthesis of the mixed So What, upper-structure and fourth-voicing II-V-I examples at the start of Chapter Sixteen.",
  ),
  "l16.diminished-motion": map(
    "l16.diminished-motion",
    "Chapter Sixteen, Figures 16-6 through 16-11",
    "Move dominant voicings by minor thirds",
    [
      {
        label: "Flat-nine harmony draws from diminished symmetry",
        detail:
          "Dominant flat-nine voicings can be related through the same half-step/whole-step diminished collection used earlier.",
      },
      {
        label: "Minor-third motion preserves the pitch field",
        detail:
          "Moving upper material by three semitones rotates the same diminished resources into a new voicing position.",
      },
      {
        label: "Use the motion inside one dominant area",
        detail:
          "The symmetry creates internal movement while the guide tones and bass context continue to define the dominant function.",
      },
    ],
    "Source-grounded map of the minor-third diminished motion developed in the early-middle part of Chapter Sixteen.",
  ),
  "l16.double-diminished": map(
    "l16.double-diminished",
    "Chapter Sixteen, Figures 16-9 through 16-11",
    "Two diminished chords make one eight-note field",
    [
      {
        label: "Give each hand a diminished seventh chord",
        detail:
          "One hand can play a diminished-seventh chord while the other hand plays the complementary diminished-seventh chord from the same scale.",
      },
      {
        label: "The two sets interlock",
        detail:
          "The hands do not merely duplicate each other; their pitch classes fill the alternating gaps of the eight-note diminished collection.",
      },
      {
        label: "The combined sonority contains the whole scale",
        detail:
          "Together the two four-note shapes sound all eight notes of the diminished scale at once, turning a scale into a dense keyboard voicing.",
      },
    ],
    "Source-grounded analysis of the double-diminished sonority and diminished-scale coverage described around Figures 16-9 through 16-11.",
  ),
  "l16.three-note-bite": map(
    "l16.three-note-bite",
    "Chapter Sixteen, Figure 16-31 and surrounding discussion",
    "Compact half-step voicing formulas",
    [
      {
        label: "Major seventh uses seventh-root-third",
        detail:
          "On a major-seventh chord, the compact cell uses the seventh, root and third, producing a bottom half step followed by a major third.",
      },
      {
        label: "Other major-scale harmony uses three key degrees",
        detail:
          "For II, V, suspended, Phrygian and Lydian-related chords, the formula uses the third, fourth and sixth degrees of the parent major key.",
      },
      {
        label: "Melodic minor uses second-third-fifth",
        detail:
          "For chords derived from melodic minor, the corresponding compact cell uses the second, third and fifth degrees of the melodic-minor key.",
      },
      {
        label: "Dominant flat-nine tightens the upper interval",
        detail:
          "Dominant-flat-nine cells keep the bottom semitone but use a minor third above it, distinguishing them from the half-step-plus-major-third family.",
      },
    ],
    "Source-grounded map of the three-note 'bite' voicing rules summarized in Figure 16-31.",
  ),


  "l17.stride-pulse": map(
    "l17.stride-pulse",
    "Chapter Seventeen - Figures 17-1 through 17-3",
    "Bass on strong beats, chords between",
    [
      {
        label: "Bass and chord have separate jobs",
        detail:
          "Stride places a low root or fifth on beats one and three and answers it with a higher triad or seventh-chord voicing on beats two and four.",
      },
      {
        label: "The leap is part of the texture",
        detail:
          "The left hand covers a wide register because it alternates between bass function and chord function instead of holding one compact voicing.",
      },
      {
        label: "Later stride uses richer chord shapes",
        detail:
          "The same rhythmic design can use more modern left-hand voicings on the chord beats without changing the low-high-low-high pulse.",
      },
      {
        label: "Pedal is not the engine",
        detail:
          "The chapter recommends practicing the motion without depending on sustain, so the hand learns to connect the rhythm cleanly on its own.",
      },
    ],
    "Source-grounded map of the basic stride pattern and its modernization at the opening of Chapter Seventeen.",
  ),
  "l17.walking-tenths": map(
    "l17.walking-tenths",
    "Chapter Seventeen - Figures 17-4 through 17-6",
    "Walking tenths as two moving outer voices",
    [
      {
        label: "A tenth joins bass and upper voice",
        detail:
          "Walking tenths pair a moving bass with an upper note roughly a tenth above it, creating a compact contrapuntal alternative to bass-chord stride.",
      },
      {
        label: "The outer-note pattern is the memory aid",
        detail:
          "The text recommends first hearing and memorizing the top and bottom contours rather than reducing the passage to abstract chord labels.",
      },
      {
        label: "Chromatic motion can be easier to remember",
        detail:
          "A line whose upper notes move chromatically can form a strong visual and aural pattern even when the chord-by-chord analysis is more complicated.",
      },
      {
        label: "Do not force an impossible span",
        detail:
          "When the hand cannot comfortably reach a tenth, the notes may be arpeggiated or released; musical continuity matters more than holding every interval physically.",
      },
    ],
    "Source-grounded synthesis of the walking-tenths discussion and memorization advice in Chapter Seventeen.",
  ),
  "l17.within-bar-harmony": map(
    "l17.within-bar-harmony",
    "Chapter Seventeen - Figure 17-7",
    "Add harmonic motion without changing the stride frame",
    [
      {
        label: "A tonic bar can contain more than tonic",
        detail:
          "A bar with one major-seventh chord can be enriched by introducing another harmony on a later beat while the stride rhythm continues.",
      },
      {
        label: "II can enter on beat three",
        detail:
          "One option inserts the minor-seventh chord on scale degree two on the third beat before returning to the larger progression.",
      },
      {
        label: "V can enter on beat three",
        detail:
          "A second option uses the dominant on the third beat as the added colour.",
      },
      {
        label: "II-V can fill beats three and four",
        detail:
          "The fullest option places II on beat three and V on beat four, creating a short turnaround inside a bar that still retains the stride pulse.",
      },
    ],
    "Source-grounded map of the three harmonic-enrichment options shown in Figure 17-7.",
  ),
  "l17.bud-powell-shells": map(
    "l17.bud-powell-shells",
    "Chapter Seventeen - Bud Powell voicings discussion and Figures 17-16 through 17-24",
    "Sparse low left-hand harmony for bebop",
    [
      {
        label: "The voicings are skeletal",
        detail:
          "Bud Powell-style left-hand chords often use only two notes, sometimes three, rather than the denser four-note rootless voicings developed later.",
      },
      {
        label: "Roots and defining intervals dominate",
        detail:
          "The common ingredients are roots, thirds or tenths, sixths and sevenths - enough information to imply the chord without filling the middle register.",
      },
      {
        label: "Lower placement creates right-hand space",
        detail:
          "Because these voicings sit lower on the keyboard, the right hand can use a much wider melodic range around and below middle C.",
      },
      {
        label: "Different shell choices can support the same line",
        detail:
          "The chapter compares several Bud Powell left-hand variants under the same bebop melody, showing that there is no single mandatory shell for each chord.",
      },
    ],
    "Source-grounded map of the Bud Powell voicing concept and the comparative examples in the second half of Chapter Seventeen.",
  ),

  "l18.minor-sixth": map(
    "l18.minor-sixth",
    "Chapter Eighteen - Figures 18-1 through 18-9",
    "Root, third, fifth and sixth from melodic minor",
    [
      {
        label: "The four notes outline minor sixth",
        detail:
          "A minor-sixth four-note scale selects root, minor third, fifth and natural sixth from a melodic-minor key.",
      },
      {
        label: "The pattern can move quickly",
        detail:
          "Because only four notes are involved, the collection can be cascaded rapidly through registers or carried through chord changes without sounding like a full seven-note scale run.",
      },
      {
        label: "The same notes can become altered dominant colour",
        detail:
          "A minor-sixth scale built on a dominant root can also supply root, sharp ninth, fifth and thirteenth over a dominant sharp-nine chord.",
      },
      {
        label: "Related blues materials overlap",
        detail:
          "The chapter compares minor-sixth, minor-pentatonic and blues-scale lines over dominant sharp-nine harmony because their pitch content and blues colour overlap strongly.",
      },
    ],
    "Source-grounded synthesis of the minor-sixth four-note scale and its early applications in Chapter Eighteen.",
  ),
  "l18.major-key-application": map(
    "l18.major-key-application",
    "Chapter Eighteen - Figures 18-10 through 18-13",
    "Minor-sixth cells inside major and melodic-minor harmony",
    [
      {
        label: "Build on scale degree two",
        detail:
          "In major-scale harmony, the minor-sixth collection built on the second degree can be played over several chords derived from the parent major key.",
      },
      {
        label: "The tonic exposes the natural fourth",
        detail:
          "Over a major-seventh tonic, the degree-two minor-sixth collection contains the parent scale's fourth, which can become the most exposed note in the line.",
      },
      {
        label: "Build on scale degree six for the tonic",
        detail:
          "A minor-sixth collection from the sixth degree replaces that natural fourth with the raised fourth, changing the tonic toward Lydian colour.",
      },
      {
        label: "One melodic-minor cell can cross many derived chords",
        detail:
          "When the same four-note collection comes from one melodic-minor parent, it may be retained across multiple chord qualities derived from that parent scale.",
      },
    ],
    "Source-grounded map of the major-key and melodic-minor applications surrounding Figures 18-10 through 18-13.",
  ),
  "l18.diminished-subsets": map(
    "l18.diminished-subsets",
    "Chapter Eighteen - Figure 18-14",
    "Invent four notes inside diminished symmetry",
    [
      {
        label: "There is no single diminished four-note formula",
        detail:
          "The eight-note diminished scale contains many possible four-note subsets, and the chapter explicitly encourages inventing combinations that sound good.",
      },
      {
        label: "Symmetry multiplies the uses",
        detail:
          "A chosen subset belongs to a scale that repeats under minor-third transposition, so related dominant-flat-nine chords can share the same melodic material.",
      },
      {
        label: "Ear quality still decides",
        detail:
          "The theoretical relationship is only a starting point; the subset should be retained because its melodic sound works in context.",
      },
    ],
    "Source-grounded map of the diminished four-note-scale invitation and its symmetrical dominant applications.",
  ),
  "l18.melodic-minor-cells": map(
    "l18.melodic-minor-cells",
    "Chapter Eighteen - Figures 18-23 and 18-24",
    "Two cells characteristic of one melodic-minor key",
    [
      {
        label: "First cell uses 1-3-5-7",
        detail:
          "The first four-note collection selects root, third, fifth and seventh from melodic minor.",
      },
      {
        label: "Second cell uses 3-5-7-9",
        detail:
          "The second begins on the third and continues with fifth, seventh and ninth, sharing three notes with the first cell.",
      },
      {
        label: "Their interval content is distinctive",
        detail:
          "The text notes that these exact four-note combinations occur only in the key of that melodic-minor parent rather than in major, diminished or whole-tone scales.",
      },
      {
        label: "Exceptions can improve the line",
        detail:
          "The application example occasionally departs from the strict four-note sets because an absolutely consistent pattern can sound too perfect and less musical.",
      },
    ],
    "Source-grounded synthesis of the two characteristic melodic-minor cells and their flexible application in Chapter Eighteen.",
  ),
  "l18.invent-and-rotate": map(
    "l18.invent-and-rotate",
    "Chapter Eighteen - Figure 18-25 and concluding discussion",
    "Generate possibilities, then let the ear decide",
    [
      {
        label: "Four-note possibilities are enormous",
        detail:
          "The chapter closes by noting that only a small fraction of theoretically possible four-note scales sound useful in actual music.",
      },
      {
        label: "Select four notes from a parent scale",
        detail:
          "One practical search method is to choose four notes from a familiar scale such as C major and treat them as a new melodic cell.",
      },
      {
        label: "Practice every rotation",
        detail:
          "Each chosen set has four modal starting points, and practicing all of them reveals different contours and tonal emphases inside the same pitch collection.",
      },
      {
        label: "The final test is musical",
        detail:
          "After trying the collection over chords, the only decisive question is whether it sounds good enough to keep using.",
      },
    ],
    "Source-grounded map of the experimental four-note-scale method at the end of Chapter Eighteen.",
  ),


  "l19.four-way-close": map(
    "l19.four-way-close",
    "Chapter Nineteen - Figures 19-3 through 19-5",
    "Close-position block chords with diminished passing harmony",
    [
      {
        label: "Harmonize every melody attack",
        detail:
          "Block-chord playing moves the harmony in the same rhythm as the melody so each important melodic note carries its own voicing.",
      },
      {
        label: "Four-way close keeps the melody on top",
        detail:
          "The basic four-note version places three harmony notes directly beneath the melody, creating compact locked motion.",
      },
      {
        label: "Diminished chords fill the passing notes",
        detail:
          "Chromatic notes can be added to the scale so stable sixth or seventh chords alternate with diminished-seventh passing chords instead of producing repeated chord types.",
      },
      {
        label: "The diminished chord can be heard as dominant flat nine",
        detail:
          "The passing diminished pitch set is often equivalent to a rootless dominant-flat-nine chord, which explains its smooth pull back toward the stable harmony.",
      },
    ],
    "Source-grounded synthesis of the four-way-close scale patterns, added chromatic passing note, and disguised dominant-flat-nine explanation in the opening block-chord section.",
  ),
  "l19.shearing": map(
    "l19.shearing",
    "Chapter Nineteen - Figures 19-6 and 19-7",
    "Double the melody below the close-position chord",
    [
      {
        label: "Start from four-way close",
        detail:
          "The right hand keeps the compact four-note block chord with the melody as the highest note.",
      },
      {
        label: "Duplicate the melody one octave lower",
        detail:
          "The left hand adds the melody note an octave below, creating a five-note texture associated with George Shearing's locked-hands sound.",
      },
      {
        label: "Both hands move as one rhythmic unit",
        detail:
          "The lower melody double strengthens the line while the two hands continue to attack in the same rhythm.",
      },
    ],
    "Source-grounded map of the doubled-melody locked-hands texture presented immediately after the basic four-way-close examples.",
  ),
  "l19.drop-two": map(
    "l19.drop-two",
    "Chapter Nineteen - Figure 19-8 and practice discussion",
    "Open four-way close into drop 2",
    [
      {
        label: "Count from the melody downward",
        detail:
          "Drop 2 begins with a close-position voicing and identifies the second note from the top.",
      },
      {
        label: "Lower that note one octave",
        detail:
          "Moving the second-highest note down an octave spreads the same chord tones over a wider range without changing chord quality.",
      },
      {
        label: "The dropped note often moves to the left hand",
        detail:
          "The wider spacing makes a natural two-hand distribution and produces a fuller, more orchestral block-chord sound.",
      },
      {
        label: "Practice the families through keys",
        detail:
          "The chapter recommends drilling major-sixth, minor-sixth, minor-seventh, dominant-seventh, minor-major and major-seventh drop-2 families until the locations are automatic.",
      },
    ],
    "Source-grounded summary of the drop-2 transformation and the chapter's practice routine for learning the major block-chord families.",
  ),
  "l19.chromatic-parallelism": map(
    "l19.chromatic-parallelism",
    "Chapter Nineteen - Figures 19-29 through 19-34",
    "Parallel and chromatic approach motion",
    [
      {
        label: "Treat the drop-2 voicing as a movable shape",
        detail:
          "Entire block-chord shapes can move in parallel rather than voice-leading every note independently.",
      },
      {
        label: "Approach from a half step below",
        detail:
          "A target chord can be preceded by the same shape displaced down a semitone so all voices resolve upward together.",
      },
      {
        label: "Approach from a half step above",
        detail:
          "The same device works from above, producing a compact chromatic resolution into the destination voicing.",
      },
      {
        label: "Melodic-minor colour can supply altered approaches",
        detail:
          "When the harmony comes from melodic minor, the chapter recommends thinking from the parent key so parallel drop-2 and altered-dominant colours remain connected.",
      },
    ],
    "Source-grounded map of the later drop-2 parallelism, chromatic-approach, and melodic-minor applications in Chapter Nineteen.",
  ),

  "l20.clave": map(
    "l20.clave",
    "Chapter Twenty - Figures 20-3 through 20-8",
    "The two-bar clave framework",
    [
      {
        label: "Clave organizes the entire texture",
        detail:
          "The chapter treats son clave as the central two-bar rhythmic framework that every salsa component must understand.",
      },
      {
        label: "Forward clave is 3-2",
        detail:
          "The three-attack side comes first: beat one, the and of two, and beat four, followed by beats two and three in the second bar.",
      },
      {
        label: "Reverse clave is 2-3",
        detail:
          "The same two rhythmic halves are reversed so the two-attack bar precedes the three-attack bar.",
      },
      {
        label: "Melody can imply the direction",
        detail:
          "When adapting jazz material, the melody's accents often suggest whether forward or reverse clave fits; if neither fits, a small rhythmic alteration may be necessary.",
      },
    ],
    "Source-grounded map of son-clave direction and the discussion of adapting melodic rhythm to clave.",
  ),
  "l20.montuno": map(
    "l20.montuno",
    "Chapter Twenty - Figures 20-11 through 20-20",
    "A repeated offbeat piano engine",
    [
      {
        label: "Montuno is an ostinato",
        detail:
          "The piano montuno is a repeated rhythmic-melodic figure that may last two, four or more bars.",
      },
      {
        label: "Offbeats dominate the pattern",
        detail:
          "The chapter's basic examples place many attacks on the ands, with ties carrying notes across beat or bar boundaries.",
      },
      {
        label: "Do not keep rewriting the groove",
        detail:
          "Once the montuno is established, it normally continues until a new section rather than changing every bar.",
      },
      {
        label: "Clave direction changes the placement",
        detail:
          "Reverse and forward clave produce related but differently placed montuno patterns, so the accompaniment must remain aligned with the active clave.",
      },
    ],
    "Source-grounded synthesis of the basic montuno rhythm, offbeat counting, repetition, and forward/reverse-clave examples.",
  ),
  "l20.harmonic-montunos": map(
    "l20.harmonic-montunos",
    "Chapter Twenty - Figures 20-15 through 20-25",
    "Preserve the groove while harmony changes",
    [
      {
        label: "One rhythm can serve several chord qualities",
        detail:
          "The same montuno pattern is shown over minor-sixth, minor-seventh and dominant-seventh chords.",
      },
      {
        label: "Simple progressions are common",
        detail:
          "The chapter applies montunos to I-V and other compact harmonic loops instead of requiring dense jazz harmony.",
      },
      {
        label: "Tenths can replace octaves",
        detail:
          "Montunos may be voiced with tenths rather than octave doubling, widening the harmonic sound while preserving the rhythm.",
      },
      {
        label: "Groove outranks constant variation",
        detail:
          "Changing a montuno too frequently breaks the pocket; the chapter explicitly prioritizes establishing a stable dance groove.",
      },
    ],
    "Source-grounded map of the chord-quality, progression, and tenth-based montuno variants in the middle of Chapter Twenty.",
  ),
  "l20.tumbao-lock": map(
    "l20.tumbao-lock",
    "Chapter Twenty - Figures 20-26 through 20-30",
    "Interlock piano and bass patterns",
    [
      {
        label: "Each rhythm-section instrument has its own pattern",
        detail:
          "Piano, bass, percussion and other parts are described as complementary pieces that fit together rather than duplicate a common rhythm.",
      },
      {
        label: "The bass pattern is a tumbao",
        detail:
          "The tumbao commonly emphasizes beat four and anticipates the next harmony, creating a forward-moving bass role.",
      },
      {
        label: "Selected attacks coincide",
        detail:
          "The chapter's practice exercise aligns piano and bass at specific points such as the and of two while leaving many other attacks separate.",
      },
      {
        label: "Practice both hands to learn the lock",
        detail:
          "Playing tumbao in the left hand and montuno in the right is recommended as a coordination exercise even though a real ensemble pianist would usually leave the bass line to the bassist.",
      },
    ],
    "Source-grounded map of the tumbao, montuno-tumbao coordination, and two-hand practice strategy.",
  ),
  "l20.rhythmic-soloing": map(
    "l20.rhythmic-soloing",
    "Chapter Twenty - Figures 20-31 and 20-32",
    "Solo with rhythmic weight",
    [
      {
        label: "Rhythm carries the solo",
        detail:
          "The chapter recommends giving rhythmic shape more importance than continuous melodic detail when soloing over a dense salsa rhythm section.",
      },
      {
        label: "Octaves increase projection",
        detail:
          "Octave lines provide enough weight to remain audible without relying on a constant stream of single notes.",
      },
      {
        label: "Large chords can function as rhythmic attacks",
        detail:
          "Chordal figures and repeated punches become part of the improvisational vocabulary alongside octaves.",
      },
      {
        label: "Leave space inside the groove",
        detail:
          "The aim is not maximum density but a strong pattern of attacks and rests that sits clearly inside the ensemble rhythm.",
      },
    ],
    "Source-grounded summary of the chapter's rhythm-first advice for salsa piano solos.",
  ),

};

export function getLevineSourceMaterial(
  id: string,
): LevineSourceMaterial | undefined {
  return levineSourceMaterial[id];
}
