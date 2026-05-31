import { isLocale } from '@/config/i18n';
import { fetchProfile } from '@/lib/data/repos';
import { pickLocale } from '@/lib/domain/i18n';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm';
import type { APIRoute } from 'astro';
import satori from 'satori';

let wasmInitialized = false;

async function ensureWasm() {
  if (wasmInitialized) return;
  await initWasm(resvgWasm as unknown as WebAssembly.Module);
  wasmInitialized = true;
}

async function loadFont(): Promise<ArrayBuffer> {
  const res = await fetch(
    'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIw2boKoduKmMEVuLyfMZg.ttf'
  );
  if (!res.ok) throw new Error(`failed to load OG font: ${res.status}`);
  return await res.arrayBuffer();
}

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
  if (!isLocale(params.locale)) {
    return new Response('not found', { status: 404 });
  }
  const locale = params.locale;
  const profile = await fetchProfile();
  const role = pickLocale(profile.role, locale);
  const subline = locale === 'es' ? 'Portfolio' : 'Portfolio';

  const fontData = await loadFont();
  await ensureWasm();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background: 'linear-gradient(135deg, #0b1233 0%, #1a2566 45%, #4a48a8 100%)',
          color: '#ffffff',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: '24px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 500,
              },
              children: subline,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '88px',
                      fontWeight: 900,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.05,
                    },
                    children: profile.fullName,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '36px',
                      color: 'rgba(255,255,255,0.82)',
                      fontWeight: 500,
                    },
                    children: role,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: '22px',
                color: 'rgba(255,255,255,0.6)',
              },
              children: 'sebasgrios.es',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, weight: 500, style: 'normal' }],
    }
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

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
