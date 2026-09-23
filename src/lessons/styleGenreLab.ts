import {
  activeLayerCount,
  arrangementLayers,
} from "../music/model";
import {
  exerciseContentSchema,
  lessonContentSchema,
  type LessonContext,
  type LessonDefinition,
} from "./types";

function played(context: LessonContext): boolean {
  return (context.experiments["transport.play"]?.changes ?? 0) >= 1;
}

function compared(
  context: LessonContext,
  key: string,
  minimumValues = 2,
): boolean {
  return (context.experiments[key]?.values.length ?? 0) >= minimumValues;
}

function arrangementSignatures(context: LessonContext): number {
  return new Set(
    context.arrangement
      .filter((bar) => activeLayerCount(bar) > 0)
      .map((bar) =>
        arrangementLayers.map((layer) => (bar[layer] ? "1" : "0")).join(""),
      ),
  ).size;
}

function harmonyOnsetCount(context: LessonContext): number {
  return context.harmonySequence.filter((notes) => notes.length > 0).length;
}

const house = lessonContentSchema.parse({
  id: "style.house",
  number: 29,
  title: "Style lab · House",
  eyebrow: "Style lab · House",
  hero: "Keep the musical idea. Change what makes the body read it.",
  description:
    "Reshape your existing track through a steady four-beat pulse, offbeat subdivision, bass-and-kick interaction, timbre, and gradual layer changes.",
  overview:
    "House is a useful study in how a stable pulse can support repetition while small changes in subdivision, bass placement, timbre, and arrangement create motion. Treat these as starting points to hear and alter, not as a recipe.",
});

export const houseStyleLesson: LessonDefinition = {
  ...house,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "style.house.a",
        letter: "A",
        title: "Put the floor under the loop",
        learn: "Hear what a steady kick pulse and offbeat hat do to material you already wrote.",
        explanation:
          "Four-on-the-floor places a kick on every quarter-note beat. A common contrasting layer puts a closed hi-hat between those kicks. The interest comes from what the stable pulse lets the other parts do around it.",
        instruction:
          "Keep your current notes and harmony. In the drum grid, put kicks on steps 1, 5, 9 and 13. Add closed hats on at least three of the spaces halfway between those kicks: steps 3, 7, 11 and 15. Play the loop, remove one offbeat hat, then put back only what helps the motion.",
        recognition:
          "Listen for the difference between the kick defining the floor and the hats defining movement between the beats. Which layer changes your sense of forward motion more?",
        terms: [
          { term: "Four-on-the-floor", definition: "A kick drum on every quarter-note beat in 4/4." },
          { term: "Offbeat", definition: "A rhythmic position between the main beats." },
          { term: "Subdivision", definition: "A division of the beat into smaller equal timing units." },
        ],
        workspace: "drums",
        checksLabel: "Build the pulse",
        successLabel: "The same musical idea now sits on a clearly different rhythmic foundation",
      }),
      evaluate: (context) => [
        {
          label: "Kicks mark all four quarter-note beats",
          complete: [0, 4, 8, 12].every((step) => context.A.kick[step]),
        },
        {
          label: "At least three between-beat hats are active",
          complete: [2, 6, 10, 14].filter((step) => context.A.hat[step]).length >= 3,
        },
        {
          label: "You edited the groove during this exercise",
          complete:
            (context.experiments["drums.A.kick.edit"]?.changes ?? 0) +
              (context.experiments["drums.A.hat.edit"]?.changes ?? 0) >=
            2,
        },
        { label: "You listened to the result", complete: played(context) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.house.b",
        letter: "B",
        title: "Change the instruments, not the notes",
        learn: "Hear how bass and chord articulation can move the same harmony toward a different role.",
        explanation:
          "A sustained pad, a short pluck, an electric-key chord and a piano chord can contain exactly the same pitches while behaving very differently in the groove. Bass timbre changes how clearly it separates from or blends with the kick.",
        instruction:
          "Keep the notes exactly as they are. Compare at least two BASS voices and at least two HARMONY voices. Play the full track between changes. Choose the combination where the kick, bass and chord attack each have a useful role.",
        recognition:
          "Which change altered the groove more: the bass attack or the chord articulation? Keep the answer you can hear, not the label that sounds most genre-like.",
        terms: [
          { term: "Timbre", definition: "The sound quality that distinguishes instruments playing the same pitch." },
          { term: "Articulation", definition: "How a note begins, sustains and ends." },
          { term: "Attack", definition: "The beginning of a sound and how quickly it reaches audible strength." },
        ],
        workspace: "instrument-palette",
        checksLabel: "Compare timbres",
        successLabel: "You chose instruments by how they work inside the groove",
      }),
      evaluate: (context) => [
        {
          label: "You compared at least two bass voices",
          complete: compared(context, "instrument.bassVoice"),
        },
        {
          label: "You compared at least two chord voices",
          complete: compared(context, "instrument.chordVoice"),
        },
        { label: "You heard the choices in the full track", complete: played(context) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.house.c",
        letter: "C",
        title: "Let the kick make room",
        learn: "Use sidechain movement as a rhythmic relationship rather than as an automatic genre effect.",
        explanation:
          "Sidechain ducking can make the bass level fall briefly when the kick hits. At obvious settings the pumping becomes a rhythm in itself; at subtler settings it can simply separate two low-frequency events.",
        instruction:
          "Turn sidechain on. Sweep the amount from almost none to at least 5 dB while the track loops, then compare it off and on. Leave an amount between 2 and 6 dB only if the movement helps your kick and bass coexist.",
        recognition:
          "At the exaggerated setting, can you hear the bass envelope becoming part of the rhythm? Reduce it until you decide whether you want audible pumping or only separation.",
        terms: [
          { term: "Sidechain", definition: "Using one signal to control processing applied to another signal." },
          { term: "Ducking", definition: "Temporarily reducing the level of one signal in response to another." },
          { term: "Pump", definition: "An audible rise-and-fall movement caused by repeated gain reduction and release." },
        ],
        workspace: "sidechain",
        checksLabel: "Shape kick/bass movement",
        successLabel: "The low end now has a sidechain amount you chose by listening",
      }),
      evaluate: (context) => [
        {
          label: "You compared sidechain off and on",
          complete:
            context.experiments["sidechain.enabled"]?.values.includes("true") === true &&
            context.experiments["sidechain.enabled"]?.values.includes("false") === true,
        },
        {
          label: "You heard an obvious amount before settling",
          complete: (context.experiments["sidechain.amountDb"]?.max ?? 0) >= 5,
        },
        {
          label: "Sidechain is enabled at a usable amount",
          complete:
            context.sidechainSettings.enabled &&
            context.sidechainSettings.amountDb >= 2 &&
            context.sidechainSettings.amountDb <= 6,
        },
        { label: "You listened in context", complete: played(context) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.house.d",
        letter: "D",
        title: "Make repetition evolve",
        learn: "Use layer entries and exits so repetition feels stable without becoming static.",
        explanation:
          "Repetition can be the point rather than a problem. Arrangement gives a loop direction when layers enter, disappear or return while the underlying pulse remains recognisable.",
        instruction:
          "Use all eight arrangement bars. Keep at least six bars active, use at least three different layer combinations, include one sparse bar and one fuller bar, and make at least four layer edits while playback runs. Do not move the peak to a prescribed bar; decide where your version should open up.",
        recognition:
          "Can you hear the track changing without losing the pulse that identifies it? If every bar feels equally important, remove something before adding anything.",
        terms: [
          { term: "Loop", definition: "A passage designed to repeat." },
          { term: "Layer entry", definition: "The moment an instrument or part begins within an arrangement." },
          { term: "Energy curve", definition: "The perceived rise and fall of intensity across a section." },
        ],
        workspace: "arrangement",
        checksLabel: "Evolve the loop",
        successLabel: "The loop now has motion without abandoning its centre",
      }),
      evaluate: (context) => {
        const densities = context.arrangement.map(activeLayerCount);
        return [
          { label: "At least six bars contain music", complete: densities.filter((value) => value > 0).length >= 6 },
          { label: "At least three layer combinations are used", complete: arrangementSignatures(context) >= 3 },
          { label: "There is both space and a fuller moment", complete: densities.some((value) => value > 0 && value <= 2) && densities.some((value) => value >= 3) },
          { label: "You made several arrangement decisions here", complete: (context.experiments["arrangement.edit"]?.changes ?? 0) >= 4 },
          { label: "You listened while arranging", complete: played(context) },
        ];
      },
    },
  ],
};

const funk = lessonContentSchema.parse({
  id: "style.funk",
  number: 30,
  title: "Style lab · Funk",
  eyebrow: "Style lab · Funk",
  hero: "Make the parts answer one another.",
  description:
    "Keep the song material and focus on subdivision, accent, syncopation, short articulation, and the way bass, drums and chords interlock.",
  overview:
    "Funk is especially useful for studying rhythmic interdependence. The lesson is not about copying a fixed beat; it is about hearing how small attacks, rests and accents make separate parts behave like one groove.",
});

export const funkStyleLesson: LessonDefinition = {
  ...funk,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "style.funk.a",
        letter: "A",
        title: "Make the subdivision breathe",
        learn: "Use velocity and timing contrast so repeated hits stop behaving like identical grid events.",
        explanation:
          "A dense subdivision becomes musical when accents create hierarchy. Straight and lightly swung timing can also change where the repeated pattern seems to lean.",
        instruction:
          "Keep at least eight hi-hat events active. Compare 0% swing with a value of at least 8%, then settle anywhere from 0–22%. Give the hats at least 20/127 of velocity contrast between their strongest and weakest active hits.",
        recognition:
          "Ignore the swing number. Which version gives the bass and snare more room to speak between the hats?",
        terms: [
          { term: "Pocket", definition: "The felt rhythmic relationship between parts when their timing and accents fit together." },
          { term: "Syncopation", definition: "Emphasis on normally weaker parts of the beat or between the main beats." },
          { term: "Accent", definition: "A deliberately stronger event within a rhythmic pattern." },
        ],
        workspace: "groove-feel",
        checksLabel: "Shape the subdivision",
        successLabel: "The repeated hats now contribute a rhythmic contour",
      }),
      evaluate: (context) => {
        const active = context.A.hat
          .map((on, step) => (on ? context.grooveFeelSettings.velocities.hat[step] : null))
          .filter((value): value is number => value !== null);
        return [
          { label: "At least eight hi-hat events are active", complete: active.length >= 8 },
          {
            label: "You compared straight and swung timing",
            complete:
              (context.experiments["groove.swing"]?.min ?? Infinity) <= 0.02 &&
              (context.experiments["groove.swing"]?.max ?? 0) >= 0.08,
          },
          {
            label: "Active hats have real velocity contrast",
            complete: active.length > 1 && Math.max(...active) - Math.min(...active) >= 20 / 127,
          },
          {
            label: "Your final swing remains a deliberate small-to-moderate choice",
            complete: context.grooveFeelSettings.swing >= 0 && context.grooveFeelSettings.swing <= 0.22,
          },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.funk.b",
        letter: "B",
        title: "Make the bass converse with the beat",
        learn: "Use rests and between-beat attacks instead of making the bass shadow every chord change.",
        explanation:
          "A bass line can outline harmony while still behaving rhythmically. Offbeat attacks and rests let the line answer the kick and snare rather than doubling their pattern.",
        instruction:
          "Keep your four-bar harmony. Write at least eight bass notes, with at least three starting on eighth-note offbeats. Leave at least eight empty bass steps so the line has real rests. Play it with the drums and remove any note that makes the groove feel busier without adding direction.",
        recognition:
          "Which offbeat bass note feels like an answer to the drums, and which one merely fills space?",
        terms: [
          { term: "Interlock", definition: "Parts fitting into one another rhythmically rather than striking at all the same moments." },
          { term: "Rest", definition: "An intentional span of silence in a musical part." },
          { term: "Chord tone", definition: "A pitch belonging to the chord sounding at that moment." },
        ],
        workspace: "bass",
        checksLabel: "Interlock bass and drums",
        successLabel: "The bass now leaves and occupies rhythmic space deliberately",
      }),
      evaluate: (context) => {
        const onsets = context.bassSequence
          .map((note, step) => ({ note, step }))
          .filter(({ note }) => note !== null);
        return [
          { label: "At least eight bass notes are written", complete: onsets.length >= 8 },
          { label: "At least three bass notes start between beats", complete: onsets.filter(({ step }) => step % 2 === 1).length >= 3 },
          { label: "The line contains substantial rests", complete: context.bassSequence.filter((note) => note === null).length >= 8 },
          { label: "You listened with the groove", complete: played(context) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.funk.c",
        letter: "C",
        title: "Compare short and sustained instruments",
        learn: "Hear how articulation can create rhythmic space even when the MIDI notes stay put.",
        explanation:
          "A short bass attack or chord pluck can expose gaps that a sustained pad fills. Instrument choice therefore changes rhythm perception as well as tone colour.",
        instruction:
          "Compare ELECTRIC with either SUB or SYNTH bass. Then compare ELECTRIC or PLUCK chords with PIANO or PAD. Keep the same notes while you switch. Choose by how the attacks lock with your groove.",
        recognition:
          "When you change only the instrument, which rests become easier to hear?",
        terms: [
          { term: "Decay", definition: "The reduction in level after a sound's initial attack." },
          { term: "Sustain", definition: "The continuing portion of a sound while a note is held." },
          { term: "Transient", definition: "The short, high-energy beginning of many instrumental sounds." },
        ],
        workspace: "instrument-palette",
        checksLabel: "Compare articulation",
        successLabel: "You chose articulation as part of the groove",
      }),
      evaluate: (context) => [
        {
          label: "You compared electric bass with another bass character",
          complete:
            context.experiments["instrument.bassVoice"]?.values.includes("electric") === true &&
            compared(context, "instrument.bassVoice"),
        },
        {
          label: "You compared at least two chord articulations",
          complete: compared(context, "instrument.chordVoice"),
        },
        { label: "You heard the choices in the full track", complete: played(context) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.funk.d",
        letter: "D",
        title: "Make the harmony rhythmic too",
        learn: "Treat chord attacks as groove events instead of a continuous harmonic background.",
        explanation:
          "Harmony can participate in rhythm. Short chord attacks on selected eighth-note positions create gaps for bass and drums while preserving the progression.",
        instruction:
          "In the harmony piano roll, keep all four bars harmonically clear but use at least six chord-note onset positions across the phrase, including at least two eighth-note offbeats. Play it with your bass and delete any stab that crowds an important bass attack.",
        recognition:
          "Which chord attack strengthens the groove because of what happens around it, rather than because the chord itself changed?",
        terms: [
          { term: "Stab", definition: "A short, rhythmically placed chord or harmonic accent." },
          { term: "Comping", definition: "Rhythmic chordal accompaniment that supports other parts." },
          { term: "Negative space", definition: "Musical room created by intentional absence of sound." },
        ],
        workspace: "harmony-song",
        checksLabel: "Rhythmise the harmony",
        successLabel: "Harmony now participates in the groove rather than filling every moment",
      }),
      evaluate: (context) => {
        const steps = context.harmonySequence
          .map((notes, step) => ({ notes, step }))
          .filter(({ notes }) => notes.length > 0);
        return [
          { label: "Harmony attacks occur at six or more positions", complete: steps.length >= 6 },
          { label: "At least two harmony attacks fall on eighth-note offbeats", complete: steps.filter(({ step }) => step % 2 === 1).length >= 2 },
          {
            label: "Every bar still contains written harmony",
            complete: [0, 1, 2, 3].every((bar) =>
              context.harmonySequence.slice(bar * 8, bar * 8 + 8).some((notes) => notes.length > 0),
            ),
          },
          { label: "You listened with bass and drums", complete: played(context) },
        ];
      },
    },
  ],
};

const hipHop = lessonContentSchema.parse({
  id: "style.hip-hop",
  number: 31,
  title: "Style lab · Hip-hop",
  eyebrow: "Style lab · Hip-hop",
  hero: "Make space feel intentional.",
  description:
    "Reframe the same track through a backbeat, kick placement, timing feel, sparse motif writing, and weightier instrument choices.",
  overview:
    "Hip-hop contains many distinct regional and historical approaches, so this lesson avoids a single canonical beat. It uses common production questions—space, backbeat, swing, repetition and sonic weight—to make you hear what changes when fewer events carry more responsibility.",
});

export const hipHopStyleLesson: LessonDefinition = {
  ...hipHop,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "style.hip-hop.a",
        letter: "A",
        title: "Let the kick pattern breathe",
        learn: "Use a clear backbeat while making kick placement less mechanically regular.",
        explanation:
          "A backbeat can make the metre legible while the kick pattern creates its own phrase. Leaving empty 16th-note positions gives each low drum hit more weight.",
        instruction:
          "Keep snare hits on steps 5 and 13. Use between two and six kick hits in the bar, but do not leave all four quarter-note kicks active. Keep at least four hi-hats. Play it and move one kick until the bar has a phrase rather than a repeated stamp.",
        recognition:
          "With the backbeat fixed, which kick move most changes the phrase? Notice how much information one low hit can carry when there is space around it.",
        terms: [
          { term: "Backbeat", definition: "A strong accent on beats 2 and 4 in 4/4." },
          { term: "Beat placement", definition: "The exact rhythmic positions chosen for events inside the bar." },
          { term: "Space", definition: "Intentional absence of events that gives sounding events more perceptual weight." },
        ],
        workspace: "drums",
        checksLabel: "Create space around the backbeat",
        successLabel: "The kick now phrases against a stable backbeat",
      }),
      evaluate: (context) => {
        const kicks = context.A.kick.filter(Boolean).length;
        return [
          { label: "Backbeats remain on steps 5 and 13", complete: context.A.snare[4] && context.A.snare[12] },
          { label: "The bar uses two to six kicks", complete: kicks >= 2 && kicks <= 6 },
          { label: "The kick is not simply four-on-the-floor", complete: ![0, 4, 8, 12].every((step) => context.A.kick[step]) },
          { label: "At least four hats keep a subdivision reference", complete: context.A.hat.filter(Boolean).length >= 4 },
          { label: "You listened to the rewritten beat", complete: played(context) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.hip-hop.b",
        letter: "B",
        title: "Compare straight and late-feeling subdivisions",
        learn: "Hear timing feel as a musical variable without moving individual MIDI blocks.",
        explanation:
          "Swing changes alternating subdivision timing. In a sparse beat, even a modest delay can change the relationship between hats, snare and melodic attacks.",
        instruction:
          "Compare 0% swing with at least 10% while the beat loops. Keep at least four hats active. Settle anywhere from 5–30%, or return close to straight if that better supports your material—but make the comparison first.",
        recognition:
          "Does the changed timing make the snare feel later, the hats looser, or the melody less aligned? Which consequence matters most in your version?",
        terms: [
          { term: "Timing feel", definition: "The perceptual character created by where events sit relative to a strict grid." },
          { term: "Swing", definition: "Unequal timing between alternating subdivisions." },
          { term: "Quantization", definition: "Aligning musical events to a timing grid." },
        ],
        workspace: "groove-feel",
        checksLabel: "Compare timing feels",
        successLabel: "You chose the timing after hearing both straight and swung versions",
      }),
      evaluate: (context) => [
        {
          label: "You compared straight with at least 10% swing",
          complete:
            (context.experiments["groove.swing"]?.min ?? Infinity) <= 0.02 &&
            (context.experiments["groove.swing"]?.max ?? 0) >= 0.1,
        },
        { label: "At least four hats remain active", complete: context.A.hat.filter(Boolean).length >= 4 },
        { label: "Final swing stays within a usable comparison range", complete: context.grooveFeelSettings.swing >= 0 && context.grooveFeelSettings.swing <= 0.3 },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.hip-hop.c",
        letter: "C",
        title: "Reduce the melody to a hook fragment",
        learn: "Use repetition and silence so a short idea becomes easier to recognise.",
        explanation:
          "A motif can gain identity by leaving room around it. Repetition does not require a long melody; a few pitches in a recognisable contour can function as a hook when their placement is memorable.",
        instruction:
          "Work with the melody you already have. Reduce the 16-step phrase to between four and eight note onsets and leave at least six empty steps. Reuse at least one pitch. Play it against the beat and decide whether one more note adds information or only fills a gap.",
        recognition:
          "After one loop, which two or three notes can you remember without looking? That memory is more useful than note count.",
        terms: [
          { term: "Hook", definition: "A short, memorable musical idea that helps identify a piece." },
          { term: "Motif", definition: "A small recognisable musical idea that can be repeated or transformed." },
          { term: "Economy", definition: "Using only the musical events needed for the intended effect." },
        ],
        workspace: "motif",
        checksLabel: "Make a sparse hook",
        successLabel: "The melody now leaves space around a recognisable fragment",
      }),
      evaluate: (context) => {
        const notes = context.melody.filter((note): note is number => note !== null);
        return [
          { label: "The phrase uses four to eight note onsets", complete: notes.length >= 4 && notes.length <= 8 },
          { label: "At least six melody steps are empty", complete: context.melody.filter((note) => note === null).length >= 6 },
          { label: "At least one pitch repeats", complete: new Set(notes).size < notes.length },
          { label: "You listened to the hook in context", complete: played(context) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.hip-hop.d",
        letter: "D",
        title: "Give fewer parts more weight",
        learn: "Compare instrument attacks and piano touch without rewriting the phrase.",
        explanation:
          "When an arrangement is sparse, timbre becomes more exposed. A sub bass, plucked bass, soft piano or strong piano changes perceived weight even before EQ or compression.",
        instruction:
          "Compare at least two BASS voices and both SOFT and STRONG piano touch. Keep the same notes. Play the full track after each change, then choose the combination whose weight matches the amount of rhythmic space you created.",
        recognition:
          "Which sound becomes too dominant when the arrangement is sparse? Which one gains presence without needing another note?",
        terms: [
          { term: "Weight", definition: "Perceived size or force created by register, timbre, dynamics and duration." },
          { term: "Velocity layer", definition: "A separate recording of an instrument played at a particular intensity." },
          { term: "Sonic foreground", definition: "The sound or part that attracts the most attention at a given moment." },
        ],
        workspace: "instrument-palette",
        checksLabel: "Choose the weight",
        successLabel: "Your sparse beat now has an instrument balance you chose by comparison",
      }),
      evaluate: (context) => [
        { label: "You compared at least two bass voices", complete: compared(context, "instrument.bassVoice") },
        {
          label: "You heard both soft and strong piano layers",
          complete:
            context.experiments["instrument.pianoTouch"]?.values.includes("soft") === true &&
            context.experiments["instrument.pianoTouch"]?.values.includes("strong") === true,
        },
        { label: "You listened to each choice in the track", complete: played(context) },
      ],
    },
  ],
};

const ambient = lessonContentSchema.parse({
  id: "style.ambient",
  number: 32,
  title: "Style lab · Ambient",
  eyebrow: "Style lab · Ambient",
  hero: "Let duration and space become compositional material.",
  description:
    "Transform the same project by slowing the sense of harmonic activity, sustaining notes, opening texture, reducing drum presence, and making effects part of the perceived space.",
  overview:
    "Ambient music spans many approaches. Here it is a laboratory for sustained sound, slow change, register, silence and spatial processing. The aim is not to remove rhythm automatically, but to hear what happens when duration and texture carry more of the form.",
});

export const ambientStyleLesson: LessonDefinition = {
  ...ambient,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "style.ambient.a",
        letter: "A",
        title: "Compare struck harmony with sustained harmony",
        learn: "Hear how instrument envelope changes the perceived speed of the same chord progression.",
        explanation:
          "A piano or pluck announces each chord with a clear transient. A pad arrives slowly and sustains. The notes can be identical while the sense of time changes.",
        instruction:
          "Compare PAD with at least one struck chord voice such as PIANO, ELECTRIC or PLUCK. Also compare two piano touch layers for the melody. Keep your notes unchanged and play the full track between choices.",
        recognition:
          "Which version makes you notice chord changes as events, and which makes you hear the harmony more as a continuous field?",
        terms: [
          { term: "Envelope", definition: "The changing level of a sound from attack through decay, sustain and release." },
          { term: "Transient", definition: "The brief onset that makes an attack perceptually clear." },
          { term: "Sustain", definition: "The portion of a sound maintained after its initial attack." },
        ],
        workspace: "instrument-palette",
        checksLabel: "Compare time in the sound",
        successLabel: "You heard how envelope changes the perceived pace without changing harmony",
      }),
      evaluate: (context) => [
        {
          label: "You compared pad with another chord voice",
          complete:
            context.experiments["instrument.chordVoice"]?.values.includes("pad") === true &&
            compared(context, "instrument.chordVoice"),
        },
        { label: "You compared at least two piano touch layers", complete: compared(context, "instrument.pianoTouch") },
        { label: "You listened in the full track", complete: played(context) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.ambient.b",
        letter: "B",
        title: "Let harmony last",
        learn: "Use real note duration so the harmony changes more slowly than the grid suggests.",
        explanation:
          "Harmonic rhythm is the rate at which harmony changes. Sustaining individual notes across several eighth-note cells makes duration audible as part of the composition rather than treating every grid event as the same length.",
        instruction:
          "In the harmony roll, keep harmony in all four bars and make at least three written notes last a half note or longer: four or more eighth-note cells. Play through the transitions and shorten any sustain that smears a change you want to hear clearly.",
        recognition:
          "Listen to the moment one chord gives way to the next. Does the long note connect the spaces or obscure the new harmony?",
        terms: [
          { term: "Harmonic rhythm", definition: "The rate at which chords or harmonic regions change." },
          { term: "Sustain", definition: "Continuing a note rather than re-triggering it." },
          { term: "Overlap", definition: "A period where one sound continues as another event begins." },
        ],
        workspace: "harmony-song",
        checksLabel: "Stretch harmonic time",
        successLabel: "Longer note durations now shape the harmonic movement",
      }),
      evaluate: (context) => {
        const longNotes = context.harmonyDurations.reduce(
          (total, entry) =>
            total + Object.values(entry).filter((duration) => duration >= 4).length,
          0,
        );
        return [
          { label: "At least three harmony notes last a half note or longer", complete: longNotes >= 3 },
          {
            label: "All four bars contain written harmony",
            complete: [0, 1, 2, 3].every((bar) =>
              context.harmonySequence.slice(bar * 8, bar * 8 + 8).some((notes) => notes.length > 0),
            ),
          },
          { label: "You listened through the chord changes", complete: played(context) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.ambient.c",
        letter: "C",
        title: "Make depth audible",
        learn: "Use reverb and delay as part of the perceived environment, then decide how much detail to keep.",
        explanation:
          "Longer reflections can blur attack and create a sense of distance. The useful question is not whether ambient music should have lots of reverb, but which musical details remain important after the space grows.",
        instruction:
          "Sweep REVERB DECAY from 2 seconds or less to at least 4.5 seconds while playing. Try some delay feedback too. Then settle at a reverb decay of at least 3 seconds only after you have heard what detail the longer tail removes.",
        recognition:
          "Which sound becomes harder to locate when the reverb tail grows? Is that loss of definition useful in this version?",
        terms: [
          { term: "Depth", definition: "The perceived front-to-back distance of sounds in a mix." },
          { term: "Reverb tail", definition: "The decaying reflections that continue after the original sound." },
          { term: "Diffusion", definition: "The spreading of reflections into a dense reverberant field." },
        ],
        workspace: "effects",
        checksLabel: "Build and reduce the space",
        successLabel: "The spatial depth is now a listening decision rather than an automatic effect",
      }),
      evaluate: (context) => [
        {
          label: "You compared short and long reverb decay",
          complete:
            (context.experiments["effects.reverbDecay"]?.min ?? Infinity) <= 2 &&
            (context.experiments["effects.reverbDecay"]?.max ?? 0) >= 4.5,
        },
        { label: "You also explored delay feedback", complete: (context.experiments["effects.delayFeedback"]?.changes ?? 0) >= 2 },
        { label: "Final reverb decay is at least 3 seconds", complete: context.effectsSettings.reverbDecay >= 3 },
        { label: "You listened while changing the space", complete: played(context) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.ambient.d",
        letter: "D",
        title: "Use absence as orchestration",
        learn: "Make some bars breathe by removing layers rather than adding new material.",
        explanation:
          "Texture can provide form even when harmony and motif change slowly. A bar without drums or with only one or two layers can make the return of density feel significant.",
        instruction:
          "Arrange all eight bars. Create at least two active bars with no drums, at least two sparse bars using one or two layers, and at least one bar with three or four layers. Keep at least six bars active overall. Play through the whole shape before deciding whether drums belong anywhere.",
        recognition:
          "When the fuller bar arrives, does it feel like expansion because of what came before it? If not, remove a layer earlier rather than adding another one later.",
        terms: [
          { term: "Sparse texture", definition: "A texture with relatively few simultaneous parts or events." },
          { term: "Density", definition: "The amount of simultaneous musical activity." },
          { term: "Orchestration", definition: "Assigning musical material to particular instruments, registers and combinations." },
        ],
        workspace: "arrangement",
        checksLabel: "Compose with absence",
        successLabel: "The arrangement now uses silence and density as part of its form",
      }),
      evaluate: (context) => {
        const active = context.arrangement.filter((bar) => activeLayerCount(bar) > 0);
        return [
          { label: "At least six bars contain music", complete: active.length >= 6 },
          { label: "At least two active bars have no drums", complete: active.filter((bar) => !bar.drums).length >= 2 },
          { label: "At least two bars use only one or two layers", complete: active.filter((bar) => activeLayerCount(bar) <= 2).length >= 2 },
          { label: "At least one bar expands to three or four layers", complete: active.some((bar) => activeLayerCount(bar) >= 3) },
          { label: "You listened through the full texture", complete: played(context) },
        ];
      },
    },
  ],
};

const pop = lessonContentSchema.parse({
  id: "style.pop",
  number: 33,
  title: "Style lab · Pop",
  eyebrow: "Style lab · Pop",
  hero: "Make the main idea easy to recognise and easy to return to.",
  description:
    "Use motif economy, clear harmonic support, section contrast, and instrument focus to turn the same project into a version whose central idea is easy to remember.",
  overview:
    "Pop is broad enough that no single rhythm or sound defines it. This lesson instead studies a recurring production problem: how to make a musical idea memorable, support it clearly, contrast sections around it, and choose which sound deserves the foreground.",
});

export const popStyleLesson: LessonDefinition = {
  ...pop,
  exercises: [
    {
      ...exerciseContentSchema.parse({
        id: "style.pop.a",
        letter: "A",
        title: "Make the motif return",
        learn: "Create recognition by repeating part of a short melodic idea rather than filling every step.",
        explanation:
          "A hook becomes recognisable when the ear can predict something about its return. Repetition can involve pitch, rhythm or contour without requiring the full phrase to repeat literally.",
        instruction:
          "Use between five and ten melody onsets across the 16 steps. Leave at least four rests and repeat at least two pitch values somewhere in the phrase. Play several loops and remove one note you cannot remember afterwards.",
        recognition:
          "After looking away for one loop, what part of the melody can you sing or imagine back? Protect that part from unnecessary extra notes.",
        terms: [
          { term: "Hook", definition: "A memorable musical idea that helps identify a song." },
          { term: "Repetition", definition: "The return of musical material." },
          { term: "Contour", definition: "The general rising and falling shape of a melody." },
        ],
        workspace: "motif",
        checksLabel: "Make the idea return",
        successLabel: "The melody now has repetition and space around its recognisable idea",
      }),
      evaluate: (context) => {
        const notes = context.melody.filter((note): note is number => note !== null);
        const counts = new Map<number, number>();
        notes.forEach((note) => counts.set(note, (counts.get(note) ?? 0) + 1));
        const repeatedPitchValues = [...counts.values()].filter((count) => count >= 2).length;
        return [
          { label: "The melody uses five to ten onsets", complete: notes.length >= 5 && notes.length <= 10 },
          { label: "At least four melody steps remain empty", complete: context.melody.filter((note) => note === null).length >= 4 },
          { label: "At least two pitch values return", complete: repeatedPitchValues >= 2 },
          { label: "You listened to repeated loops", complete: played(context) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.pop.b",
        letter: "B",
        title: "Make the harmony support the hook",
        learn: "Keep a four-bar harmonic frame clear enough that the melody remains the foreground.",
        explanation:
          "A progression can provide direction without competing for attention. Clear chord changes and deliberate voicing let harmony support a hook rather than constantly announce itself.",
        instruction:
          "Use a chord in every bar and at least three different chord names across the four bars. Make sure every bar contains written harmony notes. Play the melody over it and remove any extra harmony attack that distracts from the hook.",
        recognition:
          "Can you follow the melody while still feeling where the chord changes happen? If the harmony demands equal attention, simplify its rhythm before changing the chords.",
        terms: [
          { term: "Harmonic support", definition: "Harmony organised to reinforce the direction and character of another musical part." },
          { term: "Harmonic rhythm", definition: "The rate and placement of chord changes." },
          { term: "Foreground", definition: "The musical layer intended to attract the most attention." },
        ],
        workspace: "harmony-song",
        checksLabel: "Frame the hook",
        successLabel: "The progression now supports a clearly audible foreground melody",
      }),
      evaluate: (context) => [
        { label: "All four bars have chord targets", complete: context.chordProgression.every(Boolean) },
        { label: "At least three different chord names are used", complete: new Set(context.chordProgression.filter(Boolean)).size >= 3 },
        {
          label: "Every bar contains written harmony",
          complete: [0, 1, 2, 3].every((bar) =>
            context.harmonySequence.slice(bar * 8, bar * 8 + 8).some((notes) => notes.length > 0),
          ),
        },
        { label: "You listened to melody and harmony together", complete: played(context) },
      ],
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.pop.c",
        letter: "C",
        title: "Make sections change around the hook",
        learn: "Use density contrast so the same central idea feels different when it returns.",
        explanation:
          "Section contrast does not require a new melody. Removing support in one region and restoring it later can make the same hook feel like a different structural moment.",
        instruction:
          "Create at least six active arrangement bars, at least three different layer combinations, one sparse bar and one full four-layer bar. Make at least four arrangement edits while playback runs. Let the hook appear in more than one density rather than saving it for only the fullest bar.",
        recognition:
          "When the melody returns with different support, does it feel like the same idea in a new section or merely a louder copy?",
        terms: [
          { term: "Section contrast", definition: "Differences in texture, energy or material that separate larger parts of a song." },
          { term: "Return", definition: "The reappearance of earlier musical material." },
          { term: "Arrangement", definition: "The organisation of parts and layers across time." },
        ],
        workspace: "arrangement",
        checksLabel: "Shape section contrast",
        successLabel: "The hook now survives more than one arrangement context",
      }),
      evaluate: (context) => {
        const densities = context.arrangement.map(activeLayerCount);
        const melodyBars = context.arrangement.filter((bar) => bar.melody);
        return [
          { label: "At least six bars contain music", complete: densities.filter((value) => value > 0).length >= 6 },
          { label: "At least three layer combinations are used", complete: arrangementSignatures(context) >= 3 },
          { label: "There is a sparse bar and a full bar", complete: densities.some((value) => value > 0 && value <= 2) && densities.some((value) => value === 4) },
          { label: "The melody appears in more than one density", complete: new Set(melodyBars.map(activeLayerCount)).size >= 2 },
          { label: "You made several edits while listening", complete: (context.experiments["arrangement.edit"]?.changes ?? 0) >= 4 && played(context) },
        ];
      },
    },
    {
      ...exerciseContentSchema.parse({
        id: "style.pop.d",
        letter: "D",
        title: "Choose the foreground sound",
        learn: "Make an instrument choice that supports recognition instead of changing sound for novelty.",
        explanation:
          "A familiar melodic idea can feel intimate, bright or forceful depending on performance intensity and surrounding timbre. The production choice is useful only if it clarifies the role of the hook.",
        instruction:
          "Compare at least two chord voices and at least two piano touch layers while the full arrangement plays. Choose a final combination, then listen once without touching a control. Ask whether the melody is still the easiest part to recognise.",
        recognition:
          "If the hook is less memorable after the sound change, the newer sound is not automatically the better one. Which timbre makes the musical role clearest?",
        terms: [
          { term: "Foreground", definition: "The part intended to command attention." },
          { term: "Timbre", definition: "The sound quality that differentiates instruments or performances." },
          { term: "Production choice", definition: "A technical or sonic decision made to serve a musical intention." },
        ],
        workspace: "instrument-palette",
        checksLabel: "Choose the foreground",
        successLabel: "You finished the style lab by choosing timbre in service of the musical idea",
      }),
      evaluate: (context) => [
        { label: "You compared at least two chord voices", complete: compared(context, "instrument.chordVoice") },
        { label: "You compared at least two piano touch layers", complete: compared(context, "instrument.pianoTouch") },
        { label: "You listened to the final choice in the whole arrangement", complete: played(context) },
      ],
    },
  ],
};
