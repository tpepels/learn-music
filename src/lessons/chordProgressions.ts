import { Chord } from "tonal";
import { exerciseContentSchema, lessonContentSchema, type LessonDefinition } from "./types";

const lesson = lessonContentSchema.parse({
  id: "harmony.chords",
  number: 4,
  title: "Chords & progressions",
  eyebrow: "Piano · Harmony",
  hero: "Hear what chords do inside a phrase.",
  description:
    "Meet I, IV, and V as harmonic functions, then use them under the groove and melody you already made, compare two kinds of ending, and turn the same chords into accompaniment.",
  overview:
    "A chord is a harmonic identity, not a command to strike every note at once. In C major, I establishes home, IV moves away from it, and V creates expectation. Those functions remain recognizable when the notes are blocked, pulsed, broken, or arpeggiated.",
});

const cMajor = Chord.get("C");
const fMajor = Chord.get("F");
const gMajor = Chord.get("G");

export const chordProgressionLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.a",
        letter: "A",
        title: "Meet I, IV, and V",
        learn: "Recognise the three primary major-key functions before using them in a song.",
        explanation:
          "C major contains C-E-G, F major contains F-A-C, and G major contains G-B-D. In the key of C, these are I, IV, and V. I is the strongest point of rest, IV moves away from home, and V creates the strongest expectation of returning to I.",
        instruction:
          "Put C, F, and G in bars 1-3 and audition them. Keep the accompaniment on Block for now. Listen for home, departure, and expectation rather than only reading the symbols.",
        recognition:
          "C should feel settled. F should feel like movement away from that centre. G should feel comparatively unfinished, especially after you have heard C as home.",
        terms: [
          { term: "Chord", definition: "A collection of pitches heard as one harmonic identity." },
          { term: "Triad", definition: "A three-note chord built from a root, third, and fifth." },
          { term: "Harmonic function", definition: "The role a chord plays in creating stability, departure, tension, or resolution." },
          { term: "Roman numeral", definition: "A chord name based on its scale degree and function inside a key." },
        ],
        workspace: "chords",
        checksLabel: "Discover",
        successLabel: "I, IV, and V are mapped",
      }),
      evaluate: ({ chordProgression }) => [
        { label: "I: C major is in bar 1", complete: chordProgression[0] === "C" },
        { label: "IV: F major is in bar 2", complete: chordProgression[1] === "F" },
        { label: "V: G major is in bar 3", complete: chordProgression[2] === "G" },
        {
          label: "The three triads are C-E-G, F-A-C, and G-B-D",
          complete:
            cMajor.notes.join("-") === "C-E-G" &&
            fMajor.notes.join("-") === "F-A-C" &&
            gMajor.notes.join("-") === "G-B-D",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.b",
        letter: "B",
        title: "Complete the phrase",
        learn: "Use harmonic function underneath rhythm and melody rather than as isolated chord symbols.",
        explanation:
          "The loop now combines the groove and melody from the earlier lessons with root bass and your chord lane. Harmonic function is easier to hear when the chords have a job inside a phrase: I establishes the centre, IV creates departure, V prepares the ending, and I answers it.",
        instruction:
          "Keep playback running. Complete the four bars as C-F-G-C. Before settling there, swap F and G once and listen to how the phrase direction changes. Then leave IV before V so the final V-I sounds prepared.",
        recognition:
          "With F before G, the middle of the phrase should feel as if it opens outward and then tightens toward the final C. The last C should sound like an answer to the G before it.",
        terms: [
          { term: "Progression", definition: "An ordered sequence of harmonic identities across time." },
          { term: "Predominant", definition: "Harmony such as IV that commonly moves away from tonic and prepares dominant." },
          { term: "Dominant", definition: "Harmony such as V that creates strong expectation of tonic." },
          { term: "Resolution", definition: "Movement from a less stable sound into a more stable one." },
        ],
        workspace: "harmony-song",
        checksLabel: "Apply",
        successLabel: "The harmony now shapes a complete musical phrase",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "The phrase moves I → IV → V → I",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "F" &&
            chordProgression[2] === "G" &&
            chordProgression[3] === "C",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.c",
        letter: "C",
        title: "Change the ending",
        learn: "Hear closure as a musical consequence, not as a memorised V-I formula.",
        explanation:
          "After V, the ear strongly expects I. Replacing that expected tonic with vi keeps some shared notes but avoids full closure. This is a deceptive resolution: the dominant has moved somewhere plausible without delivering the arrival you were prepared to hear.",
        instruction:
          "Change only the final chord from C to Am, making C-F-G-Am. Compare that ending with the V-I ending you just heard. Notice that the same groove and melody now sit inside a phrase that stays more open.",
        recognition:
          "G-to-C should feel more final. G-to-Am should redirect the expectation and keep the loop moving instead of giving the same sense of arrival.",
        terms: [
          { term: "Cadence", definition: "A harmonic or melodic gesture that marks a pause, arrival, or ending." },
          { term: "V-I cadence", definition: "Dominant moving to tonic, producing a strong tonal arrival." },
          { term: "Deceptive resolution", definition: "Dominant moving somewhere other than the expected tonic, commonly V to vi." },
          { term: "Closure", definition: "The degree to which a musical phrase sounds finished." },
        ],
        workspace: "harmony-song",
        checksLabel: "Compare",
        successLabel: "You changed the phrase from closed to deliberately open",
      }),
      evaluate: ({ chordProgression }) => [
        {
          label: "The dominant now resolves deceptively to vi",
          complete:
            chordProgression[0] === "C" &&
            chordProgression[1] === "F" &&
            chordProgression[2] === "G" &&
            chordProgression[3] === "Am",
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "harmony.chords.d",
        letter: "D",
        title: "Turn harmony into accompaniment",
        learn: "Separate a chord's harmonic identity from the way its notes are performed.",
        explanation:
          "C major remains C major whether C-E-G arrive together, repeat as pulses, alternate as broken chord tones, or cycle as an arpeggio. Harmony tells you which pitch collection and function is active; accompaniment pattern tells you how that harmony becomes rhythm and texture.",
        instruction:
          "Bring the phrase back home on C. Keep C at both ends and use F and G somewhere in the middle. Then choose Pulse, Broken, or Arpeggio instead of Block. Leave the pattern that best fits the groove and melody.",
        recognition:
          "The chord names and functions should remain clear even though the surface rhythm changes. A useful accompaniment supports the groove and melody rather than sounding like four isolated theory examples.",
        terms: [
          { term: "Accompaniment", definition: "Musical material that supports the main line or texture." },
          { term: "Broken chord", definition: "Chord tones played separately instead of simultaneously." },
          { term: "Arpeggio", definition: "A chord performed as an ordered sequence of its notes." },
          { term: "Voicing", definition: "The register and ordering used to distribute the notes of a chord." },
        ],
        workspace: "harmony-song",
        checksLabel: "Create",
        successLabel: "The progression now behaves like accompaniment inside a song",
      }),
      evaluate: ({ chordProgression, accompanimentPattern }) => {
        const middle = chordProgression.slice(1, 3);
        return [
          {
            label: "The phrase starts and ends on tonic C",
            complete: chordProgression[0] === "C" && chordProgression[3] === "C",
          },
          {
            label: "IV and V both appear in the middle of the phrase",
            complete: middle.includes("F") && middle.includes("G"),
          },
          {
            label: "Harmony is performed as more than four block chords",
            complete: accompanimentPattern !== "block",
          },
        ];
      },
    },
  ],
};
