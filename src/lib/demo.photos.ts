/** Imágenes SVG generadas para las propiedades de demostración (sin dependencias externas). */

type Scene = { title: string; svg: string };

const W = 1200;
const H = 800;

function frame(inner: string, sky: [string, string], label: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${sky[0]}"/><stop offset="100%" stop-color="${sky[1]}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${inner}
  <rect x="0" y="${H - 56}" width="${W}" height="56" fill="#08222499"/>
  <text x="28" y="${H - 20}" font-family="system-ui, sans-serif" font-size="26" fill="#F3F7F5">${label}</text>
</svg>`;
}

function casa(): Scene[] {
  const jardin = `
  <rect y="520" width="${W}" height="280" fill="#4B8B54"/>
  <rect x="180" y="250" width="620" height="290" fill="#F6F1E7"/>
  <polygon points="140,255 490,110 840,255" fill="#B0533C"/>
  <rect x="250" y="330" width="120" height="110" fill="#7FC8E8"/>
  <rect x="430" y="330" width="120" height="110" fill="#7FC8E8"/>
  <rect x="610" y="330" width="120" height="110" fill="#7FC8E8"/>
  <rect x="430" y="440" width="110" height="100" fill="#0E6E64"/>
  <ellipse cx="900" cy="640" rx="230" ry="110" fill="#2FD3B0"/>
  <ellipse cx="900" cy="640" rx="200" ry="88" fill="#43BEE0"/>
  <rect x="120" y="600" width="180" height="16" rx="8" fill="#E8DFC9"/>
  <circle cx="1080" cy="330" r="70" fill="#FFE28A"/>`;
  const pileta = `
  <rect y="470" width="${W}" height="330" fill="#5A9E62"/>
  <ellipse cx="600" cy="600" rx="420" ry="170" fill="#2FD3B0"/>
  <ellipse cx="600" cy="600" rx="380" ry="140" fill="#3FA9DE"/>
  <rect x="120" y="430" width="240" height="60" rx="16" fill="#E8DFC9"/>
  <rect x="840" y="430" width="240" height="60" rx="16" fill="#E8DFC9"/>
  <circle cx="1050" cy="200" r="80" fill="#FFE28A"/>`;
  const interior = `
  <rect y="560" width="${W}" height="240" fill="#C79A6B"/>
  <rect width="${W}" height="560" fill="#F6F1E7"/>
  <rect x="120" y="150" width="380" height="280" fill="#7FC8E8" stroke="#082224" stroke-width="12"/>
  <rect x="620" y="380" width="460" height="200" rx="24" fill="#0E6E64"/>
  <rect x="660" y="330" width="120" height="60" rx="16" fill="#2FD3B0"/>
  <rect x="180" y="500" width="300" height="60" rx="12" fill="#B0533C"/>`;
  return [
    { title: "Frente y jardín", svg: frame(jardin, ["#8ED0F0", "#D9F0F7"], "Casa Familiar · frente y jardín") },
    { title: "Pileta", svg: frame(pileta, ["#7FC8E8", "#E4F5FA"], "Casa Familiar · pileta") },
    { title: "Living", svg: frame(interior, ["#F6F1E7", "#F6F1E7"], "Casa Familiar · living") },
  ];
}

function depto(): Scene[] {
  const city = `
  <rect y="520" width="${W}" height="280" fill="#1E2B33"/>
  ${Array.from({ length: 9 })
    .map((_, i) => {
      const x = 60 + i * 130;
      const h = 180 + ((i * 97) % 300);
      return `<rect x="${x}" y="${560 - h}" width="100" height="${h}" fill="#33454F"/>` +
        Array.from({ length: 6 })
          .map((__, j) => `<rect x="${x + 14}" y="${580 - h + j * 42}" width="24" height="24" fill="${(i + j) % 3 === 0 ? "#FFE28A" : "#5E7480"}"/>`)
          .join("");
    })
    .join("")}`;
  const balcon = `
  ${city}
  <rect x="0" y="600" width="${W}" height="200" fill="#E8DFC9"/>
  <rect x="0" y="560" width="${W}" height="24" fill="#0E6E64"/>
  ${Array.from({ length: 20 })
    .map((_, i) => `<rect x="${20 + i * 60}" y="560" width="8" height="60" fill="#0E6E64"/>`)
    .join("")}
  <circle cx="220" cy="700" r="46" fill="#2FD3B0"/>
  <rect x="820" y="640" width="260" height="90" rx="18" fill="#B0533C"/>`;
  const interior = `
  <rect width="${W}" height="${H}" fill="#F3F7F5"/>
  <rect y="600" width="${W}" height="200" fill="#C79A6B"/>
  <rect x="700" y="120" width="440" height="420" fill="#7FC8E8" stroke="#082224" stroke-width="14"/>
  <rect x="90" y="380" width="480" height="220" rx="26" fill="#0E6E64"/>
  <rect x="140" y="320" width="140" height="60" rx="14" fill="#2FD3B0"/>
  <rect x="620" y="560" width="360" height="40" rx="12" fill="#E8DFC9"/>`;
  return [
    { title: "Vista a la ciudad", svg: frame(city, ["#F5B96B", "#F7E4C7"], "Depto Centro · vista a la ciudad") },
    { title: "Balcón", svg: frame(balcon, ["#8ED0F0", "#E4F5FA"], "Depto Centro · balcón") },
    { title: "Ambiente principal", svg: frame(interior, ["#F3F7F5", "#F3F7F5"], "Depto Centro · ambiente principal") },
  ];
}

function cabana(): Scene[] {
  const bosque = `
  <rect y="560" width="${W}" height="240" fill="#3F6B44"/>
  ${Array.from({ length: 14 })
    .map((_, i) => {
      const x = 40 + i * 88;
      const h = 240 + ((i * 61) % 180);
      return `<polygon points="${x},${600} ${x + 44},${600 - h} ${x + 88},600" fill="${i % 2 ? "#2F5C3A" : "#274E32"}"/>`;
    })
    .join("")}
  <rect x="420" y="420" width="380" height="180" fill="#8A5A34"/>
  <polygon points="390,425 610,300 830,425" fill="#5C3A21"/>
  <rect x="560" y="480" width="100" height="120" fill="#FFE28A"/>`;
  const deck = `
  <rect y="520" width="${W}" height="280" fill="#8A5A34"/>
  ${Array.from({ length: 16 })
    .map((_, i) => `<rect x="0" y="${540 + i * 17}" width="${W}" height="6" fill="#6E4526"/>`)
    .join("")}
  <rect x="120" y="300" width="300" height="220" fill="#2F5C3A"/>
  <circle cx="880" cy="420" r="120" fill="#2FD3B0" opacity="0.6"/>
  <rect x="780" y="460" width="220" height="70" rx="18" fill="#5C3A21"/>`;
  const interior = `
  <rect width="${W}" height="${H}" fill="#EFE2CE"/>
  <rect y="620" width="${W}" height="180" fill="#8A5A34"/>
  <polygon points="0,0 600,220 1200,0" fill="#6E4526"/>
  <rect x="760" y="220" width="330" height="330" fill="#7FC8E8" stroke="#5C3A21" stroke-width="16"/>
  <rect x="120" y="400" width="420" height="220" rx="24" fill="#B0533C"/>
  <rect x="300" y="300" width="120" height="100" fill="#FFB067"/>`;
  return [
    { title: "Bosque", svg: frame(bosque, ["#A7D8E8", "#DDEEF2"], "Cabaña del Bosque · entorno") },
    { title: "Deck", svg: frame(deck, ["#9BC8DA", "#E7F2F4"], "Cabaña del Bosque · deck") },
    { title: "Interior", svg: frame(interior, ["#EFE2CE", "#EFE2CE"], "Cabaña del Bosque · interior") },
  ];
}

export const DEMO_PHOTOS: Record<string, Scene[]> = {
  casa: casa(),
  depto: depto(),
  cabana: cabana(),
};
