let pendingSection: string | null = null;

/** A főoldal egy szekciójához görget; más oldalról (pl. Impresszum) előbb a főoldalra navigál. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  pendingSection = id;
  window.location.hash = '#/';
}

/** A főoldal betöltésekor hívódik: ha másik oldalról érkeztünk egy szekció-linkkel, odagörget. */
export function consumePendingSection() {
  const id = pendingSection;
  pendingSection = null;
  if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
  else window.scrollTo(0, 0);
}
