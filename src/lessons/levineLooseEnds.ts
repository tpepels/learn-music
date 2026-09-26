import { changedControl, heardPlayback, studiedSource } from "./learningEvidence";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function sameNotes(actual: number[] | undefined, expected: number[]): boolean {
  if (!actual || actual.length !== expected.length) return false;
  const left = [...actual].sort((a, b) => a - b);
  const right = [...expected].sort((a, b) => a - b);
  return left.every((note, index) => note === right[index]);
}

function exactStudy(
  sequence: LessonContext["harmonySequence"],
  entries: Array<[number, number[]]>,
): boolean {
  const expectedSteps = new Set(entries.map(([step]) => step));
  return (
    entries.every(([step, notes]) => sameNotes(sequence[step], notes)) &&
    sequence.every((notes, step) => notes.length === 0 || expectedSteps.has(step))
  );
}

function melodicLine(notes: number[], offset = 0): Array<[number, number[]]> {
  return notes.map((note, index) => [offset + index, [note]]);
}

const lesson = lessonContentSchema.parse({
  id: "levine.loose-ends",
  number: 22,
  title: "Loose ends",
  eyebrow: "Jazz Piano · Chapter 22",
  hero: "Connect several advanced colours that do not fit one tidy category: three sus families, Aeolian harmony, uncommon melodic-minor modes, major-third cycles and harmonic major.",
  description:
    "Compare three G-sus pitch fields, reharmonize minor II chords with melodic-minor sus harmony, distinguish Aeolian VI from dominant VI, explore the fifth mode of melodic minor, build a major-third-cycle turnaround and hear harmonic major.",
  overview:
    "The unifying lesson is flexibility. Chord symbols can be incomplete, the same symbol can imply different parent scales, and some sounds have no universally agreed name. Theory narrows the possibilities, but the ear and the surrounding bass and melody decide which interpretation is useful.",
});

export const levineLooseEndsLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "levine.loose-ends.a",
        letter: "A",
        title: "Compare three sus pitch fields on G",
        learn:
          "Hear G Mixolydian, G Phrygian and the second mode of F melodic minor as three different scale choices for sus-family harmony.",
        explanation:
          "All three sounds can support a G-sus function that resolves toward C, but their upper notes are not identical. G Mixolydian is G-A-B-C-D-E-F. G Phrygian changes A, B and E to A-flat, B-flat and E-flat. The second mode of F melodic minor keeps A-flat and B-flat but restores E-natural.\n\nThat last E-natural is the natural thirteenth. It removes the flat-thirteenth note that can sound exposed in the Phrygian version.",
        instruction:
          "Study the three sus families. Clear the grid. Write G3-A3-B3-C4-D4-E4-F4-G4 on steps 1-8. Write G3-A-flat3-B-flat3-C4-D4-E-flat4-F4-G4 on steps 9-16. Write G3-A-flat3-B-flat3-C4-D4-E4-F4-G4 on steps 17-24. Put C major seventh C3-E3-G3-B3 on step 25 as the common resolution, then play the loop.",
        recognition:
          "Can you hear the final E-natural distinguish melodic-minor sus colour from the darker Phrygian version?",
        source: {
          reference: "Chapter Twenty-Two - Figures 22-1 through 22-4",
          focus:
            "Three sus-family sounds are compared on G: Mixolydian sus, Phrygian sus-flat-nine, and sus-flat-nine from the second mode of melodic minor, all resolving to C.",
          exampleIds: ["l22.sus-families"],
        },
        terms: [
          {
            term: "Second mode of melodic minor",
            definition:
              "A mode beginning on scale degree two of melodic minor; here it produces sus-flat-nine colour with a natural thirteenth.",
          },
          {
            term: "Natural thirteenth",
            definition:
              "The major sixth above the chord root, heard as a thirteenth when used as an upper extension.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare three G-sus scale families",
        successLabel: "You heard one altered scale degree separate Phrygian and melodic-minor sus colour",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the three sus families",
          complete: studiedSource(experiments, "l22.sus-families"),
        },
        {
          label: "All three scales and the C-major resolution are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([55,57,59,60,62,64,65,67]),
            ...melodicLine([55,56,58,60,62,63,65,67], 8),
            ...melodicLine([55,56,58,60,62,64,65,67], 16),
            [24,[48,52,55,59]],
          ]),
        },
        {
          label: "You entered all three pitch fields",
          complete: changedControl(experiments, "harmony.note-edit", 28),
        },
        {
          label: "You listened through the common resolution",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.loose-ends.b",
        letter: "B",
        title: "Replace the minor II with sus-flat-nine colour",
        learn:
          "Compare E minor seventh - A7 - D major with A sus-flat-nine - A7 - D major.",
        explanation:
          "A melodic-minor sus chord can reharmonize a minor II chord by shifting the ear toward the following dominant before the dominant third actually appears. Over an E-minor-seven to A7 to D-major progression, A sus-flat-nine from G melodic minor can replace E minor seven.\n\nThe sus voicing keeps A as the bass and uses D instead of the dominant third C-sharp. The following A7 flat nine then introduces C-sharp and resolves normally to D.",
        instruction:
          "Study the sus reharmonization. Clear the grid. In bar 1 write E3-G3-B3-D4 on step 1, C-sharp3-G3-B-flat3-E4 on step 5, and D3-F-sharp3-A3-C-sharp4 on step 7. In bar 3 replace the E-minor chord with A2-D3-G3-B-flat3-E4 on step 17, then write A2-C-sharp3-G3-B-flat3-E4 on step 21 and the same D-major chord on step 23. Play both versions.",
        recognition:
          "Does the sus-flat-nine version sound as though the dominant area begins earlier while the final resolution remains intact?",
        source: {
          reference: "Chapter Twenty-Two - Figures 22-5 through 22-8",
          focus:
            "Second-mode melodic-minor sus-flat-nine harmony is used as a colour in recordings and can replace a minor II chord before the following dominant.",
          exampleIds: ["l22.sus-reharm"],
        },
        terms: [
          {
            term: "Sus-flat-nine",
            definition:
              "Suspended dominant-family harmony containing a flat ninth while withholding the ordinary major third.",
          },
          {
            term: "Reharmonize",
            definition:
              "Replace an expected chord or progression with another harmony that preserves the larger musical direction.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare original and sus reharmonized II-V-I",
        successLabel: "You shifted the start of the dominant colour without changing the destination",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the sus-flat-nine reharmonization",
          complete: studiedSource(experiments, "l22.sus-reharm"),
        },
        {
          label: "Original and reharmonized progressions are written",
          complete: exactStudy(harmonySequence, [
            [0,[52,55,59,62]],[4,[49,55,58,64]],[6,[50,54,57,61]],
            [16,[45,50,55,58,64]],[20,[45,49,55,58,64]],[22,[50,54,57,61]],
          ]),
        },
        {
          label: "You entered both progressions",
          complete: changedControl(experiments, "harmony.note-edit", 26),
        },
        {
          label: "You listened to the earlier dominant pull",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.loose-ends.c",
        letter: "C",
        title: "Distinguish Aeolian VI from dominant VI",
        learn:
          "Compare G Aeolian with G Mixolydian and isolate B-flat/E-flat versus B/E-natural.",
        explanation:
          "In a major-key I-VI-II-V progression, scale degree six is often made dominant, but it can also remain a minor-seventh chord. In B-flat major, G minor seven belongs naturally to G Aeolian: G-A-B-flat-C-D-E-flat-F.\n\nIf the chord becomes G7 instead, G Mixolydian supplies B-natural and E-natural. Melody context matters: an E-flat held over G7 may suggest altered dominant colour instead of plain Mixolydian.",
        instruction:
          "Study the Aeolian comparison. Clear the grid. Write G3-A3-B-flat3-C4-D4-E-flat4-F4-G4 on steps 1-8. In bar 3 write G3-A3-B3-C4-D4-E4-F4-G4 on steps 17-24. Play both and focus on the third and sixth.",
        recognition:
          "Can you hear the minor-six chord family in Aeolian versus the brighter dominant quality of Mixolydian?",
        source: {
          reference: "Chapter Twenty-Two - Figures 22-9 through 22-13",
          focus:
            "Aeolian harmony is presented as an alternative when VI is minor seventh rather than dominant, with explicit comparison to the dominant-VI reading.",
          exampleIds: ["l22.aeolian"],
        },
        terms: [
          {
            term: "Aeolian harmony",
            definition:
              "Minor harmony derived from the sixth mode of a major scale, with minor third, minor sixth and minor seventh.",
          },
          {
            term: "Dominant VI",
            definition:
              "A major-third/minor-seventh chord on scale degree six, often used to point toward II.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare Aeolian and Mixolydian on G",
        successLabel: "You heard the chord quality change through two scale degrees",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied Aeolian versus dominant VI",
          complete: studiedSource(experiments, "l22.aeolian"),
        },
        {
          label: "Both G scale readings are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([55,57,58,60,62,63,65,67]),
            ...melodicLine([55,57,59,60,62,64,65,67], 16),
          ]),
        },
        {
          label: "You entered both eight-note lines",
          complete: changedControl(experiments, "harmony.note-edit", 16),
        },
        {
          label: "You listened to the quality change",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.loose-ends.d",
        letter: "D",
        title: "Test the fifth mode of melodic minor against a dominant chord",
        learn:
          "Hear C-D-E-F-G-A-flat-B-flat-C over C7 flat thirteen and decide how the fourth and fifth behave when sustained.",
        explanation:
          "The fifth mode of F melodic minor is C-D-E-F-G-A-flat-B-flat. It contains the major third E, minor seventh B-flat and flat thirteenth A-flat expected from C7 flat thirteen. It also contains both F and G. Held against a dense C7-flat-thirteen voicing, those notes can sound unusually exposed.\n\nThis is a good example of why scale labels do not settle every musical question. A note can be theoretically present and still need careful rhythmic or registral treatment.",
        instruction:
          "Study the fifth-mode ambiguity. Clear the grid. Write C4-D4-E4-F4-G4-A-flat4-B-flat4-C5 on steps 1-8. On step 17 write C3-E3-G3-B-flat3-A-flat4-F5. On step 25 write C3-E3-G3-B-flat3-A-flat4-G5. Play the scale, then compare the sustained F and G above the chord.",
        recognition:
          "Which upper note sounds more exposed to you, and does moving it quickly change your judgment?",
        source: {
          reference: "Chapter Twenty-Two - Figures 22-14 and 22-15",
          focus:
            "The fifth mode of melodic minor is presented as a rare dominant-related colour whose fourth and fifth can behave like contextual avoid notes; the ear is the final judge.",
          exampleIds: ["l22.fifth-mode"],
        },
        terms: [
          {
            term: "Fifth mode of melodic minor",
            definition:
              "The melodic-minor collection heard from scale degree five; here it combines dominant guide tones with a flat thirteenth and both fourth and fifth.",
          },
          {
            term: "Contextual avoid note",
            definition:
              "A note that belongs to the chosen scale but may sound too exposed when sustained against a particular voicing.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare the scale and two sustained upper notes",
        successLabel: "You used your ear to evaluate a theoretically valid but ambiguous colour",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the fifth-mode ambiguity",
          complete: studiedSource(experiments, "l22.fifth-mode"),
        },
        {
          label: "The scale and both sustained-note tests are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([60,62,64,65,67,68,70,72]),
            [16,[48,52,55,58,68,77]],
            [24,[48,52,55,58,68,79]],
          ]),
        },
        {
          label: "You entered the scale and both tests",
          complete: changedControl(experiments, "harmony.note-edit", 20),
        },
        {
          label: "You listened before deciding",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.loose-ends.e",
        letter: "E",
        title: "Build a major-third-cycle turnaround",
        learn:
          "Reharmonize a D-major II-V-I so new tonic centers descend by major thirds and each new center is approached by its dominant.",
        explanation:
          "Major-third-cycle harmony divides the octave into three equal tonal centers. In the compact turnaround used here, the destination centers are D, B-flat, G-flat and back to D. Each new major chord is prepared by its dominant.\n\nThe result is E minor seven - F7 - B-flat major - D-flat7 - G-flat major - A7 - D major. The first II chord stays in place while the expected A7-D motion expands into a chain of V-I pairs.",
        instruction:
          "Study the major-third cycle. Clear the grid. Write E3-G3-B3-D4 on step 1, F3-A3-C4-E-flat4 on step 5, B-flat2-D3-F3-A3 on step 9, D-flat3-F3-A-flat3-B3 on step 13, G-flat2-B-flat2-D-flat3-F3 on step 17, A2-C-sharp3-E3-G3 on step 21, and D3-F-sharp3-A3-C-sharp4 on step 25. Play the complete four-bar chain.",
        recognition:
          "Can you hear the tonal centers jump by major thirds while each local dominant still supplies a familiar V-I pull?",
        source: {
          reference: "Chapter Twenty-Two - Figures 22-16 through 22-22",
          focus:
            "Coltrane's major-third-cycle harmony is explained through Giant Steps and the Countdown reharmonization of a conventional II-V-I.",
          exampleIds: ["l22.coltrane-cycle"],
        },
        terms: [
          {
            term: "Major-third cycle",
            definition:
              "A harmonic plan that moves tonal centers by four semitones, dividing the octave into three equal parts.",
          },
          {
            term: "Tonal center",
            definition:
              "The temporary pitch center heard as a local tonic inside a larger progression.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Write the complete major-third-cycle turnaround",
        successLabel: "You connected rapid tonal-center changes with ordinary local dominant resolution",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied the major-third-cycle construction",
          complete: studiedSource(experiments, "l22.coltrane-cycle"),
        },
        {
          label: "All seven chords of the turnaround are written",
          complete: exactStudy(harmonySequence, [
            [0,[52,55,59,62]],
            [4,[53,57,60,63]],
            [8,[46,50,53,57]],
            [12,[49,53,56,59]],
            [16,[42,46,49,53]],
            [20,[45,49,52,55]],
            [24,[50,54,57,61]],
          ]),
        },
        {
          label: "You entered all seven chord shapes",
          complete: changedControl(experiments, "harmony.note-edit", 28),
        },
        {
          label: "You listened to the three-center cycle",
          complete: heardPlayback(experiments),
        },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "levine.loose-ends.f",
        letter: "F",
        title: "Compare harmonic major with harmonic minor",
        learn:
          "Hear C harmonic major as C major with a flat sixth, then change only E to E-flat for harmonic minor.",
        explanation:
          "C harmonic major is C-D-E-F-G-A-flat-B. Its major third and major seventh make it a major scale, while the flat sixth gives it a darker colour. C harmonic minor uses the same notes except for E-flat instead of E-natural.\n\nThe hybrid major-with-flat-six sound can support a major-seventh chord carrying the flat sixth as an important colour tone, even though chord-symbol notation for that sonority is not standardized.",
        instruction:
          "Study harmonic major. Clear the grid. Write C4-D4-E4-F4-G4-A-flat4-B4-C5 on steps 1-8. In bar 3 write C4-D4-E-flat4-F4-G4-A-flat4-B4-C5 on steps 17-24. On step 25 write C3-E3-G3-B3-A-flat4 as a compact harmonic-major chord colour. Play the loop.",
        recognition:
          "Can you hear the single E/E-flat change switch the collection from harmonic major to harmonic minor?",
        source: {
          reference: "Chapter Twenty-Two - Figures 22-25 through 22-29",
          focus:
            "Harmonic major is introduced as a major scale with a flat sixth, contrasted with harmonic minor and applied to hybrid major-seventh harmony; the chapter closes by stressing that theory serves the ear.",
          exampleIds: ["l22.harmonic-major"],
        },
        terms: [
          {
            term: "Harmonic major",
            definition:
              "A major scale with a lowered sixth degree while retaining the major third and major seventh.",
          },
          {
            term: "Hybrid chord symbol",
            definition:
              "A practical label that combines familiar chord names when no single conventional symbol fully describes the sonority.",
          },
        ],
        workspace: "jazz-piano",
        checksLabel: "Compare harmonic major and harmonic minor",
        successLabel: "You isolated the third as the difference between two closely related seven-note systems",
      }),
      evaluate: ({ harmonySequence, experiments }) => [
        {
          label: "You studied harmonic major",
          complete: studiedSource(experiments, "l22.harmonic-major"),
        },
        {
          label: "Both scales and the harmonic-major chord colour are written",
          complete: exactStudy(harmonySequence, [
            ...melodicLine([60,62,64,65,67,68,71,72]),
            ...melodicLine([60,62,63,65,67,68,71,72], 16),
            [24,[48,52,55,59,68]],
          ]),
        },
        {
          label: "You entered both collections and the chord",
          complete: changedControl(experiments, "harmony.note-edit", 21),
        },
        {
          label: "You listened to the major/minor contrast",
          complete: heardPlayback(experiments),
        },
      ],
    },
  ],
};
