/**
 * Global, non-content settings: feature flags + hero metrics + primary stack.
 * Editable here without touching components (config ≠ content, per mejoras.md).
 */
export const settings = {
  // Hero availability tag — hide it from a single switch.
  showAvailability: true,

  // Hero metrics. `years` is computed from site.careerStart at runtime.
  metrics: {
    sectors: 4,
    deployed: 2,
  },

  // Primary stack shown under the hero role so recruiters spot it in <2s.
  heroStack: ['React', 'TypeScript'],
} as const;
