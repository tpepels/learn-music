import type { ExerciseDefinition } from "../lessons/types";

export type DawStage =
  | "timeline"
  | "notes"
  | "instrument"
  | "effects"
  | "mixer"
  | "master";

export type DawTransferProfile = {
  concept: string;
  changes: string;
  dawLocation: string;
  whyItMatters: string;
  pitfall: string;
  vocabulary: string[];
  stage: DawStage;
};

export type DawCheckpoint = {
  title: string;
  intro: string;
  objects: Array<{ name: string; meaning: string }>;
  challenge: string;
};

type Workspace = ExerciseDefinition["workspace"];

const transferProfiles: Record<Workspace, DawTransferProfile> = {
  drums: {
    concept: "A drum pattern is a timeline of discrete events: each active step tells one drum sound when to happen.",
    changes: "You are changing timing and density. The sound itself can stay identical while moving or removing an event changes the groove.",
    dawLocation: "In a DAW this usually lives in a MIDI clip, drum editor, or step sequencer. Time runs left to right; drum sounds occupy separate rows.",
    whyItMatters: "Once you recognise the grid as a timeline rather than a special drum interface, most DAW drum editors become readable.",
    pitfall: "Do not confuse the grid with audio. The blocks are usually instructions that trigger samples or instruments; they are not the recorded sound itself.",
    vocabulary: ["MIDI clip", "step sequencer", "drum rack", "grid"],
    stage: "notes",
  },
  compare: {
    concept: "A/B comparison means changing one musical decision while keeping enough of the surrounding context fixed to hear what that decision actually does.",
    changes: "You are changing one version of the musical data, then switching between versions rather than relying on memory.",
    dawLocation: "DAWs support this with duplicated clips, bypass switches, alternate takes, mute/solo controls, and plugin A/B states.",
    whyItMatters: "Production is full of small decisions. Reliable comparison turns a crowded DAW into a sequence of answerable listening questions.",
    pitfall: "A louder version often seems better. When comparing tone or processing, keep level differences in mind.",
    vocabulary: ["A/B", "bypass", "alternate take", "level match"],
    stage: "timeline",
  },
  "piano-key": {
    concept: "Pitch is organised as repeating note names across octaves. A key or note position represents pitch, not a particular instrument sound.",
    changes: "You are choosing pitch classes and registering where they sit from low to high.",
    dawLocation: "The same keyboard appears vertically beside most piano rolls. Higher rows mean higher pitch; time is added horizontally.",
    whyItMatters: "Understanding the keyboard axis makes the piano roll look like graph paper for pitch and time rather than a wall of rectangles.",
    pitfall: "MIDI note names are not audio. C4 tells an instrument which pitch to play; the instrument determines the timbre.",
    vocabulary: ["pitch", "octave", "MIDI note", "piano roll"],
    stage: "notes",
  },
  melody: {
    concept: "A melody is a sequence of pitches with timing and duration. In a DAW each note is stored as an event with several editable properties.",
    changes: "You are changing pitch, onset time, note length, and sometimes velocity. Those dimensions can be edited independently.",
    dawLocation: "This is the piano roll: vertical position is pitch, horizontal position is time, width is duration, and a lower lane often shows velocity.",
    whyItMatters: "The piano roll is one of the most common DAW views. Reading these four dimensions removes much of its apparent complexity.",
    pitfall: "A note block is not a waveform. Moving it changes an instruction sent to an instrument; it does not stretch recorded audio.",
    vocabulary: ["piano roll", "note onset", "duration", "velocity"],
    stage: "notes",
  },
  chords: {
    concept: "A chord is several pitches sounding together. The chord name is shorthand; the actual sound comes from the individual notes and their register.",
    changes: "You are changing which pitches occur at the same time and how long that group lasts.",
    dawLocation: "In a piano roll a chord appears as a vertical stack of MIDI notes. Chord labels, if shown, are an additional aid rather than the sound source.",
    whyItMatters: "Seeing chords as note stacks lets you edit harmony in any DAW even when it has no dedicated chord feature.",
    pitfall: "Do not treat a chord symbol as a fixed voicing. C major can be distributed across octaves in many ways while remaining C major.",
    vocabulary: ["triad", "voicing", "MIDI notes", "chord symbol"],
    stage: "notes",
  },
  "harmony-song": {
    concept: "A progression is harmony unfolding over time. Each chord occupies a region of the timeline and provides a changing pitch context for other parts.",
    changes: "You are changing harmonic content, the moment each harmony arrives, and the rhythm or duration of its notes.",
    dawLocation: "DAWs usually show this as a MIDI accompaniment clip, sometimes with a chord track above the arrangement.",
    whyItMatters: "Thinking of harmony as timed note data connects theory directly to the clip and timeline views used in production.",
    pitfall: "The visual boundary between chords does not guarantee a convincing transition. Voice leading and rhythm determine how the change feels.",
    vocabulary: ["progression", "chord track", "MIDI clip", "harmonic rhythm"],
    stage: "notes",
  },
  synth: {
    concept: "A synthesizer turns a control signal such as MIDI into audio. Oscillators create a tone; filters and envelopes shape its spectrum and behaviour over time.",
    changes: "You are changing the instrument that interprets the notes, not the notes themselves.",
    dawLocation: "A synth normally sits in an instrument slot on a MIDI track. Opening the plugin reveals oscillator, filter, envelope, modulation, and output controls.",
    whyItMatters: "This distinction—MIDI before the instrument, audio after it—is one of the central ideas needed to understand a DAW signal path.",
    pitfall: "Changing the synth does not rewrite the composition. The same MIDI clip can drive a completely different instrument.",
    vocabulary: ["instrument plugin", "oscillator", "filter", "envelope"],
    stage: "instrument",
  },
  arrangement: {
    concept: "Arrangement is the large-scale timeline: deciding which musical layers are present in each section and when sections change.",
    changes: "You are changing presence, absence, repetition, and section length rather than individual note pitches.",
    dawLocation: "This is the main Arrangement or Timeline view. Tracks run horizontally; clips or regions are placed from left to right through the song.",
    whyItMatters: "This is the screen that initially looks most intimidating. It is mostly a map showing familiar clips placed on familiar tracks over time.",
    pitfall: "More tracks do not automatically create development. Arrangement is about contrast and function, not filling every row.",
    vocabulary: ["timeline", "track", "clip/region", "section marker"],
    stage: "timeline",
  },
  mixer: {
    concept: "A mixer combines audio streams. Each channel represents one path whose level, pan, routing, and processing can be controlled before signals meet.",
    changes: "You are changing relative level and stereo placement, which changes what occupies the foreground and how the mix is balanced.",
    dawLocation: "The mixer shows channel strips with meters, faders, pan controls, inserts, sends, and routing. Each strip usually corresponds to a track or bus.",
    whyItMatters: "The mixer stops looking like dozens of unrelated controls once you read each vertical strip as one repeated signal path.",
    pitfall: "A fader is not a quality control. Raising everything makes the mix louder, not clearer.",
    vocabulary: ["channel strip", "fader", "pan", "bus"],
    stage: "mixer",
  },
  "automation-dynamics": {
    concept: "Automation changes a parameter over the song timeline; dynamics processing changes level automatically according to the incoming signal.",
    changes: "Automation stores intentional parameter values over time. Compression reacts to signal level using threshold, ratio, attack, release, and gain.",
    dawLocation: "Automation appears as a line or lane under a track. A compressor usually appears as an insert plugin inside that track's signal path.",
    whyItMatters: "DAWs contain both kinds of 'automatic' change. Distinguishing written automation from signal-reactive processing prevents a common conceptual mix-up.",
    pitfall: "Do not assume compression is simply volume automation. It responds continuously to the signal according to rules you set.",
    vocabulary: ["automation lane", "breakpoint", "compressor", "threshold"],
    stage: "effects",
  },
  effects: {
    concept: "An effect receives audio and returns changed audio. Insert effects process the whole channel path; send effects receive a copy through an auxiliary route.",
    changes: "You are changing the audio after the instrument or recording has produced it.",
    dawLocation: "Look for insert slots on the channel strip and send knobs feeding return/aux tracks. Reverb and delay are often used on shared sends.",
    whyItMatters: "Understanding inserts versus sends turns plugin lists and routing controls into a simple question: where does the audio go next?",
    pitfall: "Wet/dry balance and send amount are not the same routing model. Check whether the effect is inserted directly or living on a return channel.",
    vocabulary: ["insert", "send", "return/aux", "wet/dry"],
    stage: "effects",
  },
  "final-project": {
    concept: "A production is a system of connected layers: note data, instruments, audio processing, arrangement, mixing, and output.",
    changes: "You are coordinating decisions across several layers instead of optimising one control in isolation.",
    dawLocation: "A real project shows these layers at once: clips in the timeline, instruments and effects on tracks, automation lanes, mixer channels, and a master output.",
    whyItMatters: "This is the point where the DAW should be read as a collection of familiar subsystems rather than one giant interface.",
    pitfall: "Do not solve every problem with another plugin. First identify whether the issue belongs to composition, arrangement, sound, or mix.",
    vocabulary: ["project", "track", "signal path", "master"],
    stage: "timeline",
  },
  voicing: {
    concept: "Voicing changes where chord notes sit and how individual voices move while preserving the underlying harmony.",
    changes: "You are changing register and note-to-note motion inside a chord, not necessarily its chord symbol.",
    dawLocation: "In a piano roll, voicing is literally the vertical placement of notes in each chord stack.",
    whyItMatters: "This makes abstract harmony visible: smoother voice leading is often visible as shorter vertical movement between neighbouring chord stacks.",
    pitfall: "An inversion is not a new chord progression. It is another arrangement of the same chord tones.",
    vocabulary: ["voicing", "inversion", "register", "voice leading"],
    stage: "notes",
  },
  bass: {
    concept: "A bass line is low-pitched note data that connects harmony, pulse, and groove. Its rhythm often matters as much as its pitch choice.",
    changes: "You are changing low-register pitch, onset, and duration in relation to the drums and chords.",
    dawLocation: "This normally appears as a MIDI clip on a bass instrument track, or as recorded audio when using a live bass.",
    whyItMatters: "The same piano-roll logic used for melody applies here; only the musical role and register change.",
    pitfall: "Low notes can overlap and build energy quickly. Note length is therefore a compositional and mixing decision, not just notation.",
    vocabulary: ["bass line", "root", "approach note", "register"],
    stage: "notes",
  },
  "groove-feel": {
    concept: "Groove comes from small differences in timing and emphasis around the grid. Velocity changes emphasis; swing delays selected subdivisions.",
    changes: "You are changing microtiming and note intensity while leaving the broad pattern recognisable.",
    dawLocation: "DAWs expose velocity in an editor lane and timing through swing/groove templates, quantize settings, or manual note movement.",
    whyItMatters: "The grid is a reference, not a command that every event must sound identical or perfectly even.",
    pitfall: "Velocity is not simply track volume. It is per-note performance data and may also change the instrument's timbre.",
    vocabulary: ["velocity", "swing", "quantize", "groove template"],
    stage: "notes",
  },
  motif: {
    concept: "A motif is a recognisable musical shape that can be repeated, moved, shortened, or answered while retaining identity.",
    changes: "You are editing note content and rhythm while preserving enough relationship for the listener to recognise the source idea.",
    dawLocation: "In a DAW this is ordinary MIDI editing: duplicate a phrase, then alter notes, timing, or length inside the copied clip.",
    whyItMatters: "Development is not a special DAW feature. It is a compositional operation performed with standard clip and piano-roll tools.",
    pitfall: "Copy-paste alone creates repetition, not development. The useful question is what stays recognisable and what changes.",
    vocabulary: ["motif", "duplicate", "transpose", "fragment"],
    stage: "notes",
  },
  "melody-harmony": {
    concept: "Melody and harmony are separate note layers heard at the same time. Their relationship changes as chord tones underneath the melody change.",
    changes: "You are changing melodic pitch and timing while listening against a harmonic context.",
    dawLocation: "DAWs normally place melody and accompaniment on separate tracks. Ghost notes, multi-clip editing, or chord tracks can show their relationship in one editor.",
    whyItMatters: "Multiple tracks do not mean multiple musical systems. They are synchronised layers sharing the same timeline.",
    pitfall: "A note cannot be judged only against the global key; its local effect also depends on the chord sounding underneath it.",
    vocabulary: ["track", "chord tone", "passing tone", "multi-clip edit"],
    stage: "notes",
  },
  "harmonic-function": {
    concept: "Harmonic function describes how chords create stability, departure, tension, and return within a tonal context.",
    changes: "You are changing the order and identity of harmonies, which changes expectation even when tempo and instrumentation stay fixed.",
    dawLocation: "The DAW only stores the notes or chord labels; 'function' is your interpretation of how those events behave in context.",
    whyItMatters: "This separates musical meaning from software representation: the piano roll shows data, while theory helps you reason about that data.",
    pitfall: "Function is contextual, not a permanent label attached to every chord shape in every piece.",
    vocabulary: ["tonic", "predominant", "dominant", "cadence"],
    stage: "notes",
  },
  "phrase-form": {
    concept: "Phrase form groups musical events into larger units with beginnings, continuations, and endings.",
    changes: "You are changing where material repeats, contrasts, pauses, or resolves across several bars.",
    dawLocation: "In the timeline, phrases appear as groups of clips or repeated regions; markers and loop braces help reveal their boundaries.",
    whyItMatters: "Zooming out from notes to phrases is the same mental move as zooming out in the DAW from piano roll to arrangement.",
    pitfall: "A four-bar box is only a visual unit. Musical phrasing comes from what happens inside and around the boundary.",
    vocabulary: ["phrase", "region", "loop brace", "marker"],
    stage: "timeline",
  },
  texture: {
    concept: "Texture is how simultaneous layers divide register, rhythm, density, and foreground/background roles.",
    changes: "You are changing which layers are active and how their musical ranges or roles overlap.",
    dawLocation: "A DAW makes texture visible as stacked tracks. Muting, soloing, octave placement, and clip density let you inspect one layer or the full stack.",
    whyItMatters: "Track count becomes less intimidating when each row is treated as one role contributing to a shared texture.",
    pitfall: "Separation is not achieved only with EQ. Composition, register, rhythm, and arrangement often solve overlap earlier in the chain.",
    vocabulary: ["layer", "register", "mute", "solo"],
    stage: "timeline",
  },
  eq: {
    concept: "EQ changes the level of selected frequency ranges in audio. It reshapes spectral balance after a sound has been produced.",
    changes: "You are changing amplitude by frequency rather than changing MIDI pitch or note choice.",
    dawLocation: "An EQ is usually an insert plugin with frequency on the horizontal axis and gain on the vertical axis; bands select where and how broadly to change level.",
    whyItMatters: "Once the graph is read as frequency versus gain, an apparently technical EQ display becomes a map of which parts of the spectrum are being raised or lowered.",
    pitfall: "A frequency shown on an EQ is not the same as a musical note you are composing. EQ changes energy around frequencies already present in the audio.",
    vocabulary: ["frequency", "gain", "band", "Q/bandwidth"],
    stage: "effects",
  },
  saturation: {
    concept: "Saturation is nonlinear processing: stronger input produces new harmonic content and often a change in apparent density or loudness.",
    changes: "You are changing the audio waveform and spectrum, not the underlying notes.",
    dawLocation: "Saturation normally appears as an insert plugin with drive/input, tone or character, output, and sometimes wet/dry controls.",
    whyItMatters: "It provides a clear example of why plugin chains matter: the audio entering the processor affects what comes out.",
    pitfall: "Louder can be mistaken for richer. Compare at similar perceived level when deciding whether the added harmonics actually help.",
    vocabulary: ["drive", "harmonics", "nonlinear", "output gain"],
    stage: "effects",
  },
  sidechain: {
    concept: "Sidechaining lets one signal control processing applied to another signal. The detector listens to a key input while the processor changes the target channel.",
    changes: "You are changing routing and dynamic gain reduction rather than moving notes on the timeline.",
    dawLocation: "A compressor or dynamic processor sits on the target track; its sidechain/key input is routed from another track such as the kick.",
    whyItMatters: "This teaches routing explicitly: a signal can travel somewhere not to be heard directly, but to control another process.",
    pitfall: "Sidechain is a routing relationship, not a particular pumping sound. Subtle ducking and other detector-controlled effects use the same idea.",
    vocabulary: ["sidechain", "key input", "detector", "gain reduction"],
    stage: "effects",
  },
  stereo: {
    concept: "Stereo describes how audio is distributed between left and right channels. Pan positions a signal; width changes the relationship between channels.",
    changes: "You are changing spatial distribution, not pitch or arrangement time.",
    dawLocation: "Pan lives on the channel strip; stereo-width or imaging tools are usually inserts. A master utility can collapse the mix to mono for checking.",
    whyItMatters: "The DAW's left/right controls become easier to reason about when mono is understood as the shared centre information rather than simply 'smaller stereo'.",
    pitfall: "A wider meter or image is not automatically better. Some widening techniques can weaken or cancel material when summed to mono.",
    vocabulary: ["pan", "stereo width", "mono", "correlation"],
    stage: "mixer",
  },
  reference: {
    concept: "Reference mixing compares your production with another finished recording under controlled listening conditions.",
    changes: "You are changing the basis of judgement: level matching and quick switching reduce the errors of memory and loudness bias.",
    dawLocation: "A reference can be imported to a dedicated audio track routed directly to the output, or handled by a monitoring/reference plugin.",
    whyItMatters: "It turns the DAW from a closed world into a measurement environment where your mix is judged against an external target.",
    pitfall: "Do not process the reference through your mix bus by accident, and do not compare at radically different loudness.",
    vocabulary: ["reference track", "level match", "A/B", "monitor path"],
    stage: "master",
  },
  "minor-key": {
    concept: "Relative major and minor can share a pitch collection while giving different notes the role of tonal centre.",
    changes: "You are changing melodic emphasis, phrase endings, and harmonic context more than the available keyboard notes.",
    dawLocation: "The piano roll does not know which pitch feels like home unless a key/scale helper is enabled; tonal centre is created by the music you enter.",
    whyItMatters: "This is another distinction between data and interpretation: identical highlighted notes can support different tonal organisations.",
    pitfall: "Do not identify major or minor only by counting which notes are present. Listen for hierarchy and resolution.",
    vocabulary: ["relative minor", "tonal centre", "scale", "tonic"],
    stage: "notes",
  },
  "harmonic-minor": {
    concept: "Harmonic minor alters one scale degree to create a stronger pull toward the tonic, especially in dominant harmony.",
    changes: "You are changing selected pitches within melodic or harmonic note data.",
    dawLocation: "In a piano roll this is simply a changed note row; scale highlighting may help, but the altered note remains ordinary MIDI data.",
    whyItMatters: "Theory explains why one small note edit can alter harmonic direction even though the DAW representation barely changes.",
    pitfall: "A scale setting does not automatically create harmonic-minor behaviour. The effect depends on where and how the altered degree is used.",
    vocabulary: ["leading tone", "scale degree", "dominant", "resolution"],
    stage: "notes",
  },
  "minor-harmony": {
    concept: "Minor-key harmony combines the tonal centre, diatonic chord resources, and altered dominant behaviour into progressions.",
    changes: "You are changing chord note data and the route those harmonies take through time.",
    dawLocation: "As with major harmony, the DAW shows note stacks in clips; key and chord helpers are optional overlays on top of that data.",
    whyItMatters: "The same editor skills transfer across tonal systems. What changes is the musical interpretation of the pitches.",
    pitfall: "Do not expect every chord in minor to come from one unchanging seven-note scale.",
    vocabulary: ["minor key", "dominant", "cadence", "chord tones"],
    stage: "notes",
  },
  "seventh-harmony": {
    concept: "A seventh chord adds another chord tone above a triad, changing colour, tension, and possible voice-leading paths.",
    changes: "You are adding or moving simultaneous MIDI notes inside chord voicings.",
    dawLocation: "The piano roll shows a four-note stack instead of a three-note stack; inversion and spacing remain editable note by note.",
    whyItMatters: "Extended harmony looks visually more crowded, but the DAW operation is still the same basic act of editing pitches in time.",
    pitfall: "More notes are not automatically richer. Register, spacing, and function determine whether the added tone helps.",
    vocabulary: ["seventh chord", "extension", "voicing", "inversion"],
    stage: "notes",
  },
  "borrowed-harmony": {
    concept: "Borrowed harmony introduces chord tones from a parallel tonal collection to create colour or directional contrast.",
    changes: "You are temporarily changing pitch content while keeping the broader tonal centre intelligible.",
    dawLocation: "The DAW stores the chromatic notes normally; scale highlighting may mark them as outside the selected key, but it does not make them invalid.",
    whyItMatters: "This is useful preparation for real DAWs because visual scale helpers are guides, not rules about which MIDI notes may be used.",
    pitfall: "An out-of-scale note is not automatically a mistake. Judge its function, preparation, and resolution in context.",
    vocabulary: ["modal mixture", "borrowed chord", "parallel key", "chromatic"],
    stage: "notes",
  },
  "instrument-palette": {
    concept: "Instrumentation separates musical content from the sound source performing it. The same notes can be rendered by different instruments.",
    changes: "You are changing timbre and articulation while keeping much of the MIDI composition fixed.",
    dawLocation: "On a MIDI track, swapping the instrument plugin or preset changes the sound after the clip but before later audio effects.",
    whyItMatters: "This makes plugin chains readable: clip data feeds an instrument, the instrument creates audio, and audio then continues through effects and the mixer.",
    pitfall: "A brighter or louder preset can seem better in isolation while fitting the arrangement worse. Audition it in context.",
    vocabulary: ["instrument plugin", "preset", "timbre", "MIDI track"],
    stage: "instrument",
  },
};

const playLabRepresentations: Record<Workspace, string> = {
  drums: "PLAY/LAB shows the pattern as rows of lit steps. Each step is an event on the timeline, not recorded audio.",
  compare: "PLAY/LAB keeps two pattern states available so you can switch between versions without relying on memory.",
  "piano-key": "PLAY/LAB uses a keyboard to isolate pitch before adding a horizontal time axis.",
  melody: "PLAY/LAB shows notes as blocks on a small piano roll: height is pitch, position is time, and width is duration.",
  chords: "PLAY/LAB shows chord tones as simultaneous note blocks so the chord symbol and the notes that create it stay connected.",
  "harmony-song": "PLAY/LAB uses a four-bar polyphonic piano roll where you write the accompaniment notes under the existing groove and melody.",
  synth: "PLAY/LAB exposes oscillator, filter, and envelope controls as one compact instrument so you can follow how MIDI becomes audio.",
  arrangement: "PLAY/LAB reduces the arrangement to a short horizontal song map where each layer can enter, leave, or return by section.",
  mixer: "PLAY/LAB uses repeated channel strips with faders, pan, and sends so each part can be read as one signal path.",
  "automation-dynamics": "PLAY/LAB separates a drawn automation lane from a compressor, making written parameter changes distinct from signal-reactive processing.",
  effects: "PLAY/LAB groups reverb, delay, and chorus as processors after the sound source and exposes their send or wet controls directly.",
  "final-project": "PLAY/LAB brings the familiar writing, arrangement, mixer, automation, and effects controls together around the same saved project.",
  voicing: "PLAY/LAB lets you rearrange the same chord tones vertically so inversions are visible as note placement rather than new chord names.",
  bass: "PLAY/LAB uses the same time-and-pitch grid as melody, but in a low register and against the existing groove and harmony.",
  "groove-feel": "PLAY/LAB places per-note velocity beside the drum pattern and keeps swing as a timing control for the shared subdivision grid.",
  motif: "PLAY/LAB gives you a compact piano roll where a phrase can be duplicated, transposed, shortened, or answered.",
  "melody-harmony": "PLAY/LAB overlays melodic editing with the harmony underneath so local chord relationships can be heard while notes are moved.",
  "harmonic-function": "PLAY/LAB keeps harmonic-function labels beside editable harmony MIDI, separating the theory description from the note data that produces it.",
  "phrase-form": "PLAY/LAB represents form as a sixteen-bar layer plan so repeated and contrasting regions are visible before the full DAW timeline appears.",
  texture: "PLAY/LAB uses register, doubling, voicing, and layer-density controls to change how simultaneous parts occupy musical space.",
  eq: "PLAY/LAB uses a frequency-versus-gain graph with movable bands, matching the basic geometry of a parametric EQ plugin.",
  saturation: "PLAY/LAB exposes drive and blend on individual channels so you can hear nonlinear colour without navigating a full plugin browser.",
  sidechain: "PLAY/LAB shows the kick as the control source and the bass as the target, then lets amount and recovery time change the ducking relationship.",
  stereo: "PLAY/LAB puts pan, width, and mono audition beside the mix so left/right placement and mono compatibility can be compared directly.",
  reference: "PLAY/LAB stores a mix snapshot and gives you fast, level-conscious A/B switching rather than importing a separate reference file.",
  "minor-key": "PLAY/LAB reuses the piano roll and changes the tonal map around the same notes, making tonal centre a musical interpretation rather than a new editor.",
  "harmonic-minor": "PLAY/LAB keeps the same note grid but introduces the raised seventh explicitly so one chromatic change can be followed in melody and cadence.",
  "minor-harmony": "PLAY/LAB uses the existing harmony piano roll for minor progressions, including the altered dominant, instead of introducing another notation system.",
  "seventh-harmony": "PLAY/LAB extends the familiar chord stacks by one editable note, so seventh chords remain ordinary MIDI voicings.",
  "borrowed-harmony": "PLAY/LAB leaves chromatic notes editable in the same harmony grid so out-of-key colour is treated as deliberate note data, not an exception mode.",
  "instrument-palette": "PLAY/LAB keeps the MIDI material fixed while voice selectors change the instrument that performs it, making content and timbre separate layers.",
};

const checkpoints: Record<number, DawCheckpoint> = {
  5: {
    title: "DAW checkpoint · Read a piano roll",
    intro: "You now know enough to decode the note editor that appears in almost every DAW. It is not a new musical system; it combines ideas you have already used.",
    objects: [
      { name: "Vertical axis", meaning: "Pitch: higher rows are higher notes." },
      { name: "Horizontal axis", meaning: "Time: notes farther right happen later." },
      { name: "Note block", meaning: "One MIDI event; its width represents duration." },
      { name: "Velocity lane", meaning: "Per-note performance strength or emphasis." },
      { name: "Clip", meaning: "A container holding this note data on the song timeline." },
    ],
    challenge: "When you next see a piano roll, identify pitch, time, duration, velocity, and the clip boundary before touching any controls.",
  },
  10: {
    title: "DAW checkpoint · Read the main project screen",
    intro: "A full project view can look dense because many familiar systems are visible at once. Read it in layers instead of trying to understand every button.",
    objects: [
      { name: "Transport", meaning: "Play, stop, position, tempo, and sometimes loop controls." },
      { name: "Timeline", meaning: "The song running from left to right." },
      { name: "Tracks", meaning: "Horizontal lanes for musical or audio roles." },
      { name: "Clips / regions", meaning: "Containers placed on tracks at particular times." },
      { name: "Mixer", meaning: "Repeated channel strips controlling the signal from each track." },
      { name: "Devices / plugins", meaning: "The instrument and effects attached to a selected track." },
      { name: "Automation", meaning: "Stored parameter changes drawn across time." },
    ],
    challenge: "Ignore the small buttons. First find these seven objects. If you can locate them, you can already read the architecture of the project.",
  },
  29: {
    title: "DAW checkpoint · From PLAY/LAB to a real DAW",
    intro: "You have now met the main parts separately. A real DAW shows them together, but the signal still follows the same path you have already been using.",
    objects: [
      { name: "MIDI / performance data", meaning: "Says what note or event should happen and when." },
      { name: "Instrument", meaning: "Turns that instruction into audio." },
      { name: "Insert effects", meaning: "Process that audio in sequence." },
      { name: "Channel", meaning: "Controls level, pan, sends, and routing." },
      { name: "Bus / master", meaning: "Combines signals before the final output." },
      { name: "Speakers / headphones", meaning: "Turn the final audio signal back into sound." },
    ],
    challenge: "Pick one track in a DAW and trace it from clip data to instrument, processing, channel, master, and speakers. Then identify which controls change the composition and which change the resulting audio.",
  },
};

export const dawStages: Array<{ id: DawStage; label: string }> = [
  { id: "timeline", label: "Timeline" },
  { id: "notes", label: "Notes / MIDI" },
  { id: "instrument", label: "Instrument" },
  { id: "effects", label: "Effects" },
  { id: "mixer", label: "Mixer" },
  { id: "master", label: "Output" },
];

const dawStageIntroducedByLesson: Record<DawStage, number> = {
  timeline: 1,
  notes: 1,
  instrument: 5,
  effects: 7,
  mixer: 7,
  master: 10,
};

export type DawStageFamiliarity = "current" | "familiar" | "upcoming";

export function getDawStageFamiliarity(
  stage: DawStage,
  currentStage: DawStage,
  lessonNumber: number,
): DawStageFamiliarity {
  if (stage === currentStage) {
    return "current";
  }

  return dawStageIntroducedByLesson[stage] <= lessonNumber
    ? "familiar"
    : "upcoming";
}

export function getDawTransfer(workspace: Workspace): DawTransferProfile {
  return transferProfiles[workspace];
}

export function getPlayLabRepresentation(workspace: Workspace): string {
  return playLabRepresentations[workspace];
}

export function getDawCheckpoint(lessonNumber: number): DawCheckpoint | undefined {
  return checkpoints[lessonNumber];
}
