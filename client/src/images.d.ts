// vite-imagetools előbeállítások típusai (lásd vite.config.ts)
interface Picture {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

declare module '*?product' {
  const picture: Picture;
  export default picture;
}
declare module '*?portrait' {
  const picture: Picture;
  export default picture;
}
declare module '*?logo' {
  const picture: Picture;
  export default picture;
}
