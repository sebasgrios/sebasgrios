export const TWEAKS = {
  glassIntensity: 0.1,
  accentHue: 264,
  accentChroma: 0.19,
  parallax: true,
  entryAnimations: true,
} as const;

export function computeGlassTokens(intensity: number) {
  return {
    blur: `${(2 + intensity * 26).toFixed(1)}px`,
    saturate: (1.1 + intensity * 0.9).toFixed(2),
    alpha: (0.32 + intensity * 0.42).toFixed(2),
    highlight: (0.25 + intensity * 0.6).toFixed(2),
    spec: (0.15 + intensity * 0.55).toFixed(2),
  };
}
