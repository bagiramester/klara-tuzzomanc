import kbkLogo from '@assets/kbk-logo.jpg';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

// KBK Jewellery — körkörös monogram logó
export function Logo({ size = 64, showText: _showText = true, className = '' }: LogoProps) {
  void _showText;
  return (
    <div className={`flex items-center justify-start ${className}`} data-testid="logo">
      <img
        src={kbkLogo}
        alt="KBK Jewellery"
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
}
