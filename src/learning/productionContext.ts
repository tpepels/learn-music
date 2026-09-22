export type ConceptVisualKind =
  | "drum-machine"
  | "variation"
  | "keyboard"
  | "piano-roll"
  | "harmony"
  | "synth"
  | "arrangement";

export type ProductionContext = {
  why: string;
  when: string;
  tools: string[];
  visual: ConceptVisualKind;
  realWorld: string;
};

export const productionContext: Record<string, ProductionContext> = {
  "rhythm.pulse-and-groove.a": {
    why: "A steady four-on-the-floor kick makes the beat impossible to lose. Producers use it when they want the track to feel physically grounded and easy to move to.",
    when: "Usually very early: while sketching the groove or laying down the rhythmic foundation before bass, chords, and melody.",
    tools: ["Drum machine", "Step sequencer", "DAW drum rack", "Kick sample"],
    visual: "drum-machine",
    realWorld: "You will see this as lit steps on hardware grooveboxes and as a row of MIDI notes in a DAW drum editor.",
  },
  "rhythm.pulse-and-groove.b": {
    why: "The backbeat gives the listener a strong recurring answer to the kick. It creates the familiar body movement of pop, rock, funk, hip-hop, and many electronic styles.",
    when: "During groove construction, often immediately after the kick pattern is established.",
    tools: ["Snare or clap", "Drum rack", "Step sequencer", "MIDI editor"],
    visual: "drum-machine",
    realWorld: "On a drum machine this is usually two bright pads or steps on beats 2 and 4; in a DAW it appears as repeated snare MIDI notes.",
  },
  "rhythm.pulse-and-groove.c": {
    why: "Subdivision gives the ear a finer timing grid. It makes the groove feel more continuous and gives later syncopation something to push against.",
    when: "After the main beats are clear, while adding hi-hats, shakers, percussion, or other time-keeping parts.",
    tools: ["Hi-hat", "Step sequencer", "Quantize grid", "Groovebox"],
    visual: "drum-machine",
    realWorld: "DAWs show this as smaller grid divisions such as 1/8 or 1/16. Hardware sequencers often show the same subdivision as evenly spaced step buttons.",
  },
  "rhythm.pulse-and-groove.d": {
    why: "Syncopation stops a groove from feeling mechanically square. It creates push, surprise, and forward motion by emphasizing weaker positions.",
    when: "Once the basic groove works. Producers add it while making a loop more alive or when a section needs extra momentum.",
    tools: ["Step sequencer", "MIDI editor", "Nudge", "Velocity/accent controls"],
    visual: "drum-machine",
    realWorld: "In a piano roll or drum editor, syncopated notes appear between the strong beat lines instead of sitting only on them.",
  },

  "rhythm.variation.a": {
    why: "Exact repetition builds recognition, but small changes stop the listener from tuning out. Variation gives a loop memory and movement at the same time.",
    when: "After a core loop works, before arranging it into a longer section.",
    tools: ["Pattern duplicate", "Clip duplicate", "Step sequencer", "MIDI editor"],
    visual: "variation",
    realWorld: "DAWs and grooveboxes often use Pattern A / Pattern B or duplicated clips so one version can stay intact while another is edited.",
  },
  "rhythm.variation.b": {
    why: "A fill signals that a phrase is ending or that something new is about to happen. It gives the listener a small structural cue without stopping the groove.",
    when: "Near the end of bars, phrases, verses, or before drops and section changes.",
    tools: ["Drum fill", "MIDI editor", "Tom/snare samples", "Pattern variation"],
    visual: "variation",
    realWorld: "Producers often duplicate the last bar of a loop and make only that bar busier.",
  },
  "rhythm.variation.c": {
    why: "Anticipation creates forward pull because an event arrives just before the place the ear expects it. It is one of the simplest ways to make rhythm feel eager.",
    when: "When a groove feels too static, or before a chord change, downbeat, chorus, or drop.",
    tools: ["MIDI nudge", "Off-grid note", "Step sequencer", "Quantize settings"],
    visual: "variation",
    realWorld: "In a DAW you will often see an anticipatory note slightly before a major grid line.",
  },
  "rhythm.variation.d": {
    why: "A turnaround makes a loop feel like a phrase with an ending rather than an endless copy-paste. It prepares the ear for the return to bar 1.",
    when: "At the end of a loop, phrase, verse, or repeated section.",
    tools: ["Last-bar variation", "Clip duplication", "Fill", "Automation"],
    visual: "variation",
    realWorld: "A common workflow is to keep bars 1–3 identical and edit bar 4 as the turnaround.",
  },

  "pitch.melody.a": {
    why: "A key narrows the pitch choices to a coherent family. That lets composers make decisions about direction and tension without treating every piano key as equally likely.",
    when: "At the start of writing, or whenever melody and harmony need a common tonal home.",
    tools: ["Piano/keyboard", "Scale highlighting", "MIDI keyboard", "DAW piano roll"],
    visual: "keyboard",
    realWorld: "Many DAWs can highlight notes belonging to a key; hardware keyboards often teach the same idea physically through the repeating black/white pattern.",
  },
  "pitch.melody.b": {
    why: "Restricting a first melody to one key helps you hear contour, rhythm, and phrasing before adding chromatic tension.",
    when: "During the first melodic sketch, especially when harmony is simple or not yet written.",
    tools: ["Piano roll", "MIDI keyboard", "Scale lock", "Loop playback"],
    visual: "piano-roll",
    realWorld: "The piano roll is one of the most common DAW views: pitch runs vertically, time horizontally, and notes are blocks.",
  },
  "pitch.melody.c": {
    why: "Scale degrees describe what a note does, not just what it is called. 1, 3, and 5 strongly define the tonic chord and often make a melody feel harmonically stable.",
    when: "While refining a melody against chords or checking why some notes feel settled and others feel tense.",
    tools: ["Piano roll", "Chord track", "Scale-degree labels", "Keyboard"],
    visual: "piano-roll",
    realWorld: "Songwriters often think 'root, third, fifth' while playing even if the DAW only displays note names.",
  },
  "pitch.melody.d": {
    why: "Motifs give listeners something they can remember. Repeating and answering a motif is how a few notes become a larger phrase instead of random pitch events.",
    when: "During melody writing, hook writing, lead lines, bass lines, and thematic development.",
    tools: ["Piano roll", "MIDI clip", "Loop", "Duplicate/copy"],
    visual: "piano-roll",
    realWorld: "In a DAW, motifs often appear as visibly repeated note shapes inside a MIDI clip.",
  },

  "harmony.chords.a": {
    why: "Triads are the basic harmonic building blocks of a huge amount of Western tonal music. Hearing root, third, and fifth makes later chord vocabulary much easier.",
    when: "While choosing harmony under a melody, sketching on piano, or building a pad/guitar/keyboard part.",
    tools: ["Piano", "Chord track", "MIDI keyboard", "Piano roll"],
    visual: "harmony",
    realWorld: "In a piano roll, a chord looks like several note blocks stacked vertically at the same time position.",
  },
  "harmony.chords.b": {
    why: "I, IV, and V provide home, departure, and tension. They make harmonic motion understandable as function rather than as a list of chord names.",
    when: "During songwriting and progression building, before voicing, instrumentation, and production details.",
    tools: ["Piano", "Chord track", "Roman numerals", "MIDI clips"],
    visual: "harmony",
    realWorld: "Many songwriters sketch these functions on piano first, then program or record the final instrument later.",
  },
  "harmony.chords.c": {
    why: "V–I is a strong resolution because several notes in V naturally pull toward notes in I. Producers use cadences to create arrival and closure.",
    when: "At endings, phrase boundaries, pre-chorus-to-chorus moves, and anywhere a section should feel resolved.",
    tools: ["Chord track", "Keyboard", "MIDI clips", "Bass movement"],
    visual: "harmony",
    realWorld: "In a DAW, cadences are usually just adjacent chord clips—but musicians hear them as tension followed by release.",
  },
  "harmony.chords.d": {
    why: "A progression is a reusable harmonic journey. I–V–vi–IV loops well because it moves through stability, tension, minor colour, and an open return.",
    when: "Very early in songwriting or beat-making, often before the final melody and arrangement.",
    tools: ["Chord track", "Piano", "MIDI clips", "Loop region"],
    visual: "harmony",
    realWorld: "Producers often loop four chord clips while trying melodies, bass lines, and sound choices on top.",
  },

  "sound.synthesis.a": {
    why: "Waveforms change timbre without changing the note. Learning them lets you choose a starting character instead of browsing presets blindly.",
    when: "At the beginning of sound design, before filtering, modulation, effects, and mixing.",
    tools: ["Oscillator", "Synth plugin", "Hardware synthesizer", "Waveform selector"],
    visual: "synth",
    realWorld: "Nearly every subtractive synth has an oscillator section labelled OSC with waveform buttons or a selector.",
  },
  "sound.synthesis.b": {
    why: "Filters let producers shape brightness and remove spectral energy that is not useful. They are central to both sound design and musical movement.",
    when: "During synth programming, arrangement transitions, and later during mixing when a sound occupies too much high-frequency space.",
    tools: ["Low-pass filter", "Cutoff knob", "Synth filter", "Automation lane"],
    visual: "synth",
    realWorld: "The cutoff knob is one of the most recognizable controls on hardware synths and software instruments.",
  },
  "sound.synthesis.c": {
    why: "The envelope changes how a sound behaves in time. The same spectrum can feel like a pluck, stab, bass, or pad depending on its attack and release.",
    when: "During sound design, after choosing the oscillator/filter and before adding effects.",
    tools: ["ADSR envelope", "Attack knob", "Release knob", "Amp envelope"],
    visual: "synth",
    realWorld: "Hardware synths commonly expose A D S R as four sliders or knobs; software synths often show the envelope as a graph.",
  },
  "sound.synthesis.d": {
    why: "Combining several small parameter choices is how producers create a sound with a specific musical role instead of only changing isolated knobs.",
    when: "When designing the actual instrument for a track—pad, bass, lead, pluck, texture—before detailed mixing.",
    tools: ["Synth plugin", "Hardware synth", "Preset save", "Effects chain"],
    visual: "synth",
    realWorld: "Real sound design is usually a signal path: oscillator → filter → envelope/amp → effects.",
  },

  "form.arrangement.a": {
    why: "Layer density is one of the easiest ways to control energy. Adding parts feels like growth; removing them creates space and focus.",
    when: "After you have a strong loop and need to turn it into more than one repeated bar.",
    tools: ["Arrangement view", "Track mute", "Clip blocks", "Mixer"],
    visual: "arrangement",
    realWorld: "In a DAW arrangement view, tracks run horizontally and time runs left to right. Energy changes are visible as clips enter and leave.",
  },
  "form.arrangement.b": {
    why: "Contrast tells the listener that a new section has arrived. Without it, verses, choruses, and drops can feel like the same loop with different labels.",
    when: "While arranging sections after the core musical material exists.",
    tools: ["Arrangement view", "Clip duplication", "Track mute", "Section markers"],
    visual: "arrangement",
    realWorld: "Producers often duplicate an 8- or 16-bar block, then remove/add clips to make the second section different.",
  },
  "form.arrangement.c": {
    why: "A build creates expectation before a high-energy moment. Density is one tool; automation, risers, drums, harmony, and dynamics can reinforce it.",
    when: "Before choruses, drops, climaxes, or major section changes.",
    tools: ["Automation", "Arrangement view", "Risers", "Drum fills", "Filter sweeps"],
    visual: "arrangement",
    realWorld: "DAW builds often look denser toward the right as more clips and automation appear before the arrival.",
  },
  "form.arrangement.d": {
    why: "Release makes the climax meaningful. If everything stays maximally dense, the ear adapts and the track stops feeling dynamic.",
    when: "Immediately after peaks, drops, choruses, or busy passages.",
    tools: ["Track mute", "Clip removal", "Automation", "Mixer", "Arrangement view"],
    visual: "arrangement",
    realWorld: "A common arrangement move is to remove drums, bass, or melody right after a peak so the next section breathes.",
  },
};

export function getProductionContext(exerciseId: string): ProductionContext {
  return productionContext[exerciseId] ?? {
    why: "Music makers use this technique because it gives them more control over what the listener hears and feels.",
    when: "Use it while developing the musical idea, then revisit it during arrangement and production.",
    tools: ["DAW", "MIDI editor", "Instrument"],
    visual: "arrangement",
    realWorld: "The same idea appears in both hardware instruments and DAW workflows.",
  };
}
