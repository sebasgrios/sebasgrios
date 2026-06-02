import {
  siAstro,
  siBitbucket,
  siCloudflare,
  siCss,
  siGit,
  siGithubcopilot,
  siHtml5,
  siJavascript,
  siJenkins,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPhp,
  siReact,
  siRedux,
  siTailwindcss,
  siTypescript,
  siWordpress,
} from 'simple-icons/icons';

interface IconDef {
  inner: string;
  viewBox?: string;
  kind?: 'fill' | 'stroke';
}

const brand = (def: { path: string }): IconDef => ({
  inner: `<path d="${def.path}"/>`,
});

const stroke = (inner: string): IconDef => ({
  inner,
  kind: 'stroke',
});

export const TECH_ICONS: Record<string, IconDef> = {
  typescript: brand(siTypescript),
  javascript: brand(siJavascript),
  react: brand(siReact),
  react16: brand(siReact),
  reactnative: brand(siReact),
  nextjs: brand(siNextdotjs),
  astro: brand(siAstro),
  redux: brand(siRedux),
  tailwindcss: brand(siTailwindcss),
  html: brand(siHtml5),
  css: brand(siCss),
  nodejs: brand(siNodedotjs),
  githubcopilot: brand(siGithubcopilot),
  jenkins: brand(siJenkins),
  bitbucket: brand(siBitbucket),
  git: brand(siGit),
  cloudflare: brand(siCloudflare),
  mysql: brand(siMysql),
  wordpress: brand(siWordpress),
  java: brand(siOpenjdk),
  php: brand(siPhp),

  rest: stroke(
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18"/><path d="M12 3a13 13 0 0 0 0 18"/>'
  ),
  pwa: stroke(
    '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 19h4"/><path d="M12 6v6"/><path d="m9 9 3 3 3-3"/>'
  ),
  microfrontends: stroke(
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
  ),
  specdriven: stroke(
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m9 14 2 2 4-4"/>'
  ),
  genai: stroke(
    '<path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="m5.6 5.6 2.1 2.1"/><path d="m16.3 16.3 2.1 2.1"/><path d="m5.6 18.4 2.1-2.1"/><path d="m16.3 7.7 2.1-2.1"/><circle cx="12" cy="12" r="3"/>'
  ),
  adobeanalytics: stroke(
    '<path d="M3 21h18"/><rect x="5" y="13" width="3" height="6"/><rect x="10.5" y="9" width="3" height="10"/><rect x="16" y="5" width="3" height="14"/>'
  ),
  adobetarget: stroke(
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'
  ),
  sql: stroke(
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'
  ),
  oop: stroke(
    '<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="8.5" y="16" width="7" height="5" rx="1"/><path d="M6.5 8v3a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V8"/><path d="M12 13v3"/>'
  ),
  databases: stroke(
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'
  ),
  networks: stroke(
    '<circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="m7 7 3 3"/><path d="m17 7-3 3"/><path d="m7 17 3-3"/><path d="m17 17-3-3"/>'
  ),
  systems: stroke(
    '<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 7h.01"/><path d="M7 17h.01"/><path d="M11 7h6"/><path d="M11 17h6"/>'
  ),
  hardware: stroke(
    '<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v4"/><path d="M15 2v4"/><path d="M9 18v4"/><path d="M15 18v4"/><path d="M2 9h4"/><path d="M2 15h4"/><path d="M18 9h4"/><path d="M18 15h4"/><rect x="9" y="9" width="6" height="6" rx="0.5"/>'
  ),
};

export function getTechIcon(slug: string): IconDef | null {
  return TECH_ICONS[slug] ?? null;
}
