
const MEDIA = {
  'what-is-indonesia': {
    image: '/media/real/01-archipelago.jpg',
    imageAlt: 'Map of the Indonesian archipelago',
    purpose: 'The map makes the class idea visible: Indonesia is a chain of islands connected by sea routes.',
    credit: 'AMH Map of Indonesian Archipelago · Public domain',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:AMH_Map_of_Indonesian_Archipelago.jpg',
  },
  'map-of-indonesia': {
    image: '/media/real/02-jakarta.jpg',
    imageAlt: 'Panorama of Jakarta, Indonesia',
    purpose: 'Jakarta shows how a coastal city becomes a connector for people, goods, and regional movement.',
    credit: 'Jakarta Panorama · CC BY-SA 3.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Jakarta_Panorama.jpg',
  },
  'peoples-and-languages': {
    image: '/media/real/03-batik.jpg',
    imageAlt: 'Batik artisan applying wax with a canting tool',
    purpose: 'Batik gives us a concrete way to see how local practice, language, and identity can travel together.',
    credit: 'Batik Artisan Applying Wax · CC BY-SA 4.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Batik_Artisan_Applying_Wax_with_Canting_in_Trusmi_Cirebon_Indonesia.jpg',
  },
  'trade-and-kingdoms': {
    image: '/media/real/04-borobudur.jpg',
    imageAlt: 'Borobudur temple in Central Java',
    purpose: 'Borobudur shows how religion, craftsmanship, political power, and regional exchange can meet in one place.',
    credit: 'Borobudur northwest view · CC BY-SA 3.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Borobudur-Nothwest-view.jpg',
  },
  'religion-and-adat': {
    image: '/media/real/05-wayang.jpg',
    imageAlt: 'Wayang kulit performance in Indonesia',
    purpose: 'Wayang helps show how formal belief, local custom, art, and community practice can overlap.',
    credit: 'Pertunjukan Wayang Kulit · CC BY-SA 4.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Pertunjukan_Wayang_Kulit.jpg',
  },
  'modern-indonesia': {
    image: '/media/real/06-independence.jpg',
    imageAlt: 'Children celebrating Indonesian Independence Day in Yogyakarta',
    purpose: 'A national celebration shows how shared citizenship is practiced through local communities and places.',
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

const SECTION_MEDIA = {
  'what-is-indonesia': [
    ['/media/real/01-archipelago.jpg', 'Island worlds', 'Different landscapes and sea distances helped local communities develop distinct ways of living.'],
    ['/media/real/01-archipelago.jpg', 'Routes across water', 'The archipelago map makes movement, exchange, and connection visible.'],
    ['/media/real/03-batik.jpg', 'Layered belonging', 'A shared national identity can hold many local languages, histories, and traditions.'],
  ],
  'map-of-indonesia': [
    ['/media/real/01-archipelago.jpg', 'Geography shapes possibility', 'Land, climate, and distance help explain where people settle and how they move.'],
    ['/media/real/02-jakarta.jpg', 'A connected coastal city', 'Jakarta makes the role of ports, migration, and regional movement concrete.'],
    ['/media/real/04-borobudur.jpg', 'Place and wider worlds', 'A local monument can reveal wider networks of religion, craft, and political power.'],
  ],
  'peoples-and-languages': [
    ['/media/real/03-batik.jpg', 'Identity has layers', 'Nationality, ethnicity, language, religion, and place answer different questions.'],
    ['/media/real/03-batik.jpg', 'Culture in practice', 'Batik shows how local knowledge, craft, language, and identity become visible.'],
    ['/media/real/06-independence.jpg', 'Shared public language', 'A national language helps people communicate while local languages remain meaningful.'],
  ],
  'trade-and-kingdoms': [
    ['/media/real/02-jakarta.jpg', 'Ports as meeting points', 'Ports connected products, people, languages, religious ideas, and political claims.'],
    ['/media/real/02-jakarta.jpg', 'Maritime networks', 'Coastal cities help us see how power can travel through routes rather than borders.'],
    ['/media/real/04-borobudur.jpg', 'Memory in monuments', 'Monuments preserve evidence of craftsmanship, belief, patronage, and historical memory.'],
  ],
  'religion-and-adat': [
    ['/media/real/05-wayang.jpg', 'Custom and community', 'Adat is a living set of local norms and practices, not one national rulebook.'],
    ['/media/real/05-wayang.jpg', 'Belief and performance', 'Wayang shows how stories, art, belief, and community practice can overlap.'],
    ['/media/real/03-batik.jpg', 'Adaptation over time', 'Everyday traditions can preserve older patterns while taking on new meanings.'],
  ],
  'modern-indonesia': [
    ['/media/real/06-independence.jpg', 'A national framework', 'Independence created a political framework across a very large and diverse archipelago.'],
    ['/media/real/06-independence.jpg', 'Citizenship in practice', 'National identity is experienced through local communities, celebrations, and public life.'],
    ['/media/real/02-jakarta.jpg', 'Many regional futures', 'Modern debates connect national institutions with different regional priorities.'],
  ],
};

export { MEDIA, RESOURCE_SETS, SECTION_MEDIA };
