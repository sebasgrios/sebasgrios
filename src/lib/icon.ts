import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

// Read at build from the project root (cwd is stable during `astro build`).
const source = readFileSync(join(process.cwd(), 'src/assets/sebas.png'));

interface IconOptions {
  /** Rounded transparent card (browser favicon) vs. full-bleed opaque (iOS). */
  rounded?: boolean;
  /** No background card and no padding — the avatar fills the whole canvas. */
  transparent?: boolean;
}

/**
 * Render the avatar as a square app icon. The source PNG is transparent
 * line-art, so by default it is composited onto a white card to stay legible on
 * light *and* dark browser chrome (bare black strokes would vanish on dark tabs).
 *
 * iOS masks `apple-touch-icon` itself and paints transparency black, so those
 * icons are rendered full-bleed and opaque (`rounded: false`).
 *
 * `transparent: true` drops the card and the padding entirely: the avatar fills
 * 100% of the canvas on a transparent background (used for the browser favicon).
 */
export async function renderIcon(
  size: number,
  { rounded = true, transparent = false }: IconOptions = {},
): Promise<Buffer> {
  if (transparent) {
    return sharp(source)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  const pad = Math.round(size * 0.08);
  const inner = size - pad * 2;
  const radius = rounded ? Math.round(size * 0.22) : 0;

  const art = await sharp(source)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#ffffff"/></svg>`;

  return sharp(Buffer.from(card))
    .composite([{ input: art, left: pad, top: pad }])
    .png()
    .toBuffer();
}
