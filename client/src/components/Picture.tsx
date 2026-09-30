import type { ImgHTMLAttributes } from 'react';

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  picture: Picture;
  alt: string;
  /** Milyen szélességben jelenik meg a kép — ez alapján választ a böngésző a változatok közül */
  sizes: string;
}

/** Reszponzív WebP kép a vite-imagetools által generált változatokból. */
export function Img({ picture, alt, sizes, loading = 'lazy', decoding = 'async', ...rest }: PictureProps) {
  const srcSet = picture.sources.webp;
  return (
    <img
      src={picture.img.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={picture.img.w}
      height={picture.img.h}
      alt={alt}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
}
