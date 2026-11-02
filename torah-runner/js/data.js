// Static game data: Torah words, Hebrew letter names, and the four regions of the journey.

export const WORDS = [
  { he: 'תורה', tr: 'Torah', en: 'Teaching' },
  { he: 'אור', tr: 'Or', en: 'Light' },
  { he: 'שלום', tr: 'Shalom', en: 'Peace' },
  { he: 'חבר', tr: 'Chaver', en: 'Friend' },
  { he: 'אמת', tr: 'Emet', en: 'Truth' },
  { he: 'טוב', tr: 'Tov', en: 'Good' },
  { he: 'חסד', tr: 'Chesed', en: 'Kindness' },
  { he: 'גמל', tr: 'Gamal', en: 'Camel' },
  { he: 'מים', tr: 'Mayim', en: 'Water' },
  { he: 'לחם', tr: 'Lechem', en: 'Bread' },
  { he: 'זהב', tr: 'Zahav', en: 'Gold' },
  { he: 'ספר', tr: 'Sefer', en: 'Book' },
  { he: 'נר', tr: 'Ner', en: 'Candle' },
  { he: 'עץ', tr: 'Etz', en: 'Tree' },
  { he: 'קול', tr: 'Kol', en: 'Voice' },
  { he: 'ארץ', tr: 'Eretz', en: 'Land' },
  { he: 'דבש', tr: 'Dvash', en: 'Honey' },
  { he: 'שמש', tr: 'Shemesh', en: 'Sun' },
  { he: 'ברכה', tr: 'Brachah', en: 'Blessing' },
  { he: 'אהבה', tr: 'Ahavah', en: 'Love' },
  { he: 'שמחה', tr: 'Simchah', en: 'Joy' },
  { he: 'צדקה', tr: 'Tzedakah', en: 'Charity' },
  { he: 'חכמה', tr: 'Chochmah', en: 'Wisdom' },
  { he: 'מצוה', tr: 'Mitzvah', en: 'Good deed' },
  { he: 'מדבר', tr: 'Midbar', en: 'Desert' },
  { he: 'כוכב', tr: 'Kochav', en: 'Star' },
  { he: 'ענוה', tr: 'Anavah', en: 'Humility' },
  { he: 'חיים', tr: 'Chaim', en: 'Life' },
  { he: 'בראשית', tr: 'Bereshit', en: 'In the beginning' },
];

export const LETTER_NAMES = {
  'א': 'Alef', 'ב': 'Bet', 'ג': 'Gimel', 'ד': 'Dalet', 'ה': 'Hey', 'ו': 'Vav',
  'ז': 'Zayin', 'ח': 'Chet', 'ט': 'Tet', 'י': 'Yod', 'כ': 'Kaf', 'ך': 'Final Kaf',
  'ל': 'Lamed', 'מ': 'Mem', 'ם': 'Final Mem', 'נ': 'Nun', 'ן': 'Final Nun',
  'ס': 'Samech', 'ע': 'Ayin', 'פ': 'Pey', 'ף': 'Final Pey', 'צ': 'Tzadi',
  'ץ': 'Final Tzadi', 'ק': 'Kuf', 'ר': 'Resh', 'ש': 'Shin', 'ת': 'Tav',
};

// Metres per region. One lap = 4 regions.
export const BIOME_LEN = 650;

export const BIOMES = [
  {
    id: 'egypt', name: 'Egypt', he: 'מצרים', line: 'Leave the brick kilns behind',
    skyTop: 0x3f86cf, skyHorizon: 0xf7c792, skyBottom: 0xe8c48e, fog: 0xf2cb9c,
    ground: 0xe6c48c, road: 0xeedbb4, sun: 0xfff1c9,
    hemiSky: 0xffe6c4, hemiGround: 0xb98a55, light: 0xfff0d8, lightI: 2.2, hemiI: 1.25,
    sunDir: [-0.35, 0.22, -1], stars: 0,
  },
  {
    id: 'sea', name: 'The Red Sea', he: 'ים סוף', line: 'Run the dry path through the water',
    skyTop: 0x2c6fb2, skyHorizon: 0xaee0e6, skyBottom: 0xa1cfcf, fog: 0xa6d6da,
    ground: 0xb99f78, road: 0xd2bc93, sun: 0xffffff,
    hemiSky: 0xd4f3ff, hemiGround: 0x6d918b, light: 0xf2fbff, lightI: 2.0, hemiI: 1.3,
    sunDir: [0.3, 0.55, -1], stars: 0,
  },
  {
    id: 'wild', name: 'The Wilderness', he: 'מדבר', line: 'Manna falls every morning',
    skyTop: 0x2584d8, skyHorizon: 0xeae5d2, skyBottom: 0xe2c690, fog: 0xecdcb9,
    ground: 0xefcd8f, road: 0xe2bd85, sun: 0xffffff,
    hemiSky: 0xfff6e2, hemiGround: 0xc49a5c, light: 0xffffff, lightI: 2.3, hemiI: 1.25,
    sunDir: [0.15, 0.8, -0.6], stars: 0,
  },
  {
    id: 'sinai', name: 'Mount Sinai', he: 'הר סיני', line: 'Thunder, lightning and a great shofar blast',
    skyTop: 0x1c1846, skyHorizon: 0xd9805e, skyBottom: 0x5e4654, fog: 0x7c5869,
    ground: 0x94796a, road: 0xa89283, sun: 0xffb27c,
    hemiSky: 0xc2b0ea, hemiGround: 0x4f3d3d, light: 0xffc89e, lightI: 1.9, hemiI: 1.35,
    sunDir: [0.45, 0.12, -1], stars: 1,
  },
];

export const POWERS = {
  shield: { label: 'Cloud shield', color: '#7fd3ff', time: 12 },
  magnet: { label: 'Magnet', color: '#ff6b5a', time: 10 },
  double: { label: '2× manna', color: '#ffd24a', time: 10 },
  shofar: { label: 'Shofar blast', color: '#f3e3c3', time: 0 },
};
