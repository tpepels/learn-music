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
  | "reference"
  | "relative-minor"
  | "harmonic-minor"
  | "minor-cadence"
  | "seventh-chords"
  | "modal-mixture";

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
    why: "A chord symbol is only an instruction about available harmony. Entering C, E, and G yourself connects the name C major to concrete pitches and to the act of sequencing them.",
    when: "At the start of writing a chord part, before the rhythm, voicing, and texture of that part have been decided.",
    tools: ["Piano roll", "MIDI clip", "Chord label", "Loop playback"],
    visual: "harmony",
    realWorld: "In a DAW, the chord name may sit above the timeline, but the actual music is still MIDI notes that the producer records or draws into the clip.",
  },
  "harmony.chords.b": {
    why: "Writing every bar by hand makes I, IV, V, and I audible as changes in the notes the learner actually entered, rather than as four buttons the software performs automatically.",
    when: "When harmonising an existing groove or melody and deciding how each bar supports the phrase.",
    tools: ["Piano roll", "Chord track", "MIDI editor", "Loop playback"],
    visual: "harmony",
    realWorld: "Songwriters often loop the drums and melody, then draw or record each chord into a MIDI region while listening to how the phrase changes.",
  },
  "harmony.chords.c": {
    why: "Once the chord tones are known, rhythm turns harmony into a playable musical part. Spreading notes through time lets the accompaniment lock with, answer, or push against the groove.",
    when: "After the progression works harmonically and the writer starts shaping the keyboard, guitar, or synth part itself.",
    tools: ["Piano roll", "Grid", "MIDI note editor", "Loop playback"],
    visual: "harmony",
    realWorld: "A producer may turn one vertical chord stack into repeated notes, offbeat stabs, or a broken-chord figure without changing the chord symbol above it.",
  },
  "harmony.chords.d": {
    why: "A finished accompaniment needs both harmonic direction and a self-written rhythmic shape. The learner now makes those choices directly instead of selecting a canned accompaniment mode.",
    when: "During actual arrangement and composition, once the harmony is understood well enough to become material rather than an answer key.",
    tools: ["Piano roll", "MIDI clip", "Loop transport", "Chord track"],
    visual: "harmony",
    realWorld: "The resulting DAW clip is the part itself: editable notes across four bars, not a preset labelled block, pulse, or arpeggio.",
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
    why: "The envelope changes the musical role of the same notes. Fast attack and short release make the learner's melody articulate rhythmically instead of smearing into a sustained layer.",
    when: "During sound design when a part needs to sit as a pluck, stab, lead, or other clearly articulated voice.",
    tools: ["ADSR envelope", "Attack knob", "Release knob", "Phrase audition"],
    visual: "synth",
    realWorld: "Producers often loop the actual MIDI phrase while shortening attack and release, because envelope timing only makes full sense against the notes it has to perform.",
  },
  "sound.synthesis.d": {
    why: "Replaying the same melody with a slow attack and long release isolates what timbre and time-shape contribute: the notes stay fixed while the part becomes a sustained background layer.",
    when: "When choosing whether musical material should be foreground, rhythmic support, or a smoother harmonic texture.",
    tools: ["Synth plugin", "Amp envelope", "Filter", "Phrase audition"],
    visual: "synth",
    realWorld: "Sound designers usually audition patches with the real MIDI part, then reshape oscillator, filter, and envelope until the instrument performs the intended role in context.",
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
    why: "Functional roles become useful when they change music the learner is already hearing. Rewriting the MIDI under C, F, G, and C connects tonic, predominant, and dominant to the notes producing those sensations.",
    when: "While reharmonizing a melody or groove and deciding whether a bar should feel stable, departing, tense, or resolved.",
    tools: ["Chord track", "Polyphonic piano roll", "Loop playback", "Roman numerals"],
    visual: "harmonic-function",
    realWorld: "A producer may use chord symbols as a map, but the audible part still consists of recorded or drawn MIDI notes that must be rewritten when the harmony changes.",
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
    why: "A and A′ only teach form if the listener can hear what is retained and what changes. The lesson therefore pairs labels with actual layer combinations that play across sixteen bars.",
    when: "After musical layers exist and the writer starts deciding what repeats, develops, contrasts, and returns at section scale.",
    tools: ["Section markers", "Arrangement layers", "Loop playback", "Macro-form view"],
    visual: "phrase-form",
    realWorld: "DAW markers name sections, but duplicated clips, muted layers, and changed instrumentation are what make A, B, or A′ audible.",
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

  "harmony.relative-minor.a": {
    why: "Relative major and minor keys share the same notes, so changing the tonic can transform the emotional and structural meaning of a familiar pitch collection without introducing new pitches.",
    when: "When moving beyond a first major key and learning how tonal centre, phrase placement, and hierarchy determine whether the same notes sound major or minor.",
    tools: ["Piano keyboard", "Piano roll", "Key display", "Scale-degree labels"],
    visual: "relative-minor",
    realWorld: "DAWs and notation tools often show the same seven note names for C major and A minor; the real difference appears in which note or chord is treated as tonic.",
  },
  "harmony.relative-minor.b": {
    why: "Beginning and ending on tonic gives the ear a stable frame. This is one of the simplest ways to make A feel like home while using exactly the same pitch collection as C major.",
    when: "During melody writing, especially while learning a new key or checking whether a phrase clearly communicates its tonal centre.",
    tools: ["Piano roll", "MIDI keyboard", "Loop playback", "Tonic reference"],
    visual: "relative-minor",
    realWorld: "Composers often loop a short MIDI phrase and change only its start or ending notes to hear how tonal gravity shifts.",
  },
  "harmony.relative-minor.c": {
    why: "Relative keys can be connected with no chromatic notes because every pitch belongs to both. Phrase endings and emphasis can therefore create a tonal pivot almost invisibly.",
    when: "When composing sections that move between relative major and minor or when a melody needs contrast without changing its note collection.",
    tools: ["Piano roll", "Phrase markers", "Loop region", "Tonic pedal/reference"],
    visual: "relative-minor",
    realWorld: "A producer may keep one MIDI clip almost unchanged while changing the bass note or phrase ending so the same material reads as C major in one section and A minor in another.",
  },
  "harmony.relative-minor.d": {
    why: "The lowered third, sixth, and seventh define the interval pattern of natural minor relative to the tonic. Using them deliberately makes the mode audible as structure rather than merely as a list of allowed notes.",
    when: "While shaping a melody after the tonic is established and the composer wants the line to carry unmistakable minor-key colour.",
    tools: ["Scale-degree display", "MIDI editor", "Keyboard", "Ear comparison"],
    visual: "relative-minor",
    realWorld: "Theory-aware MIDI tools label degrees such as ♭3, ♭6, and ♭7; pianists hear the same information as the characteristic distances above tonic.",
  },

  "harmony.harmonic-minor.a": {
    why: "Raising scale degree 7 creates a note one semitone below tonic, giving minor-key harmony a much stronger route back home.",
    when: "When natural minor's whole-step ♭7→1 motion feels too weak for the cadence or dominant function you want.",
    tools: ["Piano roll", "Scale editor", "Accidental", "Key-aware MIDI display"],
    visual: "harmonic-minor",
    realWorld: "In notation the G becomes G♯; in a piano roll it appears as the black key immediately below A.",
  },
  "harmony.harmonic-minor.b": {
    why: "The raised seventh matters because of how it resolves. G♯ feels unstable and strongly points to A, making the concept audible rather than theoretical.",
    when: "Near phrase endings, dominant chords, melodic cadences, or anywhere a minor-key line needs extra forward pull.",
    tools: ["Piano roll", "MIDI keyboard", "Loop playback", "Step input"],
    visual: "harmonic-minor",
    realWorld: "A composer can zoom into two MIDI notes—G♯ followed by A—and hear the same leading-tone behaviour later embedded inside an E7→Am cadence.",
  },
  "harmony.harmonic-minor.c": {
    why: "The F→G♯ augmented second is one of harmonic minor's most distinctive melodic intervals and helps explain why the scale sounds different from natural minor.",
    when: "While learning the scale's sound, writing deliberately dramatic lines, or deciding whether a smoother melodic-minor treatment would suit a phrase better.",
    tools: ["Piano roll", "Interval display", "Keyboard", "Scale overlay"],
    visual: "harmonic-minor",
    realWorld: "On a piano roll the jump spans three semitones even though F and G♯ are adjacent written scale degrees.",
  },
  "harmony.harmonic-minor.d": {
    why: "A chromatic alteration becomes compositionally meaningful when it shapes an actual phrase instead of appearing as a scale demonstration.",
    when: "Once the raised seventh is understood in isolation and you want to place it only where the phrase benefits from stronger cadential direction.",
    tools: ["Piano roll", "Loop playback", "Phrase markers", "MIDI editing"],
    visual: "harmonic-minor",
    realWorld: "In real writing, G♯ may appear only once near the end of a phrase rather than throughout the entire melody.",
  },

  "harmony.minor-cadences.a": {
    why: "Minor function is easier to retain when the learner writes the chord tones that produce it. Am→Dm becomes a change in actual notes rather than a pair of chord buttons.",
    when: "While building a minor accompaniment and deciding how tonic should move toward predominant and later dominant tension.",
    tools: ["Chord track", "Polyphonic piano roll", "Loop playback", "Roman-numeral analysis"],
    visual: "minor-cadence",
    realWorld: "In a DAW, Am and Dm may appear above the timeline, but the keyboard or MIDI part underneath still has to contain A–C–E and D–F–A.",
  },
  "harmony.minor-cadences.b": {
    why: "E7 contains the raised seventh G♯, converting a weak natural-minor v chord into a strong dominant V7 that resolves decisively to Am.",
    when: "At phrase endings, section boundaries, or any moment where minor-key harmony needs a clear authentic cadence.",
    tools: ["Chord track", "Dominant seventh chord", "Piano", "Voice-leading view"],
    visual: "minor-cadence",
    realWorld: "In a DAW the E7 clip visibly contains G♯ even though the surrounding A-minor material mostly uses white keys.",
  },
  "harmony.minor-cadences.c": {
    why: "The Andalusian cadence creates a memorable descending root line while leaving V at the end to propel the loop back to i.",
    when: "When a composition benefits from a strong descending harmonic pattern, especially in repeating minor-key sections.",
    tools: ["Chord track", "Bass line", "Roman numerals", "Loop playback"],
    visual: "minor-cadence",
    realWorld: "The arrangement or chord lane shows Am–G–F–E7 while the bass traces the obvious A–G–F–E descent.",
  },
  "harmony.minor-cadences.d": {
    why: "A deceptive resolution preserves dominant expectation but redirects the emotional outcome, letting the phrase continue instead of fully closing on tonic.",
    when: "When V7→i feels too final and the next section or phrase needs to remain open.",
    tools: ["Chord track", "A/B progression comparison", "Piano", "Roman-numeral analysis"],
    visual: "minor-cadence",
    realWorld: "Producers often duplicate a progression and change only the final chord to compare a closed cadence against a deceptive one.",
  },

  "harmony.seventh-chords.a": {
    why: "The seventh is easiest to understand as one additional pitch the learner can add and remove. Hearing C–E–G with and without B makes the colour concrete.",
    when: "After triads are comfortable and the writer wants richer tonic, predominant, or dominant colour.",
    tools: ["Chord track", "Polyphonic piano roll", "Piano", "Loop playback"],
    visual: "seventh-chords",
    realWorld: "A Cmaj7 MIDI clip is literally a C-major triad plus B; producers can mute that B to compare the triad and seventh chord instantly.",
  },
  "harmony.seventh-chords.b": {
    why: "The dominant seventh contains two guide tones that move by semitone into tonic, making the cadence stronger than a plain major V chord.",
    when: "At cadences, turnarounds, and functional progressions where dominant tension should be unmistakable.",
    tools: ["Chord track", "Guide-tone view", "Piano", "Voice-leading display"],
    visual: "seventh-chords",
    realWorld: "A G7→C progression can be reduced to B→C and F→E; many arrangers and jazz musicians listen for those inner motions first.",
  },
  "harmony.seventh-chords.c": {
    why: "ii7–V7–Imaj7 combines functional direction with smooth four-note voice leading and is foundational across jazz, pop, soul, film music, and many tonal styles.",
    when: "When the composer wants a clear cadential progression with richer harmony than simple triads.",
    tools: ["Chord track", "Piano", "Lead sheet", "Voice-leading editor"],
    visual: "seventh-chords",
    realWorld: "Chord symbols Dm7–G7–Cmaj7 are a standard sight on lead sheets and in DAW chord tracks.",
  },
  "harmony.seventh-chords.d": {
    why: "A turnaround points the end of a phrase back toward its beginning, making a loop sound harmonically intentional rather than mechanically repeated.",
    when: "Near the end of verses, jazz forms, intros, outros, or any repeated four-bar harmonic cycle.",
    tools: ["Chord track", "Loop region", "Lead sheet", "Piano"],
    visual: "seventh-chords",
    realWorld: "The final G7 is often placed at the end of a loop specifically so the next Cmaj7 lands as the missing resolution.",
  },

  "harmony.modal-mixture.a": {
    why: "Borrowed minor iv becomes concrete when the learner changes A to A♭ inside an F chord. One semitone creates the colour that the label Fm merely names.",
    when: "When a C-major phrase needs a darker turn without abandoning C as the tonal centre.",
    tools: ["Chord track", "Chromatic piano roll", "Loop playback", "Voice-leading view"],
    visual: "modal-mixture",
    realWorld: "In a DAW, switching F major to F minor can be as direct as dragging the A note down one semitone to A♭ while the other chord tones stay put.",
  },
  "harmony.modal-mixture.b": {
    why: "Borrowed ♭VII removes the major-key leading tone and produces a broader, more modal kind of motion than dominant harmony.",
    when: "In rock, film music, pop, folk-derived harmony, or any major-key section that benefits from less strongly functional movement.",
    tools: ["Chord track", "Modal scale reference", "Piano", "Bass line"],
    visual: "modal-mixture",
    realWorld: "B♭ major appears as a full chromatic chord in C major, yet a repeated C tonic or bass can keep the key centre clear.",
  },
  "harmony.modal-mixture.c": {
    why: "IV→iv→I creates a smooth chromatic inner line A→A♭→G, making the borrowed chord sound connected rather than arbitrary.",
    when: "At emotional phrase endings, pre-chorus resolutions, bridges, or anywhere a major-key cadence needs extra colour.",
    tools: ["Chord track", "Voice-leading view", "Piano", "MIDI notes"],
    visual: "modal-mixture",
    realWorld: "In a piano roll, three successive chords reveal one note stepping down chromatically while the other chord tones move very little.",
  },
  "harmony.modal-mixture.d": {
    why: "Combining borrowed chords teaches selective chromaticism: the scale can be left temporarily while tonic identity remains intact.",
    when: "After individual borrowed chords are familiar and the composer wants richer chromatic harmony without fully modulating.",
    tools: ["Chord track", "Roman-numeral analysis", "Piano", "Loop comparison"],
    visual: "modal-mixture",
    realWorld: "A production can keep C in the bass at structural points while B♭ and Fm colour the middle of the progression.",
  },

  "genre.house.a": {
    why: "Four-on-the-floor kick and offbeat hats create two interlocking time layers: one marks the floor, the other supplies motion between beats.",
    when: "Use this relationship when studying dance-oriented grooves or when a track needs an unambiguous physical pulse before bass and arrangement are added.",
    tools: ["Drum machine", "Step sequencer", "Velocity editor", "Tempo control"],
    visual: "groove-feel",
    realWorld: "House drum clips often show quarter-note kicks on the main grid lines with hats placed halfway between them.",
  },
  "genre.house.b": {
    why: "Syncopated bass can answer a steady kick instead of duplicating every beat, making the low end feel active without making the drum pulse less clear.",
    when: "After the kick pattern is stable and you want the bass line to create forward movement around it.",
    tools: ["Bass instrument", "Piano roll", "Loop playback", "Kick reference"],
    visual: "bassline",
    realWorld: "In a DAW, house bass MIDI often leaves visible gaps on some kick positions and places attacks on the eighth-note spaces between beats.",
  },
  "genre.house.c": {
    why: "Removing drums before their return can create lift through memory and contrast, so the next full section feels larger without requiring a new instrument.",
    when: "During breakdowns, transitions, and pre-drop sections after the core groove is already established.",
    tools: ["Arrangement view", "Track mute", "Clip blocks", "Section loop"],
    visual: "arrangement",
    realWorld: "A house arrangement commonly shows several bars where kick clips disappear while pads, chords, or vocal material continue.",
  },
  "genre.house.d": {
    why: "Kick-triggered ducking can clarify the low end and reinforce the repeating pulse, but comparing bypass prevents the technique from becoming an automatic genre checkbox.",
    when: "Once kick and bass overlap audibly and the groove is stable enough to judge whether the processing actually helps.",
    tools: ["Sidechain compressor", "Kick key input", "Release control", "A/B bypass"],
    visual: "sidechain",
    realWorld: "Electronic-music sessions often show a compressor on the bass keyed from the kick, with gain reduction occurring on every kick hit.",
  },

  "genre.hip-hop.a": {
    why: "A stable backbeat plus an asymmetrical kick pattern creates pocket by making individual kick placements matter instead of marking every quarter note automatically.",
    when: "At the beginning of beat construction, before extra percussion and melodic layers make the rhythmic skeleton harder to hear.",
    tools: ["Drum rack", "Step sequencer", "MIDI editor", "Tempo control"],
    visual: "groove-feel",
    realWorld: "Hip-hop drum clips often show snares fixed on 2 and 4 while kick notes form a less regular pattern around them.",
  },
  "genre.hip-hop.b": {
    why: "Velocity and modest swing can turn a quantized pattern into a pocket by separating main accents from supporting hits and shifting how subdivisions lean.",
    when: "After note placement works but the beat still feels mechanically flat or every hit seems equally important.",
    tools: ["Velocity lane", "Swing control", "Ghost notes", "Loop playback"],
    visual: "groove-feel",
    realWorld: "Beat makers routinely edit velocity bars below MIDI notes and audition groove or swing settings without changing the visible note pattern.",
  },
  "genre.hip-hop.c": {
    why: "Sparse bass gives each low note more weight because it arrives into clear space instead of competing with constant low-frequency activity.",
    when: "When a beat already has a strong rhythmic identity and the bass should punctuate rather than continuously fill the grid.",
    tools: ["Bass instrument", "Piano roll", "Mute/solo", "Loop playback"],
    visual: "bassline",
    realWorld: "Many beat sessions show short clusters of bass MIDI separated by large empty regions instead of an uninterrupted line of eighth notes.",
  },
  "genre.hip-hop.d": {
    why: "Letting drums and bass carry a section exposes the groove as foreground and makes later harmony or melody returns feel structurally meaningful.",
    when: "During verse/section arrangement when the beat needs contrast without introducing new musical material.",
    tools: ["Arrangement view", "Track mute", "Clip duplication", "Section markers"],
    visual: "arrangement",
    realWorld: "Producers often remove melodic clips for a bar or phrase while leaving drums and bass running, then restore them at the next section.",
  },

  "genre.funk.a": {
    why: "Dense sixteenth-note subdivisions gain life from accents and ghost notes; the groove comes from dynamic hierarchy rather than every hit being equally strong.",
    when: "When programming a tight rhythm section that should feel busy without becoming mechanically flat.",
    tools: ["Hi-hat pattern", "Velocity lane", "Ghost snare", "Step sequencer"],
    visual: "groove-feel",
    realWorld: "A funk-inspired MIDI drum clip may look dense, but its velocity lane reveals strong accents surrounded by much quieter supporting strokes.",
  },
  "genre.funk.b": {
    why: "An independent syncopated bass rhythm lets drums and bass interlock instead of moving as one doubled part, creating complexity from complementary placement.",
    when: "After the drum subdivision is established and the bass needs to become an active rhythmic voice rather than only harmonic support.",
    tools: ["Bass instrument", "Piano roll", "Metronome/loop", "Kick reference"],
    visual: "bassline",
    realWorld: "Funk bass MIDI often shows many attacks between strong beats, with a rhythm that remains recognizable even when the drum track is muted.",
  },
  "genre.funk.c": {
    why: "Short chord stabs turn harmony into part of the rhythm section. The chord names can stay the same while duration and placement completely change the role of the part.",
    when: "Once a progression works harmonically but sustained chords feel too passive for the groove.",
    tools: ["Piano roll", "Chord track", "Note-length editing", "Loop playback"],
    visual: "harmony",
    realWorld: "Keyboard or guitar comping often appears as short repeated MIDI blocks on offbeats rather than one long chord filling each bar.",
  },
  "genre.funk.d": {
    why: "Giving bass and chords separate moments makes their rhythmic jobs easier to hear, while bars where both return show how the interlocking parts combine.",
    when: "During arrangement refinement when a busy groove needs clearer conversational space between rhythm-section parts.",
    tools: ["Arrangement view", "Track mute", "Loop regions", "Mixer"],
    visual: "arrangement",
    realWorld: "Arrangements often alternate short bass-led and chord-led gaps before bringing the full rhythm section back together.",
  },

  "genre.ambient.a": {
    why: "Slow attack and long release shift attention away from note attacks toward evolving timbre and overlap, turning the same melody into a sustained texture.",
    when: "When a part should behave like an environment or background field instead of a sharply articulated lead.",
    tools: ["Synth envelope", "Filter cutoff", "Phrase audition", "Tempo control"],
    visual: "synth",
    realWorld: "Ambient synth patches commonly show long amp-envelope slopes and are auditioned with sustained MIDI rather than short preset-demo notes.",
  },
  "genre.ambient.b": {
    why: "Long notes and large onset gaps make duration and silence compositional materials, allowing the listener to notice decay, register, and timbral change.",
    when: "When a melody feels too event-heavy and the piece needs slower perceptual pacing without necessarily changing harmony.",
    tools: ["Piano roll", "Note-length handles", "Loop playback", "Sustain"],
    visual: "piano-roll",
    realWorld: "Ambient MIDI clips often contain a few visibly long note blocks separated by large empty spaces rather than dense short-note patterns.",
  },
  "genre.ambient.c": {
    why: "Low-density arrangement makes small entrances and exits structurally important, so form can emerge from gradual texture change instead of obvious drops or choruses.",
    when: "When arranging sparse material that should evolve slowly and avoid constant high-energy layering.",
    tools: ["Arrangement view", "Track mute", "Clip fades", "Layer planning"],
    visual: "arrangement",
    realWorld: "Ambient sessions often show long clips with only a few layers overlapping at once and gradual changes in which tracks are present.",
  },
  "genre.ambient.d": {
    why: "Exaggerating reverb first makes its masking effect obvious; pulling it back teaches how a long acoustic field can remain audible without erasing all articulation.",
    when: "After the dry arrangement works and spatial depth should become part of the piece's identity.",
    tools: ["Reverb return", "Decay", "Pre-delay", "Send levels"],
    visual: "effects",
    realWorld: "Ambient mixes often use long reverb tails on shared returns, with individual tracks feeding the space by different send amounts.",
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
