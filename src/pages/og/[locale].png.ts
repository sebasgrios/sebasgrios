import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { isLocale, type Locale } from '@/config/i18n';
import { fetchProfile } from '@/lib/data/repos';
import { pickLocale } from '@/lib/domain/i18n';
import { computeYearsOfExperience } from '@/lib/domain/stats';
import type { Profile } from '@/lib/domain/types';

const nodeRequire = createRequire(import.meta.url);

// Design tokens flattened to sRGB for Satori (which cannot parse oklch()).
// Source: sistema-de-diseño-sebasgrios — light theme.
const C = {
  bg: '#fafafd',
  text: '#15151b',
  textSoft: '#57575f',
  textFaintAlpha: 'rgba(104,104,112,0.6)',
  accent: '#3364db',
  blob1: 'rgba(51,100,219,0.30)',
  blob1End: 'rgba(51,100,219,0)',
  blob2: 'rgba(207,129,227,0.22)',
  blob2End: 'rgba(207,129,227,0)',
} as const;

const OG = { width: 1200, height: 630 } as const;

const FONT_FILES = [
  { name: 'Satoshi', file: 'Satoshi-Black.ttf', weight: 900 as const },
  { name: 'General Sans', file: 'GeneralSans-Medium.ttf', weight: 500 as const },
  { name: 'General Sans', file: 'GeneralSans-Semibold.ttf', weight: 600 as const },
];

interface OgFont {
  name: string;
  weight: 500 | 600 | 900;
  style: 'normal';
  data: Buffer;
}

let wasmInitialized = false;
let fontCache: OgFont[] | null = null;

async function ensureWasm() {
  if (wasmInitialized) return;
  try {
    const wasm = await readFile(nodeRequire.resolve('@resvg/resvg-wasm/index_bg.wasm'));
    await initWasm(wasm);
  } catch (error) {
    // The WASM runtime is global; a module reload (HMR) re-runs this with the
    // runtime already initialized. Any other failure is a real problem.
    if (!(error instanceof Error) || !error.message.includes('Already initialized')) {
      throw error;
    }
  }
  wasmInitialized = true;
}

async function loadFonts(): Promise<OgFont[]> {
  if (fontCache) return fontCache;
  const base = join(process.cwd(), 'src/assets/og');
  fontCache = await Promise.all(
    FONT_FILES.map(async ({ name, file, weight }) => ({
      name,
      weight,
      style: 'normal' as const,
      data: await readFile(join(base, file)),
    }))
  );
  return fontCache;
}

// Name + first surname only (e.g. "Sebastián González Ríos" → "Sebastián González").
function displayName(fullName: string): string {
  return fullName.trim().split(/\s+/).slice(0, 2).join(' ');
}

function initials(fullName: string): string {
  return displayName(fullName)
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function experienceText(years: number, locale: Locale): string {
  return locale === 'es' ? `+${years} años de experiencia` : `+${years} years of experience`;
}

// The role line is a single non-wrapping row; a long localized role would
// otherwise overflow the right column and clip. Shrink the font from the
// design's 25px only as far as needed to fit the available width.
function roleFontSize(role: string, experience: string): number {
  const IDEAL = 25;
  const MIN = 16;
  const CONTENT_WIDTH = 608; // 60% column minus its 88px/24px padding
  const FIXED = 59; // diamond + separator dot + the three 14px gaps
  const AVG_ADVANCE = 0.54; // approx General Sans medium glyph width per em
  const chars = role.length + experience.length;
  const fit = (CONTENT_WIDTH - FIXED) / (chars * AVG_ADVANCE);
  return Math.max(MIN, Math.min(IDEAL, fit));
}

// Satori (and resvg) only decode PNG/JPEG, while Storage serves WebP. Normalize
// to a PNG data URI so the static build never depends on the live Storage host
// at render time and the format is always one both engines can size and raster.
async function loadAvatar(profile: Profile): Promise<string | null> {
  const url = profile.avatarUrl ?? profile.photoUrl;
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const source = Buffer.from(await res.arrayBuffer());
    const png = await sharp(source).resize(380, 380, { fit: 'cover' }).png().toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch {
    return null;
  }
}

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
  if (!isLocale(params.locale)) {
    return new Response('not found', { status: 404 });
  }
  const locale = params.locale;
  const profile = await fetchProfile();
  const name = displayName(profile.fullName);
  const role = pickLocale(profile.role, locale);
  const years = computeYearsOfExperience(profile);
  const experience = experienceText(years, locale);
  const roleSize = roleFontSize(role, experience);
  const avatar = await loadAvatar(profile);

  const fonts = await loadFonts();
  await ensureWasm();

  const avatarInner = avatar
    ? {
        type: 'img',
        props: {
          src: avatar,
          style: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' },
        },
      }
    : {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${C.accent} 0%, ${C.blob2.replace('0.22', '1')} 100%)`,
            color: '#ffffff',
            fontFamily: 'Satoshi',
            fontWeight: 900,
            fontSize: '128px',
          },
          children: initials(profile.fullName),
        },
      };

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          position: 'relative',
          width: `${OG.width}px`,
          height: `${OG.height}px`,
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
          background: C.bg,
        },
        children: [
          // Atmosphere — two accent blobs.
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-220px',
                left: '-160px',
                width: '560px',
                height: '560px',
                background: `radial-gradient(circle, ${C.blob1} 0%, ${C.blob1End} 70%)`,
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-260px',
                right: '-120px',
                width: '520px',
                height: '520px',
                background: `radial-gradient(circle, ${C.blob2} 0%, ${C.blob2End} 70%)`,
              },
            },
          },
          // Left column (40%) — avatar inside a glass ring.
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                width: '40%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    width: '380px',
                    height: '380px',
                    borderRadius: '50%',
                    display: 'flex',
                    padding: '11px',
                    boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.36)',
                    border: '1px solid rgba(255,255,255,0.85)',
                    boxShadow:
                      '0 18px 50px -18px rgba(45,45,56,0.28), 0 2px 8px -2px rgba(45,45,56,0.12)',
                  },
                  children: avatarInner,
                },
              },
            },
          },
          // Right column (60%) — name + role line.
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '0 88px 0 24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontFamily: 'Satoshi',
                      fontWeight: 900,
                      fontSize: '92px',
                      lineHeight: 0.98,
                      letterSpacing: '-1.84px',
                      color: C.text,
                    },
                    children: name,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      fontFamily: 'General Sans',
                      fontWeight: 500,
                      fontSize: `${roleSize}px`,
                      letterSpacing: '-0.01em',
                      color: C.textSoft,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '11px',
                            height: '11px',
                            borderRadius: '3px',
                            background: C.accent,
                            transform: 'rotate(45deg)',
                          },
                        },
                      },
                      { type: 'div', props: { style: { display: 'flex' }, children: role } },
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: C.textFaintAlpha,
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontWeight: 600,
                            color: C.accent,
                          },
                          children: experience,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: OG.width, height: OG.height, fonts }
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG.width } }).render().asPng();

  return new Response(png as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};

export function getStaticPaths() {
  return [{ params: { locale: 'es' } }, { params: { locale: 'en' } }];
}
