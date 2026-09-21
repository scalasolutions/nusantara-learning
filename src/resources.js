
const MEDIA = {
  'what-is-indonesia': {
    image: '/media/real/01-archipelago.jpg',
    imageAlt: 'Map of the Indonesian archipelago',
    credit: 'AMH Map of Indonesian Archipelago · Public domain',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:AMH_Map_of_Indonesian_Archipelago.jpg',
  },
  'map-of-indonesia': {
    image: '/media/real/02-jakarta.jpg',
    imageAlt: 'Panorama of Jakarta, Indonesia',
    credit: 'Jakarta Panorama · CC BY-SA 3.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Jakarta_Panorama.jpg',
  },
  'peoples-and-languages': {
    image: '/media/real/03-batik.jpg',
    imageAlt: 'Batik artisan applying wax with a canting tool',
    credit: 'Batik Artisan Applying Wax · CC BY-SA 4.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Batik_Artisan_Applying_Wax_with_Canting_in_Trusmi_Cirebon_Indonesia.jpg',
  },
  'trade-and-kingdoms': {
    image: '/media/real/04-borobudur.jpg',
    imageAlt: 'Borobudur temple in Central Java',
    credit: 'Borobudur northwest view · CC BY-SA 3.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Borobudur-Nothwest-view.jpg',
  },
  'religion-and-adat': {
    image: '/media/real/05-wayang.jpg',
    imageAlt: 'Wayang kulit performance in Indonesia',
    credit: 'Pertunjukan Wayang Kulit · CC BY-SA 4.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Pertunjukan_Wayang_Kulit.jpg',
  },
  'modern-indonesia': {
    image: '/media/real/06-independence.jpg',
    imageAlt: 'Children celebrating Indonesian Independence Day in Yogyakarta',
    credit: 'Children celebrating Indonesian Independence Day · CC BY-SA 4.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Group_of_children_celebrating_Indonesian_Independence_Day,_Yogyakarta,_20220816_2017_8534.jpg',
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
