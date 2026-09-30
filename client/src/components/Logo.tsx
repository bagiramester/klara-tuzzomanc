import klaraMark from '@assets/brand/klara-mark.jpg?logo';
import { Img } from './Picture';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 44, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40 bg-background shadow-[0_0_24px_-6px_hsl(28_90%_55%/0.6)]"
        style={{ width: size, height: size }}
      >
        <Img
          picture={klaraMark}
          sizes={`${size}px`}
          alt=""
          loading="eager"
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className="font-serif text-gold-bright tracking-[0.22em] text-lg font-semibold">
            KLÁRA
          </span>{' '}
          <span className="text-gold/70 tracking-[0.32em] text-[0.6rem] uppercase mt-1.5 font-medium">
            Tűzzománc
          </span>
        </div>
      )}
    </div>
  );
}
