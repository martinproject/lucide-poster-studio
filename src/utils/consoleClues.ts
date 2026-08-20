let hasPrintedClues = false;

/**
 * Cyber Terminal Developer Console Easter Egg Clues
 * Displays ASCII art and enigmatic clues in the DevTools console.
 */
export function printConsoleEasterEggClues() {
  if (hasPrintedClues || typeof window === 'undefined' || typeof console === 'undefined') return;
  hasPrintedClues = true;

  const asciiArt = `
%c  ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
  ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
  ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
  ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
  ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
  ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
  -------------------------------------------------
  CLASSIFIED GLYPH MAINFRAME // 1,779 GLYPH VECTOR MATRIX
`;

  const bannerStyle = `
    color: #00FF66;
    background: #050B07;
    font-family: monospace;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 0 0 8px #00FF66;
  `;

  const titleStyle = `
    color: #FFFFFF;
    background: #111827;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    font-weight: bold;
    border: 1px solid #22C55E;
  `;

  const clueStyle = `
    color: #4ADE80;
    font-family: monospace;
    font-size: 11px;
    line-height: 1.5;
  `;

  const subtleStyle = `
    color: #6B7280;
    font-family: monospace;
    font-size: 10px;
    font-style: italic;
  `;

  console.log(asciiArt, bannerStyle);
  console.log('%c[SYSTEM] 🕶️ WAKE UP, OPERATOR...', titleStyle);
  console.log(
    '%c> There is a hidden vector rain dimension built into this studio.\n' +
    '> Clue 1: Type the 6-letter green simulation name anywhere on your keyboard.\n' +
    '> Clue 2: Or press [Cmd/Ctrl] + [Shift] + [M] (or Alt+M).\n' +
    '> 1,779 falling Lucide vector glyphs • Synthesizer soundtrack • 60 FPS Canvas.',
    clueStyle
  );
  console.log('%c// Follow the white rabbit. Neo has been expecting you.', subtleStyle);
}
