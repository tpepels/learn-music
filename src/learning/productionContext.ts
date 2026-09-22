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
  | "bassline"
  | "groove-feel"
  | "motif"
  | "melody-harmony"
  | "harmonic-function"
  | "phrase-form"
  | "texture"
  | "eq"
  | "saturation"
  | "sidechain"
  | "stereo"
  | "reference";

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
    tools: ["Chorus effect", "Wet amount", "Modulation rate", "Stereo spread"],
    visual: "effects",
    realWorld: "Chorus can be inserted directly or blended in parallel. PLAY / LAB uses a parallel chorus path so the dry melody remains available even if the optional effect cannot initialise.",
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

  "rhythm.groove-feel.a": {
    why: "Velocity creates dynamic hierarchy. Strong structural hits can anchor the body while lighter parts keep time without competing for attention.",
    when: "After note placement works, while programming drums, MIDI percussion, or any repeated part that sounds mechanically equal.",
    tools: ["Velocity lane", "MIDI editor", "Drum machine", "Accent control"],
    visual: "groove-feel",
    realWorld: "DAWs usually show velocity as vertical bars underneath MIDI notes. Hardware sequencers often expose velocity or accent per step.",
  },
  "rhythm.groove-feel.b": {
    why: "Alternating accents turn repeated subdivisions into phrasing. Real players rarely strike every repeated note with exactly the same force.",
    when: "While refining hi-hats, shakers, ostinatos, and repeated keyboard or percussion patterns.",
    tools: ["Velocity lane", "Accent pattern", "MIDI clip", "Groovebox"],
    visual: "groove-feel",
    realWorld: "A DAW velocity lane often shows a repeating tall-short pattern beneath evenly spaced MIDI notes.",
  },
  "rhythm.groove-feel.c": {
    why: "Ghost notes add quiet motion between primary accents. They create texture without changing which beats feel structurally important.",
    when: "After the main groove is clear, especially in snare, percussion, funk, hip-hop, and live-feeling programmed drums.",
    tools: ["Low MIDI velocity", "Drum sequencer", "Snare articulation", "Velocity lane"],
    visual: "groove-feel",
    realWorld: "Ghost notes look like ordinary MIDI notes with much shorter velocity bars than the main backbeat notes.",
  },
  "rhythm.groove-feel.d": {
    why: "Swing changes subdivision timing without changing the note pattern itself, creating bounce or lilt from the same visible grid.",
    when: "When straight quantized timing feels too rigid, or when working in jazz-influenced, hip-hop, house, shuffle, or swung electronic grooves.",
    tools: ["Swing amount", "Groove template", "Quantize settings", "Drum machine"],
    visual: "groove-feel",
    realWorld: "Most DAWs and grooveboxes provide a Swing/Groove control that delays alternating subdivisions while notes can remain visually quantized.",
  },

  "composition.motif-development.a": {
    why: "Exact repetition establishes a musical identity before variation begins, so listeners know which shape later changes are referring back to.",
    when: "Early in melody, riff, hook, or thematic writing, before extending a small idea into a longer phrase.",
    tools: ["MIDI clip", "Piano roll", "Duplicate/copy", "Loop playback"],
    visual: "motif",
    realWorld: "In a DAW, an exact motif repeat appears as the same small MIDI-note shape duplicated later in the clip.",
  },
  "composition.motif-development.b": {
    why: "Transposition creates fresh pitch direction while preserving the interval pattern that makes the motif recognizable.",
    when: "When a phrase needs continuation without introducing completely unrelated melodic material.",
    tools: ["Transpose command", "Piano roll", "MIDI selection", "Keyboard"],
    visual: "motif",
    realWorld: "Producers often select a MIDI phrase and drag it vertically or use a transpose command so the whole shape moves together.",
  },
  "composition.motif-development.c": {
    why: "Fragmentation keeps a trace of the source idea while creating more space and flexibility than another full repetition.",
    when: "During development, transitions, fills, and moments where the original motif should be hinted at rather than restated.",
    tools: ["MIDI edit", "Delete/mute notes", "Clip duplicate", "Loop"],
    visual: "motif",
    realWorld: "In a MIDI editor, fragmentation often looks like only the first one or two notes of a familiar shape surviving in a later phrase.",
  },
  "composition.motif-development.d": {
    why: "Call and response turns repetition into dialogue: the second phrase relates to the first but provides contrast and closure.",
    when: "While building hooks, vocal phrases, lead lines, riffs, bass phrases, and question-answer structures.",
    tools: ["Piano roll", "Phrase loop", "Duplicate/edit", "MIDI keyboard"],
    visual: "motif",
    realWorld: "A DAW often shows two adjacent MIDI shapes with similar rhythm or contour but different endings, making the response visibly related.",
  },

  "composition.melody-over-harmony.a": {
    why: "Landing on chord tones at important moments makes melody and harmony feel deliberately connected rather than coincidentally layered.",
    when: "After the chord progression exists, while revising melodic notes around chord changes and strong beats.",
    tools: ["Chord track", "Piano roll", "Scale highlighting", "Keyboard"],
    visual: "melody-harmony",
    realWorld: "Many DAWs can display chord or scale context behind the piano roll; composers also inspect which melody notes line up vertically with chord notes.",
  },
  "composition.melody-over-harmony.b": {
    why: "Passing tones connect stable notes smoothly and create motion without making every melody note a harmonic destination.",
    when: "While smoothing a melody that sounds too chordal, static, or jumpy between anchor notes.",
    tools: ["Piano roll", "Stepwise MIDI edit", "Chord track", "Loop"],
    visual: "melody-harmony",
    realWorld: "Passing tones appear as short in-between MIDI notes connecting more stable notes by semitone or whole-tone movement.",
  },
  "composition.melody-over-harmony.c": {
    why: "Neighbour notes create a small departure-and-return gesture around one stable pitch, adding decoration without losing focus.",
    when: "During melodic embellishment after the main contour and harmonic anchors already work.",
    tools: ["Piano roll", "MIDI keyboard", "Loop", "Note nudge"],
    visual: "melody-harmony",
    realWorld: "In a piano roll, neighbour motion looks like three notes where the middle block moves one step away and the third returns to the first pitch.",
  },
  "composition.melody-over-harmony.d": {
    why: "A tense non-chord note becomes expressive when it has a clear destination; resolution gives dissonance direction instead of randomness.",
    when: "During detailed melody writing, especially around chord changes, phrase peaks, suspensions, and expressive approach notes.",
    tools: ["Chord track", "Piano roll", "Tension note", "Target tone"],
    visual: "melody-harmony",
    realWorld: "A DAW view makes tension-resolution visible as a note outside the current chord moving by a small interval into a chord tone.",
  },

  "harmony.function.a": {
    why: "Functional roles explain why a progression moves: tonic stabilizes, predominant departs, dominant intensifies, and tonic resolves.",
    when: "While inventing chord progressions from harmonic goals rather than memorized chord-symbol sequences.",
    tools: ["Chord track", "Roman numerals", "Keyboard", "Function labels"],
    visual: "harmonic-function",
    realWorld: "DAWs usually show chord symbols rather than function automatically, so producers commonly annotate I, IV, V or think in functional roles while writing.",
  },
  "harmony.function.b": {
    why: "ii–V–I is a compact example of predominant–dominant–tonic motion and makes functional direction especially easy to hear.",
    when: "During harmony study, songwriting, jazz-influenced writing, turnarounds, intros, and cadential passages.",
    tools: ["Chord track", "Keyboard", "Roman numerals", "Loop region"],
    visual: "harmonic-function",
    realWorld: "In a chord lane, ii–V–I is simply three adjacent chord events, but musicians hear them as departure, tension, and arrival.",
  },
  "harmony.function.c": {
    why: "A deceptive resolution uses an established expectation and redirects it, extending the phrase without removing all harmonic momentum.",
    when: "When a dominant-to-tonic cadence feels too final or predictable and the phrase should continue.",
    tools: ["Chord track", "V–vi progression", "Keyboard", "Loop playback"],
    visual: "harmonic-function",
    realWorld: "The chord lane looks almost cadential until V moves to vi instead of I; the surprise comes from function, not from a special DAW tool.",
  },
  "harmony.function.d": {
    why: "A secondary dominant briefly intensifies a non-tonic chord by giving it its own dominant, introducing purposeful chromatic harmony.",
    when: "When a diatonic progression needs stronger forward pull toward V or another temporary local destination.",
    tools: ["Chord track", "D7 / V/V", "Chromatic note", "Keyboard"],
    visual: "harmonic-function",
    realWorld: "In C major, a D7 chord clip contains F-sharp, visibly outside the key, before resolving to G and then C.",
  },

  "composition.phrase-form.a": {
    why: "Statement-and-answer phrasing gives medium-scale punctuation so music feels spoken in coherent spans rather than as one endless line.",
    when: "After a motif or short phrase exists, before expanding it into full song sections.",
    tools: ["Section markers", "Arrangement view", "Phrase labels", "Loop regions"],
    visual: "phrase-form",
    realWorld: "DAW markers often divide eight bars into related four-bar phrases; A and A-prime labels describe similarity with a changed ending.",
  },
  "composition.phrase-form.b": {
    why: "Binary form creates large-scale contrast by dividing music into two primary identities, A and B.",
    when: "During structural planning before detailed arrangement, production, and transitions are finalized.",
    tools: ["Arrangement markers", "Section labels", "Clip groups", "Timeline"],
    visual: "phrase-form",
    realWorld: "Producers often color or label first-half and second-half blocks differently in the arrangement view to make binary structure visible.",
  },
  "composition.phrase-form.c": {
    why: "Ternary A–B–A gives contrast meaning through return: familiar material is heard differently after the contrasting middle.",
    when: "When a composition needs a clear departure and recognizable return without continuously introducing new sections.",
    tools: ["Section markers", "Arrangement view", "Duplicate section", "Timeline"],
    visual: "phrase-form",
    realWorld: "In a DAW timeline, A–B–A often looks like an earlier block duplicated after a contrasting middle section.",
  },
  "composition.phrase-form.d": {
    why: "AABA establishes the main identity strongly, creates one contrasting bridge, then restores the familiar material.",
    when: "During song-form planning, especially when sixteen- or thirty-two-bar structures need one controlled contrast point.",
    tools: ["Section markers", "Bridge marker", "Arrangement blocks", "Timeline"],
    visual: "phrase-form",
    realWorld: "AABA is visible as three similarly colored/labeled A blocks surrounding one contrasting B/bridge block.",
  },

  "composition.texture-orchestration.a": {
    why: "Register separation can solve clarity problems at the composition stage by giving bass, harmony, and melody different pitch territories.",
    when: "Before EQ and mixing, whenever parts sound crowded despite reasonable levels and timbres.",
    tools: ["Octave transpose", "Piano roll", "Register view", "Arrangement"],
    visual: "texture",
    realWorld: "In a DAW piano roll, register separation is literally vertical distance between bass, chord, and melody MIDI regions.",
  },
  "composition.texture-orchestration.b": {
    why: "Open voicing spreads chord tones over a wider range, reducing midrange congestion while making harmony feel larger.",
    when: "While arranging piano, pads, strings, synth chords, or ensemble parts before detailed mixing.",
    tools: ["Chord voicing", "Octave transpose", "Piano roll", "Keyboard"],
    visual: "texture",
    realWorld: "Opening a chord in MIDI often means selecting the top note and moving it up twelve semitones while the chord identity stays the same.",
  },
  "composition.texture-orchestration.c": {
    why: "Octave doubling reinforces a line across two registers, increasing weight and brightness without changing its pitch-class contour.",
    when: "At climaxes, choruses, lead entrances, orchestral tuttis, or other moments where a line needs more presence.",
    tools: ["Duplicate MIDI", "Octave transpose", "Layered instrument", "Arrangement"],
    visual: "texture",
    realWorld: "Producers often duplicate a MIDI melody to another instrument or octave; the two clips share rhythm and contour but occupy different registers.",
  },
  "composition.texture-orchestration.d": {
    why: "Density contrast makes large moments feel large because sparse moments establish space beforehand.",
    when: "During arrangement and orchestration when energy needs to rise and fall without relying only on volume automation.",
    tools: ["Arrangement view", "Track mute", "Layer count", "Register planning"],
    visual: "texture",
    realWorld: "Dense DAW sections visibly contain more simultaneous clips and layers, while sparse sections expose fewer active tracks.",
  },

  "production.eq-spectral-balance.a": {
    why: "High-pass filtering removes low-frequency energy a part does not need, leaving more headroom and less masking around kick and bass.",
    when: "During cleanup and balance, after the arrangement exists and before more detailed tonal shaping.",
    tools: ["Parametric EQ", "High-pass filter", "Spectrum display", "Channel strip"],
    visual: "eq",
    realWorld: "DAW EQ plugins show a rising low-cut slope on the left side of a frequency graph, usually with cutoff and slope controls.",
  },
  "production.eq-spectral-balance.b": {
    why: "A temporary narrow boost makes one frequency region obvious enough to identify by ear before deciding whether it actually needs correction.",
    when: "While diagnosing boxiness, harshness, resonance, or another tonal quality that is difficult to locate precisely.",
    tools: ["Bell filter", "Frequency sweep", "Gain", "Q"],
    visual: "eq",
    realWorld: "Engineers often drag a narrow boosted EQ node left and right across a plugin graph while a short section loops.",
  },
  "production.eq-spectral-balance.c": {
    why: "Turning the diagnostic boost into a smaller cut preserves the useful character of the source while reducing the part that distracts.",
    when: "Immediately after a sweep has identified a troublesome region and before adding broader tonal boosts.",
    tools: ["Parametric bell", "Cut", "Q", "Bypass A/B"],
    visual: "eq",
    realWorld: "The EQ node stays near the discovered frequency but moves below the 0 dB line and usually becomes less extreme.",
  },
  "production.eq-spectral-balance.d": {
    why: "Complementary EQ lets two parts share a mix by reducing overlap instead of simply turning one of them louder.",
    when: "When foreground and supporting parts compete in similar midrange or presence frequencies.",
    tools: ["Two channel EQs", "Bell cut", "Presence boost", "A/B loop"],
    visual: "eq",
    realWorld: "A mixer may show a modest cut on the supporting chord channel and a modest boost in a nearby region on the lead channel.",
  },

  "production.saturation.a": {
    why: "Bass saturation creates upper harmonics that can make low notes more audible on smaller speakers without changing the written bass line.",
    when: "During sound shaping or mixing when the bass has weight on large systems but disappears on limited playback devices.",
    tools: ["Saturator", "Drive", "Wet/dry", "Bass channel insert"],
    visual: "saturation",
    realWorld: "Saturation plugins usually place Drive/Input beside an output or Mix control and may show a waveform or harmonic meter.",
  },
  "production.saturation.b": {
    why: "Parallel drum distortion adds density beneath the clean transient so the groove can feel heavier without losing all attack definition.",
    when: "During drum-bus processing after the basic balance and compression are working.",
    tools: ["Distortion insert", "Wet/dry mix", "Drum bus", "Parallel processing"],
    visual: "saturation",
    realWorld: "Many distortion plugins have a Mix knob; engineers drive the processor hard but blend only a portion of it into the drum bus.",
  },
  "production.saturation.c": {
    why: "Small amounts of saturation can change timbre and perceived density without sounding like an obvious special effect.",
    when: "On sustained synths, keys, buses, or channels that feel sterile but do not need audible fuzz.",
    tools: ["Soft saturation", "Drive", "Mix", "Bypass"],
    visual: "saturation",
    realWorld: "Analogue-modelled channel strips and tape plugins often use subtle drive amounts where the waveform change is heard more as colour than distortion.",
  },
  "production.saturation.d": {
    why: "Different saturation amounts preserve contrast between layers; processing every track identically can flatten the mix into one texture.",
    when: "During detailed production after individual saturation choices have been learned in isolation.",
    tools: ["Multiple channel inserts", "Drive", "Wet/dry", "Bypass comparison"],
    visual: "saturation",
    realWorld: "A real session may have strong drum-bus colour, moderate bass saturation, gentle chord colour, and a comparatively clean lead.",
  },

  "production.sidechain.a": {
    why: "Kick-triggered bass ducking creates brief low-end space exactly when the kick arrives instead of permanently turning the bass down.",
    when: "When kick and bass overlap strongly in time and frequency, especially in electronic, pop, and dance-oriented production.",
    tools: ["Compressor sidechain", "Key input", "Gain reduction", "Release"],
    visual: "sidechain",
    realWorld: "A DAW compressor can expose an external Sidechain or Key input; the kick track feeds that detector while the compressor sits on the bass.",
  },
  "production.sidechain.b": {
    why: "Exaggerated ducking makes the gain envelope easy to hear and turns a mixing technique into an intentional rhythmic pumping effect.",
    when: "For obvious electronic pump, transition effects, or simply to learn what sidechain timing is doing before reducing it.",
    tools: ["Sidechain compressor", "Deep gain reduction", "Long release", "Key input"],
    visual: "sidechain",
    realWorld: "The gain-reduction meter drops dramatically on every kick and recovers slowly enough that the bass audibly breathes.",
  },
  "production.sidechain.c": {
    why: "Backing extreme settings down teaches the difference between hearing a processor and benefiting from one.",
    when: "After a diagnostic or exaggerated setup, while returning the track to a more transparent mix balance.",
    tools: ["A/B bypass", "Duck amount", "Release", "Gain-reduction meter"],
    visual: "sidechain",
    realWorld: "Engineers often exaggerate threshold or ratio first, set timing by ear, then reduce the amount until the effect becomes less obvious.",
  },
  "production.sidechain.d": {
    why: "Sidechain only solves a real interaction when the trigger and target actually overlap, so arrangement context determines whether the processing matters.",
    when: "During full-track playback after kick, bass, and section structure are already programmed.",
    tools: ["Arrangement view", "Kick key input", "Bass compressor", "Loop region"],
    visual: "sidechain",
    realWorld: "In a DAW, sidechain behaviour is easiest to judge while watching kick and bass clips overlap in the arrangement timeline.",
  },

  "production.stereo-mono.a": {
    why: "Panning supporting parts apart can improve separation while keeping foundational low-end material centred and stable.",
    when: "After rough level balance, before extreme stereo widening or spatial effects are added.",
    tools: ["Pan control", "Mixer", "Stereo monitors", "Headphones"],
    visual: "stereo",
    realWorld: "Every DAW mixer channel has a pan control; low-end channels are commonly near centre while supporting parts move left or right.",
  },
  "production.stereo-mono.b": {
    why: "Mid/side width can make selected layers larger without moving their centre position, but widening everything removes contrast and can weaken translation.",
    when: "During stereo refinement once panning and arrangement roles are already clear.",
    tools: ["Stereo widener", "Mid/side processor", "Width control", "Correlation check"],
    visual: "stereo",
    realWorld: "Stereo-imaging plugins typically show Width or Mid/Side controls, often with bass left narrower than pads or effects.",
  },
  "production.stereo-mono.c": {
    why: "Mono audition reveals whether the mix depends on stereo differences that disappear when left and right are combined.",
    when: "Repeatedly during mixing, especially after widening, chorus, stereo effects, or strong panning decisions.",
    tools: ["Mono button", "Monitor controller", "Utility plugin", "Correlation meter"],
    visual: "stereo",
    realWorld: "Many DAWs or monitor controllers provide a MONO switch so the engineer can collapse the mix without rewriting any panning.",
  },
  "production.stereo-mono.d": {
    why: "A stereo hierarchy combines stable centre information with deliberate side information so spaciousness enhances the mix rather than becoming necessary for comprehension.",
    when: "Near the end of a mix after pan, width, effects, and mono compatibility have all been checked individually.",
    tools: ["Pan", "Stereo width", "Mono audition", "Mixer"],
    visual: "stereo",
    realWorld: "A finished session often shows centred kick/bass, moderately panned leads or support, and wider ambience or harmony around them.",
  },

  "production.reference-mixing.a": {
    why: "A fixed snapshot gives the ears a stable comparison point because memory for detailed tonal and level relationships adapts quickly.",
    when: "Before making a new round of mix changes or when deciding whether a recent edit really improved the project.",
    tools: ["Mix snapshot", "Reference plugin", "A/B switch", "Version recall"],
    visual: "reference",
    realWorld: "DAWs, consoles, and reference plugins commonly let engineers recall previous mixes, alternate states, or imported reference tracks.",
  },
  "production.reference-mixing.b": {
    why: "Repeated A/B switching exposes whether a change genuinely improves balance instead of only feeling exciting because it is new.",
    when: "After making one meaningful mix change and before stacking many additional changes on top of it.",
    tools: ["A/B switch", "Snapshot recall", "Loop playback", "Bypass"],
    visual: "reference",
    realWorld: "Reference plugins often provide large A/B buttons so the engineer can switch instantly without losing the current mixer state.",
  },
  "production.reference-mixing.c": {
    why: "Level matching reduces the powerful louder-is-better bias and makes tonal balance, dynamics, and clarity easier to judge fairly.",
    when: "Before comparing a processed signal, a previous mix, a master, or an external reference track.",
    tools: ["Trim gain", "Loudness meter", "Reference plugin", "A/B switch"],
    visual: "reference",
    realWorld: "Dedicated reference plugins include gain-match controls because even a small loudness difference can skew subjective preference.",
  },
  "production.reference-mixing.d": {
    why: "Quiet and mono checks remove two forms of excitement—high playback level and stereo spread—so the core hierarchy of the mix is easier to judge.",
    when: "During final review and periodically throughout mixing whenever perspective has become stale.",
    tools: ["Monitor level", "Mono switch", "A/B reference", "Small-speaker check"],
    visual: "reference",
    realWorld: "Mix engineers routinely turn monitors down, hit mono, or switch speakers before returning to normal playback with refreshed perspective.",
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
