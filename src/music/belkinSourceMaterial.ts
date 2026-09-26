export type BelkinAnalysisSegment = {
  label: string;
  detail: string;
};

export type BelkinSourceMap = {
  kind: "map";
  id: string;
  reference: string;
  title: string;
  fidelity: "source-analysis";
  fidelityNote: string;
  segments: BelkinAnalysisSegment[];
};

function map(
  id: string,
  reference: string,
  title: string,
  segments: BelkinAnalysisSegment[],
  fidelityNote: string,
): BelkinSourceMap {
  return {
    kind: "map",
    id,
    reference,
    title,
    fidelity: "source-analysis",
    fidelityNote,
    segments,
  };
}

export const belkinSourceMaterial: Record<string, BelkinSourceMap> = {
  "b01.punctuation-dimensions": map(
    "b01.punctuation-dimensions",
    "Chapter 5 - Punctuating",
    "Cadence is multidimensional",
    [
      {
        label: "Melody",
        detail:
          "Melodic arrival can be strengthened by repose in contour, smaller intervals, prepared register and motion toward a stable pitch.",
      },
      {
        label: "Harmony",
        detail:
          "Harmonic resolution contributes to punctuation, but harmony alone does not create a cadence; voice leading, bass direction and changes in harmonic tension matter as well.",
      },
      {
        label: "Rhythm",
        detail:
          "Punctuation almost always includes some rhythmic relaxation: a longer value, a strong-beat arrival, a slowing of activity or a momentary pause.",
      },
      {
        label: "Texture and dynamics",
        detail:
          "A change in density, register, timbre or dynamic level can reinforce an arrival when it coordinates with the other musical dimensions.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 5. No copyrighted score example is reproduced.",
  ),
  "b01.elision": map(
    "b01.elision",
    "Chapter 5 - Elision",
    "One event can end a phrase and begin the next",
    [
      {
        label: "Dual function",
        detail:
          "In an elision, the apparent final event of one phrase also serves as the beginning of the next phrase.",
      },
      {
        label: "Momentum",
        detail:
          "Because the new phrase begins at the point of arrival, the music gains continuity instead of fully stopping between the two units.",
      },
      {
        label: "Contrast at the join",
        detail:
          "Dynamics, articulation, texture, harmony or motive can reveal that the shared event has changed function from ending to beginning.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 5's discussion of elision.",
  ),
  "b01.punctuation-hierarchy": map(
    "b01.punctuation-hierarchy",
    "Chapter 5 - Degrees of punctuation",
    "Cadences need different weights",
    [
      {
        label: "Local breath",
        detail:
          "A mild punctuation can articulate a phrase without releasing enough tension to suggest that a section is finished.",
      },
      {
        label: "Section close",
        detail:
          "A stronger arrival coordinates more dimensions and makes a larger formal boundary perceptible.",
      },
      {
        label: "Finality",
        detail:
          "The strongest close in a passage should normally be reserved for the formal point that really needs the greatest sense of completion.",
      },
      {
        label: "Contradiction",
        detail:
          "One dimension can deliberately weaken another - for example, a convincing melodic arrival over harmony that still points onward - creating a qualified 'yes, but...' cadence.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 5's hierarchy of punctuation.",
  ),
  "b01.cadential-shaping": map(
    "b01.cadential-shaping",
    "Chapter 5 - Cadential shaping",
    "Strengthen or weaken an arrival deliberately",
    [
      {
        label: "Strengthen",
        detail:
          "Longer duration, lower rhythmic activity, clearer tonal or intervallic stability, reduced motion and coordinated textural emphasis can make an arrival more conclusive.",
      },
      {
        label: "Weaken",
        detail:
          "An upbeat arrival, continuing motion, unresolved tension, rising energy or immediate continuation can preserve forward momentum through a boundary.",
      },
      {
        label: "Match the form",
        detail:
          "Cadential strength should match the importance of the formal boundary; too much finality too early can flatten the larger shape.",
      },
    ],
    "Source-grounded summary of Belkin Chapter 5's practical punctuation controls.",
  ),

  "b02.presenting-stability": map(
    "b02.presenting-stability",
    "Chapter 6 - Presenting",
    "Present material through stable phrase groups",
    [
      {
        label: "Familiarity",
        detail:
          "Successive phrases that share salient material help the listener learn the musical idea before the form asks them to follow larger contrasts.",
      },
      {
        label: "Stability",
        detail:
          "Similarity of motive, accompaniment, phrase length, register, texture and harmonic region can make a group feel formally stable.",
      },
      {
        label: "Progression",
        detail:
          "Stable does not mean static: phrase groups can intensify toward a local climax while retaining their common identity.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 6's presenting function.",
  ),
  "b02.phrase-length": map(
    "b02.phrase-length",
    "Chapter 6 - Phrase length",
    "Phrase length changes emotional pacing",
    [
      {
        label: "Shortening",
        detail:
          "Successively shorter phrases can create acceleration and pressure toward a goal.",
      },
      {
        label: "Lengthening",
        detail:
          "Successively longer phrases often create relaxation, delay or a sense of expanding time.",
      },
      {
        label: "Context",
        detail:
          "The effect of phrase length interacts with harmony, register, rhythm and texture, so asymmetry can intensify or soften a larger progression.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 6's discussion of phrase-length asymmetry.",
  ),
  "b02.paragraph": map(
    "b02.paragraph",
    "Chapter 6 - The paragraph",
    "Several phrases can form one higher-level unit",
    [
      {
        label: "More than two phrases",
        detail:
          "A paragraph groups several phrases into one larger unit rather than treating them as an unrelated chain.",
      },
      {
        label: "Shared material",
        detail:
          "Related thematic material persists through the group strongly enough for the listener to hear common identity.",
      },
      {
        label: "Strongest final articulation",
        detail:
          "The last phrase has the clearest boundary in the group, even when that boundary is not the harmonically most final cadence imaginable.",
      },
      {
        label: "New direction after",
        detail:
          "What follows the paragraph should make the completed group perceptible by bringing a meaningful change of material or character.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 6's paragraph requirements.",
  ),
  "b02.period-paragraph": map(
    "b02.period-paragraph",
    "Chapter 6 - Higher-level grouping",
    "Control familiarity and culmination together",
    [
      {
        label: "Repetition with purpose",
        detail:
          "Repeated or closely related phrases make comparison easy, allowing differences in cadence, register and intensity to become especially meaningful.",
      },
      {
        label: "Hierarchy",
        detail:
          "Internal phrase endings can remain subordinate while the final phrase supplies the strongest punctuation and local climax.",
      },
      {
        label: "Coherent novelty",
        detail:
          "Variation can increase from phrase to phrase without destroying the sense that all phrases belong to one formal thought.",
      },
    ],
    "Source-grounded synthesis of Belkin Chapter 6's period and paragraph discussion.",
  ),

  "b03.binary-identity": map(
    "b03.binary-identity",
    "Chapter 9 - Binary form",
    "Binary form develops one main idea across two sections",
    [
      {
        label: "Not unrelated A-B",
        detail:
          "The second section is not defined by a new main idea; both halves derive from the same principal material.",
      },
      {
        label: "Strong middle punctuation",
        detail:
          "The division between halves is clear and often marked by a substantial cadence or other strong articulation.",
      },
      {
        label: "Comparison",
        detail:
          "Because the material is related, the listener can compare what the second half does differently with familiar motives and phrase shapes.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 9's defining binary-form characteristics.",
  ),
  "b03.second-half": map(
    "b03.second-half",
    "Chapter 9 - Second-section activity",
    "The second half raises the temperature",
    [
      {
        label: "Less stable",
        detail:
          "The second section normally becomes less stable than the first through harmony, phrase structure, register, texture or fragmentation.",
      },
      {
        label: "More activity",
        detail:
          "Faster harmonic or formal change can intensify the familiar material without replacing it.",
      },
      {
        label: "Whole-form direction",
        detail:
          "The increase in activity gives the complete binary form a developing trajectory instead of two equal blocks placed side by side.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 9's intensified second section.",
  ),
  "b03.rounded-return": map(
    "b03.rounded-return",
    "Chapter 9 - Rounded binary",
    "A return can resolve the instability of the second half",
    [
      {
        label: "Departure",
        detail:
          "The beginning of the second half can create harmonic or formal surprise, increasing instability after the first section.",
      },
      {
        label: "Return",
        detail:
          "Later in the second half, material from the opening returns and restores a sense of home.",
      },
      {
        label: "Changed function",
        detail:
          "The returning opening material now acts as resolution, so its familiar sound carries a different formal meaning than it did at the beginning.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 9's rounded-binary principle.",
  ),
  "b03.finality": map(
    "b03.finality",
    "Chapter 9 - Cadential hierarchy",
    "The second ending should complete what the first left open",
    [
      {
        label: "First ending",
        detail:
          "The end of the first section is often substantial but less final, preserving a reason for the form to continue.",
      },
      {
        label: "Final ending",
        detail:
          "The end of the second section should be more conclusive through harmony, preparation, rhythm, register, texture or a combination of them.",
      },
      {
        label: "Related cadences",
        detail:
          "When the two endings are motivically related, the difference in formal weight becomes especially easy to hear.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 9's comparison of first and final endings.",
  ),

  "b04.contrast-scale": map(
    "b04.contrast-scale",
    "Chapter 11 - Contrasting",
    "Contrast exists by degree",
    [
      {
        label: "Continuity first",
        detail:
          "Across a whole piece there is normally more continuity than contrast; too much novelty too often breaks the music into disconnected fragments.",
      },
      {
        label: "Several dimensions",
        detail:
          "Melody, harmony, rhythm, articulation, tempo, register, timbre, dynamics and texture all contribute to musical character.",
      },
      {
        label: "Amount and speed",
        detail:
          "The degree of contrast depends on how many dimensions change, how far they move and how quickly the changes arrive.",
      },
      {
        label: "Fit the context",
        detail:
          "Small local spans usually need milder contrast than major formal boundaries, so contrast should be adjusted to its structural location.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 11's practical scale of musical contrast.",
  ),
  "b04.reduce-bump": map(
    "b04.reduce-bump",
    "Chapter 11 - Revising excessive contrast",
    "Reduce an abrupt formal bump",
    [
      {
        label: "List the changes",
        detail:
          "When a continuation feels too abrupt, identify which dimensions changed instead of relying on a vague judgement that it feels wrong.",
      },
      {
        label: "Change fewer things",
        detail:
          "Keeping more dimensions close to the original can lower the contrast while preserving the same formal length and direction.",
      },
      {
        label: "More than one solution",
        detail:
          "Different revisions can reach a suitable contrast level by preserving different combinations of register, rhythm, dynamics, articulation, harmony or texture.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 11's revision method for overstrong local contrast.",
  ),
  "b04.raise-contrast": map(
    "b04.raise-contrast",
    "Chapter 11 - Increasing contrast",
    "Add novelty without losing the thread",
    [
      {
        label: "Recognize monotony",
        detail:
          "A continuation can fail because it remains too close to what came before and no longer renews the listener's attention.",
      },
      {
        label: "Add several differences",
        detail:
          "Contrast can be strengthened by changing more dimensions or making existing changes more substantial.",
      },
      {
        label: "Retain some identity",
        detail:
          "Enough familiar material should remain for the listener to hear the new state as part of the same piece rather than an unrelated insertion.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 11's exercises in strengthening insufficient contrast.",
  ),
  "b04.varied-destinations": map(
    "b04.varied-destinations",
    "Chapter 11 - Repeated contrasts",
    "Familiar material can lead somewhere different",
    [
      {
        label: "Surprise diminishes",
        detail:
          "Repeating the same source-to-contrast succession reduces its effect because the listener now expects the destination.",
      },
      {
        label: "Keep the landmark",
        detail:
          "Familiar preceding material can still unify the form and act as a recognizable reference point.",
      },
      {
        label: "Change the destination",
        detail:
          "Leading the same familiar material toward a different contrasting state preserves richness and unpredictability at the larger formal level.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 11's discussion of varied contrasting destinations.",
  ),

  "b05.gradual-transition": map(
    "b05.gradual-transition",
    "Chapter 12 - Connecting",
    "Change one dimension at a time",
    [
      {
        label: "Know both endpoints",
        detail:
          "A transition is directed: the composer must know the departure and arrival states before deciding how to connect them.",
      },
      {
        label: "List every difference",
        detail:
          "Register, timbre, tempo, texture, articulation, pitch, harmony and rhythm all contribute to the distance between the endpoints.",
      },
      {
        label: "Small local steps",
        detail:
          "For a smooth transition, multiple dimensions should not change simultaneously; each local step should introduce only a small amount of novelty.",
      },
      {
        label: "Distance needs time",
        detail:
          "The more dimensions differ, and the more strongly they differ, the longer a fully smooth transition generally needs.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 12's procedure for composing smooth transitions.",
  ),
  "b05.common-ground": map(
    "b05.common-ground",
    "Chapter 12 - Common elements",
    "Use familiar material as structural glue",
    [
      {
        label: "Memory connects",
        detail:
          "A transition becomes coherent when new material is associated with something the listener already remembers.",
      },
      {
        label: "Some things stay",
        detail:
          "At every stage, certain dimensions can remain constant while others change, providing a perceptual handhold through the transition.",
      },
      {
        label: "Salient associations",
        detail:
          "Common tones, recurring gestures, contours or other familiar features can unify strongly contrasting characters even when several other dimensions change.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 12's common-ground principle.",
  ),
  "b05.control-surprise": map(
    "b05.control-surprise",
    "Chapter 12 - Controlling continuity and surprise",
    "Transition rate controls dramatic impact",
    [
      {
        label: "Gradual",
        detail:
          "Changing one small element at a time maximizes continuity and minimizes the sense of a bump.",
      },
      {
        label: "More dramatic",
        detail:
          "Changing two dimensions together, making a larger change in one dimension or shortening the route increases surprise.",
      },
      {
        label: "Precise control",
        detail:
          "Tracking how many things change and how fast they evolve gives the composer fine control over the dramatic profile of the transition.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 12's method for varying transitional surprise.",
  ),
  "b05.turning-point": map(
    "b05.turning-point",
    "Chapter 12 - Turning points",
    "A climax can redirect the music",
    [
      {
        label: "Significant moment",
        detail:
          "Cadences and climaxes can support more abrupt transformations because they are already heard as structurally important events.",
      },
      {
        label: "Prepared change",
        detail:
          "A larger change feels convincing when the preceding build has prepared the listener for a turning point.",
      },
      {
        label: "Overlap",
        detail:
          "The climactic arrival can simultaneously begin the new idea, creating momentum across the boundary instead of stopping and restarting.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 12's discussion of cadences and climaxes as turning points.",
  ),

  "b06.local-progression": map(
    "b06.local-progression",
    "Chapter 13 - Progressing",
    "Keep direction clear and details alive",
    [
      {
        label: "Incremental direction",
        detail:
          "A progression is any clearly incremental pattern, such as rising melodic peaks, accelerating rhythm or widening register.",
      },
      {
        label: "Expectation",
        detail:
          "A perceptible trajectory creates suspense because each step points beyond itself toward a later goal.",
      },
      {
        label: "Avoid literal predictability",
        detail:
          "An unvaried sequence can become obvious and lose attention once the listener understands its rule.",
      },
      {
        label: "Vary the details",
        detail:
          "Mild irregularity in motive, phrase length, rhythm or other detail can renew attention while preserving the overall direction.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 13's local-progression principle.",
  ),
  "b06.long-range": map(
    "b06.long-range",
    "Chapter 13 - Long-range progression",
    "Successive peaks can unify a large span",
    [
      {
        label: "Salient landmarks",
        detail:
          "Over longer spans, progressions work through memorable features such as climaxes, registral extremes or other events strong enough to survive intervening activity.",
      },
      {
        label: "Breathing room",
        detail:
          "Local contrasts and releases can interrupt a straight rise without destroying the larger trajectory.",
      },
      {
        label: "Graduated peaks",
        detail:
          "Successive climaxes often need to increase in strength because equal repeated peaks tend to have diminishing perceptual effect.",
      },
      {
        label: "One large gesture",
        detail:
          "A hierarchy of intensities helps the listener hear separate sections as parts of a larger directed whole.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 13's large-scale progression and climax hierarchy.",
  ),
  "b06.climax-preparation": map(
    "b06.climax-preparation",
    "Chapter 13 - Climax",
    "A peak needs preparation",
    [
      {
        label: "Build the need",
        detail:
          "A high note or loud event alone is not a climax; its force comes mainly from accumulated tension that makes the culmination feel necessary.",
      },
      {
        label: "Several dimensions",
        detail:
          "Register, rhythm, dynamics, timbre, harmony, density and pacing can all contribute to the build-up.",
      },
      {
        label: "Hold something back",
        detail:
          "Withholding a distinctive resource until the peak can crown an already strong build with new sensation.",
      },
      {
        label: "Major peaks need time",
        detail:
          "The more important the climax, the more preparation it generally requires.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 13's preparation and culmination principles.",
  ),
  "b06.accelerating-climax": map(
    "b06.accelerating-climax",
    "Chapter 13 - Final approach to climax",
    "Simplify and accelerate near the goal",
    [
      {
        label: "Clarify the pattern",
        detail:
          "Near a major culmination, simplifying the progression can make its direction more obvious and signal that the goal is close.",
      },
      {
        label: "Compress the steps",
        detail:
          "Repeating important events at shorter intervals increases urgency and makes the destination feel nearer.",
      },
      {
        label: "Arrive",
        detail:
          "Acceleration is preparation rather than the goal itself; the final event still needs enough weight to register as the culmination.",
      },
    ],
    "Source-grounded analysis of Belkin Chapter 13's discussion of simplification and acceleration before a climax.",
  ),
};

export function getBelkinSourceMaterial(id: string): BelkinSourceMap | undefined {
  return belkinSourceMaterial[id];
}
