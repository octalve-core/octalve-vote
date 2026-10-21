/** Original vector artwork for the Octalve Vote access screen. */
export function VoteIllustration() {
  return <div aria-hidden="true" className="relative flex h-full min-h-[650px] flex-col overflow-hidden rounded-[26px] bg-gradient-to-br from-[#6323d1] via-[#7229e2] to-[#4b1db1] p-9 text-white">
    <div className="absolute -left-36 -top-48 size-[480px] rounded-full border border-white/10" />
    <div className="absolute -bottom-44 -right-36 size-[540px] rounded-full border border-white/10" />
    <div className="relative z-10 flex items-center justify-between gap-4">
      <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">TRUSTED BY DESIGN</div>
      <div className="flex gap-1.5"><span className="size-2 rounded-full bg-white"/><span className="size-2 rounded-full bg-white/40"/><span className="size-2 rounded-full bg-white/40"/></div>
    </div>
    <div className="relative z-10 flex flex-1 items-center justify-center px-0 py-10">
      <svg viewBox="0 0 560 540" className="w-full max-w-[580px] drop-shadow-2xl" role="presentation" fill="none">
        <defs>
          <linearGradient id="boxFace" x1="150" x2="422" y1="282" y2="486" gradientUnits="userSpaceOnUse"><stop stopColor="#FFF"/><stop offset="1" stopColor="#EEE8FF"/></linearGradient>
          <linearGradient id="ballot" x1="180" x2="325" y1="70" y2="260" gradientUnits="userSpaceOnUse"><stop stopColor="#FFF"/><stop offset="1" stopColor="#E8DCFF"/></linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="22" stdDeviation="15" floodColor="#28006B" floodOpacity=".25"/></filter>
        </defs>
        <circle cx="288" cy="274" r="220" stroke="white" strokeOpacity=".09" strokeWidth="2"/>
        <circle cx="288" cy="274" r="164" stroke="white" strokeOpacity=".14" strokeWidth="2" strokeDasharray="8 12"/>
        <circle cx="91" cy="168" r="14" fill="#63E2CC"/>
        <circle cx="482" cy="355" r="9" fill="#FFC56E"/>
        <circle cx="456" cy="139" r="18" stroke="#B6A1FF" strokeWidth="5"/>
        <path d="m118 370 14 14m0-14-14 14M439 244l12 12m0-12-12 12" stroke="white" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round"/>
        <path d="m138 132 4-20 14 13m-14-13-17 11" stroke="#63E2CC" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <g filter="url(#softShadow)">
          <path d="m135 325 42-78h213l42 78-15 133H151l-16-133Z" fill="url(#boxFace)" />
          <path d="m177 247-42 78h297l-42-78H177Z" fill="#F4EEFF"/>
          <path d="m135 325h297l-15 133H151l-16-133Z" stroke="#3B197E" strokeWidth="5" strokeLinejoin="round"/>
          <path d="m177 247-42 78h297l-42-78H177Z" stroke="#3B197E" strokeWidth="5" strokeLinejoin="round"/>
          <path d="M246 290h79" stroke="#4C2A91" strokeWidth="9" strokeLinecap="round"/>
          <rect x="227" y="347" width="113" height="74" rx="14" fill="#6424D8"/>
          <path d="m260 382 21 21 34-40" stroke="#FFF" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <g transform="rotate(-12 277 163)" filter="url(#softShadow)">
          <rect x="207" y="63" width="143" height="203" rx="16" fill="url(#ballot)" stroke="#3B197E" strokeWidth="5"/>
          <rect x="230" y="91" width="97" height="9" rx="4.5" fill="#CEC0ED"/>
          <rect x="230" y="114" width="75" height="8" rx="4" fill="#CEC0ED"/>
          <rect x="234" y="150" width="28" height="28" rx="6" stroke="#6424D8" strokeWidth="5"/>
          <path d="m240 163 8 7 18-21" stroke="#6424D8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="276" y="159" width="49" height="7" rx="3.5" fill="#CEC0ED"/>
          <rect x="234" y="198" width="28" height="28" rx="6" stroke="#9F8CC8" strokeWidth="4"/>
          <rect x="276" y="208" width="49" height="7" rx="3.5" fill="#CEC0ED"/>
        </g>
        <g transform="rotate(11 418 183)">
          <circle cx="420" cy="177" r="58" fill="#6BE6C6" stroke="#3B197E" strokeWidth="5"/>
          <path d="m389 177 21 21 39-48" stroke="#351673" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <path d="m110 246 16-8m-5 20 18 0M460 294l15 0m-11 14 16 7" stroke="#FFE078" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    </div>
    <div className="relative z-10 text-center">
      <p className="text-2xl font-extrabold tracking-tight sm:text-[30px]">Every voice matters.</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/75">A more thoughtful way to organize, participate and build confidence in every election.</p>
      <div className="mt-6 flex justify-center gap-2"><span className="h-1.5 w-9 rounded-full bg-white"/><span className="h-1.5 w-2 rounded-full bg-white/40"/><span className="h-1.5 w-2 rounded-full bg-white/40"/></div>
    </div>
  </div>;
}
