export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="section-title">Ez az oldal nem található</h1>
      <p className="text-muted-foreground max-w-md">
        Lehet, hogy elgépelted a címet, vagy az oldal már nem létezik.
      </p>
      <a href="#/" className="btn-gold">Vissza a főoldalra</a>
    </main>
  );
}
