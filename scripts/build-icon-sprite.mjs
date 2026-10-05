/* eslint-disable no-console -- CLI-скрипт, вывод в консоль — это его интерфейс */
// Собирает SVG-спрайт из иконок дизайн-системы (Figma → Icons, node 52:4927).
//
// Исходники — «сырые» экспорты из Figma в src/shared/assets/icons/ui/<name>.svg,
// имя файла = id символа в спрайте. Скрипт нормализует их (цвет → currentColor,
// убирает id/служебные атрибуты) и пишет:
//   - src/shared/ui/app-icon/assets/sprite.svg — сам спрайт из <symbol>
//   - src/shared/ui/app-icon/iconNames.ts      — список имён для типизации AppIcon
//
// Запуск: npm run icons:sprite (после добавления/обновления иконок)

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'src/shared/assets/icons/ui');
const outDir = join(root, 'src/shared/ui/app-icon');

// Цвета, которыми Figma заливает иконки по умолчанию — заменяем на currentColor,
// чтобы цвет задавался через text-* как у обычного текста
const MONO_FILLS = /\s(fill|stroke)="(#303032|#18181b|black|#000|#000000)"/gi;

function normalize(svg, name) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`${name}: нет viewBox`);

  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .replace(MONO_FILLS, ' $1="currentColor"')
    .replace(/\sfill-opacity="0\.98"/g, '')
    .replace(/\s(id|data-[\w-]+)="[^"]*"/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<g>([\s\S]*)<\/g>/, '$1')
    .replace(/>\s+</g, '><')
    .trim();

  if (/(fill|stroke)="#[0-9a-f]{3,8}"/i.test(inner)) {
    console.warn(`⚠ ${name}: остались жёсткие цвета — проверьте, что так задумано`);
  }

  return `<symbol id="${name}" viewBox="${viewBox}">${inner}</symbol>`;
}

const files = readdirSync(sourceDir)
  .filter((file) => file.endsWith('.svg'))
  .sort();

const names = files.map((file) => basename(file, '.svg'));
const symbols = files.map((file, index) =>
  normalize(readFileSync(join(sourceDir, file), 'utf8'), names[index]),
);

writeFileSync(
  join(outDir, 'assets/sprite.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>\n`,
);

writeFileSync(
  join(outDir, 'iconNames.ts'),
  `// Сгенерировано scripts/build-icon-sprite.mjs — не редактировать вручную\n\n` +
    `export const ICON_NAMES = [\n${names.map((name) => `  '${name}',`).join('\n')}\n] as const;\n\n` +
    `export type IconName = (typeof ICON_NAMES)[number];\n`,
);

console.log(`✓ sprite: ${names.length} иконок`);
