export type PlayLabLessonScope = {
  objectives: readonly string[];
  prerequisites: readonly string[];
  scope: string;
};

export const playLabScopeByLessonId: Record<string, PlayLabLessonScope> = {
  "rhythm.pulse-and-groove": {
    objectives: [
      "Count a 4/4 bar and relate beats, eighth-note subdivisions and the 16-step grid.",
      "Hear the different jobs of kick pulse, backbeat and hi-hat subdivision.",
      "Use an offbeat accent to create syncopation against an established pulse.",
    ],
    prerequisites: [],
    scope: "This lesson is about rhythmic placement. Velocity, ghost notes and swing arrive later in Lesson 13.",
  },
  "rhythm.variation": {
    objectives: [
      "Preserve enough repetition for a groove to remain recognisable while changing selected events.",
      "Use fills and turnarounds to mark phrase endings and loop returns.",
      "Use anticipation to create forward motion before an expected beat.",
    ],
    prerequisites: ["Pulse, backbeat, eighth-note subdivision and offbeat placement from Lesson 1."],
    scope: "The focus is structural variation on the grid, not microtiming or velocity feel.",
  },
  "pitch.melody": {
    objectives: [
      "Derive the C-major pitch collection from the major-scale whole/half-step pattern.",
      "Hear tonic and scale degrees as functions inside a key, not only as note names.",
      "Write an in-key melody using contour, rests and stable degrees 1, 3 and 5.",
      "Shape a short motif into a simple question-and-answer phrase.",
    ],
    prerequisites: ["The rhythmic grid and intentional placement from Lessons 1-2."],
    scope: "Motif development is introduced only at a basic level here; systematic transformation comes in Lesson 14.",
  },
  "harmony.chords": {
    objectives: [
      "Build diatonic triads by selecting root, third and fifth from the scale.",
      "Hear I, IV and V as home, departure and dominant tension in C major.",
      "Turn chord symbols into actual timed notes and accompaniment rhythm.",
      "Write a four-bar chord part whose notes fit the current harmony.",
    ],
    prerequisites: ["C-major scale degrees and degrees 1, 3 and 5 from Lesson 3."],
    scope: "Keep chords in basic triadic form. Inversions, seventh chords and extensions are taught later.",
  },
  "sound.synthesis": {
    objectives: [
      "Hear oscillator waveform as a change of timbre while pitch stays fixed.",
      "Hear low-pass cutoff as control of spectral brightness.",
      "Use attack and release to change the time-shape and musical role of a sound.",
      "Choose a coherent subtractive-synthesis setting for a pluck or pad.",
    ],
    prerequisites: ["A short melody that can be reused while timbre changes."],
    scope: "The lab exposes waveform, cutoff, attack and release. Full ADSR shaping, modulation routing and advanced synthesis are outside this lesson.",
  },
  "form.arrangement": {
    objectives: [
      "Use layer density to change texture without rewriting the notes.",
      "Create an audible section boundary through contrast.",
      "Build toward a climax through entries and increased density.",
      "Shape an eight-bar energy arc with build, peak and release.",
    ],
    prerequisites: ["Groove, melody, harmony and a usable sound from Lessons 1-5."],
    scope: "This is arrangement-level form through layer entries and exits. More explicit repeat/contrast/return forms are revisited in Lesson 17.",
  },
  "mixing.balance-space": {
    objectives: [
      "Balance foreground and background with relative channel level.",
      "Use panning to create left-centre-right placement.",
      "Use a low-cut filter until cleanup begins to remove useful body.",
      "Use send/return reverb to create depth while preserving clarity.",
    ],
    prerequisites: ["A layered arrangement from Lesson 6."],
    scope: "This is a first mixer pass. Detailed EQ, stereo width, reference comparison and gain staging come later.",
  },
  "production.automation-dynamics": {
    objectives: [
      "Understand automation as parameter values changing over time on a timeline.",
      "Shape volume and filter movement with automation breakpoints.",
      "Use compressor threshold and ratio to control peaks.",
      "Use attack and release to hear the tradeoff between control and transient punch.",
    ],
    prerequisites: ["Mixer level, filter cutoff and arrangement energy from Lessons 5-7."],
    scope: "The compressor is intentionally simplified. The GR display is illustrative, and this lesson does not cover mastering or every compressor control.",
  },
  "production.effects-transitions": {
    objectives: [
      "Use reverb send, decay and pre-delay to control depth and attack clarity.",
      "Use tempo-synchronised delay time and feedback as rhythmic material.",
      "Use chorus wet amount for modulation-based width and movement.",
      "Combine a small number of effect moves to prepare a structural arrival.",
    ],
    prerequisites: ["Send/return routing and automation from Lessons 7-8."],
    scope: "These effects are taught as controllable relationships, not as fixed presets or mandatory production recipes.",
  },
  "production.final-project": {
    objectives: [
      "Judge whether groove, melody and harmony still work as musical material.",
      "Judge whether the arrangement has contrast, a peak and breathing room.",
      "Remove processing that does not improve a specific musical or production goal.",
      "Listen through the version you save and distinguish editable project state from a rendered audio file.",
    ],
    prerequisites: ["Lessons 1-9."],
    scope: "This is an integration checkpoint. It introduces no new technique; it tests whether earlier choices form a coherent first track.",
  },
  "harmony.voice-leading": {
    objectives: [
      "Distinguish root position, first inversion and second inversion by the bass note.",
      "Keep chord identity separate from the particular voicing and register used.",
      "Follow individual voices through adjacent chords.",
      "Use common tones and small steps to reduce unnecessary voice movement.",
    ],
    prerequisites: ["Triads and four-bar chord progressions from Lesson 4."],
    scope: "Smooth voice leading is a useful default, not a rule that every voice must always move the minimum possible distance.",
  },
  "composition.bass-lines": {
    objectives: [
      "Use roots to make the harmony clear from the lowest line.",
      "Use thirds and fifths to outline chords without playing roots only.",
      "Use diatonic or chromatic approach notes to create direction into a target root.",
      "Balance harmonic clarity, contour, rhythm and silence in a complete bass phrase.",
    ],
    prerequisites: ["Chord tones, groove and basic voice movement from Lessons 4 and 11."],
    scope: "This is foundational bass writing, not a complete treatment of walking bass, slap technique or genre-specific bass vocabulary.",
  },
  "rhythm.groove-feel": {
    objectives: [
      "Use MIDI velocity to create a hierarchy of accents rather than identical hits.",
      "Shape repeated subdivisions with an accent pattern.",
      "Use ghost notes as quiet motion without creating a new structural accent.",
      "Hear swing as unequal subdivision timing while the visible notes remain quantized.",
    ],
    prerequisites: ["Straight pulse, backbeat and subdivision from Lesson 1."],
    scope: "Swing is applied as a global timing feel here. Detailed manual microtiming and humanisation are outside this lesson.",
  },
  "composition.motif-development": {
    objectives: [
      "Establish motif identity through exact repetition.",
      "Transpose a motif while preserving its internal interval pattern.",
      "Fragment a motif while keeping enough information for recognition.",
      "Create call and response from related rather than unrelated material.",
    ],
    prerequisites: ["Basic motif and phrase writing from Lesson 3."],
    scope: "Transposition is used as a motif-development technique here; interval measurement and full-project transposition are taught explicitly in Lesson 29.",
  },
  "composition.melody-over-harmony": {
    objectives: [
      "Identify melody notes as chord tones or non-chord tones in their current harmonic context.",
      "Use passing tones to connect stable notes by step.",
      "Use neighbour notes to leave and return to a stable pitch.",
      "Create tension with a non-chord tone and make its resolution intentional.",
    ],
    prerequisites: ["Melody writing, chord tones and a working progression from Lessons 3-4."],
    scope: "The lesson teaches three useful non-chord-tone behaviours, not the complete classical taxonomy of embellishing tones.",
  },
  "harmony.function": {
    objectives: [
      "Hear tonic, predominant and dominant as directional harmonic functions.",
      "Build ii-V-I as a predominant-dominant-tonic cadence.",
      "Hear a deceptive resolution when dominant avoids tonic.",
      "Use a secondary dominant to tonicize a non-tonic chord with a chromatic note.",
    ],
    prerequisites: ["Diatonic triads, scale degrees and chord progressions from Lessons 3-4."],
    scope: "Tonicization is temporary. This lesson introduces one dominant-seventh formula only as needed; seventh-chord families come in Lesson 27, and full modulation is not covered.",
  },
  "composition.phrase-form": {
    objectives: [
      "Use orchestration as one audible source of section identity.",
      "Make A and A-prime sound related but not identical.",
      "Create binary and ternary relationships through contrast and return.",
      "Create an AABA outline whose repeated and contrasting sections can be heard without relying on labels.",
    ],
    prerequisites: ["Layer-based arrangement and contrast from Lesson 6."],
    scope: "This lab isolates orchestration as a formal cue. Melody, harmony, rhythm and motive can also define form but are not edited independently here.",
  },
  "composition.texture-orchestration": {
    objectives: [
      "Separate musical roles by register before reaching for EQ.",
      "Distinguish closed and open chord spacing without changing harmonic identity.",
      "Use octave doubling deliberately and hear its cost in density.",
      "Shape sparse and dense texture across an arrangement.",
    ],
    prerequisites: ["Voicing, bass, melody and arrangement from earlier lessons."],
    scope: "The orchestration model uses four project layers; real instrumentation offers many more timbral and register choices.",
  },
  "production.eq-spectral-balance": {
    objectives: [
      "Use high-pass cutoff to find the boundary between cleanup and lost body.",
      "Use bell-filter centre frequency and Q to locate a spectral region.",
      "Compare boost, flat and cut before deciding on corrective EQ.",
      "Make complementary EQ decisions in context rather than soloing every track indefinitely.",
    ],
    prerequisites: ["The first low-cut and masking experiment from Lesson 7."],
    scope: "This is practical parametric EQ by ear. It does not teach mastering curves, linear-phase EQ or every filter type.",
  },
  "production.saturation": {
    objectives: [
      "Hear saturation as nonlinear processing that adds harmonics and rounds peaks.",
      "Use drive to move from subtle colour toward obvious distortion.",
      "Use parallel processing to blend distortion while preserving a cleaner transient.",
      "Use different saturation amounts according to the role of each channel.",
    ],
    prerequisites: ["Timbre, transients and mixer balance from Lessons 5, 7 and 8."],
    scope: "Saturation can also make a signal seem louder. This lesson focuses on timbre; disciplined level-compensated comparison is taught in Lessons 23 and 32.",
  },
  "production.sidechain": {
    objectives: [
      "Distinguish the trigger/key signal from the signal being processed.",
      "Use kick-triggered ducking to create temporary bass space.",
      "Shape sidechain amount and release from transparent separation to audible pumping.",
      "Hear how the trigger rhythm determines the gain-movement rhythm.",
    ],
    prerequisites: ["Compressor behaviour from Lesson 8 and kick/bass interaction from Lessons 1 and 12."],
    scope: "The lab teaches level ducking. Multiband sidechain, dynamic EQ and other keyed processors are outside this lesson.",
  },
  "production.stereo-mono": {
    objectives: [
      "Distinguish panning from stereo width and keep important low-frequency material focused.",
      "Understand mid/side width as a change in centre-versus-side information.",
      "Use mono collapse to expose balances or phase relationships that depend on stereo.",
      "Build a deliberate hierarchy of centred, panned and widened elements.",
    ],
    prerequisites: ["Basic panning and mix hierarchy from Lesson 7."],
    scope: "The app provides a mono check but no phase-correlation meter. The lesson teaches the listening consequence, not detailed phase analysis.",
  },
  "production.reference-mixing": {
    objectives: [
      "Use a fixed snapshot to reduce reliance on short auditory memory.",
      "Make one meaningful change, then compare A and B repeatedly with a listening focus.",
      "Reduce obvious level bias before judging tone, balance or width.",
      "Use quiet and mono playback as translation and perspective checks.",
    ],
    prerequisites: ["Mixing, EQ and stereo concepts from Lessons 7, 19 and 22."],
    scope: "The app's level-offset guide is only an estimate from fader settings, not LUFS, RMS or perceived-loudness measurement.",
  },
  "harmony.relative-minor": {
    objectives: [
      "Understand relative major and natural minor as the same pitch collection with a different tonic.",
      "Derive A natural minor from C major rather than memorising a second unrelated scale.",
      "Use phrase position and endings to make A feel like tonic.",
      "Hear natural-minor degrees flat 3, flat 6 and flat 7 as characteristic colour.",
    ],
    prerequisites: ["Major scale, tonic and scale degrees from Lesson 3."],
    scope: "Only natural minor is established here. Raised scale degree 7 and harmonic minor belong to Lesson 25.",
  },
  "harmony.harmonic-minor": {
    objectives: [
      "Create harmonic minor by raising scale degree 7 of natural minor.",
      "Hear the raised seventh as a leading tone one semitone below tonic.",
      "Recognise the augmented second between flat 6 and raised 7.",
      "Use the leading tone near a phrase ending to strengthen arrival on tonic.",
    ],
    prerequisites: ["A natural minor and its scale degrees from Lesson 24."],
    scope: "Melodic minor is not taught here. The lesson is specifically about the harmonic-minor alteration and its melodic pull.",
  },
  "harmony.minor-cadences": {
    objectives: [
      "Use i and iv as tonic and predominant-region harmony in A minor.",
      "Derive V7 from the raised seventh and hear its strong resolution to i.",
      "Hear the descending i-VII-VI-V progression as a connected root motion.",
      "Compare dominant resolution to tonic with a deceptive move to VI.",
    ],
    prerequisites: ["Harmonic function from Lesson 16 and harmonic minor from Lesson 25."],
    scope: "The lesson stays in A minor and compares a few high-value progressions; it is not a complete catalogue of minor-key harmony.",
  },
  "harmony.seventh-chords": {
    objectives: [
      "Understand a seventh chord as a triad plus a seventh above the root.",
      "Distinguish maj7, dominant 7 and minor 7 construction.",
      "Hear dominant guide tones resolve into tonic harmony.",
      "Use ii7-V7-Imaj7 and Imaj7-vi7-ii7-V7 as functional progressions.",
    ],
    prerequisites: ["Triads, voice leading and harmonic function from Lessons 4, 11 and 16."],
    scope: "Half-diminished, diminished-seventh and altered dominant families are not part of this lesson.",
  },
  "harmony.modal-mixture": {
    objectives: [
      "Borrow harmony from the parallel minor without losing the major tonic.",
      "Create minor iv by lowering the third of IV.",
      "Use flat VII as a borrowed major chord with weaker dominant pull.",
      "Hear chromatic inner-voice motion as the reason a borrowed chord can feel connected.",
    ],
    prerequisites: ["Major/minor scale degrees, triads and harmonic function."],
    scope: "Borrowing a chord does not by itself mean modulation. The tonal centre should remain perceptibly stable.",
  },
  "pitch.intervals-transposition": {
    objectives: [
      "Treat selected intervals as measurable semitone distances rather than fixed note names.",
      "Transpose a motif by moving every note by the same interval.",
      "Distinguish absolute chord symbols from scale-degree function.",
      "Transpose melody and harmony together while preserving their internal relationships.",
    ],
    prerequisites: ["Scale degrees, motif identity and harmonic function from Lessons 3, 14 and 16."],
    scope: "This is practical interval distance for transposition, not a complete course in interval spelling, inversion or ear-training nomenclature.",
  },
  "harmony.chord-colour": {
    objectives: [
      "Build sus4 by replacing the third with the fourth and hear its optional resolution.",
      "Distinguish add9 from a suspension by retaining the complete triad.",
      "Build maj9 as a major triad plus major seventh and ninth.",
      "Use chord extensions selectively and voice them so the underlying harmony stays clear.",
    ],
    prerequisites: ["Triads, seventh-chord construction and basic interval distance."],
    scope: "The lesson does not construct 11th and 13th chord families. Modern sus chords may remain unresolved even though the first exercise demonstrates resolution.",
  },
  "rhythm.phrasing-space": {
    objectives: [
      "Treat rests and note onsets as part of phrase design.",
      "Use anticipation to create forward pull into a structural beat.",
      "Use delayed entry to create shape instead of always beginning on beat one.",
      "Combine onset rhythm with duration and sustain to change articulation.",
    ],
    prerequisites: ["Melody, subdivision and syncopation from Lessons 1 and 3."],
    scope: "The lesson works on grid-level phrasing and duration. Rubato and free timing are outside the current sequencer model.",
  },
  "production.gain-staging-loudness": {
    objectives: [
      "Distinguish fader gain from actual signal peak level and system headroom.",
      "Maintain relative mix hierarchy while leaving practical level reserve.",
      "Experience the bias created when one comparison is simply louder.",
      "Use approximate level compensation and repeated listening before judging production differences.",
    ],
    prerequisites: ["Mixer balance and reference-comparison workflow from Lessons 7 and 23."],
    scope: "The app has no real peak, RMS or LUFS meters. Its fader exercises are teaching constraints, not universal numeric targets or mastering standards.",
  },
  "style.house": {
    objectives: [
      "Apply a steady four-on-the-floor reference groove with offbeat subdivision.",
      "Use timbre and articulation to change the role of existing bass and harmony.",
      "Use sidechain movement when it serves kick/bass separation or rhythmic pump.",
      "Keep a repeated loop evolving through layer entries and exits.",
    ],
    prerequisites: ["The core rhythm, synthesis, arrangement, sidechain and mix vocabulary from earlier PLAY / LAB lessons."],
    scope: "This is one practical house-oriented production lens, not a definition of all house music or a claim that every house track uses these devices.",
  },
  "style.funk": {
    objectives: [
      "Use accents and timing feel to create pocket rather than identical grid events.",
      "Make bass and drums interlock through syncopation and rests.",
      "Use short articulation to create rhythmic space.",
      "Treat chord attacks as comping events inside the groove.",
    ],
    prerequisites: ["Groove feel, bass writing, articulation and accompaniment rhythm from earlier lessons."],
    scope: "This lab isolates a few transferable funk relationships; it does not define the many historical and stylistic forms of funk.",
  },
  "style.hip-hop": {
    objectives: [
      "Use a clear backbeat with less mechanically regular kick placement and intentional space.",
      "Compare straight and swung subdivision feel.",
      "Reduce melody to a repeatable hook fragment with silence around it.",
      "Use timbre, velocity and register to give a small number of parts more weight.",
    ],
    prerequisites: ["Groove, swing, motif, arrangement and timbre from earlier lessons."],
    scope: "Hip-hop contains many rhythmic and regional languages. This lab is a focused production study, not a genre formula.",
  },
  "style.ambient": {
    objectives: [
      "Use slower attacks and longer sustain to change the perceived speed of the same harmony.",
      "Use note duration to slow harmonic rhythm without adding more events.",
      "Use reverb and delay to create depth while deciding how much detail remains audible.",
      "Use absence and sparse orchestration as active compositional choices.",
    ],
    prerequisites: ["Envelope, duration, effects, texture and arrangement concepts from earlier lessons."],
    scope: "Ambient music is not defined by maximum reverb or slow pads; this lab focuses on duration, depth and sparse texture as transferable techniques.",
  },
  "style.pop": {
    objectives: [
      "Create recognition by returning to a concise melodic hook.",
      "Keep harmony clear enough to support rather than obscure the hook.",
      "Use section density changes to make the same central idea feel different on return.",
      "Choose foreground timbre because it strengthens identity, not merely for novelty.",
    ],
    prerequisites: ["Motif, harmony, arrangement, texture and timbre from earlier lessons."],
    scope: "Pop spans many styles. This lab focuses on clarity, recurrence and foreground hierarchy rather than prescribing a single song formula.",
  },
};

export function getPlayLabLessonScope(lessonId: string): PlayLabLessonScope | undefined {
  return playLabScopeByLessonId[lessonId];
}
