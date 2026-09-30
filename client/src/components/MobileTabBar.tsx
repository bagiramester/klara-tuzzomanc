import { useEffect, useState } from 'react';
import { Gem, Mail, ShoppingBag, User } from 'lucide-react';
import { scrollToSection } from '@/lib/scroll';

const tabs = [
  { id: 'kollekcio', label: 'Ékszerek', icon: Gem },
  { id: 'rolam', label: 'Rólam', icon: User },
  { id: 'vasarlas', label: 'Vásárlás', icon: ShoppingBag },
  { id: 'kapcsolat', label: 'Kapcsolat', icon: Mail },
];

/** Alsó, hüvelykujjal elérhető menüsáv mobilon (B változat). */
export function MobileTabBar() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ['hero', ...tabs.map((t) => t.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      className="mobile-tabbar fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gold/25 bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Gyorsmenü"
    >
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => scrollToSection(t.id)}
            aria-current={on ? 'true' : undefined}
            className={`flex flex-col items-center gap-1 py-2.5 text-[0.72rem] font-medium transition-colors ${
              on ? 'text-gold-bright' : 'text-foreground/65'
            }`}
          >
            <t.icon size={22} strokeWidth={on ? 2 : 1.6} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
