/**
 * Presets et utilitaires pour la gestion des logos d'établissement scolaire
 */

export interface SchoolLogoPreset {
  id: string;
  name: string;
  description: string;
  category: 'cameroun' | 'academique' | 'moderne';
  dataUrl: string;
}

// 1. Armoiries & Sceau Officiel de l'Éducation (Inspiré République du Cameroun / MINESEC)
const SVG_MINESEC_SEAL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#D97706"/>
    </radialGradient>
    <linearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="33%" stop-color="#059669"/>
      <stop offset="33.1%" stop-color="#DC2626"/>
      <stop offset="66%" stop-color="#DC2626"/>
      <stop offset="66.1%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#FBBF24"/>
    </linearGradient>
  </defs>
  <!-- Outer Ring -->
  <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5"/>
  <circle cx="60" cy="60" r="51" fill="none" stroke="#D97706" stroke-width="1.5" stroke-dasharray="2,2"/>
  
  <!-- Tricolor Cameroon arch -->
  <path d="M 22,60 A 38,38 0 0,1 98,60" fill="none" stroke="url(#flagGrad)" stroke-width="5"/>

  <!-- Star in Center of upper arch -->
  <polygon points="60,28 62,34 68,34 63,38 65,44 60,40 55,44 57,38 52,34 58,34" fill="#FBBF24" stroke="#B45309" stroke-width="0.5"/>

  <!-- Open Book Symbol (Éducation) -->
  <path d="M 38,72 Q 49,66 60,68 Q 71,66 82,72 L 82,88 Q 71,83 60,85 Q 49,83 38,88 Z" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.8"/>
  <path d="M 60,68 L 60,85" stroke="#0F172A" stroke-width="1.8"/>
  <line x1="42" y1="74" x2="56" y2="72" stroke="#64748B" stroke-width="1"/>
  <line x1="42" y1="78" x2="56" y2="76" stroke="#64748B" stroke-width="1"/>
  <line x1="64" y1="72" x2="78" y2="74" stroke="#64748B" stroke-width="1"/>
  <line x1="64" y1="76" x2="78" y2="78" stroke="#64748B" stroke-width="1"/>

  <!-- Scales of balance / Justice / Rigueur -->
  <path d="M 60,46 L 60,62 M 46,51 L 74,51" stroke="#0F172A" stroke-width="1.8" stroke-linecap="round"/>
  <polygon points="46,51 41,59 51,59" fill="#D97706" opacity="0.85"/>
  <polygon points="74,51 69,59 79,59" fill="#D97706" opacity="0.85"/>

  <!-- Bottom Banner Motto -->
  <path d="M 28,95 Q 60,91 92,95 L 90,102 Q 60,98 30,102 Z" fill="#0F172A"/>
  <text x="60" y="100" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">PAIX • TRAVAIL • PATRIE</text>
</svg>`;

// 2. Blason d'Excellence Académique (Lycée & Collège)
const SVG_ACADEMIC_SHIELD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <!-- Shield contour -->
  <path d="M 25,20 L 95,20 Q 95,65 60,105 Q 25,65 25,20 Z" fill="url(#shieldGrad)" stroke="#F59E0B" stroke-width="3"/>
  <path d="M 30,24 L 90,24 Q 90,62 60,98 Q 30,62 30,24 Z" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.4"/>

  <!-- Torch of Knowledge in center -->
  <path d="M 60,35 Q 65,42 60,50 Q 55,42 60,35 Z" fill="#EF4444"/>
  <path d="M 60,38 Q 63,43 60,48 Q 57,43 60,38 Z" fill="#FBBF24"/>
  <path d="M 56,50 L 64,50 L 62,64 L 58,64 Z" fill="#D97706" stroke="#FFFFFF" stroke-width="0.8"/>

  <!-- Open Book under Torch -->
  <path d="M 40,68 Q 50,64 60,66 Q 70,64 80,68 L 80,80 Q 70,76 60,78 Q 50,76 40,80 Z" fill="#FFFFFF" stroke="#F59E0B" stroke-width="1.5"/>
  <path d="M 60,66 L 60,78" stroke="#1E3A8A" stroke-width="1.5"/>

  <!-- Laurel Leaves (Left & Right) -->
  <path d="M 20,40 Q 15,60 28,80" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
  <circle cx="17" cy="45" r="2.5" fill="#F59E0B"/>
  <circle cx="15" cy="56" r="2.5" fill="#F59E0B"/>
  <circle cx="19" cy="68" r="2.5" fill="#F59E0B"/>
  <circle cx="25" cy="78" r="2.5" fill="#F59E0B"/>

  <path d="M 100,40 Q 105,60 92,80" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
  <circle cx="103" cy="45" r="2.5" fill="#F59E0B"/>
  <circle cx="105" cy="56" r="2.5" fill="#F59E0B"/>
  <circle cx="101" cy="68" r="2.5" fill="#F59E0B"/>
  <circle cx="95" cy="78" r="2.5" fill="#F59E0B"/>

  <!-- Star of excellence -->
  <polygon points="60,86 61.5,90 66,90 62.5,93 64,97 60,94.5 56,97 57.5,93 54,90 58.5,90" fill="#FBBF24"/>
</svg>`;

// 3. Logo Moderne Sciences & Savoir
const SVG_MODERN_CREST = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064E3B"/>
    </linearGradient>
  </defs>
  <!-- Modern Hexagon or Diamond -->
  <circle cx="60" cy="60" r="54" fill="#F0FDF4" stroke="#059669" stroke-width="3"/>
  <circle cx="60" cy="60" r="48" fill="url(#emeraldGrad)"/>

  <!-- Graduation Cap (Mortarboard) -->
  <polygon points="60,32 86,44 60,56 34,44" fill="#FFFFFF"/>
  <path d="M 44,52 L 44,65 Q 60,74 76,65 L 76,52 Q 60,60 44,52 Z" fill="#E2E8F0"/>
  <!-- Tassel -->
  <line x1="84" y1="45" x2="88" y2="58" stroke="#F59E0B" stroke-width="2"/>
  <circle cx="88" cy="60" r="2" fill="#F59E0B"/>

  <!-- Atom rings & Science -->
  <ellipse cx="60" cy="80" rx="20" ry="7" fill="none" stroke="#A7F3D0" stroke-width="1.5" transform="rotate(-20 60 80)"/>
  <ellipse cx="60" cy="80" rx="20" ry="7" fill="none" stroke="#A7F3D0" stroke-width="1.5" transform="rotate(20 60 80)"/>
  <circle cx="60" cy="80" r="3.5" fill="#FBBF24"/>

  <!-- Banner text -->
  <text x="60" y="106" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#064E3B" text-anchor="middle" letter-spacing="1">EXCELLENTIA</text>
</svg>`;

export const svgToDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

export const SCHOOL_LOGO_PRESETS: SchoolLogoPreset[] = [
  {
    id: 'minesec_cameroun',
    name: 'Sceau Officiel MINESEC / Cameroun',
    description: 'Armoiries officielles bilingues avec livre ouvert, balance et devise nationale.',
    category: 'cameroun',
    dataUrl: svgToDataUrl(SVG_MINESEC_SEAL),
  },
  {
    id: 'academic_shield',
    name: "Blason d'Excellence Académique",
    description: 'Écu héraldique bleu roi & or avec flambeau du savoir et lauriers.',
    category: 'academique',
    dataUrl: svgToDataUrl(SVG_ACADEMIC_SHIELD),
  },
  {
    id: 'modern_crest',
    name: 'Sceau Sciences & Mortarboard',
    description: 'Insigne moderne vert émeraude avec toge académique et symbole des sciences.',
    category: 'moderne',
    dataUrl: svgToDataUrl(SVG_MODERN_CREST),
  },
];

/**
 * Lit un fichier image utilisateur (PNG, JPG, SVG, WebP) et le compresse/redimensionne
 * pour obtenir un Data URL base64 léger et parfaitement compatible (DOCX, PDF, Print).
 */
export function processUploadedLogoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Le fichier sélectionné doit être une image (PNG, JPG, SVG, WebP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier image."));
    reader.onload = () => {
      const dataUrl = reader.result as string;

      // Si c'est un SVG, on peut le renvoyer tel quel
      if (file.type === 'image/svg+xml') {
        return resolve(dataUrl);
      }

      // Pour les images matricielles (JPG, PNG), on s'assure qu'elle ne dépasse pas 400x400 pour garder le document léger
      const img = new Image();
      img.onerror = () => resolve(dataUrl); // fallback direct
      img.onload = () => {
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(dataUrl);
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Exporter en PNG avec transparence
        const optimizedPng = canvas.toDataURL('image/png', 0.95);
        resolve(optimizedPng);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Convertit un Data URL (base64 ou SVG) en Uint8Array pour l'incorporation dans docx (ImageRun)
 */
export async function dataUrlToUint8Array(dataUrl: string): Promise<Uint8Array | null> {
  try {
    let base64 = '';
    if (dataUrl.startsWith('data:image/svg+xml')) {
      // Pour les SVGs, on les rasterise en PNG via canvas pour que Word docx l'affiche parfaitement
      base64 = await svgDataUrlToPngBase64(dataUrl, 160, 160);
    } else {
      base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
    }

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error('Impossible de convertir le logo pour Word docx :', e);
    return null;
  }
}

/**
 * Rasterise un SVG Data URL en PNG Base64
 */
export function svgDataUrlToPngBase64(svgDataUrl: string, width = 160, height = 160): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const pngUrl = canvas.toDataURL('image/png');
        resolve(pngUrl.split(',')[1]);
      } else {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = svgDataUrl;
  });
}
