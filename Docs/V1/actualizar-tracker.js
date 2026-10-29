// Copia el contenido de tracker.md adentro de tracker.html, para que la página
// muestre el tracker con solo abrirla (doble clic), sin servidor.
// Uso: node Docs/actualizar-tracker.js   (o doble clic en actualizar-tracker.bat)
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const mdPath = path.join(dir, 'tracker.md');
const htmlPath = path.join(dir, 'tracker.html');
const START = '<!-- TRACKER-MD:START -->';
const END = '<!-- TRACKER-MD:END -->';

const md = fs.readFileSync(mdPath, 'utf8');
let html = fs.readFileSync(htmlPath, 'utf8');

const i = html.indexOf(START);
const j = html.indexOf(END);
if (i < 0 || j < 0 || j < i) {
  console.error('No encontré las marcas TRACKER-MD en tracker.html. No se cambió nada.');
  process.exit(1);
}

const safe = md.replace(/<\/script/gi, '<\\/script');
const stamp = new Date().toISOString();
const block = START + '\n<script type="text/markdown" id="tracker-md" data-updated="' + stamp + '">\n' + safe + '\n</script>\n';

html = html.slice(0, i) + block + html.slice(j);
fs.writeFileSync(htmlPath, html);
console.log('Listo: tracker.html ahora muestra tracker.md (' + stamp + ').');
