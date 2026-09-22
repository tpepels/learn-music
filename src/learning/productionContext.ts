export type ConceptVisualKind =
  | "drum-machine"
  | "variation"
  | "keyboard"
  | "piano-roll"
  | "harmony"
  | "synth"
  | "arrangement"
  | "mixer"
  | "automation"
  | "effects"
  | "final"
  | "voice-leading"
  | "bassline";

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

  "mixing.balance-space.a": {
    why: "Level is the first and most powerful mixing decision. Producers balance faders before reaching for complicated processing because many 'mix problems' are simply parts competing at the wrong relative loudness.",
    when: "After the composition and rough arrangement exist, at the start of a mix. Engineers also revisit level constantly throughout the rest of the process.",
    tools: ["Mixer channel", "Volume fader", "Level meter", "DAW mixer view"],
    visual: "mixer",
    realWorld: "In a DAW mixer, every track has a vertical channel strip with a fader and meter. Hardware mixers use the same visual convention.",
  },
  "mixing.balance-space.b": {
    why: "Panning separates sounds horizontally so they do not all fight for the same perceived position. Keeping foundational low-end material centred while moving supporting parts can create width without adding new notes.",
    when: "During rough mixing after basic level balance, then refined again once the arrangement and effects are established.",
    tools: ["Pan knob", "Stereo field", "Mixer channel", "Headphones or stereo monitors"],
    visual: "mixer",
    realWorld: "Pan is normally a knob near the top of every DAW or hardware mixer channel, marked L–C–R or with a left/right scale.",
  },
  "mixing.balance-space.c": {
    why: "Removing low frequencies that a sound does not need reduces masking and leaves more room for kick and bass. It is a cleanup move, not a rule that every track must be made thin.",
    when: "During corrective EQ and cleanup, usually after rough level/pan balance and before detailed tonal shaping.",
    tools: ["EQ plugin", "High-pass filter", "Low-cut control", "Spectrum analyzer"],
    visual: "mixer",
    realWorld: "Most DAW channel EQs show a frequency graph. A low-cut appears as a rising slope on the left side, removing the lowest frequencies.",
  },
  "mixing.balance-space.d": {
    why: "Shared reverb and delay create depth and cohesion without duplicating the same effect on every track. Sends let each channel feed the shared effect by a different amount.",
    when: "After the dry balance is working. Producers add spatial effects during mixing and often automate them later for transitions or emphasis.",
    tools: ["Send knob", "Return channel", "Reverb bus", "Delay bus", "Aux track"],
    visual: "mixer",
    realWorld: "DAWs commonly show send knobs on each channel and separate return/aux channels labelled A/B or Reverb/Delay. Hardware mixers use AUX SEND and RETURN controls for the same routing idea.",
  },

  "production.automation-dynamics.a": {
    why: "A static fader can be correct at one moment and wrong at another. Volume automation lets producers shape the foreground continuously so important phrases come forward without changing the performance itself.",
    when: "Usually after the rough mix is established, during detailed mixing and arrangement refinement. It is also common during vocal rides, builds, fades, and transitions.",
    tools: ["Automation lane", "Volume automation", "Breakpoints", "DAW arrangement view"],
    visual: "automation",
    realWorld: "In most DAWs, pressing an automation key or opening an automation lane reveals a line across the track. Producers add breakpoints and drag the line up or down over time.",
  },
  "production.automation-dynamics.b": {
    why: "A filter sweep creates motion in timbre without rewriting notes. Producers use it to hide and reveal harmonics gradually, making a section feel as though it is opening, closing, or building toward an arrival.",
    when: "During arrangement and transition design, especially before choruses, drops, climaxes, and breakdowns.",
    tools: ["Filter cutoff", "Automation lane", "Low-pass filter", "Synth or EQ plugin"],
    visual: "automation",
    realWorld: "A cutoff automation curve often slopes upward across several bars while the filter knob moves automatically during playback.",
  },
  "production.automation-dynamics.c": {
    why: "Compression controls peaks and narrows dynamic range. Producers use it when individual hits jump out too much or when a drum bus needs more consistent impact.",
    when: "During mixing after basic level balance. Compression is often inserted directly on a channel or bus before or after EQ depending on the goal.",
    tools: ["Compressor", "Threshold", "Ratio", "Attack", "Release", "Gain-reduction meter"],
    visual: "automation",
    realWorld: "A compressor plugin normally shows threshold, ratio, attack, release, and a gain-reduction meter. Hardware compressors use the same controls as knobs and meters.",
  },
  "production.automation-dynamics.d": {
    why: "Compression is not only about making things even. Attack and release reshape transients, while automation shapes the larger energy curve. Using both together lets production decisions support the same musical arrival.",
    when: "During detailed mixing and final arrangement refinement, after the core groove, harmony, and structure are already working.",
    tools: ["Compressor timing", "Automation curves", "Drum bus", "Arrangement view", "A/B bypass"],
    visual: "automation",
    realWorld: "Producers often loop a section, adjust compressor attack/release by ear, then draw automation around the same section so punch, brightness, and level all reinforce its structure.",
  },

  "production.effects-transitions.a": {
    why: "Reverb is one of the main ways producers create front-to-back depth. Decay, pre-delay, and send amount let a sound feel spacious without automatically becoming blurry.",
    when: "After the dry balance is working, during mixing and transition design. Reverb is also revisited later when arrangement density changes.",
    tools: ["Reverb return", "Decay", "Pre-delay", "Send level", "Aux bus"],
    visual: "effects",
    realWorld: "DAWs often place reverb on a return/aux channel. Individual tracks feed it with send knobs while the return contains the shared reverb plugin.",
  },
  "production.effects-transitions.b": {
    why: "Delay can become a rhythmic part of the arrangement. Feedback controls how long that secondary rhythm continues after each source note.",
    when: "During sound design, mixing, fills, phrase endings, and transitions when a part should leave rhythmic traces behind it.",
    tools: ["Tempo-synced delay", "Feedback", "Send level", "Delay return"],
    visual: "effects",
    realWorld: "A DAW delay often displays note-value timing such as 1/8 or 1/4 plus a feedback control. The source reaches it through a send or insert.",
  },
  "production.effects-transitions.c": {
    why: "Chorus creates width and motion without writing another musical line. It can make a lead or pad feel larger while leaving its centre position recognizable.",
    when: "During sound design or mixing when a source feels too narrow or static but should not simply be made louder.",
    tools: ["Chorus insert", "Wet/dry mix", "Modulation rate", "Stereo spread"],
    visual: "effects",
    realWorld: "Chorus usually appears as an insert plugin directly on one track, unlike a shared reverb return. Hardware chorus pedals and synth effects use the same modulation idea.",
  },
  "production.effects-transitions.d": {
    why: "Transitions feel stronger when several cues move in the same direction. Combining filter movement, ambience, delay, and width creates one larger gesture rather than unrelated tricks.",
    when: "At section boundaries, builds, breakdowns, intros, outros, and anywhere the arrangement needs to signal that something is about to change.",
    tools: ["FX automation", "Filter sweep", "Send automation", "Riser", "Delay throw"],
    visual: "effects",
    realWorld: "In a DAW, transition work often looks like several automation lanes rising or changing around the same bar while effect returns become temporarily more active.",
  },

  "production.final-project.a": {
    why: "A production is easier to finish when the musical foundation can stand without heavy processing. Auditing the composition prevents endless mixing of material that still needs writing.",
    when: "Before final mixing and again whenever production work starts feeling like compensation for a weak musical idea.",
    tools: ["Arrangement playback", "Mute/bypass", "Piano roll", "Chord track", "Drum editor"],
    visual: "final",
    realWorld: "Producers often bypass effects or mute layers to check whether the groove, melody, and harmony still communicate on their own.",
  },
  "production.final-project.b": {
    why: "A complete track needs a large-scale reason to keep listening. Arrangement auditing checks whether energy, density, and contrast actually change across time.",
    when: "Before the final production pass, after the main writing and arrangement decisions have been made.",
    tools: ["Arrangement view", "Section markers", "Track mutes", "Energy reference"],
    visual: "final",
    realWorld: "A DAW arrangement often reveals structure visually before playback: dense and sparse regions, repeated blocks, transitions, and section boundaries are visible across the timeline.",
  },
  "production.final-project.c": {
    why: "The final production pass is about relationships rather than adding more processing. It checks whether level, space, movement, dynamics, and effects all support the same musical priorities.",
    when: "Near the end of the project, after all major writing and structural decisions are stable.",
    tools: ["Mixer", "Automation", "Compressor", "Effects rack", "A/B bypass"],
    visual: "final",
    realWorld: "Engineers repeatedly compare processed and unprocessed states, loop problem sections, and make small changes rather than rebuilding the whole mix.",
  },
  "production.final-project.d": {
    why: "Saving a versioned project preserves the decisions behind the sound. The editable session and the final audio render serve different purposes and should not be confused.",
    when: "At milestones, before risky changes, before collaboration, and at the end of a session or project.",
    tools: ["Project file", "Save As", "Version number", "Bounce/export"],
    visual: "final",
    realWorld: "DAWs save editable project/session files and separately render WAV/AIFF/MP3 audio. Versioned filenames let producers return to earlier decisions.",
  },

  "harmony.voice-leading.a": {
    why: "Root position makes chord identity obvious and gives you a reference before changing the internal note order.",
    when: "During harmony writing, keyboard arranging, and before refining how adjacent chords connect.",
    tools: ["Piano", "Chord track", "MIDI editor", "Voicing controls"],
    visual: "voice-leading",
    realWorld: "In a piano roll, root-position triads appear as three stacked notes with the chord root at the bottom.",
  },
  "harmony.voice-leading.b": {
    why: "First inversion changes the bass note while keeping the same chord, often reducing jumps between adjacent harmonies.",
    when: "When a progression sounds blocky, the bass leaps too far, or an accompaniment needs smoother movement.",
    tools: ["Piano", "Chord inversion", "Piano roll", "Chord voicing"],
    visual: "voice-leading",
    realWorld: "On a keyboard, first inversion is the same three chord tones rearranged so the third becomes the lowest note.",
  },
  "harmony.voice-leading.c": {
    why: "Second inversion gives another route through the same harmony and can create passing, pedal, or cadential motion.",
    when: "While shaping accompaniment, bass motion, or transitions between close-position chords.",
    tools: ["Piano", "Second inversion", "MIDI editor", "Chord track"],
    visual: "voice-leading",
    realWorld: "DAWs do not label inversions automatically in most workflows; producers see them as the same chord notes moved into a different vertical order.",
  },
  "harmony.voice-leading.d": {
    why: "Smooth voice leading makes harmony feel connected because individual notes move by small intervals or remain common tones.",
    when: "After the chord progression works functionally but before finalizing piano, pad, string, or vocal-harmony parts.",
    tools: ["Piano roll", "Chord voicing", "Common-tone analysis", "Keyboard"],
    visual: "voice-leading",
    realWorld: "In a MIDI editor, smooth voice leading looks like short horizontal or diagonal movements instead of every note jumping to a distant register.",
  },

  "composition.bass-lines.a": {
    why: "Chord roots in the bass make harmonic changes immediately legible and give the groove a stable foundation.",
    when: "At the start of bass writing, once the chord progression exists.",
    tools: ["Bass instrument", "Piano roll", "Chord track", "Grid"],
    visual: "bassline",
    realWorld: "Bass MIDI often begins with root notes aligned to chord changes before rhythmic detail is added.",
  },
  "composition.bass-lines.b": {
    why: "Thirds and fifths let the bass describe the chord melodically rather than only repeating roots.",
    when: "After root anchors are clear, while adding contour and movement inside each bar.",
    tools: ["Bass piano roll", "Chord tones", "Keyboard", "Loop playback"],
    visual: "bassline",
    realWorld: "A bass clip often shows root notes on strong beats with other chord tones filling the spaces between changes.",
  },
  "composition.bass-lines.c": {
    why: "Approach notes create a short pull toward the next chord root and make transitions feel intentional.",
    when: "Near bar lines and chord changes, especially when a static bass line needs more forward motion.",
    tools: ["Chromatic note", "Eighth-note grid", "Piano roll", "Nudge"],
    visual: "bassline",
    realWorld: "An approach note often appears one grid position before the next chord change, a semitone or whole tone from the destination.",
  },
  "composition.bass-lines.d": {
    why: "A complete bass phrase must support harmony and rhythm while still having its own contour and use of silence.",
    when: "Once roots, chord tones, and transitions are understood, before detailed sound design and mixing.",
    tools: ["Bass instrument", "MIDI clip", "Drum groove", "Chord track"],
    visual: "bassline",
    realWorld: "Producers commonly loop drums, chords, and bass together while editing the bass line until it locks rhythmically without obscuring the harmony.",
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
