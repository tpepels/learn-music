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
};

export function getBelkinSourceMaterial(id: string): BelkinSourceMap | undefined {
  return belkinSourceMaterial[id];
}
