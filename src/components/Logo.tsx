export function Logo({ size = 32, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="bg-brand inline-flex shrink-0 items-center justify-center rounded-xl"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="none">
          <path
            d="M4 19 12 4l8 15"
            stroke="white"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8.5 19h7" stroke="white" strokeWidth="2.1" strokeLinecap="round" />
          <circle cx="12" cy="12.6" r="1.9" fill="white" />
        </svg>
      </span>
      {withText && (
        <span className="text-[1.05rem] leading-none font-extrabold tracking-tight">
          Aluvia<span className="text-primary"> AI</span>
        </span>
      )}
    </span>
  );
}
