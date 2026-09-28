export default function ProjectIllustration({ type = 'coral', className = '' }) {
  if (type === 'tour') {
    // 3D low-poly circular observation deck / tour platform matching reference
    return (
      <svg
        viewBox="0 0 400 240"
        className={`w-full h-full select-none ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="tourGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a0e17" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tourRailing" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="tourPlatform" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        <ellipse cx="200" cy="140" rx="160" ry="65" fill="url(#tourGlow)" />

        {/* Back Railing Posts & Panes */}
        <g opacity="0.4">
          <path d="M70 120 L70 85 L100 82 L100 116 Z" fill="#2d3748" stroke="#4a5568" strokeWidth="1" />
          <path d="M100 116 L100 82 L150 78 L150 112 Z" fill="#1f2937" stroke="#374151" strokeWidth="1" />
          <path d="M150 112 L150 78 L200 76 L200 110 Z" fill="#242e3d" stroke="#374151" strokeWidth="1" />
          <path d="M200 110 L200 76 L250 78 L250 112 Z" fill="#1f2937" stroke="#374151" strokeWidth="1" />
          <path d="M250 112 L250 78 L300 82 L300 116 Z" fill="#2d3748" stroke="#4a5568" strokeWidth="1" />
          <path d="M300 116 L300 85 L330 120 L330 88 Z" fill="#1a202c" stroke="#374151" strokeWidth="1" />
          {/* Back top curved rail */}
          <path d="M70 85 Q200 68 330 85" stroke="#64748b" strokeWidth="2.5" fill="none" />
        </g>

        {/* Main Base Pillars */}
        <path d="M120 155 L120 205 L135 205 L135 158 Z" fill="#1a202c" stroke="#2d3748" strokeWidth="1" />
        <path d="M190 162 L190 220 L210 220 L210 162 Z" fill="#242e3d" stroke="#374151" strokeWidth="1" />
        <path d="M265 158 L265 205 L280 205 L280 155 Z" fill="#1a202c" stroke="#2d3748" strokeWidth="1" />

        {/* Main Observation Platform Deck (Faceted Low-Poly Rim) */}
        {/* Base Cylinder Side */}
        <path d="M60 135 C60 170 340 170 340 135 L340 155 C340 190 60 190 60 155 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />

        {/* Outer Rim Facets */}
        <path d="M60 135 L95 152 L95 170 L60 155 Z" fill="#283548" stroke="#3b4b61" strokeWidth="0.8" />
        <path d="M95 152 L145 162 L145 180 L95 170 Z" fill="#303f56" stroke="#41536d" strokeWidth="0.8" />
        <path d="M145 162 L200 165 L200 183 L145 180 Z" fill="#374863" stroke="#485c7b" strokeWidth="0.8" />
        <path d="M200 165 L255 162 L255 180 L200 183 Z" fill="#314058" stroke="#41536d" strokeWidth="0.8" />
        <path d="M255 162 L305 152 L305 170 L255 180 Z" fill="#29364a" stroke="#3b4b61" strokeWidth="0.8" />
        <path d="M305 152 L340 135 L340 155 L305 170 Z" fill="#212c3d" stroke="#324257" strokeWidth="0.8" />

        {/* Floor Surface (Low-Poly Segments) */}
        <polygon points="200,122 145,124 165,142 200,144" fill="#1b2433" stroke="#283548" strokeWidth="0.5" />
        <polygon points="200,122 200,144 235,142 255,124" fill="#232f42" stroke="#2d3c52" strokeWidth="0.5" />
        <polygon points="145,124 95,130 115,148 165,142" fill="#17202d" stroke="#253244" strokeWidth="0.5" />
        <polygon points="255,124 235,142 285,148 305,130" fill="#1d2737" stroke="#29374c" strokeWidth="0.5" />
        <polygon points="165,142 115,148 145,162 200,165" fill="#283549" stroke="#384964" strokeWidth="0.5" />
        <polygon points="200,144 200,165 255,162 235,142" fill="#2c3a50" stroke="#3b4d6a" strokeWidth="0.5" />
        <polygon points="115,148 95,152 60,135 95,130" fill="#1a2331" stroke="#263448" strokeWidth="0.5" />
        <polygon points="285,148 305,152 340,135 305,130" fill="#192230" stroke="#243245" strokeWidth="0.5" />

        {/* Center Screen / Console */}
        <g>
          <path d="M185 110 L215 110 L210 128 L190 128 Z" fill="#141c28" stroke="#2d3a4e" strokeWidth="1" />
          <path d="M175 75 L225 75 L220 106 L180 106 Z" fill="#232e40" stroke="#475569" strokeWidth="1.2" />
          {/* Glowing Console Screen */}
          <polygon points="179,79 221,79 217,102 183,102" fill="#2b394e" stroke="#60a5fa" strokeWidth="0.5" opacity="0.8" />
          <line x1="184" y1="88" x2="216" y2="88" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5" />
          <line x1="186" y1="94" x2="206" y2="94" stroke="#93c5fd" strokeWidth="0.8" opacity="0.3" />
        </g>

        {/* Front Railing Posts and Horizontal Rails */}
        {/* Front Rail Posts */}
        <path d="M60 135 L60 98" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M95 152 L95 112" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M145 162 L145 120" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M200 165 L200 122" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        <path d="M255 162 L255 120" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M305 152 L305 112" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M340 135 L340 98" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

        {/* Front Top Curved Rail */}
        <path
          d="M60 98 L95 112 L145 120 L200 122 L255 120 L305 112 L340 98"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Mid Rail */}
        <path
          d="M60 116 L95 132 L145 141 L200 143 L255 141 L305 132 L340 116"
          stroke="#475569"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.8"
        />
      </svg>
    );
  }

  // Default: Coral reef survey 3D low-poly faceted structure
  return (
    <svg
      viewBox="0 0 400 240"
      className={`w-full h-full select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="coralGlow" cx="50%" cy="65%" r="50%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0a0e17" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="175" rx="170" ry="45" fill="url(#coralGlow)" />

      {/* ─── Rock Base (Faceted Low-Poly Mound) ─── */}
      <g stroke="#1a2333" strokeWidth="0.6" strokeLinejoin="round">
        {/* Deep base facets */}
        <polygon points="65,190 110,172 135,198 80,205" fill="#141c28" />
        <polygon points="110,172 165,165 185,192 135,198" fill="#192332" />
        <polygon points="165,165 220,162 235,192 185,192" fill="#202c3e" />
        <polygon points="220,162 275,168 290,195 235,192" fill="#1c2738" />
        <polygon points="275,168 335,188 320,205 290,195" fill="#161f2c" />

        {/* Lower tier */}
        <polygon points="90,160 140,145 165,165 110,172" fill="#1e2a3c" />
        <polygon points="140,145 200,140 220,162 165,165" fill="#28374d" />
        <polygon points="200,140 260,146 275,168 220,162" fill="#233145" />
        <polygon points="260,146 310,162 335,188 275,168" fill="#1a2434" />

        {/* Middle rock platform */}
        <polygon points="120,142 165,130 190,144 140,145" fill="#243247" />
        <polygon points="165,130 215,126 235,142 190,144" fill="#30415a" />
        <polygon points="215,126 270,132 260,146 235,142" fill="#29374d" />

        {/* Highlighted Facet Edges */}
        <polygon points="135,198 185,192 200,210 145,212" fill="#111822" />
        <polygon points="185,192 235,192 245,210 200,210" fill="#151e2a" />
        <polygon points="235,192 290,195 280,212 245,210" fill="#121a24" />
      </g>

      {/* ─── 3D Low-Poly Coral Reef Branches & Polyps ─── */}
      {/* Left Tube / Polyps */}
      <g stroke="#2d3b50" strokeWidth="0.8">
        <path d="M125 140 L115 105 L130 102 L142 135 Z" fill="#2b3b52" />
        <ellipse cx="122" cy="103" rx="7.5" ry="3.5" fill="#1e2a3c" stroke="#415574" />

        <path d="M105 145 L95 118 L108 115 L118 142 Z" fill="#243347" />
        <ellipse cx="101" cy="116" rx="6.5" ry="3" fill="#172230" stroke="#374863" />

        <path d="M142 138 L140 110 L155 108 L158 135 Z" fill="#344661" />
        <ellipse cx="147" cy="109" rx="7.5" ry="3.5" fill="#223043" stroke="#485d7f" />
      </g>

      {/* Center Brain Coral Sphere (Low-Poly Grooves) */}
      <g>
        <ellipse cx="240" cy="138" rx="22" ry="18" fill="#29394f" stroke="#3d516e" strokeWidth="1" />
        <path d="M225 132 C230 128 238 134 246 130 C252 126 256 132 258 138" stroke="#4d6487" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M222 138 C228 136 235 144 245 142 C252 140 256 146 254 150" stroke="#4d6487" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M228 145 C233 148 240 148 246 152" stroke="#415573" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </g>

      {/* Main Large Antler / Branching Coral Structure (Center-Right) */}
      <g stroke="#415471" strokeWidth="1" strokeLinejoin="round">
        {/* Main Trunk */}
        <path d="M210 128 L218 82 L232 82 L228 128 Z" fill="#394d6a" />

        {/* Left Sub-branch */}
        <path d="M218 96 L195 72 L185 75 L182 60 L192 62 L202 76 L220 90 Z" fill="#43597b" />
        <path d="M192 62 L196 46 L204 48 L200 66 Z" fill="#4d658c" />
        <path d="M182 60 L170 50 L176 46 L186 56 Z" fill="#3f5475" />

        {/* Center Main Branch Split */}
        <path d="M222 82 L220 54 L210 40 L216 36 L228 50 L228 82 Z" fill="#4b6388" />
        <path d="M228 50 L238 32 L246 36 L236 54 Z" fill="#546e97" />
        <path d="M220 54 L225 30 L233 32 L228 50 Z" fill="#5f7da9" />

        {/* Right Sub-branch */}
        <path d="M228 88 L250 70 L262 72 L254 98 Z" fill="#3b4f6d" />
        <path d="M250 70 L258 52 L266 55 L258 72 Z" fill="#486084" />
        <path d="M262 72 L278 62 L284 66 L270 78 Z" fill="#3e5272" />
        <path d="M278 62 L282 48 L289 50 L284 64 Z" fill="#4a6185" />
      </g>

      {/* Fan / Sea-Whip Clusters (Far Left and Far Right) */}
      <g opacity="0.8">
        <path d="M82 180 L88 150 L94 152 L86 182 Z" fill="#2d3b50" />
        <path d="M74 185 L72 162 L78 160 L80 185 Z" fill="#222f42" />
        <path d="M315 178 L324 152 L330 155 L320 182 Z" fill="#2b3a4f" />
        <path d="M328 182 L338 165 L344 168 L334 185 Z" fill="#212c3d" />
      </g>
    </svg>
  );
}
