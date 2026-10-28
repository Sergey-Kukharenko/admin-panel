import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Tests live next to the code in __tests__: not a segment and not a public API
    ignores: ['**/__tests__/**'],
  },
  {
    rules: {
      // False positives on widgets used by one page; "merge the slice into its only consumer"
      // contradicts our feature / widget criterion
      'fsd/insignificant-slice': 'off',
      // The assets segment and app/providers are fixed in the manifest
      'fsd/segments-by-purpose': 'off',
    },
  },
  {
    // Icon sources (src/shared/assets/icons/ui) are read by the sprite build script
    files: ['./src/shared/assets/**'],
    rules: {
      'fsd/no-reserved-folder-names': 'off',
      'fsd/public-api': 'off',
    },
  },
]);
