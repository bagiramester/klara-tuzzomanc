import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Collection } from '@/components/Collection';
import { About } from '@/components/About';
import { Process } from '@/components/Process';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import type { Product } from '@/data/products';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleInterest = (product: Product) => {
    setSelectedProduct(product);
    // Scroll to contact form
    setTimeout(() => {
      document.getElementById('kapcsolat')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <Hero />
        <Collection onInterest={handleInterest} />
        <About />
        <Process />
        <Contact selectedProduct={selectedProduct} onClearProduct={() => setSelectedProduct(null)} />
      </main>
      <Footer />
    </div>
  );
}
