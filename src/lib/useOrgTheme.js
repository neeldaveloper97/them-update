import { useEffect } from 'react';
import Color from 'color';

export function useOrgTheme(hex) {
  useEffect(() => {
    if (!hex) return;

    try {
      const base = Color(hex);
      const input = Color(hex).hex().toLowerCase();

      let cssVars;
      if (input === '#0f828c') {
        cssVars = {
          '--color-org-primary': base.hex(),
          '--color-org-primary-transparent': base.alpha(0.3).string(),
          '--color-org-primary-light': base.lighten(0.4).hex(),
          '--color-org-primary-light-50': base.lighten(1).hex(),
          '--color-org-primary-light-100': base.lighten(0.8).hex(),
          '--color-org-primary-dark': '#27445D',
          '--color-org-primary-light-alt': base.mix(Color('white'), 0.9).hex(),
          '--color-muted-text': '#6b7a7a',
        };
      } else {
        cssVars = {
          '--color-org-primary': base.hex(),
          '--color-org-primary-transparent': base.alpha(0.3).string(),
          '--color-org-primary-light': base.lighten(0.4).hex(),
          '--color-org-primary-light-50': base.lighten(1).hex(),
          '--color-org-primary-light-100': base.lighten(0.2).hex(),
          '--color-org-primary-dark': base.darken(0.4).hex(),
          '--color-org-primary-light-alt': base.mix(Color('white'), 0.9).hex(),
          '--color-muted-text': '#6b7a7a',
        };
      }

      const root = document.documentElement;

      Object.entries(cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    } catch (e) {
      console.error('Invalid color hex:', hex);
    }
  }, [hex]);
}
