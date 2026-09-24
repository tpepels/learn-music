import { useEffect, useMemo, useState } from "react";
import { Note } from "tonal";
import { audioEngine, type ScorePlaybackEvent } from "../audio/engine";
import {
  getSchoenbergSourceExample,
  type SchoenbergSourceExampleId,
} from "../music/schoenbergSourceExamples";
import type {
  ScoreStaff,
  SourceScoreEvent,
  SourceScoreExample,
} from "../music/sourceScore";

const LETTER_STEP: Record<string, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

function pitchParts(pitch: string) {
  const match = pitch.match(/^([A-G])([#b]{0,2})(-?\d+)$/);
  if (!match) return { letter: "C", accidental: "", octave: 4 };
  return {
    letter: match[1],
    accidental: match[2],
    octave: Number(match[3]),
  };
}

function diatonicIndex(pitch: string): number {
  const { letter, octave } = pitchParts(pitch);
  return octave * 7 + LETTER_STEP[letter];
}

function staffBottomLineIndex(staff: ScoreStaff): number {
  return staff === "treble"
    ? 4 * 7 + LETTER_STEP.E
    : 2 * 7 + LETTER_STEP.G;
}

function staffBounds(staff: ScoreStaff, grand: boolean) {
  if (staff === "treble") {
    return { top: 42, bottom: 74 };
  }
  return grand
    ? { top: 112, bottom: 144 }
    : { top: 42, bottom: 74 };
}

function pitchY(pitch: string, staff: ScoreStaff, grand: boolean): number {
  const { bottom } = staffBounds(staff, grand);
  return bottom - (diatonicIndex(pitch) - staffBottomLineIndex(staff)) * 4;
}

function accidentalGlyph(pitch: string): string {
  const { accidental } = pitchParts(pitch);
  if (accidental === "#") return "♯";
  if (accidental === "##") return "𝄪";
  if (accidental === "b") return "♭";
  if (accidental === "bb") return "𝄫";
  return "";
}

function durationKind(duration: number) {
  return {
    open: duration >= 8,
    whole: duration >= 16,
    dotted: [3, 6, 12].includes(duration),
    flags: duration <= 1 ? 2 : duration <= 2 ? 1 : 0,
  };
}

function toPlaybackEvent(event: SourceScoreEvent): ScorePlaybackEvent {
  return {
    start: event.start,
    duration: event.duration,
    pitches: event.pitches
      .map((pitch) => Note.midi(pitch))
      .filter((midi): midi is number => midi !== null),
  };
}

function StaffLines({
  staff,
  width,
  grand,
}: {
  staff: ScoreStaff;
  width: number;
  grand: boolean;
}) {
  const { top } = staffBounds(staff, grand);
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => top + index * 8).map((y) => (
        <line
          key={y}
          x1="54"
          x2={width - 24}
          y1={y}
          y2={y}
          className="source-score-line"
        />
      ))}
      <text
        x="62"
        y={staff === "treble" ? top + 29 : top + 27}
        className={staff === "treble" ? "source-score-clef" : "source-score-bass-clef"}
      >
        {staff === "treble" ? "𝄞" : "𝄢"}
      </text>
    </>
  );
}

function LedgerLines({
  x,
  y,
  staff,
  grand,
}: {
  x: number;
  y: number;
  staff: ScoreStaff;
  grand: boolean;
}) {
  const { top, bottom } = staffBounds(staff, grand);
  const lines: number[] = [];
  if (y > bottom + 2) {
    for (let lineY = bottom + 8; lineY <= y + 1; lineY += 8) {
      lines.push(lineY);
    }
  }
  if (y < top - 2) {
    for (let lineY = top - 8; lineY >= y - 1; lineY -= 8) {
      lines.push(lineY);
    }
  }

  return (
    <>
      {lines.map((lineY) => (
        <line
          key={lineY}
          x1={x - 10}
          x2={x + 10}
          y1={lineY}
          y2={lineY}
          className="source-score-ledger"
        />
      ))}
    </>
  );
}

function ScoreEventGlyph({
  event,
  x,
  grand,
  active,
  current,
  onAudition,
}: {
  event: SourceScoreEvent;
  x: number;
  grand: boolean;
  active: boolean;
  current: boolean;
  onAudition: () => void;
}) {
  const staff = event.staff ?? "treble";
  const { top, bottom } = staffBounds(staff, grand);

  if (!event.pitches.length) {
    return (
      <g
        className={[
          "source-score-event",
          "is-rest",
          active ? "is-active" : "",
          current ? "is-current" : "",
        ].filter(Boolean).join(" ")}
      >
        <text x={x} y={(top + bottom) / 2 + 6} className="source-score-rest">
          𝄽
        </text>
      </g>
    );
  }

  const ys = event.pitches.map((pitch) => pitchY(pitch, staff, grand));
  const averageY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
  const stemDown = averageY < (top + bottom) / 2;
  const kind = durationKind(event.duration);
  const stemX = stemDown ? x - 6 : x + 6;
  const stemTop = stemDown ? averageY + 27 : averageY - 27;

  return (
    <g
      className={[
        "source-score-event",
        active ? "is-active" : "",
        current ? "is-current" : "",
      ].filter(Boolean).join(" ")}
      onClick={onAudition}
      role="button"
      tabIndex={0}
      onKeyDown={(eventKey) => {
        if (eventKey.key === "Enter" || eventKey.key === " ") {
          eventKey.preventDefault();
          onAudition();
        }
      }}
      aria-label={`Audition ${event.pitches.join(", ")}`}
    >
      {event.pitches.map((pitch, index) => {
        const y = ys[index];
        return (
          <g key={pitch + index}>
            <LedgerLines x={x} y={y} staff={staff} grand={grand} />
            {accidentalGlyph(pitch) && (
              <text x={x - 17} y={y + 5} className="source-score-accidental">
                {accidentalGlyph(pitch)}
              </text>
            )}
            <ellipse
              cx={x}
              cy={y}
              rx="7"
              ry="5"
              className={kind.open ? "is-open" : ""}
            />
            {kind.dotted && (
              <circle cx={x + 12} cy={y} r="1.6" className="source-score-dot" />
            )}
          </g>
        );
      })}
      {!kind.whole && (
        <>
          <line
            x1={stemX}
            x2={stemX}
            y1={averageY}
            y2={stemTop}
            className="source-score-stem"
          />
          {Array.from({ length: kind.flags }, (_, index) => {
            const y = stemDown ? stemTop - index * 6 : stemTop + index * 6;
            const direction = stemDown ? -1 : 1;
            return (
              <path
                key={index}
                d={`M ${stemX} ${y} q ${10 * direction} ${5 * direction} ${8 * direction} ${15 * direction}`}
                className="source-score-flag"
              />
            );
          })}
        </>
      )}
    </g>
  );
}

function NativeSourceScore({
  example,
  currentStep,
  activeSegment,
  onAudition,
}: {
  example: SourceScoreExample;
  currentStep: number;
  activeSegment: string | null;
  onAudition: (event: SourceScoreEvent) => void;
}) {
  const grand = example.events.some((event) => event.staff === "bass");
  const width = Math.max(680, 150 + example.totalUnits * 17);
  const height = grand ? 205 : 135;
  const left = 112;
  const right = width - 34;
  const usable = right - left;
  const xAt = (unit: number) => left + (unit / example.totalUnits) * usable;
  const segment = example.segments?.find((entry) => entry.id === activeSegment);

  const barUnits = (() => {
    if (!example.meter) return 16;
    const match = example.meter.match(/^(\d+)\/(\d+)$/);
    if (!match) return 16;
    return (Number(match[1]) * 16) / Number(match[2]);
  })();

  const barlines: number[] = [];
  for (let unit = barUnits; unit < example.totalUnits; unit += barUnits) {
    barlines.push(unit);
  }

  return (
    <div className="source-score-scroll">
      <svg
        className="source-score-svg"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width }}
        role="img"
        aria-label={`${example.example}: ${example.title}`}
      >
        <StaffLines staff="treble" width={width} grand={grand} />
        {grand && <StaffLines staff="bass" width={width} grand={grand} />}

        {example.meter && (
          <>
            <text x="91" y="55" className="source-score-meter">
              {example.meter.split("/")[0]}
            </text>
            <text x="91" y="70" className="source-score-meter">
              {example.meter.split("/")[1]}
            </text>
          </>
        )}

        {barlines.map((unit) => {
          const x = xAt(unit);
          return (
            <line
              key={unit}
              x1={x}
              x2={x}
              y1="38"
              y2={grand ? 148 : 78}
              className="source-score-barline"
            />
          );
        })}

        {currentStep >= 0 && (
          <line
            x1={xAt(currentStep)}
            x2={xAt(currentStep)}
            y1="28"
            y2={grand ? 154 : 84}
            className="source-score-playhead"
          />
        )}

        {example.segments?.map((entry, index) => {
          const x1 = xAt(entry.start);
          const x2 = xAt(entry.end);
          const y = 20 - (index % 2) * 8;
          return (
            <g
              key={entry.id}
              className={[
                "source-score-segment",
                activeSegment === entry.id ? "is-active" : "",
              ].filter(Boolean).join(" ")}
            >
              <path d={`M ${x1} ${y + 5} Q ${(x1 + x2) / 2} ${y - 3} ${x2} ${y + 5}`} />
              <text x={(x1 + x2) / 2} y={y} textAnchor="middle">
                {entry.label}
              </text>
            </g>
          );
        })}

        {example.events.map((event) => {
          const active =
            Boolean(segment) &&
            event.start >= segment!.start &&
            event.start < segment!.end &&
            (!segment!.staff || (event.staff ?? "treble") === segment!.staff);
          return (
            <ScoreEventGlyph
              key={event.id}
              event={event}
              x={xAt(event.start)}
              grand={grand}
              active={active}
              current={currentStep === event.start}
              onAudition={() => onAudition(event)}
            />
          );
        })}
      </svg>
    </div>
  );
}

function SourceScoreCard({ example }: { example: SourceScoreExample }) {
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeSegment, setActiveSegment] = useState<string | null>(
    example.segments?.[0]?.id ?? null,
  );

  const playbackEvents = useMemo(
    () => example.events.map(toPlaybackEvent),
    [example],
  );

  useEffect(() => {
    return () => {
      if (playing) audioEngine.stop();
    };
  }, [playing]);

  async function togglePlayback() {
    if (playing) {
      audioEngine.stop();
      setPlaying(false);
      setCurrentStep(-1);
      return;
    }

    const started = await audioEngine.playScoreExample(
      playbackEvents,
      example.totalUnits,
      example.bpm,
      setCurrentStep,
    );
    setPlaying(Boolean(started));
  }

  async function audition(event: SourceScoreEvent) {
    const midis = event.pitches
      .map((pitch) => Note.midi(pitch))
      .filter((midi): midi is number => midi !== null);
    await audioEngine.playPianoNotes(midis, event.duration);
  }

  return (
    <section className="source-score-card">
      <header className="source-score-header">
        <div>
          <span>{example.example}</span>
          <strong>{example.title}</strong>
          {example.work && <small>{example.work}</small>}
        </div>
        <button type="button" onClick={() => void togglePlayback()}>
          {playing ? "Stop" : "Play example"}
        </button>
      </header>

      <div className="source-score-meta">
        {example.key && <span>{example.key}</span>}
        {example.meter && <span>{example.meter}</span>}
        {example.tempo && <span>{example.tempo}</span>}
        <span>{example.scope}</span>
        <span>book p. {example.printedPage}</span>
      </div>

      {example.scopeNote && (
        <p className="source-score-scope-note">{example.scopeNote}</p>
      )}

      <NativeSourceScore
        example={example}
        currentStep={currentStep}
        activeSegment={activeSegment}
        onAudition={(event) => void audition(event)}
      />

      {example.segments?.length ? (
        <div className="source-score-analysis">
          {example.segments.map((segment) => (
            <button
              type="button"
              key={segment.id}
              className={activeSegment === segment.id ? "is-active" : ""}
              onClick={() =>
                setActiveSegment((current) =>
                  current === segment.id ? null : segment.id,
                )
              }
            >
              <strong>{segment.label}</strong>
              <span>{segment.description}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function SourceScoreExamples({
  exampleIds,
}: {
  exampleIds: SchoenbergSourceExampleId[];
}) {
  return (
    <div className="source-score-examples">
      {exampleIds.map((id) => (
        <SourceScoreCard key={id} example={getSchoenbergSourceExample(id)} />
      ))}
    </div>
  );
}
