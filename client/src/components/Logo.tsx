import klaraLogo from '@assets/brand/klara-logo-kor.jpg?logo';
import { Img } from './Picture';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 48, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="rounded-full overflow-hidden border border-gold/40 flex items-center justify-center bg-black shrink-0 transition-all duration-500"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Img picture={klaraLogo} sizes={`${size}px`} alt="" loading="eager" className="w-full h-full object-cover" />
      </div>
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif text-gold-bright tracking-[0.25em] text-lg leading-none font-medium">KLÁRA</span>{' '}
          <span className="font-serif text-gold/70 tracking-[0.2em] text-[10px] uppercase mt-1">Tűzzománc</span>
        </div>
      )}
    </div>
  );
}
