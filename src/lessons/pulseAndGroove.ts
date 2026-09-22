import { exerciseContentSchema, lessonContentSchema, type LessonDefinition } from "./types";

const lesson = lessonContentSchema.parse({
  id: "rhythm.pulse-and-groove",
  number: 1,
  title: "Pulse & groove",
  eyebrow: "Rhythm · Production",
  hero: "Build a groove from the beat upward.",
  description:
    "Start with the basic pulse, then add the backbeat, subdivision, and finally syncopation. Each exercise adds one audible idea to the same bar.",
  overview:
    "You are learning how a drum groove is organised in 4/4 time: the kick can state the main beats, the snare can create a backbeat, the hi-hat can show smaller subdivisions, and offbeat notes can create syncopation.",
});

export const pulseAndGrooveLesson: LessonDefinition = {
  ...lesson,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.pulse-and-groove.a",
        letter: "A",
        title: "Four-on-the-floor",
        learn: "Hear and build the four main beats of a 4/4 bar.",
        explanation:
          "In 4/4 there are four counted beats in each bar: 1, 2, 3, 4. A kick drum on every one of those beats is called four-on-the-floor. It is common in disco, house, techno, and many dance styles because the pulse is extremely easy to feel.",
        instruction:
          "Put a kick on beats 1, 2, 3, and 4. On this 16-step grid those are steps 1, 5, 9, and 13.",
        recognition:
          "Count 1-2-3-4 with the music. If the kick lands under every number, you are hearing four-on-the-floor.",
        terms: [
          { term: "Beat", definition: "The regular pulse you count along with: 1, 2, 3, 4." },
          { term: "Bar", definition: "A repeating group of beats. In 4/4, one bar contains four beats." },
          { term: "4/4", definition: "A metre with four quarter-note beats per bar." },
          { term: "Four-on-the-floor", definition: "A kick drum on every beat of a 4/4 bar." },
        ],
        workspace: "drums",
        checksLabel: "Build",
        successLabel: "Four-on-the-floor is in place",
      }),
      evaluate: ({ A }) => [
        { label: "Kick on beat 1", complete: A.kick[0] },
        { label: "Kick on beat 2", complete: A.kick[4] },
        { label: "Kick on beat 3", complete: A.kick[8] },
        { label: "Kick on beat 4", complete: A.kick[12] },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.pulse-and-groove.b",
        letter: "B",
        title: "Add the backbeat",
        learn: "Hear the standard snare emphasis on beats 2 and 4.",
        explanation:
          "A backbeat places a strong snare or clap on beats 2 and 4. It is one of the most recognisable rhythmic patterns in rock, pop, funk, soul, hip-hop, and electronic music. The kick tells you where the main pulse is; the snare gives that pulse a characteristic push.",
        instruction:
          "Keep the four-on-the-floor kick and add snare hits on beats 2 and 4.",
        recognition:
          "Count 1-2-3-4. The snare should answer the kick most clearly on 2 and 4. Those are usually the beats people clap along to.",
        terms: [
          { term: "Backbeat", definition: "A strong accent, usually a snare or clap, on beats 2 and 4 in 4/4." },
          { term: "Accent", definition: "A note or beat that is made more prominent than the surrounding ones." },
        ],
        workspace: "drums",
        checksLabel: "Add",
        successLabel: "The backbeat is audible",
      }),
      evaluate: ({ A }) => [
        { label: "Four-on-the-floor remains intact", complete: [0, 4, 8, 12].every((step) => A.kick[step]) },
        { label: "Snare on beat 2", complete: A.snare[4] },
        { label: "Snare on beat 4", complete: A.snare[12] },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.pulse-and-groove.c",
        letter: "C",
        title: "Subdivide with eighth notes",
        learn: "Feel the space between the four main beats.",
        explanation:
          "A beat can be divided into smaller equal parts. Dividing each beat into two creates eighth notes: 1-and-2-and-3-and-4-and. A steady hi-hat on those positions makes the internal grid of the rhythm much easier to hear.",
        instruction:
          "Add hi-hats on every eighth-note position: every second square across the 16-step grid.",
        recognition:
          "Say 1-and-2-and-3-and-4-and. The hi-hat should sound on every spoken syllable.",
        terms: [
          { term: "Subdivision", definition: "Dividing a beat into smaller equal rhythmic units." },
          { term: "Eighth note", definition: "Half of a quarter-note beat in 4/4; two eighth notes fit inside one beat." },
        ],
        workspace: "drums",
        checksLabel: "Subdivide",
        successLabel: "The eighth-note grid is clear",
      }),
      evaluate: ({ A }) => [
        { label: "Backbeat remains on 2 and 4", complete: A.snare[4] && A.snare[12] },
        { label: "Eight evenly spaced hi-hats", complete: [0, 2, 4, 6, 8, 10, 12, 14].every((step) => A.hat[step]) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "rhythm.pulse-and-groove.d",
        letter: "D",
        title: "Create syncopation",
        learn: "Make a stable groove less square by stressing an offbeat position.",
        explanation:
          "Syncopation occurs when rhythmic emphasis falls where the listener does not expect the strongest beat. One simple way to create it is to add a kick between the numbered beats while the main pulse remains clear.",
        instruction:
          "Keep the existing groove and add at least one extra kick between the main beats. Try different positions and listen to which one creates the most forward motion.",
        recognition:
          "If a hit feels as though it arrives between your counted 1-2-3-4 pulses and briefly pulls your attention away from the main beat, it is functioning as syncopation.",
        terms: [
          { term: "Offbeat", definition: "A rhythmic position between or away from the main counted beats." },
          { term: "Syncopation", definition: "Emphasis on a normally weak or unexpected rhythmic position." },
        ],
        workspace: "drums",
        checksLabel: "Explore",
        successLabel: "You created a syncopated groove",
      }),
      evaluate: ({ A }) => [
        { label: "Main four kicks remain", complete: [0, 4, 8, 12].every((step) => A.kick[step]) },
        { label: "Backbeat remains", complete: A.snare[4] && A.snare[12] },
        { label: "At least one offbeat kick is added", complete: A.kick.some((active, step) => active && step % 4 !== 0) },
      ],
    },
  ],
};
