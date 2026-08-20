type FlorioLogoProps = {
  primary: string;
  accent: string;
  compact?: boolean;
  light?: boolean;
};

export default function FlorioLogo({
  primary,
  accent,
  compact = false,
  light = false,
}: FlorioLogoProps) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
      "
      aria-label="FlorioTR"
    >
      {/* ZARİF FLORAL İKON */}

      <svg
        viewBox="0 0 42 54"
        className={`
          ${
            compact
              ? "h-8 w-7"
              : "h-10 w-9"
          }
          shrink-0
          overflow-visible
        `}
        role="img"
        aria-hidden="true"
      >
        {/* İNCE GÖVDE */}

        <path
          d="M20 48C19 39 20 31 22 23C24 16 27 11 31 7"
          fill="none"
          stroke={light ? "currentColor" : primary}
          strokeWidth="2.1"
          strokeLinecap="round"
        />

        {/* ÜST YAPRAK */}

        <path
          d="M25 15C28 8 33 5 38 5C37 11 33 15 25 15Z"
          fill={accent}
        />

        {/* SOL YAPRAK */}

        <path
          d="M20 25C14 20 9 20 5 22C8 28 13 30 20 28Z"
          fill={light ? "currentColor" : primary}
          opacity="0.95"
        />

        {/* SAĞ YAPRAK */}

        <path
          d="M21 32C27 27 32 27 36 29C33 35 28 37 21 35Z"
          fill={accent}
          opacity="0.95"
        />

        {/* ALT YAPRAK */}

        <path
          d="M20 39C14 35 9 36 6 39C9 44 14 45 20 43Z"
          fill={light ? "currentColor" : primary}
          opacity="0.9"
        />

        {/* KÜÇÜK TOMURCUK */}

        <circle
          cx="31"
          cy="7"
          r="2.2"
          fill={accent}
        />
      </svg>


      {/* MARKA YAZISI */}

      <span
        className={`
          ${
            compact
              ? "text-[22px] sm:text-[25px]"
              : "text-[26px] sm:text-[30px]"
          }
          flex
          items-start
          leading-none
          tracking-[-0.025em]
        `}
        style={{
          fontFamily:
            "Georgia, 'Times New Roman', serif",
        }}
      >
        <span
          className="font-medium"
          style={{
            color: light
              ? "inherit"
              : primary,
          }}
        >
          Florio
        </span>

        <span
          className="
            ml-1
            mt-[2px]
            text-[0.58em]
            font-semibold
            tracking-[0.08em]
          "
          style={{
            color: accent,
          }}
        >
          TR
        </span>
      </span>
    </span>
  );
}