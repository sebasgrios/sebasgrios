import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import { seo } from '@/config/seo';
import { settings } from '@/config/settings';
import { LOCALES, type Locale, site } from '@/config/site';

export function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}

// Read at build from the project root (cwd is stable during `astro build`).
const font = (file: string) => readFileSync(join(process.cwd(), 'src/assets/og', file));
const regular = font('Geist-Regular.otf');
const medium = font('Geist-Medium.otf');
const semibold = font('Geist-SemiBold.otf');

// Circular avatar from the hero photo, embedded as a PNG data URI so the SVG
// renderer can rasterise it reliably (computed once, shared by both locales).
const heroPhoto = readFileSync(join(process.cwd(), 'src/assets/sebas-hero.webp'));
let avatarUri: Promise<string> | null = null;
const getAvatarUri = () => {
  if (!avatarUri) {
    const size = 440;
    const circle = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
    );
    avatarUri = sharp(heroPhoto)
      .resize(size, size, { fit: 'cover', position: 'top' })
      .composite([{ input: circle, blend: 'dest-in' }])
      .png()
      .toBuffer()
      .then((buf) => `data:image/png;base64,${buf.toString('base64')}`);
  }
  return avatarUri;
};

const WIDTH = 1200;
const HEIGHT = 630;

export const GET: APIRoute = async ({ params }) => {
  const locale = params.locale as Locale;
  const meta = seo[locale];
  const role = meta.ogTitle.split('—')[1]?.trim() ?? 'AI-Driven Engineer';
  const stack = settings.heroStack.join('   ·   ');
  const avatar = await getAvatarUri();

  // Two invisible columns (40 / 60): circular avatar on the left, the most
  // relevant info on the right — mirroring the portfolio hero.
  const markup = html(`
    <div style="display:flex;width:100%;height:100%;background:#111114;color:#fafafa;font-family:Geist;padding:70px">
      <div style="display:flex;width:40%;align-items:center;justify-content:center">
        <div style="display:flex;width:404px;height:404px;border-radius:404px;background:#1c1c22;align-items:center;justify-content:center">
          <img src="${avatar}" width="380" height="380" style="width:380px;height:380px" />
        </div>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:center;width:60%;padding-left:48px">
        <div style="display:flex;font-size:22px;letter-spacing:6px;color:#8a8a92;font-weight:500">SEBASGRIOS</div>
        <div style="display:flex;font-size:58px;font-weight:600;letter-spacing:-2px;line-height:1.05;margin-top:20px">${site.author}</div>
        <div style="display:flex;font-size:30px;font-weight:500;color:#c8c8ce;margin-top:16px">${role}</div>
        <div style="display:flex;font-size:21px;color:#8a8a92;margin-top:14px">${stack}</div>
        <div style="display:flex;font-size:24px;color:#c8c8ce;border-left:3px solid #fafafa;padding-left:22px;margin-top:30px">${meta.ogDescription}</div>
      </div>
    </div>
  `);

  // satori-html returns a VNode that is structurally compatible with satori's
  // expected ReactNode at runtime, but the two declared types differ.
  const element = markup as unknown as Parameters<typeof satori>[0];

  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Geist', data: regular, weight: 400, style: 'normal' },
      { name: 'Geist', data: medium, weight: 500, style: 'normal' },
      { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
