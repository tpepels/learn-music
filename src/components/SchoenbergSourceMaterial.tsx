import { useEffect, useMemo, useRef, useState } from "react";
import { audioEngine } from "../audio/engine";
import { useStudioStore } from "../state/studio";
import {
  getSchoenbergSourceMaterial,
  type SchoenbergSourceEvent,
  type SchoenbergSourceScore,
} from "../music/schoenbergSourceMaterial";

type StaffClef = "treble" | "bass";

function eventMidis(event: SchoenbergSourceEvent): number[] {
  if (event.midi === null) return [];
  return Array.isArray(event.midi) ? event.midi : [event.midi];
}

type SourceAccidental = NonNullable<SchoenbergSourceEvent["accidental"]>;

const NATURAL_PITCH_CLASS_TO_LETTER = new Map<number, number>([
  [0, 0], // C
  [2, 1], // D
  [4, 2], // E
  [5, 3], // F
  [7, 4], // G
  [9, 5], // A
  [11, 6], // B
]);

const FLAT_SIGNATURE_LETTERS = [6, 2, 5, 1, 4, 0, 3]; // B E A D G C F
const SHARP_SIGNATURE_LETTERS = [3, 0, 4, 1, 5, 2, 6]; // F C G D A E B
const NATURAL_PITCH_CLASSES = [0, 2, 4, 5, 7, 9, 11];

function naturalDiatonicStep(midi: number): number {
  const pitchClass = ((midi % 12) + 12) % 12;
  const letter = NATURAL_PITCH_CLASS_TO_LETTER.get(pitchClass);
  if (letter === undefined) {
    throw new Error(`Expected natural MIDI pitch, got ${midi}`);
  }
  const octave = Math.floor(midi / 12) - 1;
  return octave * 7 + letter;
}

function signatureAlterationForLetter(
  letter: number,
  keySignature = 0,
): -1 | 0 | 1 {
  const count = Math.min(7, Math.abs(keySignature));
  if (!count) return 0;
  const letters =
    keySignature < 0 ? FLAT_SIGNATURE_LETTERS : SHARP_SIGNATURE_LETTERS;
  return letters.slice(0, count).includes(letter)
    ? keySignature < 0 ? -1 : 1
    : 0;
}

export function sourceNoteSpelling(
  midi: number,
  keySignature = 0,
  explicit?: SourceAccidental | null,
): { step: number; alteration: -1 | 0 | 1 } {
  const explicitAlteration =
    explicit === "♭" ? -1 : explicit === "♯" ? 1 : explicit === "♮" ? 0 : null;

  if (explicitAlteration !== null) {
    return {
      step: naturalDiatonicStep(midi - explicitAlteration),
      alteration: explicitAlteration,
    };
  }

  const pitchClass = ((midi % 12) + 12) % 12;
  const count = Math.min(7, Math.abs(keySignature));
  const signatureLetters =
    keySignature < 0 ? FLAT_SIGNATURE_LETTERS : SHARP_SIGNATURE_LETTERS;
  const signatureAlteration: -1 | 1 = keySignature < 0 ? -1 : 1;

  for (const letter of signatureLetters.slice(0, count)) {
    const alteredPitchClass =
      (NATURAL_PITCH_CLASSES[letter] + signatureAlteration + 12) % 12;
    if (alteredPitchClass === pitchClass) {
      return {
        step: naturalDiatonicStep(midi - signatureAlteration),
        alteration: signatureAlteration,
      };
    }
  }

  if (NATURAL_PITCH_CLASS_TO_LETTER.has(pitchClass)) {
    return { step: naturalDiatonicStep(midi), alteration: 0 };
  }

  const alteration: -1 | 1 = keySignature < 0 ? -1 : 1;
  return {
    step: naturalDiatonicStep(midi - alteration),
    alteration,
  };
}

export function sourceDisplayedAccidental(
  midi: number,
  keySignature = 0,
  explicit?: SourceAccidental | null,
): string {
  if (explicit) return explicit;

  const spelling = sourceNoteSpelling(midi, keySignature);
  const letter = ((spelling.step % 7) + 7) % 7;
  const signatureAlteration = signatureAlterationForLetter(letter, keySignature);

  if (spelling.alteration === signatureAlteration) return "";
  if (spelling.alteration === 0) return "♮";
  return spelling.alteration < 0 ? "♭" : "♯";
}

function staffTop(clef: StaffClef, grand: boolean): number {
  if (!grand) return 56;
  return clef === "treble" ? 46 : 126;
}

function sourceStaffY(
  midi: number,
  clef: StaffClef,
  grand = false,
  keySignature = 0,
  explicit?: SourceAccidental | null,
): number {
  const bottomLineMidi = clef === "treble" ? 64 : 43; // E4 / G2
  const bottomStep = naturalDiatonicStep(bottomLineMidi);
  const bottomY = staffTop(clef, grand) + 40;
  const noteStep = sourceNoteSpelling(midi, keySignature, explicit).step;
  return bottomY - (noteStep - bottomStep) * 5;
}

const TREBLE_FLAT_MIDIS = [71, 76, 69, 74, 67, 72, 65];
const TREBLE_SHARP_MIDIS = [77, 72, 79, 74, 69, 76, 71];
const BASS_FLAT_MIDIS = [47, 52, 45, 50, 43, 48, 41];
const BASS_SHARP_MIDIS = [53, 48, 55, 50, 45, 52, 47];

function KeySignature({
  score,
  clef,
  grand,
}: {
  score: SchoenbergSourceScore;
  clef: StaffClef;
  grand: boolean;
}) {
  const count = Math.min(7, Math.abs(score.keySignature ?? 0));
  if (!count) return null;

  const flats = (score.keySignature ?? 0) < 0;
  const midis =
    clef === "treble"
      ? flats ? TREBLE_FLAT_MIDIS : TREBLE_SHARP_MIDIS
      : flats ? BASS_FLAT_MIDIS : BASS_SHARP_MIDIS;
  const glyph = flats ? "♭" : "♯";

  return (
    <>
      {midis.slice(0, count).map((midi, index) => (
        <text
          key={index}
          x={76 + index * 13}
          y={sourceStaffY(midi, clef, grand) + 5}
          className="source-score-accidental source-score-key-signature"
        >
          {glyph}
        </text>
      ))}
    </>
  );
}

function Staff({
  score,
  clef,
  grand,
  width,
}: {
  score: SchoenbergSourceScore;
  clef: StaffClef;
  grand: boolean;
  width: number;
}) {
  const top = staffTop(clef, grand);
  const meterX = 84 + Math.abs(score.keySignature ?? 0) * 13;

  return (
    <>
      {[0, 10, 20, 30, 40].map((offset) => (
        <line
          className="source-score-line"
          key={offset}
          x1="28"
          x2={width - 24}
          y1={top + offset}
          y2={top + offset}
        />
      ))}
      <text x="38" y={top + 35} className="source-score-clef">
        {clef === "treble" ? "𝄞" : "𝄢"}
      </text>
      <KeySignature score={score} clef={clef} grand={grand} />
      {score.meter ? (
        <>
          <text x={meterX} y={top + 20} className="source-score-meter">
            {score.meter.split("/")[0]}
          </text>
          <text x={meterX} y={top + 36} className="source-score-meter">
            {score.meter.split("/")[1]}
          </text>
        </>
      ) : null}
    </>
  );
}

export function sourceContentStartX(score: SchoenbergSourceScore): number {
  const keySignatureWidth = Math.abs(score.keySignature ?? 0) * 13;
  const notationEnd = 84 + keySignatureWidth;
  return Math.max(130, notationEnd + (score.meter ? 38 : 20));
}

const SOURCE_EIGHTH_SPACING = 28;
const SOURCE_BARLINE_GAP = 22;
const SOURCE_POSITION_EPSILON = 1e-6;

export function sourceHorizontalX(
  positionUnits: number,
  unitToEighth: number,
  contentStartX: number,
  barlinePositions: number[],
  kind: "event" | "barline" = "event",
): number {
  const barsBefore = barlinePositions.filter(
    (bar) => bar < positionUnits - SOURCE_POSITION_EPSILON,
  ).length;
  const barAtPosition = barlinePositions.some(
    (bar) => Math.abs(bar - positionUnits) <= SOURCE_POSITION_EPSILON,
  );

  const base =
    contentStartX +
    positionUnits * unitToEighth * SOURCE_EIGHTH_SPACING +
    barsBefore * SOURCE_BARLINE_GAP;

  if (kind === "barline") return base + SOURCE_BARLINE_GAP / 2;
  return base + (barAtPosition ? SOURCE_BARLINE_GAP : 0);
}

export function sourceStemDirection(
  midis: number[],
  clef: StaffClef,
  keySignature = 0,
  accidentals: Array<SourceAccidental | null | undefined> = [],
): "up" | "down" {
  if (!midis.length) return "up";
  const middleLineMidi = clef === "treble" ? 71 : 50; // B4 / D3
  const averageStep =
    midis.reduce(
      (sum, midi, index) =>
        sum + sourceNoteSpelling(midi, keySignature, accidentals[index]).step,
      0,
    ) / midis.length;
  return averageStep >= naturalDiatonicStep(middleLineMidi) ? "down" : "up";
}

export function sourceChordNoteheadOffsets(
  ys: number[],
  stemDirection: "up" | "down",
): number[] {
  const offsets = ys.map(() => 0);
  if (ys.length < 2) return offsets;

  const direction = stemDirection === "up" ? 13 : -13;
  const indices = ys
    .map((_, index) => index)
    .sort((a, b) =>
      stemDirection === "up"
        ? ys[b] - ys[a] // low to high
        : ys[a] - ys[b], // high to low
    );

  let previous: number | undefined;
  for (const index of indices) {
    if (
      previous !== undefined &&
      Math.abs(ys[index] - ys[previous]) <= 5.1
    ) {
      offsets[index] = offsets[previous] === 0 ? direction : 0;
    }
    previous = index;
  }

  return offsets;
}

function sourceRestGlyph(durationEighths: number): string {
  if (durationEighths >= 8) return "𝄻";
  if (durationEighths >= 4) return "𝄼";
  if (durationEighths >= 2) return "𝄽";
  if (durationEighths >= 1) return "𝄾";
  return "𝄿";
}

function ledgerYs(y: number, clef: StaffClef, grand: boolean): number[] {
  const top = staffTop(clef, grand);
  const bottom = top + 40;
  const result: number[] = [];
  if (y < top - 2) {
    for (let line = top - 10; line >= y - 1; line -= 10) result.push(line);
  }
  if (y > bottom + 2) {
    for (let line = bottom + 10; line <= y + 1; line += 10) result.push(line);
  }
  return result;
}

function SourceScore({
  score,
}: {
  score: SchoenbergSourceScore;
}) {
  const [playingIndices, setPlayingIndices] = useState<number[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState(0);
  const timers = useRef<number[]>([]);
  const recordLearningExperiment = useStudioStore(
    (state) => state.recordLearningExperiment,
  );

  const grand = useMemo(() => {
    const staves = new Set(
      score.events
        .filter((event) => event.staff)
        .map((event) => event.staff),
    );
    return staves.has("treble") && staves.has("bass");
  }, [score.events]);

  const unitToEighth = score.durationUnit === "sixteenth" ? 0.5 : 1;

  const positions = useMemo(() => {
    let cursor = 0;
    return score.events.map((event) => {
      const current = event.at ?? cursor;
      cursor = Math.max(cursor, current + Math.max(0.25, event.duration));
      return current;
    });
  }, [score.events]);

  const totalUnits = useMemo(
    () =>
      score.events.reduce(
        (end, event, index) =>
          Math.max(
            end,
            positions[index] + Math.max(0.25, event.duration),
          ),
        0,
      ),
    [positions, score.events],
  );
  const totalEighths = totalUnits * unitToEighth;
  const contentStartX = sourceContentStartX(score);
  const barlinePositions = useMemo(() => {
    if (score.barlines?.length) return [...score.barlines];
    return score.events.flatMap((event, index) =>
      event.barAfter
        ? [positions[index] + Math.max(0.25, event.duration)]
        : [],
    );
  }, [positions, score.barlines, score.events]);
  const width = Math.max(
    700,
    contentStartX +
      totalEighths * SOURCE_EIGHTH_SPACING +
      barlinePositions.length * SOURCE_BARLINE_GAP +
      48,
  );
  const svgHeight = grand ? 232 : 176;

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    },
    [],
  );

  const stopLocalPlayback = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setPlayingIndices([]);
  };

  const play = () => {
    recordLearningExperiment("source.play", score.id);
    stopLocalPlayback();
    const eighthMs = 60000 / score.bpm / 2;

    score.events.forEach((event, index) => {
      const startMs = positions[index] * unitToEighth * eighthMs;
      const durationMs =
        Math.max(0.25, event.duration * unitToEighth) * eighthMs;

      timers.current.push(
        window.setTimeout(() => {
          setPlayingIndices((current) =>
            current.includes(index) ? current : [...current, index],
          );
          const midis = eventMidis(event);
          if (midis.length) {
            void audioEngine.playSourceNote(
              midis.length === 1 ? midis[0] : midis,
              event.duration * unitToEighth,
              0.7,
            );
          }
        }, startMs),
      );
      timers.current.push(
        window.setTimeout(() => {
          setPlayingIndices((current) =>
            current.filter((playing) => playing !== index),
          );
        }, startMs + durationMs),
      );
    });

    timers.current.push(
      window.setTimeout(
        () => setPlayingIndices([]),
        totalEighths * eighthMs + 100,
      ),
    );
  };

  const xForPosition = (
    position: number,
    kind: "event" | "barline" = "event",
  ) =>
    sourceHorizontalX(
      position,
      unitToEighth,
      contentStartX,
      barlinePositions,
      kind,
    );
  const xForEvent = (index: number) =>
    xForPosition(positions[index], "event");
  const analysis = score.analysis ?? [];
  const activeSegment = analysis[activeAnalysis];

  const staffForEvent = (event: SchoenbergSourceEvent): StaffClef =>
    event.staff ?? score.clef;

  return (
    <section className="source-score" aria-label={score.title + " score"}>
      <div className="source-material-heading">
        <div>
          <strong>{score.title}</strong>
        </div>
        <button type="button" onClick={play}>Play example</button>
      </div>

      <div className="source-score-meta">
        <span>{score.keyLabel}</span>
        {score.meter ? <span>{score.meter}</span> : null}
      </div>

      <div className="source-score-scroll">
        <svg
          className={`source-score-svg${grand ? " is-grand" : ""}`}
          viewBox={`0 0 ${width} ${svgHeight}`}
          style={{ minWidth: width }}
          role="img"
          aria-label={score.title}
        >
          {grand ? (
            <>
              <Staff score={score} clef="treble" grand width={width} />
              <Staff score={score} clef="bass" grand width={width} />
              <line
                x1="28"
                x2="28"
                y1={staffTop("treble", true)}
                y2={staffTop("bass", true) + 40}
                className="source-score-barline source-score-grand-brace"
              />
            </>
          ) : (
            <Staff score={score} clef={score.clef} grand={false} width={width} />
          )}

          {(score.barlines ?? []).map((position) => (
            <line
              key={position}
              x1={xForPosition(position, "barline")}
              x2={xForPosition(position, "barline")}
              y1={grand ? staffTop("treble", true) : staffTop(score.clef, false) - 4}
              y2={grand ? staffTop("bass", true) + 40 : staffTop(score.clef, false) + 44}
              className="source-score-barline"
            />
          ))}

          {score.events.map((event, index) => {
            const x = xForEvent(index);
            const clef = staffForEvent(event);
            const top = staffTop(clef, grand);
            const midis = eventMidis(event);
            const eventAccidentals = midis.map((_, pitchIndex) =>
              event.accidentals?.[pitchIndex] ??
              (pitchIndex === 0 ? event.accidental : null),
            );
            const ys = midis.map((midi, pitchIndex) =>
              sourceStaffY(
                midi,
                clef,
                grand,
                score.keySignature,
                eventAccidentals[pitchIndex],
              ),
            );
            const y = ys.length
              ? ys.reduce((sum, value) => sum + value, 0) / ys.length
              : top + 20;
            const stemDirection = sourceStemDirection(
              midis,
              clef,
              score.keySignature,
              eventAccidentals,
            );
            const noteheadOffsets = sourceChordNoteheadOffsets(
              ys,
              stemDirection,
            );
            const stemDown = stemDirection === "down";
            const highestY = ys.length ? Math.min(...ys) : y;
            const lowestY = ys.length ? Math.max(...ys) : y;
            const stemX = x + (stemDown ? -6.5 : 6.5);
            const stemStartY = stemDown ? highestY : lowestY;
            const stemEndY = stemDown ? lowestY + 30 : highestY - 30;
            const durationEighths = event.duration * unitToEighth;
            const open = durationEighths >= 4;
            const dotted = [1.5, 3, 6].some(
              (value) => Math.abs(durationEighths - value) < 0.001,
            );
            const flags =
              durationEighths <= 0.5 ? 2 : durationEighths <= 1 ? 1 : 0;
            return (
              <g
                key={index}
                className={[
                  "source-score-event",
                  playingIndices.includes(index) ? "is-playing" : "",
                  activeSegment &&
                  activeSegment.startEvent !== undefined &&
                  activeSegment.endEvent !== undefined &&
                  index >= activeSegment.startEvent &&
                  index <= activeSegment.endEvent
                    ? "is-analysis-active"
                    : "",
                ].filter(Boolean).join(" ")}
                onClick={() => {
                  if (midis.length) {
                    recordLearningExperiment("source.note", score.id + ":" + index);
                    void audioEngine.playSourceNote(
                      midis.length === 1 ? midis[0] : midis,
                      event.duration * unitToEighth,
                      0.74,
                    );
                  }
                }}
                role="button"
                tabIndex={midis.length ? 0 : -1}
              >
                {!midis.length ? (
                  <text x={x} y={y + 4} className="source-score-rest">
                    {sourceRestGlyph(durationEighths)}
                  </text>
                ) : (
                  <>
                    {midis.map((midi, pitchIndex) => {
                      const noteY = ys[pitchIndex];
                      const noteX = x + noteheadOffsets[pitchIndex];
                      const explicit = eventAccidentals[pitchIndex];
                      const accidental = sourceDisplayedAccidental(
                        midi,
                        score.keySignature,
                        explicit,
                      );
                      return (
                        <g key={midi + ":" + pitchIndex}>
                          {ledgerYs(noteY, clef, grand).map((ledgerY) => (
                            <line
                              key={ledgerY}
                              x1={noteX - 11}
                              x2={noteX + 11}
                              y1={ledgerY}
                              y2={ledgerY}
                              className="source-score-ledger"
                            />
                          ))}
                          {accidental ? (
                            <text
                              x={noteX - 17 - pitchIndex * 2}
                              y={noteY + 5}
                              className="source-score-accidental"
                            >
                              {accidental}
                            </text>
                          ) : null}
                          <ellipse
                            cx={noteX}
                            cy={noteY}
                            rx="7.5"
                            ry="5.2"
                            className={open ? "is-open" : ""}
                          />
                          {dotted ? (
                            <circle cx={noteX + 13} cy={noteY} r="1.8" />
                          ) : null}
                        </g>
                      );
                    })}
                    {durationEighths < 8 ? (
                      <line
                        x1={stemX}
                        x2={stemX}
                        y1={stemStartY}
                        y2={stemEndY}
                        className="source-score-stem"
                      />
                    ) : null}
                    {Array.from({ length: flags }, (_, flagIndex) => {
                      const flagY = stemEndY + (stemDown ? -flagIndex * 7 : flagIndex * 7);
                      return (
                        <path
                          key={flagIndex}
                          d={
                            stemDown
                              ? `M ${stemX} ${flagY} q -13 -6 -8 -18`
                              : `M ${stemX} ${flagY} q 13 6 8 18`
                          }
                          className="source-score-flag"
                        />
                      );
                    })}
                  </>
                )}
                {!score.barlines?.length && event.barAfter ? (
                  <line
                    x1={xForPosition(
                      positions[index] + Math.max(0.25, event.duration),
                      "barline",
                    )}
                    x2={xForPosition(
                      positions[index] + Math.max(0.25, event.duration),
                      "barline",
                    )}
                    y1={staffTop(clef, grand) - 4}
                    y2={staffTop(clef, grand) + 44}
                    className="source-score-barline"
                  />
                ) : null}
              </g>
            );
          })}

          {(score.slurs ?? []).map((slur, index) => {
            const startEvent = score.events[slur.start];
            const endEvent = score.events[slur.end];
            const startMidis = startEvent ? eventMidis(startEvent) : [];
            const endMidis = endEvent ? eventMidis(endEvent) : [];
            if (!startEvent || !endEvent || !startMidis.length || !endMidis.length) {
              return null;
            }
            const startClef = staffForEvent(startEvent);
            const endClef = staffForEvent(endEvent);
            if (startClef !== endClef) return null;
            const startX = xForEvent(slur.start) - 4;
            const endX = xForEvent(slur.end) + 7;
            const startMidi = Math.max(...startMidis);
            const endMidi = Math.max(...endMidis);
            const startPitchIndex = startMidis.indexOf(startMidi);
            const endPitchIndex = endMidis.indexOf(endMidi);
            const startAccidental =
              startEvent.accidentals?.[startPitchIndex] ??
              (startPitchIndex === 0 ? startEvent.accidental : null);
            const endAccidental =
              endEvent.accidentals?.[endPitchIndex] ??
              (endPitchIndex === 0 ? endEvent.accidental : null);
            const startY =
              sourceStaffY(
                startMidi,
                startClef,
                grand,
                score.keySignature,
                startAccidental,
              ) + 12;
            const endY =
              sourceStaffY(
                endMidi,
                endClef,
                grand,
                score.keySignature,
                endAccidental,
              ) + 12;
            const controlY = Math.max(startY, endY) + 16;
            return (
              <path
                key={index}
                d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${controlY} ${endX} ${endY}`}
                className="source-score-slur"
              />
            );
          })}
        </svg>
      </div>

      {analysis.length ? (
        <div className="source-analysis-tabs is-score-analysis" role="tablist">
          {analysis.map((entry, index) => (
            <button
              type="button"
              key={entry.label}
              className={activeAnalysis === index ? "is-active" : ""}
              onClick={() => {
                setActiveAnalysis(index);
                recordLearningExperiment(
                  "source.analysis",
                  score.id + ":" + index,
                );
              }}
              role="tab"
              aria-selected={activeAnalysis === index}
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}
      {activeSegment ? (
        <div className="source-analysis-detail is-score-analysis">
          <p>{activeSegment.detail}</p>
        </div>
      ) : null}
    </section>
  );
}

function SourceMap({
  id,
}: {
  id: string;
}) {
  const material = getSchoenbergSourceMaterial(id);
  const [active, setActive] = useState(0);
  const recordLearningExperiment = useStudioStore(
    (state) => state.recordLearningExperiment,
  );
  if (!material || material.kind !== "map") return null;
  const segment = material.segments[active];

  return (
    <section className="source-analysis-map" aria-label={material.title + " analysis"}>
      <div className="source-material-heading">
        <div>
          <strong>{material.title}</strong>
        </div>
      </div>
      <div className="source-analysis-tabs" role="tablist">
        {material.segments.map((entry, index) => (
          <button
            type="button"
            key={entry.label}
            className={active === index ? "is-active" : ""}
            onClick={() => {
              setActive(index);
              recordLearningExperiment("source.analysis", id + ":" + index);
            }}
            role="tab"
            aria-selected={active === index}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="source-analysis-detail">
        <p>{segment.detail}</p>
      </div>
    </section>
  );
}

export function SchoenbergSourceMaterial({
  id,
}: {
  id: string;
}) {
  const material = getSchoenbergSourceMaterial(id);
  if (!material) {
    return (
      <div className="source-material-missing">
        Source material {id} is not registered.
      </div>
    );
  }

  return material.kind === "score"
    ? <SourceScore score={material} />
    : <SourceMap id={id} />;
}
