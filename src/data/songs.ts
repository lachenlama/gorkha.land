export type Group = "ours" | "rain" | "love" | "home" | "selo";

export type SongStory = {
  ne: string;
  en: string;
  author: string;
  authorNe: string;
  journey: string;
  journeyNe: string;
};

export type Song = {
  id: string;
  yt: string; // YouTube video id
  title: string;
  titleNe: string;
  artist: string;
  artistNe: string;
  group: Group;
  story?: SongStory;
};

// "Ours" goes first because the point of the site is that this place made things.
export const GROUPS: { id: Group; ne: string; en: string }[] = [
  { id: "ours", ne: "पहाडको आफ्नै", en: "Ours" },
  { id: "rain", ne: "बर्षा र झरी", en: "Rain" },
  { id: "love", ne: "माया र सम्झना", en: "Love" },
  { id: "home", ne: "घरको याद", en: "Home" },
  { id: "selo", ne: "सेलो र लोक", en: "Selo & Folk" },
];

const base: Song[] = [
  {
    id: "nau-lakh",
    yt: "PhlkhbBwXbI",
    title: "Nau Lakh Tara",
    titleNe: "नौ लाख तारा",
    artist: "Amber Gurung",
    artistNe: "अम्बर गुरुङ",
    group: "ours",
    story: {
      ne: "१९६१ मा कोलकातामा रेकर्ड भएर जब आकाशवाणी खरसाङमा पहिलो पटक गुञ्जियो, सारा चियाकमान चुपचाप सुनेको थियो। बुबा भन्नुहुन्थ्यो— यो गीत मात्र होइन, हाम्रो छातीको आवाज हो।",
      en: "Recorded in Kolkata in 1961. When it first played on Akashvani Kurseong, whole tea gardens stopped to listen around single battery-powered valve radios.",
      author: "D.B. Rai",
      authorNe: "डी.बी. राई",
      journey: "Kurseong → Siliguri",
      journeyNe: "खरसाङ → सिलगढी",
    },
  },
  {
    id: "pohor-saal",
    yt: "8uIaRZrB6Jk",
    title: "Pohor Saal Khusi",
    titleNe: "पोहोर साल खुशी",
    artist: "Aruna Lama",
    artistNe: "अरुणा लामा",
    group: "ours",
    story: {
      ne: "दार्जीलिङको चिसो बर्खामा चिया पिउँदै यो गीत सुन्दा जोसुकैको मन भरिएर आउँछ। आमाले जहिले पनि कासेट पल्टाउँदा यही साइड लाउनुहुन्थ्यो।",
      en: "Monsoon afternoons in Chowrasta, listening to rain drumming on rusted tin roofs. Aama would always flip the cassette back to this track.",
      author: "Pemba Sherpa",
      authorNe: "पेम्बा शेर्पा",
      journey: "Darjeeling → Bengaluru",
      journeyNe: "दार्जीलिङ → बेङ्गलोर",
    },
  },
  {
    id: "eh-kancha",
    yt: "7pOVG4o7914",
    title: "Eh Kancha Malai Sunko Tara",
    titleNe: "ए कान्छा मलाई सुनको तारा",
    artist: "Aruna Lama",
    artistNe: "अरुणा लामा",
    group: "ours",
    story: {
      ne: "मिरिक जाने घुम्ती बाटोमा पुरानो एम्बेसडर ट्याक्सीको डेकमा बज्ने यही गीत थियो। जब जब गाडी मोडिन्थ्यो, बुबा जानाजानी गलत शब्द गाएर हामीलाई हँसाउनुहुन्थ्यो।",
      en: "Bua played this in the Ambassador taxi on the winding road to Mirik. Every time the car banked around a hairpin bend, he sang the wrong words on purpose.",
      author: "Anjali Lama",
      authorNe: "अन्जली लामा",
      journey: "Kalimpong → Delhi",
      journeyNe: "कालिम्पोङ → दिल्ली",
    },
  },
  {
    id: "asaar",
    yt: "wLq8P_Hj8wQ",
    title: "Asaar",
    titleNe: "असार",
    artist: "Bipul Chettri",
    artistNe: "बिपुल छेत्री",
    group: "rain",
    story: {
      ne: "असारको झरी, कालिम्पोङको हिलो बाटो र हरिया डाँडाहरू। नयाँ पुस्ताको आवाज भए पनि यसमा त्यही पुरानो पहाडी माटोको बास्ना आउँछ।",
      en: "Asaar rains sweeping across Kalimpong's green terraced ridges. An acoustic ballad carrying the timeless mist of the hills.",
      author: "Prashant Pradhan",
      authorNe: "प्रशान्त प्रधान",
      journey: "Kalimpong → New York",
      journeyNe: "कालिम्पोङ → न्युयोर्क",
    },
  },
  {
    id: "herana-hera",
    yt: "E2A5YLSPliM",
    title: "Herana Hera Kanchha",
    titleNe: "हेर न हेर कान्छा",
    artist: "Aruna Lama & Jitendra Bardewa",
    artistNe: "अरुणा लामा र जितेन्द्र बर्देवा",
    group: "ours",
    story: {
      ne: "गाउँको बिहे र हाटबजारमा गुञ्जिने युगल गीत। घाम डुब्ने बेला बजारबाट फर्किँदा दाजुहरू सिट्टी बजाउँदै यही धुन गाउँथे।",
      en: "A duet that played in every village wedding in the 80s. Walking back from the Friday haat as dusk fell over the valley, humming the whistle hook.",
      author: "Roshan Chettri",
      authorNe: "रोशन छेत्री",
      journey: "Sikkim → Sydney",
      journeyNe: "सिक्किम → सिड्नी",
    },
  },
  {
    id: "yeti-dherai",
    yt: "x7faDV25Dxs",
    title: "Yeti Dherai Maya",
    titleNe: "यति धेरै माया",
    artist: "Narayan Gopal",
    artistNe: "नारायण गोपाल",
    group: "love",
    story: {
      ne: "नारायण गोपालको यो गहिरो स्वरले कति सम्झनाहरू ब्युँताउँछ। काठमाडौँ र दार्जीलिङलाई जोड्ने बलियो धागो यस्तै कालजयी धुनहरू हुन्।",
      en: "A song that carried whole generations through longing and quiet evenings. This voice defined the sonic identity of a generation.",
      author: "Suresh Thapa",
      authorNe: "सुरेस थापा",
      journey: "Kathmandu → Doha",
      journeyNe: "काठमाडौँ → दोहा",
    },
  },
  {
    id: "chura",
    yt: "hXOZ1wFvE0U",
    title: "Chura Ta Hoina Astura",
    titleNe: "चुरा त होइन अस्तुरा",
    artist: "Hira Devi Waiba",
    artistNe: "हीरादेवी वाइबा",
    group: "selo",
    story: {
      ne: "हीरादेवी वाइबाको डम्फुको ताल र खरसाङको माटोको मौलिक सुगन्ध। दशैँको बेला आँगनमा बज्दा कसैको खुट्टा स्थिर रहन सक्दैनथ्यो।",
      en: "The organic pulse of the Tamang damphu drum. When this played during Dasain in the village courtyard, everyone joined in.",
      author: "Sushma Tamang",
      authorNe: "सुष्मा तामाङ",
      journey: "Mirik → Mumbai",
      journeyNe: "मिरिक → मुम्बई",
    },
  },
  {
    id: "ramri",
    yt: "q7VhB2by7dA",
    title: "Ramri Ta Ramri",
    titleNe: "राम्री त राम्री",
    artist: "Hira Devi Waiba",
    artistNe: "हीरादेवी वाइबा",
    group: "selo",
    story: {
      ne: "पहाडको लोकभाकालाई रेडियोको पर्दासम्म पुर्‍याउने गीत। गाउँले जीवनको सादा, मीठो र आत्मीय ठट्टा यसमा जीवन्त छ।",
      en: "The playful wit of hill village life captured on magnetic tape. Simple, warm, and impossible not to smile along with.",
      author: "Karma Gurung",
      authorNe: "कर्मा गुरुङ",
      journey: "Kalimpong → London",
      journeyNe: "कालिम्पोङ → लन्डन",
    },
  },
];

// Phone-testing escape hatch: /?ids=abc123,def456 swaps the playlist without a rebuild.
const override = new URLSearchParams(typeof location !== "undefined" ? location.search : "").get("ids");

export const songs: Song[] = override
  ? override.split(",").map((yt, i) => ({ ...(base[i] ?? base[0]), id: `ov${i}`, yt }))
  : base;
