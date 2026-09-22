import type { ConceptVisualKind } from "../learning/productionContext";

export function ConceptVisual({ kind }: { kind: ConceptVisualKind }) {
  switch (kind) {
    case "drum-machine":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Step sequencer diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <circle cx="43" cy="47" r="12" className="diagram-knob" />
          <circle cx="80" cy="47" r="12" className="diagram-knob" />
          <rect x="111" y="36" width="70" height="22" rx="7" className="diagram-display" />
          {Array.from({ length: 16 }, (_, i) => (
            <rect
              key={i}
              x={22 + i * 17.2}
              y="82"
              width="12"
              height="25"
              rx="3"
              className={i % 4 === 0 || i === 6 ? "diagram-step is-lit" : "diagram-step"}
            />
          ))}
          <text x="22" y="124" className="diagram-caption">STEP SEQUENCER · 1 BAR / 16 STEPS</text>
        </svg>
      );

    case "variation":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Pattern A and B variation diagram">
          <rect x="12" y="19" width="296" height="112" rx="18" className="diagram-shell" />
          <text x="28" y="49" className="diagram-label">A</text>
          <text x="28" y="96" className="diagram-label">B</text>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={"a"+i} x={58+i*28} y="35" width="20" height="20" rx="5" className={i%2===0 ? "diagram-step is-lit" : "diagram-step"} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={"b"+i} x={58+i*28} y="82" width="20" height="20" rx="5" className={i%2===0 || i===5 || i===7 ? "diagram-step is-alt" : "diagram-step"} />
          ))}
          <path d="M 156 61 L 156 75" className="diagram-arrow" />
          <text x="216" y="123" className="diagram-caption">DUPLICATE → CHANGE A FEW THINGS</text>
        </svg>
      );

    case "keyboard":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Piano keyboard scale diagram">
          <rect x="12" y="18" width="296" height="114" rx="18" className="diagram-shell" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={28+i*32} y="41" width="31" height="72" rx="2" className="diagram-white-key is-scale" />
          ))}
          {[0,1,3,4,5].map((i) => (
            <rect key={i} x={49+i*32+(i>1?32:0)} y="41" width="18" height="43" rx="2" className="diagram-black-key" />
          ))}
          <text x="28" y="126" className="diagram-caption">C MAJOR · SCALE HIGHLIGHTING</text>
        </svg>
      );

    case "piano-roll":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Piano roll diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {Array.from({ length: 7 }, (_, r) => (
            <line key={"h"+r} x1="58" y1={33+r*14} x2="296" y2={33+r*14} className="diagram-grid" />
          ))}
          {Array.from({ length: 9 }, (_, c) => (
            <line key={"v"+c} x1={58+c*29.75} y1="33" x2={58+c*29.75} y2="117" className="diagram-grid" />
          ))}
          {[["C",1,4],["E",2,3],["G",3,2],["E",5,3],["D",6,4],["C",7,5]].map(([n,x,y],i)=>(
            <rect key={i} x={62+Number(x)*28} y={38+Number(y)*13} width="36" height="9" rx="4" className="diagram-note">
              <title>{n}</title>
            </rect>
          ))}
          <rect x="25" y="35" width="22" height="80" rx="4" className="diagram-keyboard-mini" />
          <text x="184" y="128" className="diagram-caption">PITCH ↑ · TIME →</text>
        </svg>
      );

    case "harmony":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Chord stack and progression diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <g transform="translate(25 31)">
            <rect x="0" y="54" width="68" height="15" rx="5" className="diagram-note" />
            <rect x="0" y="32" width="68" height="15" rx="5" className="diagram-note" />
            <rect x="0" y="10" width="68" height="15" rx="5" className="diagram-note" />
            <text x="79" y="21" className="diagram-small">G · 5th</text>
            <text x="79" y="43" className="diagram-small">E · 3rd</text>
            <text x="79" y="65" className="diagram-small">C · root</text>
          </g>
          <g transform="translate(178 45)">
            {["I","IV","V","I"].map((n,i)=>(
              <g key={n+i}>
                <rect x={i*31} y="0" width="26" height="42" rx="7" className={i===2 ? "diagram-chord is-tension" : "diagram-chord"} />
                <text x={13+i*31} y="26" textAnchor="middle" className="diagram-label">{n}</text>
              </g>
            ))}
          </g>
          <text x="177" y="106" className="diagram-caption">CHORD TRACK / HARMONIC MOTION</text>
        </svg>
      );

    case "synth":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Synthesizer signal flow diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {[
            ["OSC",27],
            ["FILTER",107],
            ["AMP",202],
          ].map(([label,x],i)=>(
            <g key={String(label)}>
              <rect x={Number(x)} y="43" width={i===1?72:58} height="45" rx="10" className="diagram-module" />
              <text x={Number(x)+(i===1?36:29)} y="70" textAnchor="middle" className="diagram-label">{label}</text>
            </g>
          ))}
          <path d="M 87 65 H 103" className="diagram-arrow" />
          <path d="M 181 65 H 198" className="diagram-arrow" />
          <path d="M 262 65 H 285" className="diagram-arrow" />
          <path d="M 132 96 C 132 111, 225 111, 225 96" className="diagram-envelope" />
          <text x="27" y="112" className="diagram-caption">WAVE</text>
          <text x="110" y="112" className="diagram-caption">BRIGHTNESS</text>
          <text x="205" y="112" className="diagram-caption">ENVELOPE</text>
        </svg>
      );

    case "automation":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Automation curve and compressor diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <g transform="translate(22 29)">
            {Array.from({ length: 6 }, (_, i) => (
              <line key={"v"+i} x1={i*32} y1="0" x2={i*32} y2="70" className="diagram-grid" />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line key={"h"+i} x1="0" y1={i*17.5} x2="160" y2={i*17.5} className="diagram-grid" />
            ))}
            <polyline
              points="0,58 31,55 63,48 95,34 127,23 160,13"
              className="diagram-automation-line"
            />
            {[["0","58"],["31","55"],["63","48"],["95","34"],["127","23"],["160","13"]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="4" className="diagram-automation-point" />
            ))}
            <text x="0" y="87" className="diagram-caption">AUTOMATION LANE</text>
          </g>
          <g transform="translate(205 34)">
            <rect x="0" y="0" width="82" height="67" rx="11" className="diagram-module" />
            <text x="41" y="17" textAnchor="middle" className="diagram-label">COMP</text>
            <path d="M 14 49 L 29 24 L 42 43 L 55 20 L 69 46" className="diagram-transient" />
            <path d="M 14 54 L 29 35 L 42 47 L 55 31 L 69 49" className="diagram-envelope" />
          </g>
          <text x="204" y="119" className="diagram-caption">TRANSIENT / DYNAMICS</text>
        </svg>
      );

    case "effects":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Effects send and return routing diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <g transform="translate(22 34)">
            <rect x="0" y="0" width="62" height="34" rx="9" className="diagram-module" />
            <text x="31" y="21" textAnchor="middle" className="diagram-label">TRACK</text>
            <path d="M 64 17 H 96" className="diagram-arrow" />
            <rect x="99" y="0" width="70" height="34" rx="9" className="diagram-module" />
            <text x="134" y="21" textAnchor="middle" className="diagram-label">MIXER</text>
            <path d="M 171 17 H 207" className="diagram-arrow" />
            <rect x="210" y="0" width="70" height="34" rx="9" className="diagram-module" />
            <text x="245" y="21" textAnchor="middle" className="diagram-label">MASTER</text>
            <path d="M 133 38 C 133 64, 73 64, 73 86" className="diagram-envelope" />
            <path d="M 150 38 C 150 64, 226 64, 226 86" className="diagram-envelope" />
            <rect x="30" y="88" width="86" height="28" rx="8" className="diagram-chord is-tension" />
            <rect x="184" y="88" width="86" height="28" rx="8" className="diagram-chord" />
            <text x="73" y="106" textAnchor="middle" className="diagram-small">REVERB RETURN</text>
            <text x="227" y="106" textAnchor="middle" className="diagram-small">DELAY RETURN</text>
          </g>
          <text x="22" y="132" className="diagram-caption">SEND / RETURN ROUTING + INSERT EFFECTS</text>
        </svg>
      );

    case "final":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Final production workflow diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {[
            ["WRITE", 24, 35],
            ["ARRANGE", 86, 35],
            ["MIX", 166, 35],
            ["MOVE", 222, 35],
            ["FX", 62, 87],
            ["CHECK", 122, 87],
            ["SAVE", 202, 87],
          ].map(([label,x,y],i)=>(
            <g key={String(label)}>
              <rect x={Number(x)} y={Number(y)} width={i===1||i===5?66:50} height="28" rx="8" className={label==="SAVE" ? "diagram-chord is-tension" : "diagram-module"} />
              <text x={Number(x)+(i===1||i===5?33:25)} y={Number(y)+18} textAnchor="middle" className="diagram-small">{label}</text>
            </g>
          ))}
          <path d="M 74 49 H 84 M 152 49 H 164 M 216 49 H 220" className="diagram-arrow" />
          <path d="M 247 65 C 247 77, 227 77, 227 85" className="diagram-arrow" />
          <path d="M 201 101 H 190 M 122 101 H 116" className="diagram-arrow" />
          <text x="22" y="130" className="diagram-caption">ITERATE → REVIEW → SAVE A VERSION</text>
        </svg>
      );

    case "voice-leading":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Chord inversion and voice-leading diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {[0,1,2,3].map((column) => {
            const x = 32 + column * 70;
            const ys = [
              [88,66,44],
              [86,62,43],
              [82,60,41],
              [84,61,42],
            ][column];
            return (
              <g key={column}>
                {ys.map((y, voice) => (
                  <rect
                    key={voice}
                    x={x}
                    y={y}
                    width="42"
                    height="10"
                    rx="4"
                    className={voice === 0 ? "diagram-note is-bass" : "diagram-note"}
                  />
                ))}
                <text x={x} y="116" className="diagram-small">
                  {["I","V⁶","vi⁶","IV⁶⁴"][column]}
                </text>
              </g>
            );
          })}
          <path d="M 53 49 C 92 48, 101 48, 123 48 S 178 46, 193 46 S 244 47, 263 47" className="diagram-envelope" />
          <path d="M 53 71 C 89 70, 108 67, 123 67 S 176 64, 193 64 S 246 65, 263 65" className="diagram-envelope" />
          <path d="M 53 93 C 86 91, 105 91, 123 91 S 176 87, 193 87 S 245 89, 263 89" className="diagram-envelope" />
          <text x="32" y="130" className="diagram-caption">COMMON TONES + SMALLER VOICE MOVES</text>
        </svg>
      );

    case "bassline":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Bass piano roll and approach-note diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {Array.from({ length: 6 }, (_, row) => (
            <line key={"h"+row} x1="48" y1={34+row*15} x2="298" y2={34+row*15} className="diagram-grid" />
          ))}
          {Array.from({ length: 17 }, (_, col) => (
            <line key={"v"+col} x1={48+col*15.6} y1="34" x2={48+col*15.6} y2="109" className="diagram-grid" />
          ))}
          {[
            [0,4],[4,3],[7,2],[8,1],[12,3],[15,4],
          ].map(([step,row],i)=>(
            <rect
              key={i}
              x={52+step*15.6}
              y={38+row*15}
              width="12"
              height="9"
              rx="3"
              className={step===7||step===15 ? "diagram-step is-alt" : "diagram-step is-lit"}
            />
          ))}
          <text x="18" y="54" className="diagram-small">G</text>
          <text x="18" y="84" className="diagram-small">D</text>
          <text x="18" y="99" className="diagram-small">C</text>
          <text x="49" y="124" className="diagram-caption">ROOTS · CHORD TONES · APPROACH NOTES</text>
        </svg>
      );

    case "mixer":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="DAW mixer channel diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {[0,1,2,3].map((i) => (
            <g key={i} transform={"translate(" + (24 + i * 64) + " 28)"}>
              <rect x="0" y="0" width="50" height="92" rx="9" className="diagram-module" />
              <circle cx="25" cy="17" r="7" className="diagram-knob" />
              <line x1="25" y1="36" x2="25" y2="76" className="diagram-grid" />
              <rect x="19" y={48 + (i % 2) * 9} width="12" height="20" rx="4" className="diagram-fader" />
              <rect x="38" y="33" width="4" height="43" rx="2" className="diagram-meter-bg" />
              <rect x="38" y={49 - i * 3} width="4" height={27 + i * 3} rx="2" className="diagram-meter" />
              <text x="25" y="87" textAnchor="middle" className="diagram-small">
                {["DRM","BAS","CHR","MEL"][i]}
              </text>
            </g>
          ))}
          <path d="M 44 123 C 90 139, 226 139, 276 123" className="diagram-envelope" />
          <text x="112" y="142" className="diagram-caption">CHANNELS → SENDS / RETURNS → MASTER</text>
        </svg>
      );

    case "arrangement":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="DAW arrangement timeline diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {["DRUMS","BASS","CHORDS","LEAD"].map((name,r)=>(
            <g key={name}>
              <text x="24" y={42+r*23} className="diagram-small">{name}</text>
              {Array.from({length:8},(_,i)=> (
                <rect
                  key={i}
                  x={82+i*26}
                  y={30+r*23}
                  width="22"
                  height="15"
                  rx="4"
                  className={(i+r)%3!==0 ? "diagram-clip is-active" : "diagram-clip"}
                />
              ))}
            </g>
          ))}
          <line x1="185" y1="26" x2="185" y2="119" className="diagram-section-line" />
          <text x="82" y="128" className="diagram-caption">A SECTION</text>
          <text x="198" y="128" className="diagram-caption">B SECTION</text>
        </svg>
      );
  }
}
