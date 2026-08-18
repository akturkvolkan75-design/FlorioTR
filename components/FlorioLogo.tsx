type FlorioLogoProps = {
  primary: string;
  accent: string;
  compact?: boolean;
  light?: boolean;
};

export default function FlorioLogo({ primary, accent, compact = false, light = false }: FlorioLogoProps) {
  return <span className="inline-flex items-center gap-2" aria-label="FlorioTR">
    <svg viewBox="0 0 54 64" className={`${compact ? "h-9 w-8" : "h-11 w-10"} shrink-0`} role="img" aria-hidden="true">
      <path d="M18 58V22c0-8 5-14 13-17-2 8-7 14-13 17" fill={primary}/>
      <path d="M19 27c8-6 17-7 27-4-6 7-15 10-27 8Z" fill={primary}/>
      <path d="M19 39c7-5 14-6 22-3-5 6-12 8-22 7Z" fill={primary}/>
      <path d="M18 24C11 20 7 14 7 7c8 1 13 6 15 13Z" fill={accent}/>
      <path d="M12 58h19c-4-4-8-6-12-6-3 0-5 2-7 6Z" fill={primary}/>
    </svg>
    <span className={`${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} font-black tracking-[-0.035em]`} style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>
      <span style={{color:light?"inherit":primary}}>Florio</span><span style={{color:accent}}>TR</span>
    </span>
  </span>;
}
