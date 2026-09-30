import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Collection } from '@/components/Collection';
import { About } from '@/components/About';
import { Process } from '@/components/Process';
import { OrderInfo } from '@/components/OrderInfo';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { MobileTabBar } from '@/components/MobileTabBar';
import { useDesign } from '@/lib/design';
import { useReveal } from '@/hooks/use-reveal';
import { consumePendingSection } from '@/lib/scroll';
import type { Product } from '@/data/products';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useReveal();
  const design = useDesign();
  useEffect(consumePendingSection, []);

  return (
    <div className="min-h-screen text-foreground selection:bg-gold/30 selection:text-gold-bright">
      <a
        href="#kollekcio"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('kollekcio')?.scrollIntoView();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-background"
      >
        Ugrás a kollekcióhoz
      </a>
      <Navigation />
      <main>
        <Hero />
        <Collection onSelectProduct={(product) => setSelectedProduct(product)} />
        <About />
        <Process />
        <OrderInfo />
        <Contact selectedProduct={selectedProduct} onClearProduct={() => setSelectedProduct(null)} />
      </main>
      <Footer />
      {design === 'b' && <MobileTabBar />}
    </div>
  );
}
