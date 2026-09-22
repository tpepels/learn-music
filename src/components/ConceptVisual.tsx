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

    case "groove-feel":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Velocity lane and swing timing diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <rect
                x={28 + i * 31}
                y={42 + (i % 2 === 0 ? 0 : 13)}
                width="18"
                height={i % 2 === 0 ? 48 : 35}
                rx="4"
                className={i % 2 === 0 ? "diagram-step is-lit" : "diagram-step is-alt"}
              />
              <line
                x1={37 + i * 31}
                y1="98"
                x2={37 + i * 31}
                y2={98 - (i % 2 === 0 ? 28 : 15)}
                className="diagram-envelope"
              />
            </g>
          ))}
          <path d="M 28 118 H 92 L 116 118 H 180 L 204 118 H 268" className="diagram-grid" />
          <path d="M 46 118 Q 61 128 77 118 M 139 118 Q 154 128 170 118 M 232 118 Q 247 128 263 118" className="diagram-automation-line" />
          <text x="28" y="132" className="diagram-caption">VELOCITY HEIGHT + SWUNG SUBDIVISIONS</text>
        </svg>
      );


    case "motif":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Motif development transformation diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {[
            ["MOTIF", 24, 58, 0],
            ["REPEAT", 94, 58, 0],
            ["TRANSPOSE", 164, 43, -12],
            ["FRAGMENT", 244, 58, 0],
          ].map(([label, x, y, shift], i) => (
            <g key={String(label)}>
              {[0,1,2,3].map((n) => (
                <rect
                  key={n}
                  x={Number(x) + n * 11}
                  y={Number(y) + [16,4,0,9][n] + Number(shift)}
                  width="9"
                  height="8"
                  rx="3"
                  className={i === 2 ? "diagram-step is-alt" : "diagram-note"}
                  opacity={i === 3 && n > 1 ? 0.18 : 1}
                />
              ))}
              <text x={Number(x)} y="112" className="diagram-small">{label}</text>
            </g>
          ))}
          <path d="M 70 70 H 90 M 140 70 H 160 M 223 70 H 240" className="diagram-arrow" />
          <text x="24" y="130" className="diagram-caption">SAME IDENTITY · DIFFERENT DEVELOPMENT</text>
        </svg>
      );

    case "melody-harmony":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Melody notes against changing chords">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {["C","G","Am","F"].map((chord, i) => (
            <g key={chord}>
              <rect x={28+i*68} y="87" width="58" height="24" rx="7" className="diagram-module" />
              <text x={57+i*68} y="103" textAnchor="middle" className="diagram-small">{chord}</text>
            </g>
          ))}
          {[
            [34,54,"tone"],[54,45,"scale"],[76,58,"tone"],
            [102,48,"tone"],[124,35,"scale"],[145,52,"tone"],
            [171,61,"tone"],[192,42,"alt"],[213,55,"tone"],
            [239,45,"tone"],[261,32,"scale"],[281,48,"tone"],
          ].map(([x,y,type],i)=>(
            <circle
              key={i}
              cx={Number(x)}
              cy={Number(y)}
              r="6"
              className={
                type === "tone"
                  ? "diagram-automation-point"
                  : type === "scale"
                    ? "diagram-knob"
                    : "diagram-step is-alt"
              }
            />
          ))}
          <path d="M 34 54 L 54 45 L 76 58 L 102 48 L 124 35 L 145 52 L 171 61 L 192 42 L 213 55 L 239 45 L 261 32 L 281 48" className="diagram-envelope" />
          <text x="28" y="127" className="diagram-caption">CHORD TONES · PASSING TONES · TENSION → RESOLUTION</text>
        </svg>
      );

    case "harmonic-function":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Tonic predominant dominant functional harmony diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {[
            ["TONIC","home",24,48],
            ["PRE-DOM","departure",101,48],
            ["DOMINANT","tension",194,48],
            ["TONIC","return",256,48],
          ].map(([name,sub,x,y],i)=>(
            <g key={String(name)+i}>
              <rect x={Number(x)} y={Number(y)} width={i===1?76:58} height="40" rx="10" className={i===2?"diagram-chord is-tension":"diagram-module"} />
              <text x={Number(x)+(i===1?38:29)} y={Number(y)+17} textAnchor="middle" className="diagram-small">{name}</text>
              <text x={Number(x)+(i===1?38:29)} y={Number(y)+31} textAnchor="middle" className="diagram-caption">{sub}</text>
            </g>
          ))}
          <path d="M 84 68 H 98 M 179 68 H 191 M 254 68 H 255" className="diagram-arrow" />
          <path d="M 130 99 C 165 123, 216 123, 245 99" className="diagram-envelope" />
          <text x="24" y="128" className="diagram-caption">FUNCTION = WHERE THE CHORD WANTS TO GO</text>
        </svg>
      );

    case "phrase-form":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Four-section AABA form map">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {["A","A","B","A"].map((label,i)=>(
            <g key={i}>
              <rect
                x={26+i*69}
                y="44"
                width="58"
                height="52"
                rx="10"
                className={label==="B" ? "diagram-chord is-tension" : "diagram-module"}
              />
              <text x={55+i*69} y="72" textAnchor="middle" className="diagram-label">{label}</text>
              <text x={55+i*69} y="87" textAnchor="middle" className="diagram-small">
                {i*4+1}–{i*4+4}
              </text>
            </g>
          ))}
          <text x="26" y="118" className="diagram-caption">4 BARS</text>
          <text x="95" y="118" className="diagram-caption">4 BARS</text>
          <text x="164" y="118" className="diagram-caption">BRIDGE</text>
          <text x="233" y="118" className="diagram-caption">RETURN</text>
        </svg>
      );

    case "texture":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Register and orchestration spacing diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <text x="24" y="39" className="diagram-small">HIGH</text>
          <text x="24" y="78" className="diagram-small">MID</text>
          <text x="24" y="116" className="diagram-small">LOW</text>
          <line x1="60" y1="34" x2="294" y2="34" className="diagram-grid" />
          <line x1="60" y1="73" x2="294" y2="73" className="diagram-grid" />
          <line x1="60" y1="112" x2="294" y2="112" className="diagram-grid" />
          <rect x="195" y="29" width="72" height="14" rx="5" className="diagram-note" />
          <rect x="198" y="47" width="72" height="10" rx="4" className="diagram-note" opacity="0.55" />
          <rect x="104" y="65" width="98" height="11" rx="4" className="diagram-chord" />
          <rect x="104" y="82" width="98" height="11" rx="4" className="diagram-chord" />
          <rect x="67" y="104" width="92" height="12" rx="4" className="diagram-step is-alt" />
          <text x="211" y="26" className="diagram-caption">MELODY + OCTAVE</text>
          <text x="109" y="62" className="diagram-caption">OPEN CHORDS</text>
          <text x="70" y="128" className="diagram-caption">BASS</text>
        </svg>
      );


    case "eq":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Parametric EQ frequency response diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {Array.from({ length: 6 }, (_, i) => (
            <line key={"v"+i} x1={38+i*47} y1="30" x2={38+i*47} y2="110" className="diagram-grid" />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={"h"+i} x1="38" y1={30+i*20} x2="285" y2={30+i*20} className="diagram-grid" />
          ))}
          <path d="M 38 94 Q 52 94 66 68 L 95 68" className="diagram-envelope" />
          <path d="M 95 68 C 130 68, 138 42, 163 42 C 188 42, 196 68, 231 68 L 285 68" className="diagram-automation-line" />
          <circle cx="163" cy="42" r="5" className="diagram-automation-point" />
          <text x="38" y="126" className="diagram-caption">HPF · FREQUENCY · GAIN · Q</text>
        </svg>
      );

    case "saturation":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Saturation waveform diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <path d="M 24 74 C 52 26, 82 26, 112 74 S 172 122, 202 74 S 262 26, 296 74" className="diagram-envelope" />
          <path d="M 24 74 C 44 43, 66 39, 92 42 C 111 45, 118 67, 134 74 C 154 84, 166 105, 189 106 C 220 107, 239 43, 296 74" className="diagram-transient" />
          <line x1="24" y1="74" x2="296" y2="74" className="diagram-grid" />
          <text x="24" y="124" className="diagram-caption">DRIVE → WAVESHAPING → WET / DRY</text>
        </svg>
      );

    case "sidechain":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Kick sidechain ducking bass diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <rect x="24" y="40" width="64" height="32" rx="9" className="diagram-module" />
          <text x="56" y="60" textAnchor="middle" className="diagram-label">KICK</text>
          <path d="M 90 56 H 126" className="diagram-arrow" />
          <rect x="129" y="37" width="76" height="38" rx="10" className="diagram-chord is-tension" />
          <text x="167" y="60" textAnchor="middle" className="diagram-small">KEY / DUCK</text>
          <path d="M 207 56 H 235" className="diagram-arrow" />
          <rect x="238" y="40" width="58" height="32" rx="9" className="diagram-module" />
          <text x="267" y="60" textAnchor="middle" className="diagram-label">BASS</text>
          <path d="M 26 102 L 52 102 L 60 78 L 73 102 L 106 102 L 114 78 L 127 102 L 160 102 L 168 78 L 181 102 L 214 102" className="diagram-transient" />
          <path d="M 26 112 C 50 112, 58 86, 82 104 S 120 86, 144 104 S 182 86, 206 104 S 246 91, 290 105" className="diagram-envelope" />
          <text x="24" y="128" className="diagram-caption">TRIGGER → GAIN REDUCTION → RELEASE</text>
        </svg>
      );

    case "stereo":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Stereo field and mono collapse diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <text x="26" y="43" className="diagram-label">L</text>
          <text x="286" y="43" className="diagram-label">R</text>
          <line x1="160" y1="28" x2="160" y2="111" className="diagram-section-line" />
          <ellipse cx="160" cy="92" rx="28" ry="12" className="diagram-step is-alt" />
          <ellipse cx="102" cy="68" rx="46" ry="13" className="diagram-note" />
          <ellipse cx="220" cy="48" rx="54" ry="13" className="diagram-chord" />
          <path d="M 80 119 H 240" className="diagram-grid" />
          <path d="M 112 119 H 208" className="diagram-arrow" />
          <text x="24" y="129" className="diagram-caption">PAN / WIDTH → MONO COMPATIBILITY</text>
        </svg>
      );

    case "reference":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Reference mix A B level matching diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <rect x="28" y="39" width="82" height="48" rx="11" className="diagram-module" />
          <text x="69" y="58" textAnchor="middle" className="diagram-label">A</text>
          <text x="69" y="75" textAnchor="middle" className="diagram-small">CURRENT MIX</text>
          <rect x="210" y="39" width="82" height="48" rx="11" className="diagram-chord" />
          <text x="251" y="58" textAnchor="middle" className="diagram-label">B</text>
          <text x="251" y="75" textAnchor="middle" className="diagram-small">REFERENCE</text>
          <path d="M 113 63 H 151 M 169 63 H 207" className="diagram-arrow" />
          <circle cx="160" cy="63" r="15" className="diagram-knob" />
          <text x="160" y="67" textAnchor="middle" className="diagram-small">TRIM</text>
          <path d="M 50 106 H 126 M 194 106 H 270" className="diagram-grid" />
          <rect x="50" y="98" width="64" height="8" rx="4" className="diagram-meter" />
          <rect x="194" y="98" width="64" height="8" rx="4" className="diagram-meter" />
          <text x="28" y="126" className="diagram-caption">LEVEL MATCH FIRST · THEN A/B REPEATEDLY</text>
        </svg>
      );


    case "relative-minor":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="C major and A minor relative-key diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <circle cx="101" cy="72" r="40" className="diagram-module" />
          <circle cx="219" cy="72" r="40" className="diagram-chord" />
          <text x="101" y="62" textAnchor="middle" className="diagram-label">C MAJOR</text>
          <text x="101" y="80" textAnchor="middle" className="diagram-small">C D E F G A B</text>
          <text x="219" y="62" textAnchor="middle" className="diagram-label">A MINOR</text>
          <text x="219" y="80" textAnchor="middle" className="diagram-small">A B C D E F G</text>
          <path d="M 139 72 H 181" className="diagram-arrow" />
          <text x="160" y="103" textAnchor="middle" className="diagram-caption">SAME NOTES · DIFFERENT TONIC</text>
          <text x="36" y="125" className="diagram-caption">C = HOME</text>
          <text x="229" y="125" className="diagram-caption">A = HOME</text>
        </svg>
      );

    case "harmonic-minor":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="A harmonic minor raised seventh diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {["A","B","C","D","E","F","G♯","A"].map((note,i)=>(
            <g key={note+i}>
              <rect
                x={24+i*35}
                y={i===6?48:72}
                width="27"
                height="24"
                rx="7"
                className={i===6 ? "diagram-step is-alt" : i===7 ? "diagram-note" : "diagram-module"}
              />
              <text x={37.5+i*35} y={i===6?64:88} textAnchor="middle" className="diagram-small">{note}</text>
            </g>
          ))}
          <path d="M 245 72 Q 260 42 276 72" className="diagram-envelope" />
          <text x="214" y="36" className="diagram-caption">RAISED 7TH</text>
          <text x="223" y="118" className="diagram-caption">G♯ → A = SEMITONE</text>
        </svg>
      );

    case "minor-cadence":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Minor-key dominant seventh cadence diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {[
            ["Am","i",26],
            ["Dm","iv",94],
            ["E7","V7",162],
            ["Am","i",230],
          ].map(([chord,roman,x],i)=>(
            <g key={String(chord)+i}>
              <rect
                x={Number(x)}
                y="48"
                width="56"
                height="42"
                rx="10"
                className={chord==="E7" ? "diagram-chord is-tension" : "diagram-module"}
              />
              <text x={Number(x)+28} y="66" textAnchor="middle" className="diagram-label">{chord}</text>
              <text x={Number(x)+28} y="82" textAnchor="middle" className="diagram-small">{roman}</text>
            </g>
          ))}
          <path d="M 83 69 H 92 M 151 69 H 160 M 219 69 H 228" className="diagram-arrow" />
          <path d="M 182 105 C 203 121, 231 121, 255 98" className="diagram-envelope" />
          <text x="159" y="125" className="diagram-caption">G♯ IN E7 PULLS TOWARD TONIC A</text>
        </svg>
      );

    case "seventh-chords":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="Seventh chord stacking and cadence diagram">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          {[
            ["Dm7",["D","F","A","C"],24],
            ["G7",["G","B","D","F"],118],
            ["Cmaj7",["C","E","G","B"],212],
          ].map(([name,notes,x],group)=>(
            <g key={String(name)}>
              {(notes as string[]).map((note,i)=>(
                <rect
                  key={note}
                  x={Number(x)+i*10}
                  y={83-i*13}
                  width="30"
                  height="10"
                  rx="4"
                  className={i===3 ? "diagram-step is-alt" : "diagram-note"}
                />
              ))}
              <text x={Number(x)} y="108" className="diagram-small">{name}</text>
              {group<2 && <path d={"M "+(Number(x)+53)+" 68 H "+(Number(x)+88)} className="diagram-arrow" />}
            </g>
          ))}
          <text x="24" y="128" className="diagram-caption">STACKED 3RDS · ii7 → V7 → Imaj7</text>
        </svg>
      );

    case "modal-mixture":
      return (
        <svg viewBox="0 0 320 150" role="img" aria-label="C major borrowing chords from C minor">
          <rect x="10" y="16" width="300" height="118" rx="18" className="diagram-shell" />
          <rect x="25" y="38" width="112" height="44" rx="11" className="diagram-module" />
          <text x="81" y="57" textAnchor="middle" className="diagram-label">C MAJOR</text>
          <text x="81" y="73" textAnchor="middle" className="diagram-small">I · IV · V · vi</text>
          <rect x="183" y="38" width="112" height="44" rx="11" className="diagram-chord" />
          <text x="239" y="57" textAnchor="middle" className="diagram-label">C MINOR</text>
          <text x="239" y="73" textAnchor="middle" className="diagram-small">iv · ♭VII</text>
          <path d="M 180 60 H 143" className="diagram-arrow" />
          <rect x="94" y="96" width="58" height="24" rx="7" className="diagram-chord is-tension" />
          <text x="123" y="112" textAnchor="middle" className="diagram-small">Fm · iv</text>
          <rect x="168" y="96" width="58" height="24" rx="7" className="diagram-step is-alt" />
          <text x="197" y="112" textAnchor="middle" className="diagram-small">B♭ · ♭VII</text>
          <text x="25" y="128" className="diagram-caption">BORROW COLOUR · KEEP C AS TONIC</text>
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
