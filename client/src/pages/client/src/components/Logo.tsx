import klaraLogo from '@assets/klara-logo.jpg';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 48, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="rounded-full overflow-hidden border border-gold/40 flex items-center justify-center bg-black"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src={klaraLogo}
          alt="KLÁRA tűzzománc logó"
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif text-gold-bright tracking-[0.25em] text-lg leading-none font-bold">
            KLÁRA
          </span>
          <span className="font-serif text-gold/70 tracking-[0.2em] text-[10px] uppercase mt-1">
            Tűzzománc
          </span>
        </div>
      )}
    </div>
  );
}
