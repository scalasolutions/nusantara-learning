
const MEDIA = {
  'what-is-indonesia': {
    image: '/media/01-archipelago.svg',
    remoteImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Province_Flag_Map_Indonesia_Map.png/960px-Province_Flag_Map_Indonesia_Map.png',
    imageAlt: 'Original course illustration of the Indonesian archipelago',
    credit: 'Original Nusantara Learning visual · map reference',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Province_Flag_Map_Indonesia_Map.png',
  },
  'map-of-indonesia': {
    image: '/media/02-geography.svg',
    remoteImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Jakarta_Panorama.jpg/960px-Jakarta_Panorama.jpg',
    imageAlt: 'Original course illustration of Indonesian island geography and routes',
    credit: 'Original Nusantara Learning visual · Jakarta reference',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Jakarta_Panorama.jpg',
  },
  'peoples-and-languages': {
    image: '/media/03-identity.svg',
    remoteImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Maestro_Batik_Tulis_di_Imogiri.jpg/960px-Maestro_Batik_Tulis_di_Imogiri.jpg',
    imageAlt: 'Original course illustration of layered Indonesian identity',
    credit: 'Original Nusantara Learning visual · batik reference',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Maestro_Batik_Tulis_di_Imogiri.jpg',
  },
  'trade-and-kingdoms': {
    image: '/media/04-trade.svg',
    remoteImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Borobudur-Nothwest-view.jpg/960px-Borobudur-Nothwest-view.jpg',
    imageAlt: 'Original course illustration of maritime trade routes',
    credit: 'Original Nusantara Learning visual · Borobudur reference',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Borobudur-Nothwest-view.jpg',
  },
  'religion-and-adat': {
    image: '/media/05-adat.svg',
    remoteImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Pertunjukan_Wayang_Kulit.jpg/960px-Pertunjukan_Wayang_Kulit.jpg',
    imageAlt: 'Original course illustration of religion, adat, and community overlap',
    credit: 'Original Nusantara Learning visual · wayang reference',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Pertunjukan_Wayang_Kulit.jpg',
  },
  'modern-indonesia': {
    image: '/media/06-modern.svg',
    remoteImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Jakarta_skyline_2.jpg/960px-Jakarta_skyline_2.jpg',
    imageAlt: 'Original course illustration of Indonesia becoming a modern republic',
    credit: 'Original Nusantara Learning visual · Jakarta reference',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Jakarta_skyline_2.jpg',
  },
};

const RESOURCE_SETS = {
  'what-is-indonesia': [
    ['Read', 'Encyclopaedia Britannica — Indonesia', 'https://www.britannica.com/place/Indonesia', 'A broad, editorially reviewed orientation to the country.'],
    ['Map', 'Wikimedia Commons — Maps of Indonesia', 'https://commons.wikimedia.org/wiki/Category:Maps_of_Indonesia', 'Browse maps and check the license on the individual file page.'],
  ],
  'map-of-indonesia': [
    ['Read', 'CIA World Factbook — Indonesia', 'https://www.cia.gov/the-world-factbook/countries/indonesia/', 'Geography, people, and country reference data.'],
    ['Explore', 'UNESCO — Indonesia World Heritage', 'https://whc.unesco.org/en/statesparties/id', 'See how places and landscapes are represented as heritage.'],
  ],
  'peoples-and-languages': [
    ['Read', 'Britannica — Indonesia: People', 'https://www.britannica.com/place/Indonesia/People', 'A concise overview of ethnic and linguistic diversity.'],
    ['Explore', 'UNESCO — Languages', 'https://www.unesco.org/en/languages', 'Context for language diversity and vitality.'],
  ],
  'trade-and-kingdoms': [
    ['Read', 'Britannica — Srivijaya empire', 'https://www.britannica.com/place/Srivijaya-empire', 'Maritime trade, power, and the Strait of Malacca.'],
    ['Visit', 'UNESCO — Borobudur Temple Compounds', 'https://whc.unesco.org/en/list/592/', 'Official heritage documentation for a Central Javanese monument.'],
  ],
  'religion-and-adat': [
    ['Read', 'Britannica — Indonesia: Religion', 'https://www.britannica.com/place/Indonesia/Religion', 'A careful overview of major religions and local traditions.'],
    ['Explore', 'UNESCO Intangible Cultural Heritage — Indonesia', 'https://ich.unesco.org/en/state/indonesia-ID', 'Living heritage entries including wayang, batik, and angklung.'],
  ],
  'modern-indonesia': [
    ['Read', 'Britannica — Indonesia: History', 'https://www.britannica.com/place/Indonesia/History', 'A broad timeline from colonial rule to the modern republic.'],
    ['Read', 'US Office of the Historian — Indonesia', 'https://history.state.gov/countries/indonesia', 'A second perspective for post-independence chronology.'],
  ],
};

export { MEDIA, RESOURCE_SETS };
