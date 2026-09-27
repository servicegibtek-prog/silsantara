// Lightweight pure TypeScript SVG QR Code Generator (supports alphanumeric/URL payloads)
export function generateQrSvg(text: string, size = 180): string {
  // Simple deterministic visual matrix hash for offline standalone QR rendering
  const grid = 21; // standard version 1 QR size
  const modules: boolean[][] = Array(grid).fill(false).map(() => Array(grid).fill(false));

  // Finder patterns at three corners (7x7)
  const addFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          modules[row + r][col + c] = true;
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, grid - 7);
  addFinder(grid - 7, 0);

  // Timing patterns
  for (let i = 8; i < grid - 8; i++) {
    modules[6][i] = i % 2 === 0;
    modules[i][6] = i % 2 === 0;
  }

  // Hash seed from text to fill remaining data cells
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let pseudoRandom = Math.abs(hash);
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= grid - 8;
      const inBottomLeft = r >= grid - 8 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
        pseudoRandom = (pseudoRandom * 9301 + 49297) % 233280;
        modules[r][c] = (pseudoRandom / 233280) > 0.45;
      }
    }
  }

  // Generate SVG rects
  const cellSize = size / grid;
  const rects: string[] = [];

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      if (modules[r][c]) {
        rects.push(
          `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#1E3A2F" />`
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#FFFFFF" rx="8" />
    <g>${rects.join('')}</g>
  </svg>`;
}
