// Quran Runner — all game content in one file.
//
// Same shape as Torah Runner's js/data.js, so it can drop into a copy of that engine:
//   WORDS, LETTER_NAMES, BIOME_LEN, ROUTE, routeStart, GATE_AT, FINISH_AT, WISDOMS (was COMMANDMENTS),
//   BIOMES, POWERS — plus every other piece of named content the engine keeps in other files
//   (SHOP, UPGRADES, ACHIEVEMENTS, OUTFITS, SKINS, CAPS, COIN_ERA, CHASERS, LANDMARKS, SCENERY,
//   OBSTACLE_NAMES, PHRASES, PILLARS, UI_TEXT). Move each table to the module that uses it.
//
// Arabic text uses the field `ar`. The engine reads `he`, so the bottom of this file copies `ar`
// into `he` on every word and place. Remove that block once the engine reads `ar` directly.
//
// Content rules followed throughout:
//   - No pictures of Allah, the prophets, the angels or the Prophet's family and companions.
//     Every scene is built from places, objects, plants and animals only.
//   - The names of Allah are never collectible letters (nothing holy is "dropped" or "missed").
//   - Verses are cited by surah:ayah reference and retold in simple English, not quoted in Arabic.
//   - Chasers are historical opponents from the stories, never real modern groups or people.
//   - Battles are shown as places and objects (wells, a trench, banners), with nothing gory.
//
// Arabic words are written without vowel marks so every letter can be caught on its own.
// Letters fly as isolated forms; the word card shows the joined word.

// ======================================================================================
// WORDS — 336 Arabic words, each with transliteration, meaning and a category.
// cat: faith, prayer, nature, animal, food, family, body, color, number, thing, value,
//      prophet (names only), surah (chapter names), place
// ======================================================================================
export const WORDS = [
  // ---------- faith
  { ar: 'قرآن', tr: "Qur'an", en: 'Recitation (the Quran)', cat: 'faith' },
  { ar: 'كتاب', tr: 'Kitab', en: 'Book', cat: 'faith' },
  { ar: 'نور', tr: 'Nur', en: 'Light', cat: 'faith' },
  { ar: 'سلام', tr: 'Salam', en: 'Peace', cat: 'faith' },
  { ar: 'رحمة', tr: 'Rahmah', en: 'Mercy', cat: 'faith' },
  { ar: 'إيمان', tr: 'Iman', en: 'Faith', cat: 'faith' },
  { ar: 'إسلام', tr: 'Islam', en: 'Submission to God', cat: 'faith' },
  { ar: 'دين', tr: 'Din', en: 'Way of life', cat: 'faith' },
  { ar: 'هدى', tr: 'Huda', en: 'Guidance', cat: 'faith' },
  { ar: 'حق', tr: 'Haqq', en: 'Truth', cat: 'faith' },
  { ar: 'خير', tr: 'Khayr', en: 'Goodness', cat: 'faith' },
  { ar: 'بركة', tr: 'Barakah', en: 'Blessing', cat: 'faith' },
  { ar: 'تقوى', tr: 'Taqwa', en: 'Mindfulness of God', cat: 'faith' },
  { ar: 'إحسان', tr: 'Ihsan', en: 'Doing your best', cat: 'faith' },
  { ar: 'توبة', tr: 'Tawbah', en: 'Repentance', cat: 'faith' },
  { ar: 'جنة', tr: 'Jannah', en: 'Garden, Paradise', cat: 'faith' },
  { ar: 'آية', tr: 'Ayah', en: 'Sign, verse', cat: 'faith' },
  { ar: 'سورة', tr: 'Surah', en: 'Chapter', cat: 'faith' },
  { ar: 'رسول', tr: 'Rasul', en: 'Messenger', cat: 'faith' },
  { ar: 'نبي', tr: 'Nabi', en: 'Prophet', cat: 'faith' },
  { ar: 'ملك', tr: 'Malak', en: 'Angel', cat: 'faith' },
  { ar: 'وحي', tr: 'Wahy', en: 'Revelation', cat: 'faith' },
  { ar: 'غيب', tr: 'Ghayb', en: 'The unseen', cat: 'faith' },
  { ar: 'أمة', tr: 'Ummah', en: 'Community', cat: 'faith' },
  { ar: 'سنة', tr: 'Sunnah', en: 'The Prophet\'s way', cat: 'faith' },
  { ar: 'حلال', tr: 'Halal', en: 'Allowed', cat: 'faith' },
  { ar: 'شهادة', tr: 'Shahadah', en: 'Declaration of faith', cat: 'faith' },
  { ar: 'زكاة', tr: 'Zakah', en: 'Yearly charity', cat: 'faith' },
  { ar: 'صدقة', tr: 'Sadaqah', en: 'Charity', cat: 'faith' },
  { ar: 'صوم', tr: 'Sawm', en: 'Fasting', cat: 'faith' },
  { ar: 'حج', tr: 'Hajj', en: 'Pilgrimage', cat: 'faith' },
  { ar: 'عمرة', tr: 'Umrah', en: 'Lesser pilgrimage', cat: 'faith' },
  { ar: 'رمضان', tr: 'Ramadan', en: 'Month of fasting', cat: 'faith' },
  { ar: 'عيد', tr: 'Eid', en: 'Festival', cat: 'faith' },
  { ar: 'إفطار', tr: 'Iftar', en: 'Breaking the fast', cat: 'faith' },
  { ar: 'سحور', tr: 'Suhur', en: 'Pre-dawn meal', cat: 'faith' },
  { ar: 'هجرة', tr: 'Hijrah', en: 'Migration', cat: 'faith' },
  { ar: 'كعبة', tr: "Ka'bah", en: 'The Kaaba', cat: 'faith' },
  { ar: 'قبلة', tr: 'Qiblah', en: 'Prayer direction', cat: 'faith' },
  { ar: 'إمام', tr: 'Imam', en: 'Prayer leader', cat: 'faith' },
  { ar: 'خطبة', tr: 'Khutbah', en: 'Sermon', cat: 'faith' },
  { ar: 'حافظ', tr: 'Hafiz', en: 'One who memorises', cat: 'faith' },
  { ar: 'تلاوة', tr: 'Tilawah', en: 'Recitation', cat: 'faith' },
  { ar: 'مصحف', tr: 'Mushaf', en: 'Written Quran', cat: 'faith' },
  { ar: 'جزء', tr: "Juz'", en: 'One thirtieth part', cat: 'faith' },

  // ---------- prayer and remembrance
  { ar: 'صلاة', tr: 'Salah', en: 'Prayer', cat: 'prayer' },
  { ar: 'دعاء', tr: "Du'a", en: 'Personal prayer', cat: 'prayer' },
  { ar: 'ذكر', tr: 'Dhikr', en: 'Remembrance', cat: 'prayer' },
  { ar: 'تسبيح', tr: 'Tasbih', en: 'Glorifying God', cat: 'prayer' },
  { ar: 'حمد', tr: 'Hamd', en: 'Praise', cat: 'prayer' },
  { ar: 'شكر', tr: 'Shukr', en: 'Thankfulness', cat: 'prayer' },
  { ar: 'أذان', tr: 'Adhan', en: 'Call to prayer', cat: 'prayer' },
  { ar: 'إقامة', tr: 'Iqamah', en: 'Second call', cat: 'prayer' },
  { ar: 'وضوء', tr: "Wudu'", en: 'Washing before prayer', cat: 'prayer' },
  { ar: 'سجدة', tr: 'Sajdah', en: 'Prostration', cat: 'prayer' },
  { ar: 'ركوع', tr: "Ruku'", en: 'Bowing', cat: 'prayer' },
  { ar: 'ركعة', tr: "Rak'ah", en: 'Unit of prayer', cat: 'prayer' },
  { ar: 'مسجد', tr: 'Masjid', en: 'Mosque', cat: 'prayer' },
  { ar: 'منبر', tr: 'Minbar', en: 'Pulpit', cat: 'prayer' },
  { ar: 'محراب', tr: 'Mihrab', en: 'Prayer niche', cat: 'prayer' },
  { ar: 'مئذنة', tr: "Mi'dhanah", en: 'Minaret', cat: 'prayer' },
  { ar: 'قبة', tr: 'Qubbah', en: 'Dome', cat: 'prayer' },
  { ar: 'فجر', tr: 'Fajr', en: 'Dawn prayer', cat: 'prayer' },
  { ar: 'ظهر', tr: 'Dhuhr', en: 'Noon prayer', cat: 'prayer' },
  { ar: 'عصر', tr: "'Asr", en: 'Afternoon prayer', cat: 'prayer' },
  { ar: 'مغرب', tr: 'Maghrib', en: 'Sunset prayer', cat: 'prayer' },
  { ar: 'عشاء', tr: "'Isha'", en: 'Night prayer', cat: 'prayer' },
  { ar: 'جمعة', tr: "Jumu'ah", en: 'Friday prayer', cat: 'prayer' },
  { ar: 'سجادة', tr: 'Sajjadah', en: 'Prayer rug', cat: 'prayer' },
  { ar: 'مسبحة', tr: 'Misbahah', en: 'Prayer beads', cat: 'prayer' },

  // ---------- nature
  { ar: 'شمس', tr: 'Shams', en: 'Sun', cat: 'nature' },
  { ar: 'قمر', tr: 'Qamar', en: 'Moon', cat: 'nature' },
  { ar: 'هلال', tr: 'Hilal', en: 'Crescent moon', cat: 'nature' },
  { ar: 'نجم', tr: 'Najm', en: 'Star', cat: 'nature' },
  { ar: 'سماء', tr: "Sama'", en: 'Sky', cat: 'nature' },
  { ar: 'أرض', tr: 'Ard', en: 'Earth', cat: 'nature' },
  { ar: 'بحر', tr: 'Bahr', en: 'Sea', cat: 'nature' },
  { ar: 'نهر', tr: 'Nahr', en: 'River', cat: 'nature' },
  { ar: 'ماء', tr: "Ma'", en: 'Water', cat: 'nature' },
  { ar: 'عين', tr: "'Ayn", en: 'Spring of water', cat: 'nature' },
  { ar: 'جبل', tr: 'Jabal', en: 'Mountain', cat: 'nature' },
  { ar: 'وادي', tr: 'Wadi', en: 'Valley', cat: 'nature' },
  { ar: 'صحراء', tr: "Sahra'", en: 'Desert', cat: 'nature' },
  { ar: 'رمل', tr: 'Raml', en: 'Sand', cat: 'nature' },
  { ar: 'حجر', tr: 'Hajar', en: 'Stone', cat: 'nature' },
  { ar: 'كهف', tr: 'Kahf', en: 'Cave', cat: 'nature' },
  { ar: 'بئر', tr: "Bi'r", en: 'Well', cat: 'nature' },
  { ar: 'جزيرة', tr: 'Jazirah', en: 'Island', cat: 'nature' },
  { ar: 'شجرة', tr: 'Shajarah', en: 'Tree', cat: 'nature' },
  { ar: 'نخلة', tr: 'Nakhlah', en: 'Palm tree', cat: 'nature' },
  { ar: 'زهرة', tr: 'Zahrah', en: 'Flower', cat: 'nature' },
  { ar: 'ورد', tr: 'Ward', en: 'Roses', cat: 'nature' },
  { ar: 'عشب', tr: "'Ushb", en: 'Grass', cat: 'nature' },
  { ar: 'مطر', tr: 'Matar', en: 'Rain', cat: 'nature' },
  { ar: 'سحاب', tr: 'Sahab', en: 'Clouds', cat: 'nature' },
  { ar: 'ريح', tr: 'Rih', en: 'Wind', cat: 'nature' },
  { ar: 'برق', tr: 'Barq', en: 'Lightning', cat: 'nature' },
  { ar: 'رعد', tr: "Ra'd", en: 'Thunder', cat: 'nature' },
  { ar: 'ثلج', tr: 'Thalj', en: 'Snow', cat: 'nature' },
  { ar: 'نار', tr: 'Nar', en: 'Fire', cat: 'nature' },
  { ar: 'ظل', tr: 'Dhill', en: 'Shade', cat: 'nature' },
  { ar: 'ليل', tr: 'Layl', en: 'Night', cat: 'nature' },
  { ar: 'نهار', tr: 'Nahar', en: 'Daytime', cat: 'nature' },
  { ar: 'صبح', tr: 'Subh', en: 'Morning', cat: 'nature' },
  { ar: 'حديد', tr: 'Hadid', en: 'Iron', cat: 'nature' },
  { ar: 'نحاس', tr: 'Nuhas', en: 'Copper', cat: 'nature' },
  { ar: 'لؤلؤ', tr: "Lu'lu'", en: 'Pearls', cat: 'nature' },

  // ---------- animals (most of them appear in the Quran)
  { ar: 'جمل', tr: 'Jamal', en: 'Camel', cat: 'animal' },
  { ar: 'ناقة', tr: 'Naqah', en: 'She-camel', cat: 'animal' },
  { ar: 'بقرة', tr: 'Baqarah', en: 'Cow', cat: 'animal' },
  { ar: 'فيل', tr: 'Fil', en: 'Elephant', cat: 'animal' },
  { ar: 'نحل', tr: 'Nahl', en: 'Bees', cat: 'animal' },
  { ar: 'نمل', tr: 'Naml', en: 'Ants', cat: 'animal' },
  { ar: 'عنكبوت', tr: "'Ankabut", en: 'Spider', cat: 'animal' },
  { ar: 'حوت', tr: 'Hut', en: 'Whale', cat: 'animal' },
  { ar: 'هدهد', tr: 'Hudhud', en: 'Hoopoe', cat: 'animal' },
  { ar: 'كلب', tr: 'Kalb', en: 'Dog', cat: 'animal' },
  { ar: 'حمار', tr: 'Himar', en: 'Donkey', cat: 'animal' },
  { ar: 'خيل', tr: 'Khayl', en: 'Horses', cat: 'animal' },
  { ar: 'غنم', tr: 'Ghanam', en: 'Sheep', cat: 'animal' },
  { ar: 'طير', tr: 'Tayr', en: 'Birds', cat: 'animal' },
  { ar: 'غراب', tr: 'Ghurab', en: 'Crow', cat: 'animal' },
  { ar: 'ذئب', tr: "Dhi'b", en: 'Wolf', cat: 'animal' },
  { ar: 'أسد', tr: 'Asad', en: 'Lion', cat: 'animal' },
  { ar: 'سمك', tr: 'Samak', en: 'Fish', cat: 'animal' },
  { ar: 'حمامة', tr: 'Hamamah', en: 'Dove', cat: 'animal' },
  { ar: 'فراشة', tr: 'Farashah', en: 'Butterfly', cat: 'animal' },
  { ar: 'بعوضة', tr: "Ba'udah", en: 'Mosquito', cat: 'animal' },
  { ar: 'ضفدع', tr: "Difda'", en: 'Frog', cat: 'animal' },
  { ar: 'جراد', tr: 'Jarad', en: 'Locusts', cat: 'animal' },
  { ar: 'ثعلب', tr: "Tha'lab", en: 'Fox', cat: 'animal' },
  { ar: 'غزال', tr: 'Ghazal', en: 'Gazelle', cat: 'animal' },
  { ar: 'صقر', tr: 'Saqr', en: 'Falcon', cat: 'animal' },
  { ar: 'قطة', tr: 'Qittah', en: 'Cat', cat: 'animal' },
  { ar: 'دجاجة', tr: 'Dajajah', en: 'Hen', cat: 'animal' },
  { ar: 'سلحفاة', tr: 'Sulahfah', en: 'Tortoise', cat: 'animal' },

  // ---------- food
  { ar: 'تمر', tr: 'Tamr', en: 'Dates', cat: 'food' },
  { ar: 'عسل', tr: "'Asal", en: 'Honey', cat: 'food' },
  { ar: 'لبن', tr: 'Laban', en: 'Milk', cat: 'food' },
  { ar: 'خبز', tr: 'Khubz', en: 'Bread', cat: 'food' },
  { ar: 'تين', tr: 'Tin', en: 'Figs', cat: 'food' },
  { ar: 'زيتون', tr: 'Zaytun', en: 'Olives', cat: 'food' },
  { ar: 'عنب', tr: "'Inab", en: 'Grapes', cat: 'food' },
  { ar: 'رمان', tr: 'Rumman', en: 'Pomegranate', cat: 'food' },
  { ar: 'موز', tr: 'Mawz', en: 'Bananas', cat: 'food' },
  { ar: 'تفاح', tr: 'Tuffah', en: 'Apples', cat: 'food' },
  { ar: 'لحم', tr: 'Lahm', en: 'Meat', cat: 'food' },
  { ar: 'ملح', tr: 'Milh', en: 'Salt', cat: 'food' },
  { ar: 'سكر', tr: 'Sukkar', en: 'Sugar', cat: 'food' },
  { ar: 'أرز', tr: 'Aruzz', en: 'Rice', cat: 'food' },
  { ar: 'عدس', tr: "'Adas", en: 'Lentils', cat: 'food' },
  { ar: 'بصل', tr: 'Basal', en: 'Onions', cat: 'food' },
  { ar: 'قهوة', tr: 'Qahwah', en: 'Coffee', cat: 'food' },
  { ar: 'شاي', tr: 'Shay', en: 'Tea', cat: 'food' },
  { ar: 'حلوى', tr: 'Halwa', en: 'Sweets', cat: 'food' },
  { ar: 'فاكهة', tr: 'Fakihah', en: 'Fruit', cat: 'food' },
  { ar: 'بيض', tr: 'Bayd', en: 'Eggs', cat: 'food' },
  { ar: 'جبن', tr: 'Jubn', en: 'Cheese', cat: 'food' },

  // ---------- family and people
  { ar: 'أب', tr: 'Ab', en: 'Father', cat: 'family' },
  { ar: 'أم', tr: 'Umm', en: 'Mother', cat: 'family' },
  { ar: 'أخ', tr: 'Akh', en: 'Brother', cat: 'family' },
  { ar: 'أخت', tr: 'Ukht', en: 'Sister', cat: 'family' },
  { ar: 'ابن', tr: 'Ibn', en: 'Son', cat: 'family' },
  { ar: 'بنت', tr: 'Bint', en: 'Daughter', cat: 'family' },
  { ar: 'جد', tr: 'Jadd', en: 'Grandfather', cat: 'family' },
  { ar: 'جدة', tr: 'Jaddah', en: 'Grandmother', cat: 'family' },
  { ar: 'عائلة', tr: "'A'ilah", en: 'Family', cat: 'family' },
  { ar: 'صديق', tr: 'Sadiq', en: 'Friend', cat: 'family' },
  { ar: 'جار', tr: 'Jar', en: 'Neighbour', cat: 'family' },
  { ar: 'طفل', tr: 'Tifl', en: 'Child', cat: 'family' },
  { ar: 'معلم', tr: "Mu'allim", en: 'Teacher', cat: 'family' },
  { ar: 'طالب', tr: 'Talib', en: 'Student', cat: 'family' },
  { ar: 'ضيف', tr: 'Dayf', en: 'Guest', cat: 'family' },
  { ar: 'يتيم', tr: 'Yatim', en: 'Orphan', cat: 'family' },
  { ar: 'مسافر', tr: 'Musafir', en: 'Traveller', cat: 'family' },
  { ar: 'ناس', tr: 'Nas', en: 'People', cat: 'family' },

  // ---------- body
  { ar: 'قلب', tr: 'Qalb', en: 'Heart', cat: 'body' },
  { ar: 'يد', tr: 'Yad', en: 'Hand', cat: 'body' },
  { ar: 'رأس', tr: "Ra's", en: 'Head', cat: 'body' },
  { ar: 'وجه', tr: 'Wajh', en: 'Face', cat: 'body' },
  { ar: 'أذن', tr: 'Udhun', en: 'Ear', cat: 'body' },
  { ar: 'فم', tr: 'Fam', en: 'Mouth', cat: 'body' },
  { ar: 'لسان', tr: 'Lisan', en: 'Tongue', cat: 'body' },
  { ar: 'رجل', tr: 'Rijl', en: 'Foot', cat: 'body' },
  { ar: 'صدر', tr: 'Sadr', en: 'Chest', cat: 'body' },

  // ---------- colours
  { ar: 'أبيض', tr: 'Abyad', en: 'White', cat: 'color' },
  { ar: 'أسود', tr: 'Aswad', en: 'Black', cat: 'color' },
  { ar: 'أحمر', tr: 'Ahmar', en: 'Red', cat: 'color' },
  { ar: 'أخضر', tr: 'Akhdar', en: 'Green', cat: 'color' },
  { ar: 'أصفر', tr: 'Asfar', en: 'Yellow', cat: 'color' },
  { ar: 'أزرق', tr: 'Azraq', en: 'Blue', cat: 'color' },

  // ---------- numbers
  { ar: 'واحد', tr: 'Wahid', en: 'One', cat: 'number' },
  { ar: 'اثنان', tr: 'Ithnan', en: 'Two', cat: 'number' },
  { ar: 'ثلاثة', tr: 'Thalathah', en: 'Three', cat: 'number' },
  { ar: 'أربعة', tr: "Arba'ah", en: 'Four', cat: 'number' },
  { ar: 'خمسة', tr: 'Khamsah', en: 'Five', cat: 'number' },
  { ar: 'ستة', tr: 'Sittah', en: 'Six', cat: 'number' },
  { ar: 'سبعة', tr: "Sab'ah", en: 'Seven', cat: 'number' },
  { ar: 'ثمانية', tr: 'Thamaniyah', en: 'Eight', cat: 'number' },
  { ar: 'تسعة', tr: "Tis'ah", en: 'Nine', cat: 'number' },
  { ar: 'عشرة', tr: "'Asharah", en: 'Ten', cat: 'number' },
  { ar: 'مئة', tr: "Mi'ah", en: 'Hundred', cat: 'number' },
  { ar: 'ألف', tr: 'Alf', en: 'Thousand', cat: 'number' },

  // ---------- things, places and time
  { ar: 'بيت', tr: 'Bayt', en: 'House', cat: 'thing' },
  { ar: 'باب', tr: 'Bab', en: 'Door', cat: 'thing' },
  { ar: 'قلم', tr: 'Qalam', en: 'Pen', cat: 'thing' },
  { ar: 'لوح', tr: 'Lawh', en: 'Tablet', cat: 'thing' },
  { ar: 'مفتاح', tr: 'Miftah', en: 'Key', cat: 'thing' },
  { ar: 'سراج', tr: 'Siraj', en: 'Lamp', cat: 'thing' },
  { ar: 'مصباح', tr: 'Misbah', en: 'Lantern', cat: 'thing' },
  { ar: 'فانوس', tr: 'Fanus', en: 'Ramadan lantern', cat: 'thing' },
  { ar: 'خيمة', tr: 'Khaymah', en: 'Tent', cat: 'thing' },
  { ar: 'سفينة', tr: 'Safinah', en: 'Ship', cat: 'thing' },
  { ar: 'طريق', tr: 'Tariq', en: 'Road', cat: 'thing' },
  { ar: 'سوق', tr: 'Suq', en: 'Market', cat: 'thing' },
  { ar: 'مدينة', tr: 'Madinah', en: 'City', cat: 'thing' },
  { ar: 'قرية', tr: 'Qaryah', en: 'Village', cat: 'thing' },
  { ar: 'قصر', tr: 'Qasr', en: 'Palace', cat: 'thing' },
  { ar: 'سور', tr: 'Sur', en: 'City wall', cat: 'thing' },
  { ar: 'جسر', tr: 'Jisr', en: 'Bridge', cat: 'thing' },
  { ar: 'ذهب', tr: 'Dhahab', en: 'Gold', cat: 'thing' },
  { ar: 'فضة', tr: 'Fiddah', en: 'Silver', cat: 'thing' },
  { ar: 'دينار', tr: 'Dinar', en: 'Gold coin', cat: 'thing' },
  { ar: 'درهم', tr: 'Dirham', en: 'Silver coin', cat: 'thing' },
  { ar: 'ثوب', tr: 'Thawb', en: 'Robe', cat: 'thing' },
  { ar: 'عمامة', tr: "'Imamah", en: 'Turban', cat: 'thing' },
  { ar: 'نعل', tr: "Na'l", en: 'Sandal', cat: 'thing' },
  { ar: 'كأس', tr: "Ka's", en: 'Cup', cat: 'thing' },
  { ar: 'ميزان', tr: 'Mizan', en: 'Scales', cat: 'thing' },
  { ar: 'حبل', tr: 'Habl', en: 'Rope', cat: 'thing' },
  { ar: 'عصا', tr: "'Asa", en: 'Staff', cat: 'thing' },
  { ar: 'خاتم', tr: 'Khatam', en: 'Ring', cat: 'thing' },
  { ar: 'ساعة', tr: "Sa'ah", en: 'Hour', cat: 'thing' },
  { ar: 'يوم', tr: 'Yawm', en: 'Day', cat: 'thing' },
  { ar: 'أسبوع', tr: "Usbu'", en: 'Week', cat: 'thing' },
  { ar: 'شهر', tr: 'Shahr', en: 'Month', cat: 'thing' },
  { ar: 'عام', tr: "'Am", en: 'Year', cat: 'thing' },

  // ---------- values and feelings
  { ar: 'صبر', tr: 'Sabr', en: 'Patience', cat: 'value' },
  { ar: 'صدق', tr: 'Sidq', en: 'Truthfulness', cat: 'value' },
  { ar: 'عدل', tr: "'Adl", en: 'Justice', cat: 'value' },
  { ar: 'علم', tr: "'Ilm", en: 'Knowledge', cat: 'value' },
  { ar: 'حكمة', tr: 'Hikmah', en: 'Wisdom', cat: 'value' },
  { ar: 'أمانة', tr: 'Amanah', en: 'Trust', cat: 'value' },
  { ar: 'وعد', tr: "Wa'd", en: 'Promise', cat: 'value' },
  { ar: 'حب', tr: 'Hubb', en: 'Love', cat: 'value' },
  { ar: 'فرح', tr: 'Farah', en: 'Joy', cat: 'value' },
  { ar: 'أمل', tr: 'Amal', en: 'Hope', cat: 'value' },
  { ar: 'شجاعة', tr: "Shaja'ah", en: 'Courage', cat: 'value' },
  { ar: 'كرم', tr: 'Karam', en: 'Generosity', cat: 'value' },
  { ar: 'تواضع', tr: "Tawadu'", en: 'Humility', cat: 'value' },
  { ar: 'رفق', tr: 'Rifq', en: 'Gentleness', cat: 'value' },
  { ar: 'عفو', tr: "'Afw", en: 'Forgiveness', cat: 'value' },
  { ar: 'وفاء', tr: "Wafa'", en: 'Loyalty', cat: 'value' },
  { ar: 'نية', tr: 'Niyyah', en: 'Intention', cat: 'value' },
  { ar: 'أدب', tr: 'Adab', en: 'Good manners', cat: 'value' },
  { ar: 'أخلاق', tr: 'Akhlaq', en: 'Good character', cat: 'value' },
  { ar: 'ابتسامة', tr: 'Ibtisamah', en: 'Smile', cat: 'value' },
  { ar: 'سكينة', tr: 'Sakinah', en: 'Calm', cat: 'value' },
  { ar: 'نظافة', tr: 'Nadhafah', en: 'Cleanliness', cat: 'value' },
  { ar: 'تعاون', tr: "Ta'awun", en: 'Helping each other', cat: 'value' },
  { ar: 'إخلاص', tr: 'Ikhlas', en: 'Sincerity', cat: 'value' },

  // ---------- names of the prophets and of Maryam (names only, never pictured)
  { ar: 'آدم', tr: 'Adam', en: 'Adam', cat: 'prophet' },
  { ar: 'إدريس', tr: 'Idris', en: 'Enoch', cat: 'prophet' },
  { ar: 'نوح', tr: 'Nuh', en: 'Noah', cat: 'prophet' },
  { ar: 'هود', tr: 'Hud', en: 'Hud', cat: 'prophet' },
  { ar: 'صالح', tr: 'Salih', en: 'Salih', cat: 'prophet' },
  { ar: 'إبراهيم', tr: 'Ibrahim', en: 'Abraham', cat: 'prophet' },
  { ar: 'لوط', tr: 'Lut', en: 'Lot', cat: 'prophet' },
  { ar: 'إسماعيل', tr: "Isma'il", en: 'Ishmael', cat: 'prophet' },
  { ar: 'إسحاق', tr: 'Ishaq', en: 'Isaac', cat: 'prophet' },
  { ar: 'يعقوب', tr: "Ya'qub", en: 'Jacob', cat: 'prophet' },
  { ar: 'يوسف', tr: 'Yusuf', en: 'Joseph', cat: 'prophet' },
  { ar: 'أيوب', tr: 'Ayyub', en: 'Job', cat: 'prophet' },
  { ar: 'شعيب', tr: "Shu'ayb", en: 'Shuaib', cat: 'prophet' },
  { ar: 'موسى', tr: 'Musa', en: 'Moses', cat: 'prophet' },
  { ar: 'هارون', tr: 'Harun', en: 'Aaron', cat: 'prophet' },
  { ar: 'داود', tr: 'Dawud', en: 'David', cat: 'prophet' },
  { ar: 'سليمان', tr: 'Sulayman', en: 'Solomon', cat: 'prophet' },
  { ar: 'إلياس', tr: 'Ilyas', en: 'Elijah', cat: 'prophet' },
  { ar: 'اليسع', tr: "Al-Yasa'", en: 'Elisha', cat: 'prophet' },
  { ar: 'يونس', tr: 'Yunus', en: 'Jonah', cat: 'prophet' },
  { ar: 'زكريا', tr: 'Zakariyya', en: 'Zechariah', cat: 'prophet' },
  { ar: 'يحيى', tr: 'Yahya', en: 'John', cat: 'prophet' },
  { ar: 'عيسى', tr: "'Isa", en: 'Jesus', cat: 'prophet' },
  { ar: 'مريم', tr: 'Maryam', en: 'Mary', cat: 'prophet' },
  { ar: 'محمد', tr: 'Muhammad', en: 'Muhammad', cat: 'prophet' },
  { ar: 'لقمان', tr: 'Luqman', en: 'Luqman the wise', cat: 'prophet' },

  // ---------- surah names
  { ar: 'الفاتحة', tr: 'Al-Fatihah', en: 'The Opening (1)', cat: 'surah' },
  { ar: 'البقرة', tr: 'Al-Baqarah', en: 'The Cow (2)', cat: 'surah' },
  { ar: 'الأنعام', tr: "Al-An'am", en: 'The Cattle (6)', cat: 'surah' },
  { ar: 'الرعد', tr: "Ar-Ra'd", en: 'The Thunder (13)', cat: 'surah' },
  { ar: 'النحل', tr: 'An-Nahl', en: 'The Bee (16)', cat: 'surah' },
  { ar: 'الكهف', tr: 'Al-Kahf', en: 'The Cave (18)', cat: 'surah' },
  { ar: 'طه', tr: 'Ta-Ha', en: 'Ta-Ha (20)', cat: 'surah' },
  { ar: 'الأنبياء', tr: "Al-Anbiya'", en: 'The Prophets (21)', cat: 'surah' },
  { ar: 'النور', tr: 'An-Nur', en: 'The Light (24)', cat: 'surah' },
  { ar: 'الفرقان', tr: 'Al-Furqan', en: 'The Criterion (25)', cat: 'surah' },
  { ar: 'النمل', tr: 'An-Naml', en: 'The Ants (27)', cat: 'surah' },
  { ar: 'العنكبوت', tr: "Al-'Ankabut", en: 'The Spider (29)', cat: 'surah' },
  { ar: 'الروم', tr: 'Ar-Rum', en: 'The Romans (30)', cat: 'surah' },
  { ar: 'سبأ', tr: "Saba'", en: 'Sheba (34)', cat: 'surah' },
  { ar: 'يس', tr: 'Ya-Sin', en: 'Ya-Sin (36)', cat: 'surah' },
  { ar: 'الشورى', tr: 'Ash-Shura', en: 'The Consultation (42)', cat: 'surah' },
  { ar: 'الحجرات', tr: 'Al-Hujurat', en: 'The Rooms (49)', cat: 'surah' },
  { ar: 'القمر', tr: 'Al-Qamar', en: 'The Moon (54)', cat: 'surah' },
  { ar: 'الحديد', tr: 'Al-Hadid', en: 'Iron (57)', cat: 'surah' },
  { ar: 'القلم', tr: 'Al-Qalam', en: 'The Pen (68)', cat: 'surah' },
  { ar: 'الفجر', tr: 'Al-Fajr', en: 'The Dawn (89)', cat: 'surah' },
  { ar: 'الشمس', tr: 'Ash-Shams', en: 'The Sun (91)', cat: 'surah' },
  { ar: 'الضحى', tr: 'Ad-Duha', en: 'The Morning Light (93)', cat: 'surah' },
  { ar: 'التين', tr: 'At-Tin', en: 'The Fig (95)', cat: 'surah' },
  { ar: 'العصر', tr: "Al-'Asr", en: 'Time (103)', cat: 'surah' },
  { ar: 'الفيل', tr: 'Al-Fil', en: 'The Elephant (105)', cat: 'surah' },
  { ar: 'قريش', tr: 'Quraysh', en: 'Quraysh (106)', cat: 'surah' },
  { ar: 'الكوثر', tr: 'Al-Kawthar', en: 'Abundance (108)', cat: 'surah' },
  { ar: 'الإخلاص', tr: 'Al-Ikhlas', en: 'Sincerity (112)', cat: 'surah' },
  { ar: 'الفلق', tr: 'Al-Falaq', en: 'The Daybreak (113)', cat: 'surah' },
  { ar: 'الناس', tr: 'An-Nas', en: 'Mankind (114)', cat: 'surah' },

  // ---------- places in the stories
  { ar: 'مكة', tr: 'Makkah', en: 'Makkah', cat: 'place' },
  { ar: 'المدينة', tr: 'Al-Madinah', en: 'Madinah', cat: 'place' },
  { ar: 'القدس', tr: 'Al-Quds', en: 'Jerusalem', cat: 'place' },
  { ar: 'مصر', tr: 'Misr', en: 'Egypt', cat: 'place' },
  { ar: 'زمزم', tr: 'Zamzam', en: 'The well of Zamzam', cat: 'place' },
  { ar: 'عرفات', tr: "'Arafat", en: 'Plain of Arafat', cat: 'place' },
  { ar: 'منى', tr: 'Mina', en: 'Valley of Mina', cat: 'place' },
  { ar: 'الصفا', tr: 'As-Safa', en: 'Hill of Safa', cat: 'place' },
  { ar: 'المروة', tr: 'Al-Marwah', en: 'Hill of Marwah', cat: 'place' },
  { ar: 'حراء', tr: "Hira'", en: 'Cave of Hira', cat: 'place' },
  { ar: 'ثور', tr: 'Thawr', en: 'Cave of Thawr', cat: 'place' },
  { ar: 'قباء', tr: "Quba'", en: 'Quba', cat: 'place' },
  { ar: 'بدر', tr: 'Badr', en: 'Wells of Badr', cat: 'place' },
  { ar: 'أحد', tr: 'Uhud', en: 'Mount Uhud', cat: 'place' },
  { ar: 'الجودي', tr: 'Al-Judi', en: 'Mount Judi', cat: 'place' },
  { ar: 'الطور', tr: 'At-Tur', en: 'Mount Sinai', cat: 'place' },
  { ar: 'إرم', tr: 'Iram', en: 'Iram of the Pillars', cat: 'place' },
  { ar: 'الحجر', tr: 'Al-Hijr', en: 'The Rocky Tract', cat: 'place' },
];

// ======================================================================================
// LETTER_NAMES — every character that appears in WORDS.
// ======================================================================================
export const LETTER_NAMES = {
  'ا': 'Alif', 'ب': 'Ba', 'ت': 'Ta', 'ث': 'Tha', 'ج': 'Jim', 'ح': 'Ha', 'خ': 'Kha',
  'د': 'Dal', 'ذ': 'Dhal', 'ر': 'Ra', 'ز': 'Zay', 'س': 'Sin', 'ش': 'Shin', 'ص': 'Sad',
  'ض': 'Dad', 'ط': 'Ta (heavy)', 'ظ': 'Dha (heavy)', 'ع': 'Ayn', 'غ': 'Ghayn', 'ف': 'Fa', 'ق': 'Qaf',
  'ك': 'Kaf', 'ل': 'Lam', 'م': 'Mim', 'ن': 'Nun', 'ه': 'Ha (soft)', 'و': 'Waw', 'ي': 'Ya',
  // Extra forms
  'ة': 'Ta marbutah', 'ى': 'Alif maqsurah', 'ء': 'Hamzah', 'أ': 'Alif with hamzah above',
  'إ': 'Alif with hamzah below', 'آ': 'Alif maddah', 'ؤ': 'Waw with hamzah', 'ئ': 'Ya with hamzah',
};

// The alphabet in order with each letter's number value (abjad), for a "letter of the day" or a quiz.
export const ALPHABET = [
  ['ا', 'Alif', 1], ['ب', 'Ba', 2], ['ت', 'Ta', 400], ['ث', 'Tha', 500], ['ج', 'Jim', 3], ['ح', 'Ha', 8],
  ['خ', 'Kha', 600], ['د', 'Dal', 4], ['ذ', 'Dhal', 700], ['ر', 'Ra', 200], ['ز', 'Zay', 7], ['س', 'Sin', 60],
  ['ش', 'Shin', 300], ['ص', 'Sad', 90], ['ض', 'Dad', 800], ['ط', 'Ta', 9], ['ظ', 'Dha', 900], ['ع', 'Ayn', 70],
  ['غ', 'Ghayn', 1000], ['ف', 'Fa', 80], ['ق', 'Qaf', 100], ['ك', 'Kaf', 20], ['ل', 'Lam', 30], ['م', 'Mim', 40],
  ['ن', 'Nun', 50], ['ه', 'Ha', 5], ['و', 'Waw', 6], ['ي', 'Ya', 10],
];

// Eastern Arabic numerals, used on the Wisdom tablets and anywhere a number is shown in Arabic.
export const NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

// ======================================================================================
// THE ROUTE — 25 places from the stories of the Quran, in story order.
// ======================================================================================
export const BIOME_LEN = 1950;
export const ROUTE = [
  'garden', 'judi', 'iram', 'hijr', 'fire', 'zamzam', 'canaan', 'egypt', 'sea', 'tur',
  'saba', 'nineveh', 'kahf', 'wall', 'palm', 'fil', 'hira', 'thawr', 'madinah', 'badr',
  'khandaq', 'hudaybiyyah', 'fath', 'arafat', 'kaaba',
];
export const routeStart = (id) => ROUTE.indexOf(id) * BIOME_LEN;
// The Arabic test gate: answer word questions at the edge of Madinah to enter the city.
export const GATE_AT = routeStart('madinah') - 40;
export const GATE_TEXT = {
  title: 'The gates of Madinah',
  sub: 'The people of Madinah welcome travellers. Answer 3 Arabic word questions to enter the city.',
  pass: 'Ahlan wa sahlan! Welcome to Madinah.',
  fail: 'Not yet. Keep collecting words and try again.',
};
// The end of the road: reach the Kaaba holding all ten Wisdoms to win.
export const FINISH_AT = ROUTE.length * BIOME_LEN;

// ======================================================================================
// WISDOMS — the ten collectibles needed to win (Torah Runner's COMMANDMENTS).
// Surat al-Isra 17:23-37 gives a famous list of guidance. Each glowing scroll is numbered ١ to ١٠.
// ======================================================================================
export const WISDOMS = [
  { place: 'iram', num: '١', ref: '17:23', en: 'Worship Allah alone', ar: 'التوحيد' },
  { place: 'fire', num: '٢', ref: '17:23-24', en: 'Be kind and gentle to your parents', ar: 'بر الوالدين' },
  { place: 'canaan', num: '٣', ref: '17:26', en: 'Give to relatives, the poor and travellers', ar: 'العطاء' },
  { place: 'sea', num: '٤', ref: '17:26-27', en: 'Do not waste', ar: 'لا إسراف' },
  { place: 'saba', num: '٥', ref: '17:32', en: 'Keep away from shameful things', ar: 'العفة' },
  { place: 'kahf', num: '٦', ref: '17:33', en: 'Never take a life unjustly', ar: 'حرمة النفس' },
  { place: 'palm', num: '٧', ref: '17:34', en: "Look after the orphan's wealth", ar: 'رعاية اليتيم' },
  { place: 'hira', num: '٨', ref: '17:34', en: 'Keep your promises', ar: 'الوفاء بالعهد' },
  { place: 'madinah', num: '٩', ref: '17:35', en: 'Weigh and measure fairly', ar: 'الميزان' },
  { place: 'hudaybiyyah', num: '١٠', ref: '17:37', en: 'Do not walk on the earth proudly', ar: 'التواضع' },
];
export const WISDOM_TEXT = {
  hud: 'Wisdoms',
  pickup: (n, w) => `Wisdom ${n} of 10 · ${w.en} · +100 dinars`,
  missed: 'Missed it? The scroll comes back a little further on.',
  finishShort: (n) => `You reached the Kaaba with ${n} of 10 Wisdoms. Start from the Garden and find all 10 to win.`,
  winTitle: 'You win! All Ten Wisdoms',
  winSub: (wins) => `You carried the ten Wisdoms of Surat al-Isra all the way to the Kaaba. +1,000 dinar victory bonus. Wins so far: ${wins}.`,
};

// The Five Pillars — a second set: one is shown on the loading screen each time, and finishing a run
// with all five power-up types used earns the "Five Pillars" badge.
export const PILLARS = [
  { ar: 'الشهادة', tr: 'Shahadah', en: 'Declaring faith in One God and His Messenger' },
  { ar: 'الصلاة', tr: 'Salah', en: 'Praying five times a day' },
  { ar: 'الزكاة', tr: 'Zakah', en: 'Giving to people in need' },
  { ar: 'الصوم', tr: 'Sawm', en: 'Fasting in Ramadan' },
  { ar: 'الحج', tr: 'Hajj', en: 'Pilgrimage to Makkah once in a lifetime, if you are able' },
];

// ======================================================================================
// BIOMES — every place on the route: names, banner line, story, colours and lighting.
// story: one or two sentences shown on the map and the loading card. ref: where it is in the Quran.
// ======================================================================================
export const BIOMES = [
  {
    id: 'garden', name: 'The First Garden', ar: 'الجنة', line: 'Where the story of people began',
    story: 'Adam and Hawwa lived in a beautiful garden and were told to stay away from one tree. They made a mistake, said sorry, and Allah forgave them.', ref: '2:35-37, 7:19-25',
    skyTop: 0x4f9de0, skyHorizon: 0xe4f6d8, skyBottom: 0xbfe3a6, fog: 0xd8efcc,
    ground: 0x7fbf5a, road: 0xd9e8b8, sun: 0xfffbe6,
    hemiSky: 0xf0ffe6, hemiGround: 0x5f8f3a, light: 0xfffcec, lightI: 2.2, hemiI: 1.35,
    sunDir: [-0.25, 0.6, -1], stars: 0,
  },
  {
    id: 'judi', name: 'The Ark at Mount Judi', ar: 'الجودي', line: 'Run before the flood rises',
    story: 'Nuh built a great ship on dry land while people laughed. The flood came, the ship carried the believers and the animals, and it came to rest on Mount Judi.', ref: '11:37-44',
    skyTop: 0x5b6f86, skyHorizon: 0xb8c4cc, skyBottom: 0x8a9a94, fog: 0xa9b6ba,
    ground: 0x6f7f5a, road: 0xa8a48c, sun: 0xe8f0f4,
    hemiSky: 0xd6e2ea, hemiGround: 0x4f5a44, light: 0xe6eef2, lightI: 1.7, hemiI: 1.3,
    sunDir: [0.3, 0.45, -1], stars: 0, rain: true,
  },
  {
    id: 'iram', name: 'Iram of the Pillars', ar: 'إرم ذات العماد', line: 'Tall towers in the sands of Ad',
    story: "The people of 'Ad built tall pillars and thought nobody was stronger. Hud warned them to be thankful, but they would not listen, and a fierce wind blew for seven nights.", ref: '89:6-8, 69:6-7',
    skyTop: 0x3f7cc4, skyHorizon: 0xf4c27e, skyBottom: 0xe0a65e, fog: 0xeab47a,
    ground: 0xd9a35e, road: 0xe8c48a, sun: 0xfff0c4,
    hemiSky: 0xffe0b0, hemiGround: 0xa8703a, light: 0xffeccc, lightI: 2.3, hemiI: 1.2,
    sunDir: [-0.4, 0.25, -1], stars: 0, dust: true,
  },
  {
    id: 'hijr', name: 'The Rock Houses of Thamud', ar: 'الحجر', line: 'Homes carved into the mountains',
    story: 'The people of Thamud carved houses out of rock. Salih showed them a special she-camel as a sign and asked them to share the water with her.', ref: '7:73-79, 15:80-84',
    skyTop: 0x3a86cc, skyHorizon: 0xf6d2a6, skyBottom: 0xd89a6a, fog: 0xe8b48c,
    ground: 0xc8835a, road: 0xe2b08a, sun: 0xffefd2,
    hemiSky: 0xffe2c8, hemiGround: 0x9a5a3a, light: 0xffeedc, lightI: 2.2, hemiI: 1.2,
    sunDir: [0.35, 0.3, -1], stars: 0,
  },
  {
    id: 'fire', name: 'The Cool Fire', ar: 'برد وسلام', line: 'Cool and safe',
    story: 'Ibrahim broke the idols of his town. Angry people threw him into a huge fire, and Allah said: be cool and safe. He walked out unharmed.', ref: '21:51-70',
    skyTop: 0x2c3e6a, skyHorizon: 0xff9a5a, skyBottom: 0xc05a3a, fog: 0xd8784e,
    ground: 0x8a5a3a, road: 0xc49a6a, sun: 0xffd2a0,
    hemiSky: 0xffc8a0, hemiGround: 0x6a3a2a, light: 0xffdcb8, lightI: 2.0, hemiI: 1.25,
    sunDir: [-0.3, 0.2, -1], stars: 0.3, embers: true,
  },
  {
    id: 'zamzam', name: 'The Valley of Zamzam', ar: 'زمزم', line: 'Seven runs between Safa and Marwah',
    story: "Hajar ran seven times between the hills of Safa and Marwah looking for water for baby Isma'il. The spring of Zamzam burst from the ground. Later Ibrahim and Isma'il raised the walls of the Kaaba here.", ref: '14:37, 2:125-127, 2:158',
    skyTop: 0x3f8ad0, skyHorizon: 0xf4dcae, skyBottom: 0xd8b98a, fog: 0xead2a6,
    ground: 0xc9a46e, road: 0xe6cfa2, sun: 0xfff6dc,
    hemiSky: 0xfff0d4, hemiGround: 0x9a7a4a, light: 0xfff4e0, lightI: 2.3, hemiI: 1.25,
    sunDir: [0.2, 0.55, -1], stars: 0,
  },
  {
    id: 'canaan', name: 'The Well of Canaan', ar: 'غيابة الجب', line: 'A caravan stops at the old well',
    story: "Yusuf's jealous brothers left him in a deep well. A passing caravan lowered a bucket, found him, and took him to Egypt.", ref: '12:8-20',
    skyTop: 0x4a92d8, skyHorizon: 0xe6e8c0, skyBottom: 0xb8c48a, fog: 0xd6dcb0,
    ground: 0xa8a86a, road: 0xd8cfa0, sun: 0xfffbe4,
    hemiSky: 0xf6f8e0, hemiGround: 0x7a7a44, light: 0xfffbea, lightI: 2.2, hemiI: 1.3,
    sunDir: [-0.2, 0.5, -1], stars: 0,
  },
  {
    id: 'egypt', name: 'The Storehouses of Egypt', ar: 'خزائن الأرض', line: 'Seven fat years, seven thin years',
    story: "The king dreamed of seven fat cows and seven thin ones. Yusuf explained it: store the grain in the good years to feed everyone in the hard years. He was put in charge of Egypt's storehouses.", ref: '12:43-55',
    skyTop: 0x3f86cf, skyHorizon: 0xf7c792, skyBottom: 0xe8c48e, fog: 0xf2cb9c,
    ground: 0xe6c48c, road: 0xeedbb4, sun: 0xfff1c9,
    hemiSky: 0xffe6c4, hemiGround: 0xb98a55, light: 0xfff0d8, lightI: 2.2, hemiI: 1.25,
    sunDir: [-0.35, 0.22, -1], stars: 0,
  },
  {
    id: 'sea', name: 'The Parted Sea', ar: 'فلق البحر', line: 'A dry path through the water',
    story: "Musa struck the sea with his staff and it split into two walls, each like a great mountain. The Children of Israel crossed on dry land while Pharaoh's army followed.", ref: '26:61-66, 20:77-78',
    skyTop: 0x2c6fb2, skyHorizon: 0xaee0e6, skyBottom: 0xa1cfcf, fog: 0xa6d6da,
    ground: 0xb99f78, road: 0xd2bc93, sun: 0xffffff,
    hemiSky: 0xd4f3ff, hemiGround: 0x6d918b, light: 0xf2fbff, lightI: 2.0, hemiI: 1.3,
    sunDir: [0.3, 0.55, -1], stars: 0, walls: { h: 13, x: 4.7 },
  },
  {
    id: 'tur', name: 'Mount Tur', ar: 'طور سيناء', line: 'Twelve springs and the tablets',
    story: 'In the desert, Musa struck a rock and twelve springs gushed out, one for each tribe. Shade clouds, manna and quails came, and on the mountain Musa received the Tablets.', ref: '2:57-60, 7:142-145',
    skyTop: 0x3c6fae, skyHorizon: 0xe8d2b4, skyBottom: 0xb89a7a, fog: 0xd6c0a4,
    ground: 0xa8866a, road: 0xd2b896, sun: 0xfff4e4,
    hemiSky: 0xfff0e0, hemiGround: 0x7a5a44, light: 0xfff2e4, lightI: 2.1, hemiI: 1.3,
    sunDir: [0.1, 0.5, -1], stars: 0,
  },
  {
    id: 'saba', name: 'The Kingdom of Saba', ar: 'سبأ', line: 'Two gardens and a great dam',
    story: "A hoopoe brought Sulayman news of the queen of Saba. Her land had two great gardens watered by the Marib dam. She later visited Sulayman's palace with its floor of shining glass.", ref: '27:20-44, 34:15-16',
    skyTop: 0x3a8ad6, skyHorizon: 0xe0f0d0, skyBottom: 0xa8cc8a, fog: 0xcfe4bc,
    ground: 0x8ab85a, road: 0xd8d0a8, sun: 0xfffbe8,
    hemiSky: 0xf0ffe8, hemiGround: 0x5a8a3a, light: 0xfffcf0, lightI: 2.2, hemiI: 1.35,
    sunDir: [-0.3, 0.55, -1], stars: 0,
  },
  {
    id: 'nineveh', name: 'The Shore of Nineveh', ar: 'نينوى', line: 'Out of the whale, onto the shore',
    story: 'Yunus was swallowed by a great fish. In the darkness he prayed and said sorry. The fish cast him onto the shore, a gourd plant gave him shade, and his whole city believed.', ref: '37:139-148, 21:87-88',
    skyTop: 0x2f7ab8, skyHorizon: 0xbfe6ee, skyBottom: 0x8cc4c8, fog: 0xa8d6dc,
    ground: 0xd8c89a, road: 0xe6dcb8, sun: 0xffffff,
    hemiSky: 0xe0f8ff, hemiGround: 0x7aa09a, light: 0xf4fcff, lightI: 2.0, hemiI: 1.35,
    sunDir: [0.35, 0.45, -1], stars: 0,
  },
  {
    id: 'kahf', name: 'The Cave of the Sleepers', ar: 'أصحاب الكهف', line: 'Three hundred and nine years of sleep',
    story: 'Young believers hid from a cruel king in a cave with their dog stretched at the entrance. Allah made them sleep for 309 years, and they woke in a changed world.', ref: '18:9-26',
    skyTop: 0x1c2450, skyHorizon: 0x5a5a8a, skyBottom: 0x3a3a5a, fog: 0x44466a,
    ground: 0x5a5466, road: 0x8a8494, sun: 0xd8dcff,
    hemiSky: 0xb8c0ff, hemiGround: 0x3a3444, light: 0xc8ccff, lightI: 1.3, hemiI: 1.2,
    sunDir: [0.2, 0.6, -1], stars: 1,
  },
  {
    id: 'wall', name: 'The Iron Wall', ar: 'سد ذي القرنين', line: 'Iron blocks and melted copper',
    story: 'Dhul-Qarnayn travelled east and west. Between two mountains he helped a people build a wall of iron blocks sealed with melted copper to keep out Yajuj and Majuj.', ref: '18:83-98',
    skyTop: 0x4a6a8a, skyHorizon: 0xc8ccd0, skyBottom: 0x8a8c90, fog: 0xaeb2b8,
    ground: 0x7a7468, road: 0xaaa498, sun: 0xf0f4ff,
    hemiSky: 0xe0e8f0, hemiGround: 0x54504a, light: 0xeef2f8, lightI: 1.9, hemiI: 1.3,
    sunDir: [-0.3, 0.4, -1], stars: 0, snow: true,
  },
  {
    id: 'palm', name: 'The Palm of Maryam', ar: 'جذع النخلة', line: 'Fresh dates and a stream',
    story: 'Maryam rested under a palm tree far from her people. She was told to shake the trunk, and fresh ripe dates fell. A stream flowed beneath her.', ref: '19:22-26',
    skyTop: 0x4a9ae0, skyHorizon: 0xf6e6c6, skyBottom: 0xd6c494, fog: 0xece0bc,
    ground: 0xcfb882, road: 0xe8dab2, sun: 0xfffaec,
    hemiSky: 0xfff6e4, hemiGround: 0x8a7a4a, light: 0xfff8ee, lightI: 2.2, hemiI: 1.3,
    sunDir: [0.25, 0.55, -1], stars: 0,
  },
  {
    id: 'fil', name: 'The Year of the Elephant', ar: 'عام الفيل', line: 'Birds in flocks over Makkah',
    story: 'Abraha marched on Makkah with elephants to destroy the Kaaba. Flocks of birds came carrying small stones, and the army was turned back. The Prophet was born that same year.', ref: '105:1-5',
    skyTop: 0x3a7ec8, skyHorizon: 0xf0d0a0, skyBottom: 0xc8a070, fog: 0xe0bc8c,
    ground: 0xb8905a, road: 0xdcc094, sun: 0xfff0d0,
    hemiSky: 0xffe8c8, hemiGround: 0x8a6a3a, light: 0xfff0dc, lightI: 2.2, hemiI: 1.25,
    sunDir: [-0.2, 0.45, -1], stars: 0,
  },
  {
    id: 'hira', name: 'The Mountain of Light', ar: 'جبل النور', line: 'Read! — the first word revealed',
    story: 'The Prophet Muhammad would think and pray alone in the cave of Hira on Jabal an-Nur. There the first verses came: Read, in the name of your Lord who created.', ref: '96:1-5',
    skyTop: 0x141c44, skyHorizon: 0x6a5a8a, skyBottom: 0x3a3456, fog: 0x4a4468,
    ground: 0x6a5a4a, road: 0x9a8a74, sun: 0xfff2d0,
    hemiSky: 0xd0c8ff, hemiGround: 0x4a3a30, light: 0xe8e0ff, lightI: 1.4, hemiI: 1.2,
    sunDir: [0.3, 0.55, -1], stars: 1,
  },
  {
    id: 'thawr', name: 'The Cave of Thawr', ar: 'غار ثور', line: 'A spider web and a dove\'s nest',
    story: 'On the Hijrah to Madinah, the Prophet and Abu Bakr hid in the cave of Thawr. The trackers turned away from the entrance. Do not be sad, Allah is with us.', ref: '9:40',
    skyTop: 0x3478c0, skyHorizon: 0xeec8a0, skyBottom: 0xb88a64, fog: 0xd8aa84,
    ground: 0xa47a54, road: 0xd0aa84, sun: 0xffecd4,
    hemiSky: 0xffe4cc, hemiGround: 0x7a5434, light: 0xffecdc, lightI: 2.1, hemiI: 1.25,
    sunDir: [-0.35, 0.35, -1], stars: 0,
  },
  {
    id: 'madinah', name: 'Madinah', ar: 'المدينة المنورة', line: 'The radiant city welcomes you',
    story: 'The people of Madinah came out singing to welcome the Prophet. The first mosque was built at Quba, then the Prophet\'s Mosque, among the date gardens.', ref: '9:108, 59:9',
    skyTop: 0x3c8ed8, skyHorizon: 0xe6f0d8, skyBottom: 0xb8cc98, fog: 0xd4e2c0,
    ground: 0x9ab86a, road: 0xe2dab8, sun: 0xfffbea,
    hemiSky: 0xf4ffe8, hemiGround: 0x6a8a44, light: 0xfffcf0, lightI: 2.2, hemiI: 1.35,
    sunDir: [0.2, 0.6, -1], stars: 0,
  },
  {
    id: 'badr', name: 'The Wells of Badr', ar: 'بدر', line: 'Few against many',
    story: 'A small group of believers met a much larger army at the wells of Badr. Rain fell to firm the sand under their feet, and they held their ground.', ref: '3:123, 8:9-11',
    skyTop: 0x3a74b8, skyHorizon: 0xf2caa0, skyBottom: 0xc89a6e, fog: 0xe0b48a,
    ground: 0xc09060, road: 0xdcb88e, sun: 0xffeed0,
    hemiSky: 0xffe6c8, hemiGround: 0x8a6440, light: 0xffeed8, lightI: 2.2, hemiI: 1.2,
    sunDir: [0.4, 0.3, -1], stars: 0,
  },
  {
    id: 'khandaq', name: 'The Trench', ar: 'الخندق', line: 'Dig, hold, and wait for the wind',
    story: 'Ten thousand riders came to attack Madinah. Following Salman\'s idea, everyone dug a long trench. After weeks of waiting, a cold wind blew down the camps and the armies went home.', ref: '33:9-25',
    skyTop: 0x34507a, skyHorizon: 0xb8c0c8, skyBottom: 0x7a7c80, fog: 0x9aa0a8,
    ground: 0x8a7a64, road: 0xb4a48c, sun: 0xe8eef8,
    hemiSky: 0xd8e0ea, hemiGround: 0x5a4c3a, light: 0xe6ecf4, lightI: 1.8, hemiI: 1.3,
    sunDir: [-0.3, 0.35, -1], stars: 0, wind: true,
  },
  {
    id: 'hudaybiyyah', name: 'The Treaty of Hudaybiyyah', ar: 'صلح الحديبية', line: 'A clear victory through peace',
    story: 'The believers wanted to visit the Kaaba, and Quraysh blocked the way. Instead of fighting, both sides signed a ten-year peace under an acacia tree. The Quran called it a clear victory.', ref: '48:1, 48:18',
    skyTop: 0x3c86d0, skyHorizon: 0xeee2c0, skyBottom: 0xc8b88a, fog: 0xe0d4b0,
    ground: 0xb8a674, road: 0xe0d2a8, sun: 0xfff8e4,
    hemiSky: 0xfff4e0, hemiGround: 0x84744a, light: 0xfff6e8, lightI: 2.2, hemiI: 1.3,
    sunDir: [0.15, 0.55, -1], stars: 0,
  },
  {
    id: 'fath', name: 'The Return to Makkah', ar: 'فتح مكة', line: 'Truth has come — and everyone is forgiven',
    story: 'The Prophet returned to Makkah with ten thousand people and almost no fighting. The idols around the Kaaba were removed and he forgave the people who had hurt him.', ref: '17:81, 110:1-3',
    skyTop: 0x3a88d4, skyHorizon: 0xf6e0b4, skyBottom: 0xd8c08e, fog: 0xecd6aa,
    ground: 0xc8aa74, road: 0xe8d6ac, sun: 0xfff6dc,
    hemiSky: 0xfff2d8, hemiGround: 0x947446, light: 0xfff4e2, lightI: 2.3, hemiI: 1.3,
    sunDir: [-0.2, 0.5, -1], stars: 0, banners: true,
  },
  {
    id: 'arafat', name: 'The Plain of Arafat', ar: 'عرفات', line: 'The Farewell Pilgrimage',
    story: 'At the Farewell Hajj, the Prophet spoke at Arafat: no Arab is better than a non-Arab and no colour better than another, except by good deeds, and every life and property is sacred.', ref: '5:3, 49:13',
    skyTop: 0x4a94dc, skyHorizon: 0xfaf0dc, skyBottom: 0xe2d4b4, fog: 0xf2e8d2,
    ground: 0xd6c6a0, road: 0xf0e6cc, sun: 0xffffff,
    hemiSky: 0xffffff, hemiGround: 0xa89a74, light: 0xfffaf0, lightI: 2.3, hemiI: 1.4,
    sunDir: [0.1, 0.7, -1], stars: 0, tents: true,
  },
  {
    id: 'kaaba', name: 'The Kaaba', ar: 'الكعبة المشرفة', line: 'The end of the road — the House of Allah',
    story: 'The first House built for worshipping Allah, raised by Ibrahim and Isma\'il. Pilgrims from every land walk around it together. You made it.', ref: '3:96-97, 22:26-27',
    skyTop: 0x1a2a5a, skyHorizon: 0x8a7aa8, skyBottom: 0x4a4466, fog: 0x5a5478,
    ground: 0xe8e4dc, road: 0xf4f2ee, sun: 0xfff6e0,
    hemiSky: 0xe8e0ff, hemiGround: 0x8a8478, light: 0xfff4e8, lightI: 1.9, hemiI: 1.45,
    sunDir: [0.2, 0.6, -1], stars: 0.8, lanterns: true,
  },
];

// ======================================================================================
// POWERS — power-ups (same keys as Torah Runner so the engine logic works unchanged).
// ======================================================================================
export const POWERS = {
  shield: { label: 'Crescent shield', color: '#7fd3ff', time: 12, about: 'A glowing crescent and star surrounds you. Obstacles cannot hurt you.' },
  jetpack: { label: 'Flying carpet', color: '#d84a5a', time: 4.5, about: 'A patterned carpet lifts you above everything. Grab the letters in the sky.' },
  sneakers: { label: 'Swift sandals', color: '#c8903a', time: 10, about: 'Leather sandals with gold straps for huge leaps.' },
  shabbat: { label: 'Sakinah', color: '#ffd36a', time: 6, about: 'A calm settles over the road and everything slows down.' },
  magnet: { label: 'Magnet', color: '#ff6b5a', time: 10, about: 'Dinars fly to you from every lane.' },
  double: { label: '2× dinars', color: '#ffd24a', time: 10, about: 'Every coin counts twice.' },
  shofar: { label: 'Desert wind', color: '#f3e3c3', time: 0, about: 'A strong wind sweeps the road ahead clear.' },
};

// ======================================================================================
// SHOP, UPGRADES, ACHIEVEMENTS — the currency is dinars.
// ======================================================================================
export const CURRENCY = { name: 'dinars', one: 'dinar', icon: 'dinar' };

export const SHOP = [
  { type: 'shield', name: 'Crescent shield', price: 150, about: 'Keep it, use it any time: double-tap, E, or the crescent button' },
  { type: 'magnet', name: 'Magnet', price: 150, about: 'Pulls dinars to you' },
  { type: 'double', name: '2× dinars', price: 200, about: 'Double dinars for 10 s' },
  { type: 'sneakers', name: 'Swift sandals', price: 200, about: 'Super-high jumps' },
  { type: 'jetpack', name: 'Flying carpet', price: 300, about: 'Fly over everything' },
  { type: 'heart', name: 'Extra heart', price: 250, about: 'One heart appears on the road in your next run' },
];

export const UPGRADES = [
  { id: 'speed', name: 'Swift feet', about: '+5% running speed per level', price: 1000, max: 5, icon: 'sneakers' },
  { id: 'mult', name: 'Barakah', about: '+0.25× dinars per level (up to 3×)', price: 270, max: 8, icon: 'double' },
  { id: 'jet', name: 'Longer carpet', about: '+1 s of flying carpet per level', price: 900, max: 5, icon: 'jetpack' },
  { id: 'magnet', name: 'Strong magnet', about: '+2 s of magnet per level', price: 700, max: 5, icon: 'magnet' },
  { id: 'shieldUp', name: 'Lasting crescent', about: '+3 s of Crescent shield per level', price: 700, max: 5, icon: 'shield' },
  { id: 'coin', name: 'Heavy dinars', about: '+1 dinar per coin per level', price: 1500, max: 3, icon: 'double' },
  { id: 'luck', name: 'Blessed path', about: 'Power-ups appear 12% more often per level', price: 1100, max: 5, icon: 'shofar' },
  { id: 'start', name: 'Head start', about: 'Start each run with 3 s of swift sandals per level', price: 600, max: 5, icon: 'sneakers' },
];

// Word milestones pay out once each.
export const ACHIEVEMENTS = [
  { words: 5, manna: 100, name: 'First steps' },
  { words: 10, manna: 200, name: 'Student of Arabic' },
  { words: 25, manna: 400, name: 'Reader' },
  { words: 50, manna: 750, name: 'Scholar' },
  { words: 100, manna: 1500, name: 'Keeper of words' },
  { words: 150, manna: 2000, name: 'Wise traveller' },
  { words: 200, manna: 3000, name: 'Lantern of knowledge' },
  { words: 336, manna: 5000, name: 'Hafiz of the road' },
];

// Badges for special runs (optional extra system).
export const BADGES = [
  { id: 'pillars', name: 'Five Pillars', about: 'Use five different power-ups in one run' },
  { id: 'hijrah', name: 'Hijrah', about: 'Run from the Cave of Thawr to Madinah without getting hit' },
  { id: 'zamzam', name: 'Seven runs', about: 'Change lanes 7 times in 7 seconds in the Valley of Zamzam' },
  { id: 'sleepers', name: '309', about: 'Collect 309 dinars in one run' },
  { id: 'birds', name: 'Flocks of birds', about: 'Pass the elephant army without being caught' },
  { id: 'trench', name: 'Hold the line', about: 'Cross the whole Trench using only slides and jumps' },
  { id: 'peace', name: 'Clear victory', about: 'Reach Hudaybiyyah without using the Crescent shield' },
  { id: 'wisdoms', name: 'All ten', about: 'Reach the Kaaba with all ten Wisdoms' },
];

// ======================================================================================
// OUTFITS — the runner's clothes in each place (thawb, sash, headwear, sandals).
// wrap = head cloth colour, band = its cord; cap = a round cap (taqiyah) instead.
// ======================================================================================
export const OUTFITS = {
  garden: { top: 0xf4f0e4, hem: 0x7fbf5a, belt: 0x8b5a2b, pants: 0xeee6d4, shoe: 0x8b5a2b, wrap: null, cap: 0xf4f0e4 },
  judi: { top: 0x8a7a64, hem: 0x5a4c3a, belt: 0x3a2a1c, pants: 0xb8a88c, shoe: 0x4a3420, wrap: 0xd8ccb4, band: 0x5a4c3a },
  iram: { top: 0xd89a4a, hem: 0xa86a2a, belt: 0x5a3418, pants: 0xeedcb8, shoe: 0x6b3e1e, wrap: 0xf4e8d0, band: 0xa86a2a },
  hijr: { top: 0xc86a4a, hem: 0x8a3a24, belt: 0x4a2414, pants: 0xe8d4bc, shoe: 0x5a3018, wrap: 0xf2e2cc, band: 0x8a3a24 },
  fire: { top: 0xf6f2ea, hem: 0xd8784e, belt: 0x8a3a24, pants: 0xeee4d4, shoe: 0x6b3e1e, wrap: 0xf6f2ea, band: 0xd8784e },
  zamzam: { top: 0xffffff, hem: 0xe8e2d6, belt: 0xc9a46e, pants: 0xf2ece0, shoe: 0x8b5a2b, wrap: 0xffffff, band: 0x2a2a2a },
  canaan: { top: 0x3a6ab0, hem: 0xc8303a, belt: 0xf0b93a, pants: 0xeadbb8, shoe: 0x6b3e1e, wrap: 0xf0e2c0, band: 0x3a6ab0 },
  egypt: { top: 0xf4efe4, hem: 0xf0b93a, belt: 0xf0b93a, pants: 0xeadbb8, shoe: 0x6b3e1e, wrap: 0xf4efe4, band: 0x2c4ea3 },
  sea: { top: 0xf2f2ee, hem: 0x2c6fd6, belt: 0x2c4ea3, pants: 0xdcd2bc, shoe: 0x6b3e1e, wrap: 0x7fd3ff, band: 0xffffff },
  tur: { top: 0xb8986a, hem: 0x7a5a3a, belt: 0x4a3420, pants: 0xe6d6b4, shoe: 0x5a3a1c, wrap: 0xf0e4cc, band: 0x7a5a3a },
  saba: { top: 0x2f8f4a, hem: 0xf0b93a, belt: 0xf0b93a, pants: 0xeadbb8, shoe: 0x6b3e1e, wrap: 0xf6eed8, band: 0x2f8f4a },
  nineveh: { top: 0x5ab0c8, hem: 0x2a6a8a, belt: 0x8b5a2b, pants: 0xeee6d4, shoe: 0x6b3e1e, wrap: 0xffffff, band: 0x2a6a8a },
  kahf: { top: 0x3a2f6a, hem: 0x2a2250, belt: 0xf0b93a, pants: 0x4a4060, shoe: 0x2a1e14, wrap: 0x2a2250, band: 0xf0b93a },
  wall: { top: 0x6a6e78, hem: 0xb87333, belt: 0x3a3a3a, pants: 0x8a8a8a, shoe: 0x2a2a2a, wrap: 0xd8d8dc, band: 0xb87333 },
  palm: { top: 0xf6f0e2, hem: 0x8a6a3a, belt: 0x8a6a3a, pants: 0xeee6d4, shoe: 0x6b3e1e, wrap: null, cap: 0xf6f0e2 },
  fil: { top: 0xe6d2a8, hem: 0x8a6a3a, belt: 0x5a3a1c, pants: 0xf0e6d0, shoe: 0x6b3e1e, wrap: 0xffffff, band: 0x5a3a1c },
  hira: { top: 0xffffff, hem: 0x2a2250, belt: 0x2a2250, pants: 0xf0ece4, shoe: 0x4a3420, wrap: 0xffffff, band: 0x2a2250 },
  thawr: { top: 0xb88a64, hem: 0x6a4428, belt: 0x3a2414, pants: 0xe6d4bc, shoe: 0x4a2c18, wrap: 0xe6d4bc, band: 0x6a4428 },
  madinah: { top: 0xffffff, hem: 0x2f8f4a, belt: 0x2f8f4a, pants: 0xf2f0ea, shoe: 0x6b3e1e, wrap: null, cap: 0xffffff },
  badr: { top: 0xe8d8b8, hem: 0x2a2a2a, belt: 0x2a2a2a, pants: 0xeee4d0, shoe: 0x4a3420, wrap: 0x2a2a2a, band: 0xe8d8b8 },
  khandaq: { top: 0x8a7a64, hem: 0x4a3c2c, belt: 0x2a2014, pants: 0xb8aa94, shoe: 0x3a2a18, wrap: 0xd8ccb4, band: 0x4a3c2c },
  hudaybiyyah: { top: 0xffffff, hem: 0xf2f2f2, belt: 0xd8d8d8, pants: 0xffffff, shoe: 0x8b5a2b, wrap: null, cap: null, ihram: true },
  fath: { top: 0xffffff, hem: 0x2f8f4a, belt: 0x1a1a1a, pants: 0xf2f0ea, shoe: 0x4a3420, wrap: 0x1a1a1a, band: 0xffffff },
  arafat: { top: 0xffffff, hem: 0xf4f4f4, belt: 0xe0e0e0, pants: 0xffffff, shoe: 0x8b5a2b, wrap: null, cap: null, ihram: true },
  kaaba: { top: 0xffffff, hem: 0xf4f4f4, belt: 0xe0e0e0, pants: 0xffffff, shoe: 0x8b5a2b, wrap: null, cap: null, ihram: true },
};
// ihram: true = two plain white sheets and bare head, as pilgrims wear for Hajj and Umrah.

// Shop cosmetics (Torah Runner's SKINS and KIPPAHS). Caps show a small crescent and star on top.
export const SKINS = [
  { id: 'white', name: 'Classic white thawb', top: 0xffffff, hem: 0xe8e8e8, price: 300 },
  { id: 'cream', name: 'Desert cream', top: 0xf0e2c0, hem: 0xd8c49a, price: 300 },
  { id: 'sky', name: 'Sky blue', top: 0x7fc8f0, hem: 0x4a9ac8, price: 300 },
  { id: 'green', name: 'Madinah green', top: 0x2f8f4a, hem: 0x1f6a34, price: 300 },
  { id: 'navy', name: 'Night navy', top: 0x1c2f6a, hem: 0x101c44, price: 400 },
  { id: 'maroon', name: 'Maroon', top: 0x7a1f2a, hem: 0x5a141c, price: 400 },
  { id: 'grey', name: 'Stone grey', top: 0x8a8c90, hem: 0x6a6c70, price: 300 },
  { id: 'gold', name: 'Golden thread', top: 0xf0b93a, hem: 0xc8902a, price: 600 },
];
export const CAPS = [
  { id: 'white', name: 'White taqiyah', color: 0xf6f6f2, rim: 0xd8d8d0, emblem: 0x2f8f4a, price: 150 },
  { id: 'crochet', name: 'Crochet cap', color: 0xf0e8d8, rim: 0xc8b898, emblem: 0x8a6a3a, price: 150 },
  { id: 'black', name: 'Black cap', color: 0x151515, rim: 0x151515, emblem: 0xf0b93a, price: 150 },
  { id: 'green', name: 'Green cap', color: 0x2f8f4a, rim: 0xf0b93a, emblem: 0xffffff, price: 200 },
  { id: 'navy', name: 'Navy cap', color: 0x1c2f6a, rim: 0xc0c4ca, emblem: 0xffffff, price: 200 },
  { id: 'red', name: 'Fez red', color: 0xb8202a, rim: 0x8a141c, emblem: 0xf0b93a, price: 250 },
  { id: 'gold', name: 'Embroidered gold', color: 0xf0b93a, rim: 0x8a5a0b, emblem: 0x2f8f4a, price: 400 },
  { id: 'shemagh', name: 'Red-check shemagh', color: 0xf4f0ea, rim: 0xc8202a, emblem: null, price: 500, check: 0xc8202a },
];

// ======================================================================================
// COINS — what the dinars look like in each era.
// ======================================================================================
export const COIN_ERA = {
  garden: 'pearl', judi: 'shell', iram: 'copper', hijr: 'copper', fire: 'copper', zamzam: 'copper',
  canaan: 'copper', egypt: 'scarab', sea: 'scarab', tur: 'copper', saba: 'saba', nineveh: 'shell',
  kahf: 'roman', wall: 'iron', palm: 'silver', fil: 'silver', hira: 'silver', thawr: 'silver',
  madinah: 'dirham', badr: 'dirham', khandaq: 'dirham', hudaybiyyah: 'dirham', fath: 'dinar', arafat: 'dinar', kaaba: 'dinar',
};
export const COIN_LOOKS = {
  pearl: { face: '#f6f2ec', rim: '#d8d0c4', label: '◯', about: 'A shining pearl' },
  shell: { face: '#f0d8c0', rim: '#c8a080', label: '≋', about: 'A cowrie shell, the oldest money' },
  copper: { face: '#c87a4a', rim: '#8a4a24', label: '•', about: 'A lump of copper' },
  scarab: { face: '#e8c060', rim: '#a8802a', label: '𓆣', about: 'An Egyptian gold scarab ring' },
  saba: { face: '#e0c070', rim: '#9a7a2a', label: '☼', about: 'A coin of Saba with a sun' },
  roman: { face: '#d8d8d8', rim: '#8a8a8a', label: 'R', about: 'A silver coin of the Roman cities' },
  iron: { face: '#8a8c90', rim: '#4a4c50', label: '▦', about: 'An iron token' },
  silver: { face: '#e4e6ea', rim: '#9a9ca2', label: '◇', about: 'Old Arabian silver' },
  dirham: { face: '#e6e8ec', rim: '#a0a4aa', label: 'درهم', about: 'A silver dirham' },
  dinar: { face: '#f0c040', rim: '#b8860b', label: 'دينار', about: 'A gold dinar' },
};

// ======================================================================================
// CHASERS — who runs after you in each place. kind = which model to use.
// Kinds: soldier, rider, chariot, elephant, raider, guard, animal, crowd.
// ======================================================================================
export const CHASERS = {
  garden: { kind: 'animal', name: 'A whispering shadow', taunt: 'Do not listen to the whispers!' },
  judi: { kind: 'crowd', name: 'The people who mocked the Ark', taunt: 'They laughed — now they chase!' },
  iram: { kind: 'soldier', name: "A tower guard of 'Ad", taunt: 'The giants of Iram are close!' },
  hijr: { kind: 'raider', name: 'The camel-hunters of Thamud', taunt: 'Protect the she-camel!' },
  fire: { kind: 'guard', name: "The king's fire-keepers", taunt: 'Run through the cool flames!' },
  zamzam: { kind: 'animal', name: 'A hungry desert jackal', taunt: 'Run like Hajar — seven times!' },
  canaan: { kind: 'raider', name: 'Caravan robbers', taunt: 'Keep the caravan moving!' },
  egypt: { kind: 'guard', name: 'The palace guards of Egypt', taunt: 'The guards are behind you!' },
  sea: { kind: 'chariot', name: "Pharaoh's charioteers", taunt: 'The sea is closing behind!' },
  tur: { kind: 'raider', name: 'Desert raiders', taunt: 'Drink from the springs and run!' },
  saba: { kind: 'soldier', name: 'Soldiers of Saba', taunt: 'The guards of the dam give chase!' },
  nineveh: { kind: 'crowd', name: 'The sailors of the ship', taunt: 'Over the dunes, onto the shore!' },
  kahf: { kind: 'soldier', name: "The cruel king's soldiers", taunt: 'Hide in the cave!' },
  wall: { kind: 'raider', name: 'Raiders of Yajuj and Majuj', taunt: 'Reach the iron wall!' },
  palm: { kind: 'animal', name: 'A runaway goat', taunt: 'Even the goats want dates!' },
  fil: { kind: 'elephant', name: "Abraha's elephant army", taunt: 'The elephants are coming!' },
  hira: { kind: 'crowd', name: 'Mocking chiefs of Quraysh', taunt: 'Keep climbing to the light!' },
  thawr: { kind: 'rider', name: 'The Quraysh trackers', taunt: 'The trackers are on your trail!' },
  madinah: { kind: 'rider', name: 'Desert raiders', taunt: 'Almost at the city gate!' },
  badr: { kind: 'soldier', name: 'The army of Quraysh', taunt: 'Hold firm — help is coming!' },
  khandaq: { kind: 'rider', name: 'The Confederate cavalry', taunt: 'Leap the trench!' },
  hudaybiyyah: { kind: 'rider', name: 'A Quraysh envoy racing to talk', taunt: 'A race for peace!' },
  fath: { kind: 'crowd', name: 'A cheering crowd', taunt: 'Makkah welcomes you home!' },
  arafat: { kind: 'crowd', name: 'A sea of pilgrims', taunt: 'Stay with the pilgrims!' },
  kaaba: { kind: 'crowd', name: 'Pilgrims walking together', taunt: 'Almost there!' },
};

// ======================================================================================
// LANDMARKS — six scenes per place, built from places and objects only.
// side: L/R/both. Each has a short caption shown when you pass it (optional "scene card").
// ======================================================================================
export const LANDMARKS = {
  garden: [
    { id: 'tree', name: 'The forbidden tree', about: 'One tree with dark leaves, roped off with a gentle glow' },
    { id: 'rivers', name: 'Rivers of the garden', about: 'Rivers of water, milk and honey (47:15)' },
    { id: 'fruit', name: 'Fruit trees', about: 'Trees heavy with pomegranates, grapes and dates' },
    { id: 'birds', name: 'Garden birds', about: 'White birds flying over flower beds' },
    { id: 'leaves', name: 'Fig leaves', about: 'A pile of wide fig leaves by a stream (7:22)' },
    { id: 'path', name: 'The path down', about: 'A shining stair leading down to the earth' },
  ],
  judi: [
    { id: 'ark', name: "Nuh's Ark", about: 'A huge wooden ship of planks and nails (54:13), resting on the peak' },
    { id: 'animals', name: 'Animals in pairs', about: 'Pairs of camels, sheep, lions and birds walking up a ramp' },
    { id: 'oven', name: 'The oven that overflowed', about: 'A clay oven gushing water, the sign the flood began (11:40)' },
    { id: 'waves', name: 'Waves like mountains', about: 'Grey waves rising high on both sides (11:42)' },
    { id: 'dove', name: 'Rain clouds parting', about: 'Dark clouds breaking up with sunbeams shining through' },
    { id: 'judi', name: 'The peak of Judi', about: 'A green mountaintop with the ark settled on it (11:44)' },
  ],
  iram: [
    { id: 'pillars', name: 'The tall pillars', about: 'Giant stone columns rising out of the dunes (89:7)' },
    { id: 'towers', name: 'Signal towers', about: 'Towers built on every high place (26:128)' },
    { id: 'palaces', name: 'Strong palaces', about: 'Fortresses built to last forever (26:129)' },
    { id: 'storm', name: 'The roaring wind', about: 'A wall of dust blowing for seven nights (69:6-7)' },
    { id: 'trunks', name: 'Fallen palm trunks', about: 'Hollow trunks lying in the sand (69:7)' },
    { id: 'dunes', name: 'Curving dunes', about: 'Wind-carved dunes, the Ahqaf (46:21)' },
  ],
  hijr: [
    { id: 'houses', name: 'Rock-cut houses', about: 'Doorways carved high in the sandstone cliffs (15:82)' },
    { id: 'camel', name: "The she-camel's water", about: 'A stone trough with two turns marked: her day and theirs (26:155)' },
    { id: 'plains', name: 'Palaces on the plains', about: 'Houses built on the flat land below (7:74)' },
    { id: 'gardens', name: 'Palm gardens', about: 'Date palms with soft, heavy clusters (26:148)' },
    { id: 'well', name: 'The great well', about: 'A deep stone well shared by the town' },
    { id: 'tombs', name: 'Silent facades', about: 'Empty carved fronts with no one home' },
  ],
  fire: [
    { id: 'idols', name: 'Broken idols', about: 'Toppled stone statues with one big one left standing (21:58)' },
    { id: 'axe', name: 'The axe', about: 'An axe hanging on the biggest idol' },
    { id: 'pyre', name: 'The great fire', about: 'Huge flames that glow blue and cool as you run past (21:69)' },
    { id: 'catapult', name: 'The catapult', about: 'A wooden throwing machine beside the fire' },
    { id: 'stars', name: 'Star, moon and sun', about: 'Ibrahim looked at each and said: I do not love things that set (6:76-79)' },
    { id: 'birds', name: 'Four birds', about: 'Four birds returning when called (2:260)' },
  ],
  zamzam: [
    { id: 'safa', name: 'Hill of Safa', about: 'A rocky hill with a path toward Marwah (2:158)' },
    { id: 'marwah', name: 'Hill of Marwah', about: 'The second hill, seven runs away' },
    { id: 'spring', name: 'The spring of Zamzam', about: 'Water bubbling from the sand, with a ring of stones' },
    { id: 'kaaba', name: 'Raising the House', about: 'Stone walls going up with a standing stone, Maqam Ibrahim (2:125-127)' },
    { id: 'birds', name: 'Birds circling', about: 'Birds circling where the water appeared' },
    { id: 'tents', name: 'The tribe of Jurhum', about: 'Travellers setting up tents beside the new water' },
  ],
  canaan: [
    { id: 'well', name: 'The deep well', about: 'A stone well with a rope and bucket (12:19)' },
    { id: 'caravan', name: 'The caravan', about: 'Camels with bundles of spice and cloth' },
    { id: 'shirt', name: 'The shirt', about: 'A shirt on a line — later it would bring back a father\'s sight (12:93)' },
    { id: 'wolf', name: 'The wolf story', about: 'Wolf tracks the brothers blamed (12:17)' },
    { id: 'stars', name: 'Eleven stars', about: 'Eleven stars, a sun and a moon in a dream (12:4)' },
    { id: 'tents', name: "Ya'qub's tents", about: 'Family tents among olive trees' },
  ],
  egypt: [
    { id: 'granary', name: 'The storehouses', about: 'Domed grain stores full of wheat (12:47-49)' },
    { id: 'cows', name: 'Seven fat cows', about: 'Seven fat cows and seven thin cows in a field (12:43)' },
    { id: 'wheat', name: 'Green and dry ears', about: 'Seven green ears of wheat and seven dry ones' },
    { id: 'cup', name: 'The king\'s cup', about: 'A golden measuring cup in a sack of grain (12:70-72)' },
    { id: 'prison', name: 'The prison', about: 'Stone cells where two young men told their dreams (12:36)' },
    { id: 'throne', name: 'The raised throne', about: 'A family arriving at a throne under a sun banner (12:100)' },
  ],
  sea: [
    { id: 'walls', name: 'Walls of water', about: 'Two towering walls of sea on each side (26:63)' },
    { id: 'staff', name: 'The staff', about: 'A wooden staff stuck in the sand where the sea split' },
    { id: 'path', name: 'The dry path', about: 'A road of dry seabed (20:77)' },
    { id: 'chariots', name: 'Empty chariots', about: 'Overturned chariot wheels at the edge of the water' },
    { id: 'fish', name: 'Fish in the walls', about: 'Fish swimming inside the standing water' },
    { id: 'shore', name: 'The far shore', about: 'Families resting on the safe shore' },
  ],
  tur: [
    { id: 'springs', name: 'Twelve springs', about: 'Twelve streams pouring from one rock (2:60)' },
    { id: 'clouds', name: 'Shade clouds', about: 'Soft clouds shading the camp (2:57)' },
    { id: 'manna', name: 'Manna and quails', about: 'White flakes on the ground and quails among the bushes (2:57)' },
    { id: 'bush', name: 'The fire on the mountain', about: 'A fire glowing on the slope in the sacred valley of Tuwa (20:10-12)' },
    { id: 'tablets', name: 'The tablets', about: 'Stone tablets with writing, resting on a rock (7:145)' },
    { id: 'calf', name: 'The golden calf', about: 'A golden calf, burned and scattered into the sea (20:97)' },
  ],
  saba: [
    { id: 'dam', name: 'The Marib dam', about: 'A great stone dam holding back a lake' },
    { id: 'gardens', name: 'Two gardens', about: 'Gardens to the right and to the left (34:15)' },
    { id: 'hoopoe', name: 'The hoopoe', about: 'A hoopoe bird with a crest perched on a scroll (27:20-28)' },
    { id: 'sun', name: 'The sun temple', about: 'A temple where people bowed to the sun (27:24)' },
    { id: 'throne', name: 'The queen\'s throne', about: 'A great throne, moved in the blink of an eye (27:38-40)' },
    { id: 'glass', name: 'The glass floor', about: 'A palace floor of glass that looked like water (27:44)' },
  ],
  nineveh: [
    { id: 'whale', name: 'The great fish', about: 'A huge whale tail rising from the waves' },
    { id: 'ship', name: 'The laden ship', about: 'A heavy ship sailing away (37:140)' },
    { id: 'gourd', name: 'The gourd plant', about: 'A broad gourd vine giving shade on the beach (37:146)' },
    { id: 'city', name: 'Nineveh', about: 'A city of a hundred thousand or more who believed (37:147)' },
    { id: 'pearls', name: 'Darkness of the sea', about: 'Deep-sea glows where the prayer was heard (21:87)' },
    { id: 'shore', name: 'The empty shore', about: 'Soft sand where the fish left Yunus' },
  ],
  kahf: [
    { id: 'cave', name: 'The cave', about: 'A cave whose opening the sun passes by (18:17)' },
    { id: 'dog', name: 'The faithful dog', about: 'A sleeping dog with its paws stretched at the entrance (18:18)' },
    { id: 'coins', name: 'Old silver coins', about: 'Coins too old for the market (18:19)' },
    { id: 'gardens', name: 'Two gardens', about: 'Two grape gardens with a river between (18:32-33)' },
    { id: 'meeting', name: 'Where two seas meet', about: 'A rock where a fish slipped back into the sea (18:60-63)' },
    { id: 'boat', name: 'The boat with a hole', about: 'A small boat with a plank missing (18:71)' },
  ],
  wall: [
    { id: 'wall', name: 'The iron wall', about: 'Iron blocks stacked between two cliffs (18:96)' },
    { id: 'copper', name: 'Molten copper', about: 'Glowing copper poured over the iron' },
    { id: 'bellows', name: 'The bellows', about: 'Big leather bellows blowing the fire' },
    { id: 'sunset', name: 'The sunset spring', about: 'The sun setting into a dark muddy spring (18:86)' },
    { id: 'sunrise', name: 'The open east', about: 'A land with no shelter from the rising sun (18:90)' },
    { id: 'mountains', name: 'Two mountains', about: 'Two steep peaks with the wall between them' },
  ],
  palm: [
    { id: 'palm', name: 'The palm trunk', about: 'A tall palm with ripe dates falling (19:25)' },
    { id: 'stream', name: 'The little stream', about: 'A stream trickling under the tree (19:24)' },
    { id: 'mihrab', name: 'The prayer room', about: 'A prayer niche with fresh fruit out of season (3:37)' },
    { id: 'dates', name: 'Fresh dates', about: 'Baskets of ripe dates' },
    { id: 'cradle', name: 'The cradle', about: 'A wooden cradle under the palms (19:29)' },
    { id: 'hill', name: 'The quiet hill', about: 'A high place with a spring (23:50)' },
  ],
  fil: [
    { id: 'elephants', name: 'The elephant army', about: 'Armoured elephants with tall saddles (105:1)' },
    { id: 'birds', name: 'Flocks of birds', about: 'Birds in flocks carrying little stones (105:3-4)' },
    { id: 'kaaba', name: 'The ancient House', about: 'The Kaaba standing safe in the valley' },
    { id: 'hills', name: 'The hills of Makkah', about: 'Families watching from the hilltops' },
    { id: 'chaff', name: 'Eaten straw', about: 'Fields of trampled straw (105:5)' },
    { id: 'caravans', name: 'Winter and summer caravans', about: 'Caravans of Quraysh going north and south (106:2)' },
  ],
  hira: [
    { id: 'cave', name: 'The cave of Hira', about: 'A small cave near the top of Jabal an-Nur' },
    { id: 'pen', name: 'The pen', about: 'A reed pen and ink: the first verses speak of the pen (96:4)' },
    { id: 'stars', name: 'The night sky', about: 'Bright stars over the valley' },
    { id: 'kaaba', name: 'Makkah below', about: 'The valley and the Kaaba seen from the mountain' },
    { id: 'blanket', name: 'The blanket', about: 'A warm blanket at home (74:1)' },
    { id: 'path', name: 'The steep path', about: 'A rocky path climbing toward the light' },
  ],
  thawr: [
    { id: 'web', name: 'The spider web', about: 'A web across the mouth of the cave' },
    { id: 'dove', name: 'The dove\'s nest', about: 'A dove sitting on her nest at the entrance' },
    { id: 'tracks', name: 'Lost tracks', about: 'Footprints that end at the rocks' },
    { id: 'camels', name: 'The waiting camels', about: 'Two camels and a guide waiting at night' },
    { id: 'milk', name: 'The sheep\'s milk', about: 'A shepherd bringing milk each evening' },
    { id: 'road', name: 'The coast road', about: 'The secret route along the Red Sea coast' },
  ],
  madinah: [
    { id: 'quba', name: 'The Quba mosque', about: 'The first mosque, built on mindfulness of God (9:108)' },
    { id: 'masjid', name: 'The Prophet\'s Mosque', about: 'A mosque of palm trunks and mud bricks with a palm-leaf roof' },
    { id: 'drums', name: 'The welcome', about: 'Children with daff drums singing on the rooftops' },
    { id: 'gardens', name: 'Date gardens', about: 'Shady gardens of date palms and wells' },
    { id: 'market', name: 'The market', about: 'Stalls with honest scales (83:1-3)' },
    { id: 'green', name: 'The green dome', about: 'A green dome among white minarets' },
  ],
  badr: [
    { id: 'wells', name: 'The wells of Badr', about: 'Stone wells in a sandy valley' },
    { id: 'rain', name: 'The rain', about: 'Light rain making the sand firm (8:11)' },
    { id: 'hut', name: 'The shade hut', about: 'A small palm-branch shelter on a rise' },
    { id: 'banners', name: 'Banners', about: 'Banners planted in the sand' },
    { id: 'pebbles', name: 'A handful of dust', about: 'A swirl of dust blowing across the valley (8:17)' },
    { id: 'dunes', name: 'The far dunes', about: 'Two camps on opposite edges of the valley' },
  ],
  khandaq: [
    { id: 'trench', name: 'The trench', about: 'A long deep ditch across the open side of the city' },
    { id: 'baskets', name: 'Digging baskets', about: 'Baskets of earth carried shoulder to shoulder' },
    { id: 'rock', name: 'The hard rock', about: 'A rock that broke apart with sparks' },
    { id: 'tents', name: 'The camps', about: 'Thousands of tents and horses beyond the trench' },
    { id: 'wind', name: 'The cold wind', about: 'A freezing wind knocking over pots and tents (33:9)' },
    { id: 'hills', name: 'Mount Sal\'', about: 'The hill where the defenders camped' },
  ],
  hudaybiyyah: [
    { id: 'tree', name: 'The tree of the pledge', about: 'An acacia tree where everyone made a promise (48:18)' },
    { id: 'treaty', name: 'The treaty', about: 'A scroll with ten years of peace written on it' },
    { id: 'camels', name: 'Gift camels', about: 'Decorated camels meant for the Kaaba' },
    { id: 'well', name: 'The well of Hudaybiyyah', about: 'A well that filled with water' },
    { id: 'ihram', name: 'Pilgrims in white', about: 'Rows of people in simple white cloth' },
    { id: 'road', name: 'The road home', about: 'A peaceful road leading back, with Makkah next year' },
  ],
  fath: [
    { id: 'army', name: 'Ten thousand lanterns', about: 'Thousands of campfires on the hills at night' },
    { id: 'idols', name: 'Falling idols', about: 'Idols toppling as the words are said: truth has come (17:81)' },
    { id: 'kaaba', name: 'The cleaned Kaaba', about: 'The Kaaba with its door open' },
    { id: 'bilal', name: 'The call from the roof', about: 'A call to prayer rising from the top of the Kaaba' },
    { id: 'forgive', name: 'Open doors', about: 'Open doors everywhere: anyone who stays home is safe' },
    { id: 'crowds', name: 'People in crowds', about: 'People entering the faith in crowds (110:2)' },
  ],
  arafat: [
    { id: 'mount', name: 'The Mount of Mercy', about: 'Jabal ar-Rahmah with a white pillar on top' },
    { id: 'tents', name: 'A city of tents', about: 'White tents as far as the eye can see' },
    { id: 'muzdalifah', name: 'Muzdalifah', about: 'Pilgrims gathering small pebbles under the stars' },
    { id: 'mina', name: 'Mina', about: 'Three stone pillars in the valley' },
    { id: 'equal', name: 'Nations and tribes', about: 'A banner: We made you nations and tribes so you may know one another (49:13)' },
    { id: 'water', name: 'Water for pilgrims', about: 'Water stations along the road' },
  ],
  kaaba: [
    { id: 'kaaba', name: 'The Kaaba', about: 'The black-draped cube with its gold-embroidered band' },
    { id: 'stone', name: 'The Black Stone', about: 'The corner stone set in silver' },
    { id: 'maqam', name: 'Maqam Ibrahim', about: 'The stone with footprints, under a golden cover (2:125)' },
    { id: 'zamzam', name: 'Zamzam water', about: 'Cool water fountains for everyone' },
    { id: 'tawaf', name: 'The circling', about: 'Rings of pilgrims walking around together' },
    { id: 'minarets', name: 'Minarets', about: 'Tall minarets glowing at night' },
  ],
};

// ======================================================================================
// SCENERY — roadside props for each place (Torah Runner's SCENERY), most common first.
// ======================================================================================
export const SCENERY = {
  garden: ['fruitTree', 'flowerBed', 'stream', 'grapeVine', 'palm', 'bird'],
  judi: ['rock', 'puddle', 'plank', 'deadTree', 'sheep', 'rainCloud'],
  iram: ['pillar', 'dune', 'brokenColumn', 'palmTrunk', 'tumbleweed', 'tower'],
  hijr: ['cliffDoor', 'rock', 'palm', 'trough', 'camel', 'well'],
  fire: ['brokenIdol', 'brazier', 'logPile', 'palm', 'rock', 'ember'],
  zamzam: ['rock', 'stoneRing', 'tent', 'acacia', 'waterSkin', 'bird'],
  canaan: ['olive', 'well', 'camel', 'spiceBundle', 'tent', 'sheep'],
  egypt: ['granary', 'wheat', 'cow', 'obelisk', 'palm', 'reeds'],
  sea: ['seaweed', 'coral', 'shell', 'fish', 'rock', 'wheel'],
  tur: ['acacia', 'spring', 'rock', 'quail', 'bush', 'tent'],
  saba: ['garden', 'canal', 'damStone', 'incense', 'palm', 'hoopoe'],
  nineveh: ['dune', 'gourd', 'shell', 'boat', 'palm', 'net'],
  kahf: ['rock', 'cave', 'pine', 'grapeVine', 'lantern', 'owl'],
  wall: ['ironBlock', 'anvil', 'bellows', 'pine', 'rock', 'snowPile'],
  palm: ['palm', 'stream', 'dateBasket', 'reeds', 'rock', 'flower'],
  fil: ['acacia', 'rock', 'saddle', 'strawPile', 'tent', 'bird'],
  hira: ['rock', 'thornBush', 'lantern', 'starPile', 'path', 'goat'],
  thawr: ['rock', 'thornBush', 'acacia', 'camel', 'waterSkin', 'dove'],
  madinah: ['palm', 'well', 'mudHouse', 'market', 'lantern', 'daffDrum'],
  badr: ['well', 'banner', 'dune', 'rock', 'palmShelter', 'horse'],
  khandaq: ['dirtPile', 'basket', 'spade', 'tent', 'rock', 'brokenPot'],
  hudaybiyyah: ['acacia', 'camel', 'tent', 'well', 'scroll', 'rock'],
  fath: ['banner', 'lantern', 'campfire', 'mudHouse', 'palm', 'brokenIdol'],
  arafat: ['tent', 'waterStation', 'umbrella', 'pillar', 'rock', 'sign'],
  kaaba: ['lamp', 'minaret', 'column', 'zamzamFountain', 'carpet', 'dove'],
};

// ======================================================================================
// OBSTACLE_NAMES — what each obstacle type is called and looks like in each place.
// low = jump over, high = slide under, tall = change lane, roll = rolling hazard.
// ======================================================================================
export const OBSTACLE_NAMES = {
  garden: { low: 'Fallen branch', high: 'Grape arch', tall: 'Fruit tree', roll: 'Rolling pomegranate' },
  judi: { low: 'Loose planks', high: 'Hanging ropes', tall: 'Stack of timber', roll: 'Rolling barrel' },
  iram: { low: 'Broken column', high: 'Stone lintel', tall: 'Pillar of Iram', roll: 'Rolling capital stone' },
  hijr: { low: 'Water trough', high: 'Carved doorway', tall: 'Rock face', roll: 'Rolling boulder' },
  fire: { low: 'Smouldering log', high: 'Hot-coal beam', tall: 'Toppled idol', roll: 'Rolling firewood' },
  zamzam: { low: 'Stone ring', high: 'Tent rope', tall: 'Rock outcrop', roll: 'Rolling water jar' },
  canaan: { low: 'Spice bundle', high: 'Well beam and rope', tall: 'Loaded camel', roll: 'Rolling bucket' },
  egypt: { low: 'Grain sacks', high: 'Granary arch', tall: 'Grain store', roll: 'Rolling cart wheel' },
  sea: { low: 'Coral ridge', high: 'Arching wave', tall: 'Wall of water', roll: 'Chariot wheel' },
  tur: { low: 'Quail nest', high: 'Rock arch', tall: 'Boulder', roll: 'Rolling stone' },
  saba: { low: 'Canal edge', high: 'Garden trellis', tall: 'Dam block', roll: 'Rolling incense pot' },
  nineveh: { low: 'Fishing net', high: 'Gourd vine', tall: 'Beached boat', roll: 'Rolling shell' },
  kahf: { low: 'Stone ledge', high: 'Cave arch', tall: 'Cave wall', roll: 'Rolling rock' },
  wall: { low: 'Iron bar', high: 'Copper chute', tall: 'Iron block', roll: 'Rolling iron ingot' },
  palm: { low: 'Date basket', high: 'Palm fronds', tall: 'Palm trunk', roll: 'Rolling basket' },
  fil: { low: 'Saddle', high: 'Elephant howdah pole', tall: 'Armoured elephant', roll: 'Rolling shield' },
  hira: { low: 'Rock step', high: 'Overhang', tall: 'Cliff', roll: 'Rolling stone' },
  thawr: { low: 'Thorn bush', high: 'Low cave roof', tall: 'Boulder', roll: 'Rolling stone' },
  madinah: { low: 'Market crate', high: 'Palm-leaf awning', tall: 'Mud-brick wall', roll: 'Rolling date barrel' },
  badr: { low: 'Well wall', high: 'Banner line', tall: 'Supply camel', roll: 'Rolling shield' },
  khandaq: { low: 'Dirt mound', high: 'Plank bridge', tall: 'Earth wall', roll: 'Rolling basket' },
  hudaybiyyah: { low: 'Saddle pack', high: 'Acacia branch', tall: 'Decorated camel', roll: 'Rolling water skin' },
  fath: { low: 'Fallen idol', high: 'Banner arch', tall: 'Stone gate', roll: 'Rolling idol head' },
  arafat: { low: 'Tent pegs', high: 'Shade umbrella', tall: 'Tent', roll: 'Rolling water bottle' },
  kaaba: { low: 'Carpet roll', high: 'Lamp chain', tall: 'Marble column', roll: 'Rolling zamzam cooler' },
};

// ======================================================================================
// PHRASES — short everyday Islamic phrases. Use them for popups (a new word, a streak,
// a near miss) and for a "phrase of the run" on the loading screen.
// ======================================================================================
export const PHRASES = [
  { ar: 'بسم الله', tr: 'Bismillah', en: 'In the name of Allah', when: 'run starts' },
  { ar: 'الحمد لله', tr: 'Alhamdulillah', en: 'All praise is for Allah', when: 'word complete' },
  { ar: 'سبحان الله', tr: 'Subhanallah', en: 'Glory be to Allah', when: 'see a landmark' },
  { ar: 'الله أكبر', tr: 'Allahu Akbar', en: 'Allah is the Greatest', when: 'Wisdom collected' },
  { ar: 'ما شاء الله', tr: "Masha'Allah", en: 'What Allah has willed', when: 'new high score' },
  { ar: 'إن شاء الله', tr: "In sha'Allah", en: 'If Allah wills', when: 'try again' },
  { ar: 'جزاك الله خيرا', tr: 'Jazakallahu khayran', en: 'May Allah reward you with good', when: 'shop purchase' },
  { ar: 'السلام عليكم', tr: "As-salamu 'alaykum", en: 'Peace be upon you', when: 'main menu' },
  { ar: 'أستغفر الله', tr: 'Astaghfirullah', en: 'I ask Allah for forgiveness', when: 'hit an obstacle' },
  { ar: 'لا حول ولا قوة إلا بالله', tr: 'La hawla wa la quwwata illa billah', en: 'There is no power except with Allah', when: 'last heart' },
  { ar: 'توكلت على الله', tr: "Tawakkaltu 'ala Allah", en: 'I trust in Allah', when: 'revive' },
  { ar: 'بارك الله فيك', tr: 'Barakallahu fik', en: 'May Allah bless you', when: 'quiz passed' },
  { ar: 'أهلا وسهلا', tr: 'Ahlan wa sahlan', en: 'Welcome', when: 'enter a new place' },
  { ar: 'مرحبا', tr: 'Marhaba', en: 'Hello', when: 'any time' },
  { ar: 'شكرا', tr: 'Shukran', en: 'Thank you', when: 'any time' },
  { ar: 'عيد مبارك', tr: "'Eid Mubarak", en: 'Blessed Eid', when: 'Eid days' },
  { ar: 'رمضان كريم', tr: 'Ramadan Karim', en: 'Generous Ramadan', when: 'Ramadan days' },
];

// Facts for the loading card: one random fact each time the game starts.
export const FACTS = [
  'The Quran has 114 surahs and is divided into 30 parts called juz\'.',
  'The first word revealed was "Iqra" — Read! (96:1)',
  'Surat al-Ikhlas is about one third of the Quran in meaning, in a famous hadith.',
  'The Arabic alphabet has 28 letters, written from right to left.',
  'Most Arabic letters change shape depending on where they are in a word.',
  'Surah 27 is named after the ants, who warned each other to get out of the way (27:18).',
  'Bees are told to build their homes in mountains, trees and what people build (16:68).',
  'The spider\'s house is called the weakest of houses (29:41).',
  'Zamzam has given water to pilgrims for thousands of years.',
  'The Sleepers of the Cave slept for 300 years, plus nine (18:25).',
  'Only one woman is named in the Quran: Maryam. A whole surah carries her name.',
  'Surat at-Tawbah is the only surah that does not begin with Bismillah.',
  'The Treaty of Hudaybiyyah is called "a clear victory", even though no battle was fought (48:1).',
  'The Kaaba is said to be the first House set up for people to worship Allah (3:96).',
  'The hoopoe, the ant, the crow, the spider and the bee all have a part in Quran stories.',
  'Arabic numbers 0-9 travelled from India through the Arab world to Europe.',
  'The word "Islam" comes from the same root as "salam", peace.',
  'Dates and water are a common way to break the fast in Ramadan.',
];

// ======================================================================================
// UI_TEXT — every on-screen sentence in Torah Runner's index.html and ui.js, re-themed.
// ======================================================================================
export const UI_TEXT = {
  title: 'Quran Runner',
  eyebrow: 'قرآن',
  lede: 'Run through the stories of the Quran: the Ark of Nuh, the cool fire, the well of Yusuf, the parted sea, the cave of the Sleepers, the Year of the Elephant and the Hijrah to Madinah, all the way to the Kaaba. Catch the golden letters to write Arabic words in your notebook. Find all ten Wisdoms and reach the Kaaba to win.',
  bestNone: 'No runs yet. The road starts in the First Garden.',
  scrollTitle: 'My notebook',
  scrollCount: (n, total) => `${n} of ${total} words written`,
  scrollLocked: 'Not yet written',
  wordKicker: 'Word complete',
  wordMeans: (w) => `${w.tr} means ${w.en.toLowerCase()}`,
  wordCount: (n, total) => `${n} of ${total} words in your notebook`,
  keepRunning: 'Keep running',
  catchNext: (ch, name) => `Catch ${ch} ${name}`,
  newPlace: (bonus) => `New place! +${bonus}`,
  streak: (m) => `Streak ×${m}!`,
  quizTitle: 'Second chance · word quiz',
  quizSub: (need, n) => `Get ${need} of ${n} right to keep running.`,
  quizPass: 'Barakallahu fik! Keep running.',
  quizFail: 'Not this time. Every word you learn helps next run.',
  rideTitle: 'All aboard!',
  rideSub: (place) => `Riding the camel caravan back to ${place}`,
  rideSkip: 'Skip ride',
  overTitle: (place) => `You reached ${place}`,
  overWords: (n) => `You wrote ${n} Arabic word${n === 1 ? '' : 's'} in your notebook.`,
  overNone: 'Catch the golden letters in order to write a word in your notebook.',
  shopTitle: 'Dinar market',
  shopLede: 'Upgrades last forever. Power-ups switch on at the start of your next run. Every new word you spell earns bonus dinars.',
  mapTitle: 'Journey map',
  mapLede: 'Start a run from any place you have reached, or unlock a place ahead with dinars.',
  hsTitle: 'High scores',
  hsDevice: 'Your 10 best runs on this device.',
  hsEveryone: 'Everyone who plays this page.',
  tipRotate: 'Tip: turn your phone sideways for a wider view.',
  hintTouch: '<b>Swipe</b> left or right to change lanes · <b>up</b> to jump · <b>down</b> to slide',
  hintKeys: '<b>← →</b> change lanes · <b>↑</b> or <b>Space</b> jump · <b>↓</b> slide · <b>P</b> pause',
  countdown: ['٣', '٢', '١', 'Yalla!'],
};

// The train ride back is a camel caravan here; these lines scroll by during the ride.
export const RIDE_LINES = [
  'The caravan sets off at sunset…',
  'Past the palm groves and the wells…',
  'Under the desert stars…',
  'The guide knows every road…',
  'Almost back to the start…',
];

// Music: tunes to use in place of Hava Nagila and the freylekh (synthesised, no vocals).
// Many families prefer drum-only (daff) music, so the game should offer a "daff only" setting.
export const MUSIC = {
  scales: { hijaz: [0, 1, 4, 5, 7, 8, 10], bayati: [0, 1.5, 3, 5, 7, 8, 10], rast: [0, 2, 3.5, 5, 7, 9, 10.5] },
  tracks: [
    { id: 'caravan', name: 'Desert caravan', scale: 'hijaz', bpm: 112, instruments: ['oud', 'ney', 'daff'] },
    { id: 'madinah', name: 'Welcome to Madinah', scale: 'rast', bpm: 100, instruments: ['daff', 'claps'] },
    { id: 'night', name: 'Night of stars', scale: 'bayati', bpm: 84, instruments: ['ney', 'daff'] },
  ],
  daffOnlyOption: true,
};

// ======================================================================================
// Compatibility with Torah Runner's engine (it reads `he`). Remove once the engine reads `ar`.
// Also exported under the old names so imports keep working.
// ======================================================================================
for (const w of WORDS) w.he = w.ar;
for (const b of BIOMES) b.he = b.ar;
for (const w of WISDOMS) w.he = w.ar;
export const COMMANDMENTS = WISDOMS;
export const KIPPAHS = CAPS;
