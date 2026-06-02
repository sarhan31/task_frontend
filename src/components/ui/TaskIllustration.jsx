import { motion } from 'framer-motion';

/**
 * Inline SVG illustration: a person standing next to a giant task checklist,
 * with floating check-badges — inspired by the Tasky reference images.
 * Fully self-contained, no external assets needed.
 */
const TaskIllustration = () => {
  return (
    <div className="relative w-full max-w-xs mx-auto select-none">
      {/* Floating badge – top right */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-2 z-20"
      >
        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </motion.div>

      {/* Floating badge – top left */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute top-6 -left-4 z-20"
      >
        <div className="w-10 h-10 bg-yellow-400 rounded-xl shadow-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </motion.div>

      {/* Main SVG scene */}
      <motion.svg
        viewBox="0 0 320 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full drop-shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── CHECKLIST BOARD ── */}
        {/* Board shadow */}
        <rect x="88" y="38" width="148" height="210" rx="18" fill="rgba(0,0,0,0.15)" />
        {/* Board body */}
        <rect x="84" y="34" width="148" height="210" rx="18" fill="white" />
        {/* Board header */}
        <rect x="84" y="34" width="148" height="44" rx="18" fill="#e0e7ff" />
        <rect x="84" y="56" width="148" height="22" fill="#e0e7ff" />
        {/* Clipboard clip */}
        <rect x="140" y="24" width="36" height="20" rx="6" fill="#c7d2fe" />
        <rect x="148" y="20" width="20" height="12" rx="4" fill="#a5b4fc" />
        {/* Title text lines */}
        <rect x="104" y="46" width="60" height="7" rx="3.5" fill="#6366f1" opacity="0.7" />
        <rect x="104" y="57" width="40" height="5" rx="2.5" fill="#6366f1" opacity="0.4" />

        {/* Row 1 – checked */}
        <rect x="100" y="90" width="116" height="28" rx="8" fill="#f0fdf4" />
        <rect x="108" y="98" width="12" height="12" rx="3" fill="#22c55e" />
        <path d="M111 104l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="128" y="101" width="56" height="5" rx="2.5" fill="#86efac" />
        <rect x="128" y="109" width="36" height="4" rx="2" fill="#bbf7d0" />

        {/* Row 2 – checked */}
        <rect x="100" y="126" width="116" height="28" rx="8" fill="#f0fdf4" />
        <rect x="108" y="134" width="12" height="12" rx="3" fill="#22c55e" />
        <path d="M111 140l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="128" y="137" width="48" height="5" rx="2.5" fill="#86efac" />
        <rect x="128" y="145" width="30" height="4" rx="2" fill="#bbf7d0" />

        {/* Row 3 – in progress */}
        <rect x="100" y="162" width="116" height="28" rx="8" fill="#eff6ff" />
        <rect x="108" y="170" width="12" height="12" rx="3" fill="#6366f1" opacity="0.3" />
        <rect x="128" y="173" width="52" height="5" rx="2.5" fill="#a5b4fc" />
        <rect x="128" y="181" width="34" height="4" rx="2" fill="#c7d2fe" />

        {/* Row 4 – todo */}
        <rect x="100" y="198" width="116" height="28" rx="8" fill="#fafafa" />
        <rect x="108" y="206" width="12" height="12" rx="3" fill="#e5e7eb" />
        <rect x="128" y="209" width="44" height="5" rx="2.5" fill="#d1d5db" />
        <rect x="128" y="217" width="28" height="4" rx="2" fill="#e5e7eb" />

        {/* ── PERSON ── */}
        {/* Shadow */}
        <ellipse cx="200" cy="358" rx="28" ry="8" fill="rgba(0,0,0,0.12)" />

        {/* Legs */}
        <rect x="183" y="310" width="14" height="46" rx="7" fill="#fbbf24" />
        <rect x="201" y="310" width="14" height="46" rx="7" fill="#f59e0b" />
        {/* Shoes */}
        <rect x="179" y="348" width="22" height="12" rx="6" fill="#1e293b" />
        <rect x="197" y="348" width="22" height="12" rx="6" fill="#1e293b" />

        {/* Body */}
        <rect x="176" y="230" width="46" height="86" rx="20" fill="#6366f1" />
        {/* Shirt detail */}
        <rect x="190" y="248" width="18" height="3" rx="1.5" fill="white" opacity="0.4" />
        <rect x="190" y="255" width="14" height="3" rx="1.5" fill="white" opacity="0.3" />

        {/* Left arm – pointing at board */}
        <motion.g
          animate={{ rotate: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '176px 248px' }}
        >
          <rect x="138" y="238" width="42" height="14" rx="7" fill="#6366f1" />
          {/* Hand */}
          <circle cx="134" cy="245" r="9" fill="#fde68a" />
          <circle cx="128" cy="241" r="4" fill="#fde68a" />
          <circle cx="126" cy="248" r="3.5" fill="#fde68a" />
        </motion.g>

        {/* Right arm – relaxed */}
        <rect x="222" y="238" width="36" height="14" rx="7" fill="#4f46e5" />
        <circle cx="262" cy="245" r="9" fill="#fde68a" />

        {/* Neck */}
        <rect x="191" y="218" width="16" height="18" rx="8" fill="#fde68a" />

        {/* Head */}
        <circle cx="199" cy="200" r="30" fill="#fde68a" />
        {/* Hair */}
        <path d="M170 196 Q172 168 199 166 Q226 168 228 196 Q220 178 199 178 Q178 178 170 196Z" fill="#92400e" />
        {/* Eyes */}
        <circle cx="190" cy="198" r="4" fill="#1e293b" />
        <circle cx="208" cy="198" r="4" fill="#1e293b" />
        <circle cx="191.5" cy="196.5" r="1.5" fill="white" />
        <circle cx="209.5" cy="196.5" r="1.5" fill="white" />
        {/* Smile */}
        <path d="M190 210 Q199 218 208 210" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Eyebrows */}
        <path d="M186 191 Q190 188 194 191" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M204 191 Q208 188 212 191" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* ── GROUND LINE ── */}
        <rect x="60" y="358" width="200" height="4" rx="2" fill="white" opacity="0.25" />
      </motion.svg>

      {/* Floating task-done pill */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute bottom-8 -left-6 z-20"
      >
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-xl">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-bold text-gray-700">Task done!</span>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskIllustration;
