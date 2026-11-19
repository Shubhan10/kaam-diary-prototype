import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Phone,
  PhoneCall,
  Calendar as CalendarIcon,
  FileText,
  Download,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  HelpCircle,
  UserCheck,
  Clock,
  MapPin,
  Briefcase,
  Hammer,
  Globe,
  Beaker,
  Play,
  RotateCcw,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  History,
  Keyboard
} from 'lucide-react';

// ============================================================================
// 1. UNIFIED LOCALIZATION STRINGS (HINDI DEVANAGARI & ODIA SCRIPT)
// Every Odia phrase is explicitly flagged for native-speaker review.
// ============================================================================
const STRINGS = {
  meta: {
    odiaFlagNote: "⚠️ Odia translations flagged for native-speaker review (ଓଡ଼ିଆ ଅନୁବାଦ ମାତୃଭାଷୀ ସମୀକ୍ଷା ପାଇଁ ଚିହ୍ନିତ)",
    needsNativeReview: true
  },
  appTitle: {
    hi: "काम डायरी (Kaam Diary)",
    or: "କାମ ଡାଏରୀ (Kaam Diary)",
    en: "Kaam Diary — Voice Work Logger"
  },
  chooseLanguageTitle: {
    hi: "अपनी भाषा चुनें (बोलें या दबाएं)",
    or: "ନିଜ ଭାଷା ବାଛନ୍ତୁ (କୁହନ୍ତୁ ବା ଦବାନ୍ତୁ)"
  },
  hindiBtnLabel: {
    hi: "हिन्दी में बात करें",
    or: "ହିନ୍ଦୀରେ କଥା ହୁଅନ୍ତୁ",
    audioHi: "हिंदी के लिए यहाँ दबाएं या बोलें हिंदी"
  },
  odiaBtnLabel: {
    hi: "ओड़िया में बात करें",
    or: "ଓଡ଼ିଆରେ କଥା ହୁଅନ୍ତୁ",
    audioOr: "ଓଡ଼ିଆ ପାଇଁ ଏଠାରେ ଦବାନ୍ତୁ",
    audioHiFallback: "ओड़िया भाषा के लिए यहाँ दबाएं"
  },
  switchLangHint: {
    hi: "कभी भी 'भाषा बदलो' बोलकर भाषा बदलें",
    or: "ଯেকୌଣସି ସମୟରେ 'ଭାଷା ବଦଳାନ୍ତୁ' ବା 'bhasha badlo' କହି ଭାଷା ବଦଳାନ୍ତୁ"
  },
  greeting: {
    hi: "नमस्ते। आज का काम बताएं: जगह, ठेकेदार, घंटे।",
    or: "ନମସ୍କାର। ଆଜିର କାମ କୁହନ୍ତୁ: ଜାଗା, ଠିକାଦାର, ଘଣ୍ଟା।",
    romanHi: "Namaste. Aaj ka kaam batayein: jagah, thekedar, ghante."
  },
  languageSwitched: {
    hi: "भाषा बदलकर हिन्दी कर दी गई है। आज का काम बताएं: जगह, ठेकेदार, घंटे।",
    or: "ଭାଷା ବଦଳাই ଓଡ଼ିଆ କରାଯାଇଛି। ଆଜିର କାମ କୁହନ୍ତୁ: ଜାଗା, ଠିକାଦାର, ଘଣ୍ଟା।"
  },
  cardSite: {
    hi: "जगह (Site)",
    or: "ଜାଗା / ସାଇଟ୍ (Site)"
  },
  cardContractor: {
    hi: "ठेकेदार (Contractor)",
    or: "ଠିକାଦାର (Contractor)"
  },
  cardHours: {
    hi: "घंटे (Hours)",
    or: "ଘଣ୍ଟା (Hours)"
  },
  cardWorkType: {
    hi: "काम (Work Type)",
    or: "କାମ ପ୍ରକାର (Work Type)"
  },
  emptyCard: {
    hi: "खाली (बोलकर भरें)",
    or: "ଖାଲି ଅଛି (കହି ପୂରଣ କରନ୍ତୁ)"
  },
  readBackTemplate: {
    hi: (site, contractor, hours) => `${site}, ठेकेदार ${contractor}, ${hours} घंटे। सही है?`,
    or: (site, contractor, hours) => `${site}, ଠିକାଦାର ${contractor}, ${hours} ଘଣ୍ଟା। ଠିକ୍ ଅଛି କି?`,
    romanHi: (site, contractor, hours) => `${site}, thekedar ${contractor}, ${hours} ghante. Sahi hai?`
  },
  askWhatWasWrong: {
    hi: "क्या गलत था: जगह, ठेकेदार या घंटे?",
    or: "କଣ ଭୁଲ୍ ଥିଲା: ଜାଗା, ଠିକାଦାର ନା ଘଣ୍ଟା?",
    romanHi: "Kya galat tha: jagah, thekedar ya ghante?"
  },
  askSingleSite: {
    hi: "सिर्फ जगह का नाम बताइए।",
    or: "କେବଳ ଜାଗା ବା ସାଇଟ୍ ର ନାମ କୁହନ୍ତୁ।",
    romanHi: "Sirf jagah ka naam bataiye."
  },
  askSingleContractor: {
    hi: "सिर्फ ठेकेदार का नाम बताइए।",
    or: "କେବଳ ଠିକାଦାରଙ୍କ ନାମ କୁହନ୍ତୁ।",
    romanHi: "Sirf thekedar ka naam bataiye."
  },
  askSingleHours: {
    hi: "सिर्फ कितने घंटे काम किया, यह बताइए।",
    or: "କେବଳ କେତେ ଘଣ୍ଟା କାମ କଲେ ତାହା କୁହନ୍ତୁ।",
    romanHi: "Sirf kitne ghante kaam kiya, yeh bataiye."
  },
  savedSuccessTemplate: {
    hi: (done, rem) => `आज का दिन लिख लिया। ${done} दिन हो गए, ${rem} बाकी।`,
    or: (done, rem) => `ଆଜିର ଦିନ ଲେଖା ହେଲା। ${done} ଦିନ ହୋଇଗଲା, ${rem} ଦିନ ବାକି।`,
    romanHi: (done, rem) => `Aaj ka din likh liya. ${done} din ho gaye, ${rem} baaki.`
  },
  lowConfidenceNoise: {
    hi: "आवाज़ साफ़ नहीं आई, दोबारा बोलिए।",
    or: "ଆୱାଜ୍ ସଫା ଆସିଲା ନାହିଁ, ପୁଣିଥରେ କୁହନ୍ତୁ।",
    romanHi: "Awaaz saaf nahi aayi, dobara boliye"
  },
  silenceRepeatPrefix: {
    hi: "कोई आवाज़ नहीं मिली। मैं फिर से पूछता हूँ: ",
    or: "କୌଣସି ଶବ୍ଦ ଶୁଣାଗଲା ନାହିଁ। ମୁଁ ପୁଣି ପଚାରୁଛି: "
  },
  silencePolitePause: {
    hi: "कॉल रुका हुआ है। जब आप तैयार हों, बड़ा माइक बटन दबाकर बोलें।",
    or: "କଲ୍ ଅଟକି ରହିଛି। ଆପଣ ପ୍ରସ୍ତୁତ ହେଲେ ବଡ଼ ମାଇକ୍ ବଟନ୍ ଦବାଇ କୁହନ୍ତୁ।"
  },
  unverifiedSitePrompt: {
    hi: (suggested) => `यह नाम नया या अस्पष्ट लगा (असत्यापित)। क्या वही ${suggested} साइट?`,
    or: (suggested) => `ଏହି ନାମ ନୂଆ ଲାଗୁଛି (ଅସତ୍ୟାପିତ)। ସେଇ ${suggested} ସାଇଟ୍ କି?`,
    romanHi: (suggested) => `Kya wahi ${suggested} site?`
  },
  unverifiedContractorPrompt: {
    hi: (suggested) => `यह ठेकेदार नाम नया लगा। क्या वही ${suggested} ठेकेदार?`,
    or: (suggested) => `ଏହି ଠିକାଦାର ନାମ ନୂଆ ଲାଗୁଛି। ସେଇ ${suggested} ଠିକାଦାର କି?`
  },
  impossibleHoursZero: {
    hi: "0 घंटे काम दर्ज नहीं हो सकता। कृपया 1 से 16 घंटे के बीच सही समय बोलिए।",
    or: "0 ଘଣ୍ଟା କାମ ଲେଖାଯାଇ ପାରିବ ନାହିଁ। ଦୟାକରି 1 ରୁ 16 ଘଣ୍ଟା ମଧ୍ୟରେ କୁହନ୍ତୁ।"
  },
  impossibleHoursHigh: {
    hi: (hrs) => `${hrs} घंटे असंभव हैं। एक दिन में 16 घंटे से ज़्यादा नहीं लिख सकते। फिर से बोलिए।`,
    or: (hrs) => `${hrs} ଘଣ୍ଟା ଅସମ୍ଭବ ଅଟେ। ଗୋଟିଏ ଦିନରେ 16 ଘଣ୍ଟାରୁ ଅଧିକ ହୋଇପାରିବ ନାହିଁ। ପୁଣି କୁହନ୍ତୁ।`
  },
  impossibleFutureDate: {
    hi: "आने वाले कल या भविष्य की तारीख का काम आज नहीं लिख सकते। आज या पिछले दिन का काम बताएं।",
    or: "ଭବିଷ୍ୟତ ତାରିଖର କାମ ଆଜି ଲେଖିହେବ ନାହିଁ। ଆଜି ବା ପୂର୍ବ ଦିନର କାମ କୁହନ୍ତୁ।"
  },
  duplicateDayPrompt: {
    hi: "आज का दिन पहले से लिखा है। बदलना है या जोड़ना है?",
    or: "ଆଜିର ଦିନ ପୂର୍ବରୁ ଲେଖା ଅଛି। ବଦଳାଇବେ ନା ଯୋଡ଼ିବେ?",
    romanHi: "Aaj ka din pehle se likha hai. Badalna hai ya jodna hai?"
  },
  helperModeActivated: {
    hi: "आवाज़ बार-बार साफ़ नहीं आ रही। 'सहायक मोड' (Helper Mode) खुल गया है — पास के किसी व्यक्ति से लिखने की मदद लें।",
    or: "ଆୱାଜ୍ ବାରମ୍ବାର ସଫା ଆସୁନାହିଁ। 'ସହାୟକ ମୋଡ୍' ଖୋଲିଛି — ପାଖରେ ଥିବା କାହା ସାହାଯ୍ୟରେ ଲେଖନ୍ତୁ।"
  },
  weeklySummaryIntro: {
    hi: (daysCount, totalHrs) => `पिछले हफ्ते का हिसाब: आपने ${daysCount} दिन काम किया और कुल ${totalHrs} घंटे पूरे किए।`,
    or: (daysCount, totalHrs) => `ଗତ ସପ୍ତାହର ହିସାବ: ଆପଣ ${daysCount} ଦିନ କାମ କରିଛନ୍ତି ଏବଂ ମୋଟ ${totalHrs} ଘଣ୍ଟା ପୂରଣ କରିଛନ୍ତି।`
  },
  recordOpenedSpeech: {
    hi: (name, totalDays) => `${name} का काम रिकॉर्ड तैयार है। कुल ${totalDays} दिन दर्ज हैं। श्रम अधिकारी की जांच के लिए पीडीएफ डाउनलोड करें।`,
    or: (name, totalDays) => `${name} ଙ୍କ କାମ ରେକର୍ଡ ପ୍ରସ୍ତୁତ ଅଛି। ମୋଟ ${totalDays} ଦିନ ଲେଖା ଅଛି। ଶ୍ରମ ଅଧିକାରୀଙ୍କ ଯାଞ୍ଚ ପାଇଁ ଡାଉନଲୋଡ୍ କରନ୍ତୁ।`
  },
  tapMicToSpeak: {
    hi: "बोलने के लिए बड़ा माइक दबाएं",
    or: "କହିବା ପାଇଁ ବଡ଼ ମାଇକ୍ ବଟନ୍ ଦବାନ୍ତୁ"
  },
  listeningNow: {
    hi: "सुन रहे हैं... अब बोलिए (6 सेकंड सन्नाटा जांच सक्रिय)",
    or: "ଶୁଣୁଛୁ... ଏବେ କୁହନ୍ତୁ (6 ସେକେଣ୍ଡ ନୀରବତା ଯାଞ୍ଚ ଚାଲୁ)"
  },
  neverSaveWithoutHaan: {
    hi: "सुरक्षा नियम: जब तक आप 'हाँ' नहीं बोलते, कोई भी रिकॉर्ड सेव नहीं किया जाता।",
    or: "ସୁରକ୍ଷା ନିୟମ: ଆପଣ 'ହଁ' ନ କହିବା ପର୍ଯ୍ୟନ୍ତ କୌଣସି ତଥ୍ୟ ସେଭ୍ ହୁଏ ନାହିଁ।"
  },
  odiaTtsFallbackNotice: {
    hi: "हिन्दी आवाज़ सक्रिय",
    or: "ଓଡ଼ିଆ ଅଡିଓ উপলব্ধ ନଥିବାରୁ ହିନ୍ଦୀ ସ୍ୱର + ଓଡ଼ିଆ ଲେଖା (Captions) ଚାଲୁ ଅଛି"
  }
};

// ============================================================================
// 2. KNOWN SITES, CONTRACTORS & SEEDED 46-DAY DEMO DATA FOR "RAMESH"
// ============================================================================
const KNOWN_SITES = [
  "Whitefield Site",
  "Hebbal Flyover Site",
  "Electronic City Phase 2",
  "Sarjapur Road Tower",
  "Yelahanka Metro Site"
];

const KNOWN_CONTRACTORS = [
  "Sharma",
  "Patnaik",
  "Reddy",
  "Mishra",
  "Verma"
];

const WORK_TYPES = [
  "Slab Dhalai",
  "Plastering",
  "Bar Bending",
  "Brick Masonry",
  "Shuttering",
  "Painting"
];

function generateRameshSeedHistory() {
  const entries = [];
  // Anchor date: 2026-11-15 (Today is NOT logged yet so worker has 46 days and logging today makes 47!)
  const baseDate = new Date(2026, 10, 15); // Nov 15, 2026
  let dOffset = 1;
  let count = 0;

  while (count < 46) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - dOffset);
    // Skip every 7th day to simulate occasional Sunday rest
    if (dOffset % 8 !== 0) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const site = KNOWN_SITES[count % KNOWN_SITES.length];
      const contractor = KNOWN_CONTRACTORS[count % KNOWN_CONTRACTORS.length];
      const work_type = WORK_TYPES[count % WORK_TYPES.length];
      const hours = count % 5 === 0 ? 10 : count % 7 === 0 ? 4 : 8;

      entries.push({
        id: `seed-${count + 1}`,
        date: dateStr,
        site,
        contractor,
        work_type,
        hours,
        confidence: 0.94,
        verifiedSite: true,
        verifiedContractor: true,
        syncStatus: "synced",
        source: "voice-verified"
      });
      count++;
    }
    dOffset++;
  }
  return entries; // 46 entries ending yesterday (2026-11-14)
}

const TODAY_ISO = "2026-11-15";

// ============================================================================
// 3. TRILINGUAL NUMBER, HALF-DAY & FUZZY ENTITY PARSER + LLM JSON EXTRACTOR
// ============================================================================
const NUMBER_WORD_MAP = {
  // Zero
  "zero": 0, "shunya": 0, "शून्य": 0, "सिफर": 0, "sifar": 0, "ଶୂନ": 0, "shuna": 0, "0": 0,
  // Half day (aadha din -> 4 hours)
  "aadha din": 4, "adha din": 4, "आधा दिन": 4, "ଅଧା ଦିନ": 4, "adha dina": 4, "half day": 4,
  // 1 to 16
  "ek": 1, "एक": 1, "ଏକ": 1, "one": 1, "1": 1, "୧": 1, "१": 1,
  "do": 2, "दो": 2, "ଦୁଇ": 2, "dui": 2, "two": 2, "2": 2, "୨": 2, "२": 2,
  "teen": 3, "tin": 3, "तीन": 3, "ତିନି": 3, "tini": 3, "three": 3, "3": 3, "୩": 3, "३": 3,
  "chaar": 4, "char": 4, "चार": 4, "ଚାରି": 4, "chari": 4, "four": 4, "4": 4, "୪": 4, "४": 4,
  "paanch": 5, "panch": 5, "पांच": 5, "पाँच": 5, "ପାଞ୍ଚ": 5, "pancha": 5, "five": 5, "5": 5, "୫": 5, "५": 5,
  "chhah": 6, "chhe": 6, "छह": 6, "छः": 6, "ଛଅ": 6, "chha": 6, "six": 6, "6": 6, "୬": 6, "६": 6,
  "saat": 7, "sat": 7, "सात": 7, "ସାତ": 7, "sata": 7, "seven": 7, "7": 7, "୭": 7, "७": 7,
  "aath": 8, "ath": 8, "आठ": 8, "ଆଠ": 8, "atha": 8, "eight": 8, "8": 8, "୮": 8, "८": 8,
  "nau": 9, "नौ": 9, "ନଅ": 9, "naa": 9, "nine": 9, "9": 9, "୯": 9, "९": 9,
  "das": 10, "दस": 10, "ଦଶ": 10, "dasha": 10, "ten": 10, "10": 10, "१०": 10, "୧୦": 10,
  "gyarah": 11, "ग्यारह": 11, "ଏଗାର": 11, "egara": 11, "eleven": 11, "11": 11,
  "barah": 12, "बारह": 12, "ବାର": 12, "bara": 12, "twelve": 12, "12": 12,
  "terah": 13, "तेरह": 13, "ତେର": 13, "tera": 13, "thirteen": 13, "13": 13,
  "chaudah": 14, "चौदह": 14, "ଚଉଦ": 14, "chauda": 14, "fourteen": 14, "14": 14,
  "pandrah": 15, "पंद्रह": 15, "ପନ୍ଦର": 15, "pandara": 15, "fifteen": 15, "15": 15,
  "solah": 16, "सोलह": 16, "ଷୋହଳ": 16, "shohala": 16, "sixteen": 16, "16": 16,
  // Impossible high values for testing
  "bees": 20, "बीस": 20, "କୋଡ଼ିଏ": 20, "kodiye": 20, "twenty": 20, "20": 20, "22": 22, "baais": 22, "बाइस": 22, "24": 24, "chaubis": 24, "चौबीस": 24, "25": 25, "pachis": 25
};

function normalizeDigits(str) {
  const devanagari = "०१२३४५६७८९";
  const odia = "୦୧୨୩୪୫୬୭୮୯";
  return str
    .split("")
    .map((ch) => {
      const dIdx = devanagari.indexOf(ch);
      if (dIdx !== -1) return String(dIdx);
      const oIdx = odia.indexOf(ch);
      if (oIdx !== -1) return String(oIdx);
      return ch;
    })
    .join("");
}

function extractHoursFromUtterance(rawText) {
  if (!rawText) return null;
  const text = normalizeDigits(rawText.toLowerCase());

  // 1. Check half-day idioms first
  if (
    text.includes("aadha din") ||
    text.includes("adha din") ||
    text.includes("आधा दिन") ||
    text.includes("ଅଧା ଦିନ") ||
    text.includes("adha dina") ||
    text.includes("half day")
  ) {
    return 4;
  }

  // 2. Check explicit number + hour unit (ghante, ghanta, ଘଣ୍ଟା, घंटे, hrs, hours)
  const regexNumBeforeHour = /(\d+)\s*(?:ghante|ghanta|ghanto|ঘণ্টা|घंटे|घंटा|ଘଣ୍ଟା|hours?|hrs?)/i;
  const mDigit = text.match(regexNumBeforeHour);
  if (mDigit) {
    return parseInt(mDigit[1], 10);
  }

  // 3. Check multi-script number words before hour unit or standalone
  const sortedKeys = Object.keys(NUMBER_WORD_MAP).sort((a, b) => b.length - a.length);
  for (const word of sortedKeys) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const unitPattern = new RegExp(`(?:^|\\s|,)${escaped}\\s*(?:ghante|ghanta|घंटे|घंटा|ଘଣ୍ଟା|hours?|hrs?)`, "i");
    if (unitPattern.test(text)) {
      return NUMBER_WORD_MAP[word];
    }
  }

  // 4. Fallback: any standalone number token or word
  const standaloneDigit = text.match(/\b(\d{1,2})\b/);
  if (standaloneDigit) {
    return parseInt(standaloneDigit[1], 10);
  }
  for (const word of sortedKeys) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wordBoundary = new RegExp(`(?:^|\\s|,)${escaped}(?:$|\\s|,|\\.|।)`, "i");
    if (wordBoundary.test(text)) {
      return NUMBER_WORD_MAP[word];
    }
  }
  return null;
}

function levenshtein(a, b) {
  const s = a.toLowerCase();
  const t = b.toLowerCase();
  const dp = Array.from({ length: s.length + 1 }, () => Array(t.length + 1).fill(0));
  for (let i = 0; i <= s.length; i++) dp[i][0] = i;
  for (let j = 0; j <= t.length; j++) dp[0][j] = j;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[s.length][t.length];
}

function findClosestKnown(rawName, knownList) {
  if (!rawName) return { exactMatch: null, closestMatch: knownList[0], isExact: false };
  const cleaned = rawName.replace(/\b(site|साइट|ସାଇଟ୍|thekedar|contractor|ठेकेदार|ଠିକାଦାର)\b/gi, "").trim();
  for (const k of knownList) {
    const kBase = k.replace(/\bSite\b/i, "").trim();
    if (
      k.toLowerCase() === rawName.toLowerCase().trim() ||
      kBase.toLowerCase() === cleaned.toLowerCase()
    ) {
      return { exactMatch: k, closestMatch: k, isExact: true };
    }
  }
  // Find closest fuzzy match for "Kya wahi X site?"
  let best = knownList[0];
  let bestDist = 999;
  for (const k of knownList) {
    const kBase = k.replace(/\bSite\b/i, "").trim();
    const d = levenshtein(cleaned, kBase);
    if (d < bestDist) {
      bestDist = d;
      best = k;
    }
  }
  return { exactMatch: null, closestMatch: best, isExact: false };
}

// Local deterministic + LLM-schema compliant JSON extractor
function deterministicExtractJSON(utterance, forcedConfidence = null) {
  const raw = (utterance || "").trim();
  if (!raw) {
    return {
      date: TODAY_ISO,
      site: null,
      contractor: null,
      work_type: null,
      hours: null,
      confidence: 0.0
    };
  }

  const lower = raw.toLowerCase();

  // Check if noisy / garbled marker
  let confidence = forcedConfidence !== null ? forcedConfidence : 0.92;
  if (lower.includes("[noise]") || lower.includes("...") || lower.includes("???") || raw.length < 3) {
    if (forcedConfidence === null) confidence = 0.42;
  }

  // Date extraction (detect future date like "kal", "आने वाला कल", "ଆସନ୍ତାକାଲି", "tomorrow")
  let date = TODAY_ISO;
  if (
    /\b(tomorrow|aane wala kal|agale din|next week|2026-11-16)\b/i.test(lower) ||
    raw.includes("आने वाले कल") ||
    raw.includes("ଆସନ୍ତାକାଲି") ||
    /\bkal\b.*?\b(karunga|jaunga|kaam hoga)\b/i.test(lower)
  ) {
    date = "2026-11-16"; // Future date
  }

  // Hours extraction
  const hours = extractHoursFromUtterance(raw);

  // Work type extraction
  let work_type = null;
  if (/slab|dhalai|ढलाई|ଢଳାଇ|छत/i.test(raw)) work_type = "Slab Dhalai";
  else if (/plaster|प्लास्टर|ପ୍ଲାଷ୍ଟର/i.test(raw)) work_type = "Plastering";
  else if (/sariya|bar bending|सरिया|ଲୁହା ଛଡ଼/i.test(raw)) work_type = "Bar Bending";
  else if (/brick|eent|ईंट|ଇଟା| जुड़ाई|masonry/i.test(raw)) work_type = "Brick Masonry";
  else if (/shuttering|शटरिंग|ସଟରିଂ/i.test(raw)) work_type = "Shuttering";
  else if (/paint|पेंट|ରଙ୍ଗ/i.test(raw)) work_type = "Painting";

  // Site extraction
  let site = null;
  // Common Devanagari / Odia / Roman site transliterations
  const siteTranslitMap = [
    { pattern: /व्हाइटफील्ड|ହ୍ୱାଇଟଫିଲ୍ଡ|whitefield/i, canonical: "Whitefield Site" },
    { pattern: /हेब्बल|ହେବ୍বଲ୍|hebbal/i, canonical: "Hebbal Flyover Site" },
    { pattern: /इलेक्ट्रॉनिक सिटी|ଇଲେକ୍ଟ୍ରୋନିକ୍ ସିଟି|electronic city/i, canonical: "Electronic City Phase 2" },
    { pattern: /सरजापुर|ସରଜାପୁର|sarjapur/i, canonical: "Sarjapur Road Tower" },
    { pattern: /यलहंका|ୟେଲାହାଙ୍କା|yelahanka/i, canonical: "Yelahanka Metro Site" }
  ];

  // Check if utterance has a misheard site like "Whetfeld site" or "Waitfild site" or explicit "[something] site"
  const siteExplicitRegex = /(?:aaj|आजी|ଆଜି|आज|at|in)?\s*([A-Za-z\u0900-\u097F\u0B00-\u0B7F\s]{2,22}?)\s*(?:site|साइट|ସାଇଟ୍)/i;
  const siteMatch = raw.match(siteExplicitRegex);
  if (siteMatch) {
    const captured = siteMatch[1]
      .replace(/^(aaj|aaji|आज|ଆଜି|mu|main|मैं|ମୁଁ|kaam|काम|କାମ)\s+/i, "")
      .trim();
    // Check if it matches canonical transliteration
    let matchedCanon = null;
    for (const st of siteTranslitMap) {
      if (st.pattern.test(captured) && !/whetfeld|waitfild|hebalপুর/i.test(captured)) {
        matchedCanon = st.canonical;
        break;
      }
    }
    site = matchedCanon || `${captured} Site`;
  } else {
    for (const st of siteTranslitMap) {
      if (st.pattern.test(raw)) {
        site = st.canonical;
        break;
      }
    }
  }

  // Contractor extraction
  let contractor = null;
  const contractorTranslitMap = [
    { pattern: /शर्मा|ଶର୍ମା|\bsharma\b/i, canonical: "Sharma" },
    { pattern: /पटनायक|ପଟ୍ଟନାୟକ|\bpatnaik\b/i, canonical: "Patnaik" },
    { pattern: /रेड्डी|ରେଡ୍ଡୀ|\breddy\b/i, canonical: "Reddy" },
    { pattern: /मिश्रा|ମିଶ୍ର|\bmishra\b/i, canonical: "Mishra" },
    { pattern: /वर्मा|ବର୍ମା|\bverma\b/i, canonical: "Verma" }
  ];

  for (const ct of contractorTranslitMap) {
    if (ct.pattern.test(raw)) {
      contractor = ct.canonical;
      break;
    }
  }

  if (!contractor) {
    // Pattern like "X thekedar" or "thekedar X" or "X contractor"
    const beforeThekedar = raw.match(/([A-Za-z\u0900-\u097F\u0B00-\u0B7F]+)\s+(?:thekedar|contractor|ठेकेदार|ଠିକାଦାର|mesthri)/i);
    const afterThekedar = raw.match(/(?:thekedar|contractor|ठेकेदार|ଠିକାଦାର|mesthri)\s+([A-Za-z\u0900-\u097F\u0B00-\u0B7F]+)/i);
    if (beforeThekedar && !/site|साइट|ସାଇଟ୍|aaj|आज|ଆଜି/i.test(beforeThekedar[1])) {
      contractor = beforeThekedar[1].trim();
    } else if (afterThekedar) {
      contractor = afterThekedar[1].replace(/[,.।]/g, "").trim();
    }
  }

  return {
    date,
    site,
    contractor,
    work_type,
    hours,
    confidence
  };
}

// ============================================================================
// 4. FIVE SAMPLE UTTERANCES FOR TEST PANEL (WITH EXPECTED EXTRACTED FIELDS)
// ============================================================================
const TEST_UTTERANCES = [
  {
    id: "standard-hindi",
    title: "1. Standard Hindi + English Site Terms",
    badge: "Clean Speech (0.95)",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    utterance: "Aaj Whitefield site, Sharma thekedar, slab dhalai, aath ghante.",
    scriptText: "आज व्हाइटफील्ड साइट, शर्मा ठेकेदार, स्लैब ढलाई, आठ घंटे।",
    forcedConfidence: 0.95,
    expected: {
      date: TODAY_ISO,
      site: "Whitefield Site",
      contractor: "Sharma",
      work_type: "Slab Dhalai",
      hours: 8,
      confidence: 0.95
    },
    description: "Extracts all 4 fields cleanly, triggers spoken read-back, and awaits spoken 'Haan'."
  },
  {
    id: "hindi-odia-mix",
    title: "2. Hindi–Odia–English Code-Mixed Utterance",
    badge: "Odia-Hindi Mix (0.91)",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    utterance: "ଆଜି Hebbal site रे Patnaik thekedar पाखरे plastering काम, ଆଠ ଘଣ୍ଟା।",
    scriptText: "ଆଜି Hebbal site ରେ Patnaik thekedar ପାଖରେ plastering କାମ, ଆଠ ଘଣ୍ଟା।",
    forcedConfidence: 0.91,
    expected: {
      date: TODAY_ISO,
      site: "Hebbal Flyover Site",
      contractor: "Patnaik",
      work_type: "Plastering",
      hours: 8,
      confidence: 0.91
    },
    description: "Parses Odia script number word 'ଆଠ' (8), English 'site'/'plastering', and contractor 'Patnaik'."
  },
  {
    id: "noisy-low-conf",
    title: "3. Noisy Construction Site (Confidence < 0.60)",
    badge: "Low Confidence (0.42)",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    utterance: "[Noise] ... کٹ कटर आवाज़ ... Whitef... [horn] ... thekedar ...",
    scriptText: "[शोर / कंक्रीट मिक्सर की आवाज़] ... व्हाइट... ठेकेदार...",
    forcedConfidence: 0.42,
    expected: {
      date: TODAY_ISO,
      site: null,
      contractor: null,
      work_type: null,
      hours: null,
      confidence: 0.42
    },
    description: "Rejects noisy transcript (<0.6), speaks 'Awaaz saaf nahi aayi, dobara boliye'. 2x triggers step-by-step; 4x opens Helper Mode."
  },
  {
    id: "impossible-hours",
    title: "4. Impossible Hours Value (> 16 Hours)",
    badge: "Validation Guard (22 hrs)",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    utterance: "Aaj Sarjapur site, Reddy thekedar, shuttering kaam, 22 ghante.",
    scriptText: "आज सरजापुर साइट, रेड्डी ठेकेदार, शटरिंग काम, २२ घंटे।",
    forcedConfidence: 0.93,
    expected: {
      date: TODAY_ISO,
      site: "Sarjapur Road Tower",
      contractor: "Reddy",
      work_type: "Shuttering",
      hours: 22,
      confidence: 0.93
    },
    description: "Detects impossible hours (22 > 16), explains why it cannot be saved, and re-asks hours without saving."
  },
  {
    id: "misheard-halfday",
    title: "5. Misheard Site Name + 'Aadha Din' (4 Hours)",
    badge: "Unverified Site + Idiom",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    utterance: "Aaj Whetfeld site, Mishra thekedar, brick masonry, aadha din.",
    scriptText: "आज व्हेटफेल्ड साइट, मिश्रा ठेकेदार, ईंट जुड़ाई, आधा दिन।",
    forcedConfidence: 0.88,
    expected: {
      date: TODAY_ISO,
      site: "Whetfeld Site",
      contractor: "Mishra",
      work_type: "Brick Masonry",
      hours: 4,
      confidence: 0.88
    },
    description: "Converts 'aadha din' to 4 hrs, stores 'Whetfeld Site' as heard with yellow Unverified badge, and offers 'Kya wahi Whitefield site?'"
  }
];

// Quick voice response chips for zero-typing simulation
const VOICE_RESPONSE_CHIPS = [
  { labelHi: "हाँ (Haan)", labelOr: "ହଁ (Haan)", utterance: "Haan", color: "bg-emerald-600 hover:bg-emerald-500 text-white" },
  { labelHi: "नहीं (Nahi)", labelOr: "ନା (Nahi)", utterance: "Nahi", color: "bg-rose-600 hover:bg-rose-500 text-white" },
  { labelHi: "जगह (Jagah)", labelOr: "ଜାଗା (Jagah)", utterance: "Jagah", color: "bg-slate-700 hover:bg-slate-600 text-amber-200" },
  { labelHi: "ठेकेदार (Thekedar)", labelOr: "ଠିକାଦାର (Thekedar)", utterance: "Thekedar", color: "bg-slate-700 hover:bg-slate-600 text-amber-200" },
  { labelHi: "घंटे (Ghante)", labelOr: "ଘଣ୍ଟା (Ghante)", utterance: "Ghante", color: "bg-slate-700 hover:bg-slate-600 text-amber-200" },
  { labelHi: "मेरा रिकॉर्ड बनाओ", labelOr: "ମୋ ରେକର୍ଡ ବନାନ୍ତୁ", utterance: "Mera record banao", color: "bg-indigo-600 hover:bg-indigo-500 text-white" },
  { labelHi: "पिछले हफ्ते का हिसाब", labelOr: "ଗତ ସପ୍ତାହର ହିସାବ", utterance: "Pichle hafte ka hisaab", color: "bg-teal-600 hover:bg-teal-500 text-white" },
  { labelHi: "भाषा बदलो", labelOr: "ଭାଷା ବଦଳାନ୍ତୁ", utterance: "Bhasha badlo", color: "bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold" }
];

// ============================================================================
// 5. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Language: null (language chooser screen) | 'hi' | 'or'
  const [lang, setLang] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [odiaVoiceAvailable, setOdiaVoiceAvailable] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Worker profile & 46-day seeded storage
  const [workerName] = useState("Ramesh (रमेश / ରମେଶ)");
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("kaam_diary_ramesh_logs_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 46) return parsed;
      }
    } catch (e) {
      // Fallback to in-memory seed
    }
    return generateRameshSeedHistory();
  });

  // Connectivity & Offline Queue state
  const [isOnline, setIsOnline] = useState(true);

  // Call & Dialogue State Machine
  // States: 'IDLE_GREETING' | 'AWAITING_FULL_ENTRY' | 'AWAITING_SINGLE_FIELD' | 'AWAITING_UNVERIFIED_RESOLVE' | 'AWAITING_DUPLICATE_CHOICE' | 'AWAITING_CONFIRMATION' | 'AWAITING_WHICH_WRONG' | 'SAVED_SUMMARY' | 'HELPER_MODE' | 'RECORD_VIEW' | 'WEEKLY_SUMMARY'
  const [dialogueState, setDialogueState] = useState("IDLE_GREETING");
  const [singleFieldTarget, setSingleFieldTarget] = useState(null); // 'site' | 'contractor' | 'hours'
  const [failureCount, setFailureCount] = useState(0);
  const [silenceSeconds, setSilenceSeconds] = useState(0);
  const [silenceRepeatedOnce, setSilenceRepeatedOnce] = useState(false);
  const [micPausedPolite, setMicPausedPolite] = useState(false);

  // Live Microphone & Transcripts
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastConfidence, setLastConfidence] = useState(null);
  const [promptDisplay, setPromptDisplay] = useState("");
  const [promptRoman, setPromptRoman] = useState("");
  const [errorBanner, setErrorBanner] = useState(null);
  const [duplicateMode, setDuplicateMode] = useState(null); // 'replace' | 'add'

  // Extracted Current Entry Draft
  const [draft, setDraft] = useState({
    date: TODAY_ISO,
    site: null,
    contractor: null,
    work_type: null,
    hours: null,
    confidence: null,
    verifiedSite: true,
    verifiedContractor: true,
    suggestedSite: null,
    suggestedContractor: null
  });

  // Helper mode form state (only used when another person types after 4 failures)
  const [helperForm, setHelperForm] = useState({
    site: "Whitefield Site",
    contractor: "Sharma",
    work_type: "Slab Dhalai",
    hours: "8"
  });

  // Active tab in mobile shell or test drawer
  const [showTestDrawer, setShowTestDrawer] = useState(true);
  const [llmStatusNote, setLlmStatusNote] = useState("Deterministic + Gemini Schema JSON Extractor Ready");

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // Persist logs safely to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kaam_diary_ramesh_logs_v1", JSON.stringify(logs));
    } catch (e) {
      // Ignore storage quota errors inside sandboxed iframe
    }
  }, [logs]);

  // Detect Web Speech Synthesis voices for Hindi & Odia
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      const hasOr = voices.some((v) => v.lang && v.lang.toLowerCase().startsWith("or"));
      setOdiaVoiceAvailable(hasOr);
    };
    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;
  }, []);

  // Automatic sync when switching from Offline back to Online
  useEffect(() => {
    if (isOnline) {
      setLogs((prev) =>
        prev.map((item) =>
          item.syncStatus === "waiting_to_sync" ? { ...item, syncStatus: "synced" } : item
        )
      );
    }
  }, [isOnline]);

  // Compute unique logged days count toward 90-day BOCW target
  const uniqueDaysSet = useMemo(() => {
    const s = new Set();
    logs.forEach((l) => s.add(l.date));
    return s;
  }, [logs]);

  const totalDaysLogged = uniqueDaysSet.size;
  const remainingDays = Math.max(0, 90 - totalDaysLogged);

  // Worker's last 5 distinct sites and contractors from history
  const recentFiveSites = useMemo(() => {
    const seen = [];
    for (let i = 0; i < logs.length; i++) {
      const s = logs[i].site;
      if (s && !seen.includes(s)) seen.push(s);
      if (seen.length === 5) break;
    }
    return seen.length ? seen : KNOWN_SITES.slice(0, 5);
  }, [logs]);

  const recentFiveContractors = useMemo(() => {
    const seen = [];
    for (let i = 0; i < logs.length; i++) {
      const c = logs[i].contractor;
      if (c && !seen.includes(c)) seen.push(c);
      if (seen.length === 5) break;
    }
    return seen.length ? seen : KNOWN_CONTRACTORS.slice(0, 5);
  }, [logs]);

  // ============================================================================
  // SPEECH SYNTHESIS (TTS) WITH ODIA-TO-HINDI VOICE FALLBACK + ODIA CAPTIONS
  // ============================================================================
  const speakPrompt = (textHi, textOr, romanHi = "") => {
    const activeLang = lang || "hi";
    const displayStr = activeLang === "or" ? textOr : textHi;
    setPromptDisplay(displayStr);
    setPromptRoman(romanHi || textHi);

    if (audioMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices() || [];
      let utterText = displayStr;
      let targetLangTag = activeLang === "or" ? "or-IN" : "hi-IN";

      // Rule: "if Odia is unavailable, speak Hindi and show Odia text captions"
      if (activeLang === "or" && !odiaVoiceAvailable) {
        utterText = textHi; // Speak Hindi audio while showing Odia script on screen
        targetLangTag = "hi-IN";
      }

      const utter = new SpeechSynthesisUtterance(utterText);
      utter.lang = targetLangTag;
      utter.rate = 0.95;

      const matchedVoice =
        voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(targetLangTag.slice(0, 2))) ||
        voices.find((v) => v.lang && v.lang.toLowerCase().includes("in"));
      if (matchedVoice) utter.voice = matchedVoice;

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // ============================================================================
  // 6-SECOND SILENCE DETECTION TIMER WHILE LISTENING
  // Rule: "Silence: wait six seconds, repeat the question once, then pause politely."
  // ============================================================================
  useEffect(() => {
    if (!isListening) {
      setSilenceSeconds(0);
      if (silenceTimerRef.current) clearInterval(silenceTimerRef.current);
      return;
    }

    silenceTimerRef.current = setInterval(() => {
      setSilenceSeconds((prev) => {
        const next = prev + 1;
        if (next === 6 && !silenceRepeatedOnce) {
          setSilenceRepeatedOnce(true);
          const repHi = `${STRINGS.silenceRepeatPrefix.hi}${promptDisplay}`;
          const repOr = `${STRINGS.silenceRepeatPrefix.or}${promptDisplay}`;
          speakPrompt(repHi, repOr, "Silence (6s): Repeating question once...");
        } else if (next >= 12 && silenceRepeatedOnce) {
          // Pause politely after repeating once
          stopListeningInternal();
          setMicPausedPolite(true);
          speakPrompt(
            STRINGS.silencePolitePause.hi,
            STRINGS.silencePolitePause.or,
            "Polite pause after silence. Tap mic when ready."
          );
        }
        return next;
      });
    }, 1000);

    return () => {
      if (silenceTimerRef.current) clearInterval(silenceTimerRef.current);
    };
  }, [isListening, silenceRepeatedOnce, promptDisplay, lang]);

  const stopListeningInternal = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // ============================================================================
  // START LANGUAGE & GREETING FLOW
  // ============================================================================
  const selectLanguageAndStart = (chosenLang) => {
    setLang(chosenLang);
    setFailureCount(0);
    setErrorBanner(null);
    setDialogueState("AWAITING_FULL_ENTRY");
    setDraft({
      date: TODAY_ISO,
      site: null,
      contractor: null,
      work_type: null,
      hours: null,
      confidence: null,
      verifiedSite: true,
      verifiedContractor: true,
      suggestedSite: null,
      suggestedContractor: null
    });

    setTimeout(() => {
      const gHi = STRINGS.greeting.hi;
      const gOr = STRINGS.greeting.or;
      setPromptDisplay(chosenLang === "or" ? gOr : gHi);
      setPromptRoman(STRINGS.greeting.romanHi);
      // Speak in chosen language
      if (!audioMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(
            chosenLang === "or" && !odiaVoiceAvailable ? gHi : chosenLang === "or" ? gOr : gHi
          );
          utter.lang = chosenLang === "or" && odiaVoiceAvailable ? "or-IN" : "hi-IN";
          utter.rate = 0.95;
          window.speechSynthesis.speak(utter);
        } catch (e) {}
      }
    }, 80);
  };

  // ============================================================================
  // CORE VOICE COMMAND & UTTERANCE PROCESSOR
  // ============================================================================
  const handleUtteranceInput = async (rawUtterance, forcedConfidence = null) => {
    stopListeningInternal();
    setSilenceSeconds(0);
    setSilenceRepeatedOnce(false);
    setMicPausedPolite(false);
    setErrorBanner(null);

    const text = (rawUtterance || "").trim();
    setLiveTranscript(text || "(खाली / कोई आवाज़ नहीं)");

    const lower = text.toLowerCase();

    // 1. GLOBAL COMMAND: "bhasha badlo" (switches language at any time)
    if (
      lower.includes("bhasha badlo") ||
      lower.includes("भाषा बदलो") ||
      lower.includes("ଭାଷା ବଦଳାନ୍ତୁ") ||
      lower.includes("change language")
    ) {
      const nextLang = lang === "or" ? "hi" : "or";
      setLang(nextLang);
      setPromptDisplay(
        nextLang === "or" ? STRINGS.languageSwitched.or : STRINGS.languageSwitched.hi
      );
      setPromptRoman("Language switched via 'bhasha badlo'.");
      if (!audioMuted && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(
            nextLang === "or" && !odiaVoiceAvailable
              ? STRINGS.languageSwitched.hi
              : nextLang === "or"
              ? STRINGS.languageSwitched.or
              : STRINGS.languageSwitched.hi
          );
          u.lang = "hi-IN";
          window.speechSynthesis.speak(u);
        } catch (e) {}
      }
      return;
    }

    // 2. GLOBAL COMMAND: "Mera record banao" (One-page work record)
    if (
      lower.includes("mera record banao") ||
      lower.includes("मेरा रिकॉर्ड बनाओ") ||
      lower.includes("ମୋ ରେକର୍ଡ ବନାନ୍ତୁ") ||
      lower.includes("record banao")
    ) {
      openWorkRecordView();
      return;
    }

    // 3. GLOBAL COMMAND: "Pichle hafte ka hisaab" (Speak last 7 days)
    if (
      lower.includes("pichle hafte ka hisaab") ||
      lower.includes("पिछले हफ्ते का हिसाब") ||
      lower.includes("ଗତ ସପ୍ତାହର ହିସାବ") ||
      lower.includes("hafte ka hisaab")
    ) {
      speakLastSevenDays();
      return;
    }

    // 4. CHECK FOR DIALOGUE-SPECIFIC SHORT RESPONSES ("haan", "nahi", field names, duplicate choices)
    if (dialogueState === "AWAITING_CONFIRMATION") {
      if (/^(haan|han|जी हाँ|हाँ|हां|ହଁ|yes|sahi hai|ok)$/i.test(lower) || lower.includes("हाँ") || lower.includes("ହଁ") || /\bhaan\b/i.test(lower)) {
        finalizeAndSaveEntry();
        return;
      }
      if (/^(nahi|na|नहीं|ना|ନା|ନାହିଁ|no|galat)$/i.test(lower) || lower.includes("नहीं") || lower.includes("ନା") || /\bnahi\b/i.test(lower)) {
        setDialogueState("AWAITING_WHICH_WRONG");
        speakPrompt(
          STRINGS.askWhatWasWrong.hi,
          STRINGS.askWhatWasWrong.or,
          STRINGS.askWhatWasWrong.romanHi
        );
        return;
      }
    }

    if (dialogueState === "AWAITING_WHICH_WRONG") {
      if (/jagah|site|जगह|साइट|ଜାଗା|ସାଇଟ୍/i.test(lower)) {
        setSingleFieldTarget("site");
        setDialogueState("AWAITING_SINGLE_FIELD");
        speakPrompt(
          STRINGS.askSingleSite.hi,
          STRINGS.askSingleSite.or,
          STRINGS.askSingleSite.romanHi
        );
        return;
      }
      if (/thekedar|contractor|ठेकेदार|ଠିକାଦାର/i.test(lower)) {
        setSingleFieldTarget("contractor");
        setDialogueState("AWAITING_SINGLE_FIELD");
        speakPrompt(
          STRINGS.askSingleContractor.hi,
          STRINGS.askSingleContractor.or,
          STRINGS.askSingleContractor.romanHi
        );
        return;
      }
      if (/ghante|ghanta|hours|घंटे|घंटा|ଘଣ୍ଟା/i.test(lower)) {
        setSingleFieldTarget("hours");
        setDialogueState("AWAITING_SINGLE_FIELD");
        speakPrompt(
          STRINGS.askSingleHours.hi,
          STRINGS.askSingleHours.or,
          STRINGS.askSingleHours.romanHi
        );
        return;
      }
    }

    if (dialogueState === "AWAITING_DUPLICATE_CHOICE") {
      if (/badalna|badlo|बदलना|बदलो|ବଦଳାଇବେ|replace/i.test(lower)) {
        setDuplicateMode("replace");
        proceedToReadBack(draft);
        return;
      }
      if (/jodna|jodo|जोड़ना|जोड़ो|ଯୋଡ଼ିବେ|add/i.test(lower)) {
        setDuplicateMode("add");
        proceedToReadBack(draft);
        return;
      }
    }

    if (dialogueState === "AWAITING_UNVERIFIED_RESOLVE") {
      if (/\bhaan\b|हाँ|ହଁ|yes/i.test(lower)) {
        const updated = {
          ...draft,
          site: draft.suggestedSite || draft.site,
          contractor: draft.suggestedContractor || draft.contractor,
          verifiedSite: true,
          verifiedContractor: true
        };
        setDraft(updated);
        checkDuplicateOrReadBack(updated);
        return;
      }
      if (/\bnahi\b|नहीं|ନା|no/i.test(lower)) {
        // Keep exact heard name marked unverified in yellow, and proceed to read-back
        checkDuplicateOrReadBack(draft);
        return;
      }
    }

    // 5. EXTRACT STRUCTURED JSON (date, site, contractor, work_type, hours, confidence)
    const extracted = deterministicExtractJSON(text, forcedConfidence);
    setLastConfidence(extracted.confidence);
    setLlmStatusNote(
      `Extracted JSON: ${JSON.stringify({
        date: extracted.date,
        site: extracted.site,
        contractor: extracted.contractor,
        work_type: extracted.work_type,
        hours: extracted.hours,
        confidence: extracted.confidence
      })}`
    );

    // 6. NOISE OR LOW CONFIDENCE (< 0.6 OR EMPTY TRANSCRIPT)
    if (!text || extracted.confidence < 0.6) {
      const nextFails = failureCount + 1;
      setFailureCount(nextFails);

      if (nextFails >= 4) {
        // After two more failures (total 4), open Helper mode where another person can type
        setDialogueState("HELPER_MODE");
        setErrorBanner(
          lang === "or" ? STRINGS.helperModeActivated.or : STRINGS.helperModeActivated.hi
        );
        speakPrompt(
          STRINGS.helperModeActivated.hi,
          STRINGS.helperModeActivated.or,
          "4 noise failures: Helper Mode opened so a bystander can type."
        );
        return;
      }

      if (nextFails >= 2) {
        // After two failures, ask one field at a time ("Sirf jagah ka naam bataiye")
        const missingField = !draft.site
          ? "site"
          : !draft.contractor
          ? "contractor"
          : "hours";
        setSingleFieldTarget(missingField);
        setDialogueState("AWAITING_SINGLE_FIELD");

        const singleHi =
          missingField === "site"
            ? `${STRINGS.lowConfidenceNoise.hi} ${STRINGS.askSingleSite.hi}`
            : missingField === "contractor"
            ? `${STRINGS.lowConfidenceNoise.hi} ${STRINGS.askSingleContractor.hi}`
            : `${STRINGS.lowConfidenceNoise.hi} ${STRINGS.askSingleHours.hi}`;

        const singleOr =
          missingField === "site"
            ? `${STRINGS.lowConfidenceNoise.or} ${STRINGS.askSingleSite.or}`
            : missingField === "contractor"
            ? `${STRINGS.lowConfidenceNoise.or} ${STRINGS.askSingleContractor.or}`
            : `${STRINGS.lowConfidenceNoise.or} ${STRINGS.askSingleHours.or}`;

        setErrorBanner(
          `कम स्पष्टता (${Math.round(extracted.confidence * 100)}%) — एक-एक करके पूछ रहे हैं (प्रयास ${nextFails}/4)`
        );
        speakPrompt(singleHi, singleOr, `${STRINGS.lowConfidenceNoise.romanHi} -> Asking 1 field at a time.`);
        return;
      }

      // First or second low-confidence failure
      setErrorBanner(
        `आवाज़ साफ़ नहीं (Confidence: ${extracted.confidence.toFixed(2)} < 0.60) — प्रयास ${nextFails}/4`
      );
      speakPrompt(
        STRINGS.lowConfidenceNoise.hi,
        STRINGS.lowConfidenceNoise.or,
        STRINGS.lowConfidenceNoise.romanHi
      );
      return;
    }

    // Valid confidence (>= 0.6): reset consecutive failure counter
    setFailureCount(0);

    // 7. HANDLE SINGLE-FIELD RE-ASK OR STEP-BY-STEP FILLING
    let nextDraft = { ...draft };
    if (dialogueState === "AWAITING_SINGLE_FIELD" && singleFieldTarget) {
      if (singleFieldTarget === "site") {
        const candidateSite =
          extracted.site ||
          (text.length > 1 ? `${text.replace(/site|साइट|ସାଇଟ୍/gi, "").trim()} Site` : null);
        nextDraft.site = candidateSite;
      } else if (singleFieldTarget === "contractor") {
        const candidateContractor =
          extracted.contractor ||
          text.replace(/thekedar|contractor|ठेकेदार|ଠିକାଦାର/gi, "").trim();
        nextDraft.contractor = candidateContractor;
      } else if (singleFieldTarget === "hours") {
        nextDraft.hours = extracted.hours;
      }
      nextDraft.confidence = extracted.confidence;
    } else {
      nextDraft = {
        ...draft,
        date: extracted.date || TODAY_ISO,
        site: extracted.site || draft.site,
        contractor: extracted.contractor || draft.contractor,
        work_type: extracted.work_type || draft.work_type || "Slab Dhalai",
        hours: extracted.hours !== null ? extracted.hours : draft.hours,
        confidence: extracted.confidence
      };
    }

    // 8. VALIDATE IMPOSSIBLE VALUES (hours == 0, hours > 16, or future date)
    if (nextDraft.date > TODAY_ISO) {
      setDraft({ ...nextDraft, date: TODAY_ISO });
      setErrorBanner(
        lang === "or" ? STRINGS.impossibleFutureDate.or : STRINGS.impossibleFutureDate.hi
      );
      speakPrompt(
        STRINGS.impossibleFutureDate.hi,
        STRINGS.impossibleFutureDate.or,
        "Future date rejected: cannot log future work."
      );
      return;
    }

    if (nextDraft.hours !== null && nextDraft.hours <= 0) {
      setDraft({ ...nextDraft, hours: null });
      setSingleFieldTarget("hours");
      setDialogueState("AWAITING_SINGLE_FIELD");
      setErrorBanner(
        lang === "or" ? STRINGS.impossibleHoursZero.or : STRINGS.impossibleHoursZero.hi
      );
      speakPrompt(
        STRINGS.impossibleHoursZero.hi,
        STRINGS.impossibleHoursZero.or,
        "Impossible hours (0 hrs): rejected and re-asking."
      );
      return;
    }

    if (nextDraft.hours !== null && nextDraft.hours > 16) {
      const badHrs = nextDraft.hours;
      setDraft({ ...nextDraft, hours: null });
      setSingleFieldTarget("hours");
      setDialogueState("AWAITING_SINGLE_FIELD");
      setErrorBanner(
        lang === "or"
          ? STRINGS.impossibleHoursHigh.or(badHrs)
          : STRINGS.impossibleHoursHigh.hi(badHrs)
      );
      speakPrompt(
        STRINGS.impossibleHoursHigh.hi(badHrs),
        STRINGS.impossibleHoursHigh.or(badHrs),
        `Impossible hours (${badHrs} > 16): rejected without saving.`
      );
      return;
    }

    // 9. IF ANY OF THE 3 CORE FIELDS ARE STILL MISSING, ASK THAT SPECIFIC FIELD
    if (!nextDraft.site) {
      setDraft(nextDraft);
      setSingleFieldTarget("site");
      setDialogueState("AWAITING_SINGLE_FIELD");
      speakPrompt(
        STRINGS.askSingleSite.hi,
        STRINGS.askSingleSite.or,
        STRINGS.askSingleSite.romanHi
      );
      return;
    }
    if (!nextDraft.contractor) {
      setDraft(nextDraft);
      setSingleFieldTarget("contractor");
      setDialogueState("AWAITING_SINGLE_FIELD");
      speakPrompt(
        STRINGS.askSingleContractor.hi,
        STRINGS.askSingleContractor.or,
        STRINGS.askSingleContractor.romanHi
      );
      return;
    }
    if (nextDraft.hours === null || nextDraft.hours === undefined) {
      setDraft(nextDraft);
      setSingleFieldTarget("hours");
      setDialogueState("AWAITING_SINGLE_FIELD");
      speakPrompt(
        STRINGS.askSingleHours.hi,
        STRINGS.askSingleHours.or,
        STRINGS.askSingleHours.romanHi
      );
      return;
    }

    // 10. CHECK FOR MISHEARD / UNVERIFIED SITE OR CONTRACTOR NAMES
    // Rule: "Misheard names: store the name exactly as heard, mark it 'unverified' in yellow, and offer the worker's last five sites and contractors: 'Kya wahi Whitefield site?'"
    const siteCheck = findClosestKnown(nextDraft.site, recentFiveSites);
    const contractorCheck = findClosestKnown(nextDraft.contractor, recentFiveContractors);

    nextDraft.verifiedSite = siteCheck.isExact;
    nextDraft.verifiedContractor = contractorCheck.isExact;
    nextDraft.suggestedSite = siteCheck.isExact ? null : siteCheck.closestMatch;
    nextDraft.suggestedContractor = contractorCheck.isExact ? null : contractorCheck.closestMatch;

    setDraft(nextDraft);

    if (!siteCheck.isExact) {
      setDialogueState("AWAITING_UNVERIFIED_RESOLVE");
      speakPrompt(
        STRINGS.unverifiedSitePrompt.hi(siteCheck.closestMatch),
        STRINGS.unverifiedSitePrompt.or(siteCheck.closestMatch),
        STRINGS.unverifiedSitePrompt.romanHi(siteCheck.closestMatch)
      );
      return;
    }

    if (!contractorCheck.isExact) {
      setDialogueState("AWAITING_UNVERIFIED_RESOLVE");
      speakPrompt(
        STRINGS.unverifiedContractorPrompt.hi(contractorCheck.closestMatch),
        STRINGS.unverifiedContractorPrompt.or(contractorCheck.closestMatch),
        `Kya wahi ${contractorCheck.closestMatch} thekedar?`
      );
      return;
    }

    // 11. CHECK DUPLICATE DAY OR PROCEED TO READ-BACK
    checkDuplicateOrReadBack(nextDraft);
  };

  const checkDuplicateOrReadBack = (currentDraft) => {
    const alreadyLoggedToday = logs.some((l) => l.date === currentDraft.date);
    if (alreadyLoggedToday && !duplicateMode) {
      setDialogueState("AWAITING_DUPLICATE_CHOICE");
      speakPrompt(
        STRINGS.duplicateDayPrompt.hi,
        STRINGS.duplicateDayPrompt.or,
        STRINGS.duplicateDayPrompt.romanHi
      );
      return;
    }
    proceedToReadBack(currentDraft);
  };

  const proceedToReadBack = (currentDraft) => {
    setDialogueState("AWAITING_CONFIRMATION");
    const siteLabel = currentDraft.site.replace(/\s*Site$/i, "");
    speakPrompt(
      STRINGS.readBackTemplate.hi(siteLabel, currentDraft.contractor, currentDraft.hours),
      STRINGS.readBackTemplate.or(siteLabel, currentDraft.contractor, currentDraft.hours),
      STRINGS.readBackTemplate.romanHi(siteLabel, currentDraft.contractor, currentDraft.hours)
    );
  };

  // ============================================================================
  // SAVE ENTRY ONLY AFTER SPOKEN "HAAN"
  // Rule: "Save and reply: 'Aaj ka din likh liya. 47 din ho gaye, 43 baaki.' Show a progress ring (47 of 90) and a calendar with today marked."
  // ============================================================================
  const finalizeAndSaveEntry = () => {
    const newEntry = {
      id: `entry-${Date.now()}`,
      date: draft.date || TODAY_ISO,
      site: draft.site,
      contractor: draft.contractor,
      work_type: draft.work_type || "Slab Dhalai",
      hours: Number(draft.hours),
      confidence: draft.confidence || 0.92,
      verifiedSite: draft.verifiedSite,
      verifiedContractor: draft.verifiedContractor,
      syncStatus: isOnline ? "synced" : "waiting_to_sync",
      source: "spoken-haan"
    };

    let updatedLogs;
    if (duplicateMode === "replace") {
      updatedLogs = [newEntry, ...logs.filter((l) => l.date !== newEntry.date)];
    } else if (duplicateMode === "add") {
      // Combine hours onto existing entry or add second shift entry on same date
      updatedLogs = [newEntry, ...logs];
    } else {
      updatedLogs = [newEntry, ...logs];
    }

    setLogs(updatedLogs);
    setDuplicateMode(null);

    const uniqueDates = new Set(updatedLogs.map((l) => l.date));
    const newTotalDays = uniqueDates.size;
    const newRemaining = Math.max(0, 90 - newTotalDays);

    setDialogueState("SAVED_SUMMARY");
    speakPrompt(
      STRINGS.savedSuccessTemplate.hi(newTotalDays, newRemaining),
      STRINGS.savedSuccessTemplate.or(newTotalDays, newRemaining),
      STRINGS.savedSuccessTemplate.romanHi(newTotalDays, newRemaining)
    );
  };

  // ============================================================================
  // "MERA RECORD BANAO" & "PICHLE HAFTE KA HISAAB"
  // ============================================================================
  const openWorkRecordView = () => {
    setDialogueState("RECORD_VIEW");
    speakPrompt(
      STRINGS.recordOpenedSpeech.hi("रमेश", totalDaysLogged),
      STRINGS.recordOpenedSpeech.or("ରମେଶ", totalDaysLogged),
      `Mera record banao: Showing 1-page verification record (${totalDaysLogged}/90 days).`
    );
  };

  const speakLastSevenDays = () => {
    setDialogueState("WEEKLY_SUMMARY");
    const last7 = logs.slice(0, 7);
    const totalHrs = last7.reduce((acc, item) => acc + (Number(item.hours) || 0), 0);
    speakPrompt(
      STRINGS.weeklySummaryIntro.hi(last7.length, totalHrs),
      STRINGS.weeklySummaryIntro.or(last7.length, totalHrs),
      `Pichle hafte ka hisaab: ${last7.length} days, ${totalHrs} total hours.`
    );
  };

  // Download printable HTML/PDF labour officer verification record
  const downloadPrintableRecord = () => {
    const totalHoursAll = logs.reduce((acc, l) => acc + (Number(l.hours) || 0), 0);
    const rowsHtml = logs
      .slice(0, 50)
      .map(
        (l, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${l.date}</td>
          <td>${l.site} ${!l.verifiedSite ? "(Unverified)" : ""}</td>
          <td>${l.contractor} ${!l.verifiedContractor ? "(Unverified)" : ""}</td>
          <td>${l.work_type || "-"}</td>
          <td><strong>${l.hours} hrs</strong></td>
        </tr>`
      )
      .join("");

    const docHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Kaam Diary - BOCW Work Record - Ramesh</title>
  <style>
    body { font-family: sans-serif; padding: 28px; color: #111827; max-width: 820px; margin: 0 auto; }
    .stamp { border: 2px solid #b45309; background: #fffbeb; color: #92400e; padding: 10px 14px; font-weight: bold; border-radius: 6px; margin-bottom: 16px; display: inline-block; }
    h1 { margin: 0 0 6px 0; font-size: 24px; }
    .meta { display: flex; gap: 24px; margin: 16px 0; background: #f3f4f6; padding: 14px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
    th, td { border: 1px solid #d1d5db; padding: 7px 10px; text-align: left; }
    th { background: #1f2937; color: white; }
    .footer { margin-top: 28px; padding-top: 12px; border-top: 2px dashed #9ca3af; display: flex; justify-content: space-between; font-size: 13px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="stamp">SELF-REPORTED, FOR VERIFICATION BY A LABOUR OFFICER (स्व-रिपोर्ट किया गया - श्रम अधिकारी द्वारा सत्यापन हेतु)</div>
  <h1>Kaam Diary (काम डायरी / କାମ ଡାଏରୀ) — One-Page Work Record</h1>
  <p>Privacy Notice: Zero Aadhaar, phone number, or biometric photos collected.</p>
  <div class="meta">
    <div><strong>Worker Name:</strong> Ramesh (रमेश)</div>
    <div><strong>Total Distinct Days Logged:</strong> ${totalDaysLogged} / 90 Days</div>
    <div><strong>Total Hours:</strong> ${totalHoursAll} Hours</div>
    <div><strong>Generated Date:</strong> ${TODAY_ISO}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Date (तारीख)</th>
        <th>Site (जगह)</th>
        <th>Contractor (ठेकेदार)</th>
        <th>Work Type (काम)</th>
        <th>Hours (घंटे)</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
  <div class="footer">
    <div>Worker Thumb / Sign: ______________________</div>
    <div>Contractor / Labour Officer Verification Sign & Stamp: ______________________</div>
  </div>
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;

    const blob = new Blob([docHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Kaam_Diary_Ramesh_Work_Record_${TODAY_ISO}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // BROWSER SPEECH-TO-TEXT (MICROPHONE BUTTON HANDLER)
  // ============================================================================
  const toggleMicrophone = () => {
    if (isListening) {
      stopListeningInternal();
      return;
    }

    setMicPausedPolite(false);
    setSilenceSeconds(0);
    setSilenceRepeatedOnce(false);
    setErrorBanner(null);

    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      // Browser doesn't support native SpeechRecognition in iframe: keep mic active for 6s silence demo or simulated tap
      setIsListening(true);
      setLiveTranscript("माइक चालू है... (बोलें या नीचे दिए गए आवाज़ बटन से परखें)");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "or" ? "or-IN" : "hi-IN";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript("सुन रहे हैं...");
      };

      recognition.onresult = (event) => {
        setSilenceSeconds(0);
        const res = event.results[event.results.length - 1];
        const transcriptText = res[0].transcript;
        const conf = typeof res[0].confidence === "number" && res[0].confidence > 0 ? res[0].confidence : 0.9;
        setLiveTranscript(transcriptText);
        if (res.isFinal) {
          handleUtteranceInput(transcriptText, conf);
        }
      };

      recognition.onerror = () => {
        // Keep listening UI active so user can test 6s silence or tap simulated voice utterances in sandboxed preview
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(true);
    }
  };

  // Helper Mode submission -> prepares cards and STILL requires spoken "Haan" to save!
  // Rule: "Never guess and never save without a spoken 'haan'."
  const prepareHelperEntryForSpokenHaan = (e) => {
    e.preventDefault();
    const hrs = Number(helperForm.hours);
    if (!hrs || hrs <= 0 || hrs > 16) {
      setErrorBanner(
        hrs <= 0 ? STRINGS.impossibleHoursZero.hi : STRINGS.impossibleHoursHigh.hi(hrs)
      );
      return;
    }
    const prepared = {
      date: TODAY_ISO,
      site: helperForm.site.trim(),
      contractor: helperForm.contractor.trim(),
      work_type: helperForm.work_type.trim() || "Slab Dhalai",
      hours: hrs,
      confidence: 0.99,
      verifiedSite: true,
      verifiedContractor: true,
      suggestedSite: null,
      suggestedContractor: null
    };
    setDraft(prepared);
    setLiveTranscript(
      `[Helper Typed] ${prepared.site}, ${prepared.contractor}, ${prepared.hours} ghante`
    );
    proceedToReadBack(prepared);
  };

  // Reset to clean 46-day demo state
  const resetDemoState = () => {
    const fresh = generateRameshSeedHistory();
    setLogs(fresh);
    setFailureCount(0);
    setDuplicateMode(null);
    setErrorBanner(null);
    setLiveTranscript("");
    setLastConfidence(null);
    setDraft({
      date: TODAY_ISO,
      site: null,
      contractor: null,
      work_type: null,
      hours: null,
      confidence: null,
      verifiedSite: true,
      verifiedContractor: true,
      suggestedSite: null,
      suggestedContractor: null
    });
    setDialogueState("AWAITING_FULL_ENTRY");
    speakPrompt(STRINGS.greeting.hi, STRINGS.greeting.or, STRINGS.greeting.romanHi);
  };

  // ============================================================================
  // SCREEN 1: FIRST SCREEN — TWO LARGE AUDIO LANGUAGE BUTTONS (HINDI & ODIA)
  // ============================================================================
  if (!lang) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
        {/* Top Status Header */}
        <div className="max-w-md mx-auto w-full flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-amber-400">
                काम डायरी • କାମ ଡାଏରୀ
              </h1>
              <p className="text-xs text-slate-400">Kaam Diary • Voice Phone Call Diary</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">
            Ramesh (46/90 दिन)
          </span>
        </div>

        {/* Center Two Giant High-Contrast Language Buttons with Audio Preview */}
        <div className="max-w-md mx-auto w-full my-auto py-6 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-xl sm:text-2xl font-bold text-white">
              {STRINGS.chooseLanguageTitle.hi}
            </p>
            <p className="text-lg sm:text-xl font-bold text-amber-300">
              {STRINGS.chooseLanguageTitle.or}
            </p>
          </div>

          {/* HINDI GIANT BUTTON */}
          <div className="bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition rounded-3xl p-1 shadow-xl shadow-amber-500/10">
            <div className="bg-slate-900/95 rounded-[22px] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold tracking-wider uppercase">
                  Devanagari • हिन्दी
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if ("speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(STRINGS.hindiBtnLabel.audioHi);
                      u.lang = "hi-IN";
                      window.speechSynthesis.speak(u);
                    }
                  }}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700"
                >
                  <Volume2 className="w-4 h-4" />
                  सुनें (Audio)
                </button>
              </div>
              <button
                type="button"
                onClick={() => selectLanguageAndStart("hi")}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-2xl sm:text-3xl py-6 rounded-2xl shadow-lg flex items-center justify-center gap-3"
              >
                <Phone className="w-8 h-8 fill-slate-950" />
                <span>हिन्दी (Hindi)</span>
              </button>
            </div>
          </div>

          {/* ODIA GIANT BUTTON */}
          <div className="bg-teal-500 hover:bg-teal-400 active:scale-[0.99] transition rounded-3xl p-1 shadow-xl shadow-teal-500/10">
            <div className="bg-slate-900/95 rounded-[22px] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold tracking-wider uppercase">
                  Odia Script • ଓଡ଼ିଆ
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if ("speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(
                        odiaVoiceAvailable
                          ? STRINGS.odiaBtnLabel.audioOr
                          : STRINGS.odiaBtnLabel.audioHiFallback
                      );
                      u.lang = odiaVoiceAvailable ? "or-IN" : "hi-IN";
                      window.speechSynthesis.speak(u);
                    }
                  }}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700"
                >
                  <Volume2 className="w-4 h-4" />
                  ଶୁଣନ୍ତୁ (Audio)
                </button>
              </div>
              <button
                type="button"
                onClick={() => selectLanguageAndStart("or")}
                className="w-full bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-2xl sm:text-3xl py-6 rounded-2xl shadow-lg flex items-center justify-center gap-3"
              >
                <Phone className="w-8 h-8 fill-slate-950" />
                <span>ଓଡ଼ିଆ (Odia)</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 text-center space-y-1">
            <p className="text-xs text-slate-300 font-medium">{STRINGS.switchLangHint.hi}</p>
            <p className="text-xs text-teal-300 font-medium">{STRINGS.switchLangHint.or}</p>
            <p className="text-[11px] text-amber-400/90 pt-1">{STRINGS.meta.odiaFlagNote}</p>
          </div>
        </div>

        {/* Footer Privacy Guarantee */}
        <div className="max-w-md mx-auto w-full text-center text-xs text-slate-500 py-2">
          कोई आधार नंबर, फ़ोन नंबर या फ़ोटो नहीं ली जाती • केवल आवाज़ से काम का हिसाब
        </div>
      </div>
    );
  }

  // ============================================================================
  // COMPUTE PROGRESS RING & NOVEMBER 2026 CALENDAR DAYS
  // ============================================================================
  const progressPercent = Math.min(100, Math.round((totalDaysLogged / 90) * 100));
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringStrokeOffset =
    ringCircumference - (progressPercent / 100) * ringCircumference;

  const novDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const iso = `2026-11-${String(dayNum).padStart(2, "0")}`;
    const isLogged = uniqueDaysSet.has(iso);
    const isToday = iso === TODAY_ISO;
    return { dayNum, iso, isLogged, isToday };
  });

  const pendingSyncCount = logs.filter((l) => l.syncStatus === "waiting_to_sync").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* TOP BAR: SIMULATED CALL HEADER + LANGUAGE + ONLINE/OFFLINE SYNC */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white">
                  {lang === "or" ? STRINGS.appTitle.or : STRINGS.appTitle.hi}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                  ● कॉल चालू (Active Call)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Worker: <strong className="text-slate-200">{workerName}</strong> • {totalDaysLogged}/90 Days
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Offline / Online Toggle */}
            <button
              type="button"
              onClick={() => setIsOnline((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                isOnline
                  ? "bg-emerald-950/60 border-emerald-600/50 text-emerald-300"
                  : "bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse"
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? "ऑनलाइन (Synced)" : "ऑफ़लाइन (Offline)"}</span>
              {pendingSyncCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black">
                  {pendingSyncCount} waiting to sync
                </span>
              )}
            </button>

            {/* Switch Language ("bhasha badlo") */}
            <button
              type="button"
              onClick={() => handleUtteranceInput("bhasha badlo", 0.99)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold"
              title="Say 'bhasha badlo' to switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === "or" ? "भाषा बदलो → हिन्दी" : "ଭାଷା ବଦଳାନ୍ତୁ → ଓଡ଼ିଆ"}</span>
            </button>

            {/* Mute / Unmute Audio */}
            <button
              type="button"
              onClick={() => setAudioMuted((m) => !m)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              title={audioMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Reset Demo Button */}
            <button
              type="button"
              onClick={resetDemoState}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-semibold"
              title="Reset to 46 days seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset (46d)</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN GRID: LEFT = MOBILE PHONE CALL DIARY, RIGHT = TEST PANEL & EXTRACTION INSPECTOR */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ====================================================================
            LEFT COLUMN (7 COLS): MOBILE-FIRST VOICE CALL INTERFACE
        ==================================================================== */}
        <section className="lg:col-span-7 bg-slate-900 border-2 border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5">
          {/* Odia Native-Speaker Review & TTS Fallback Banner */}
          {lang === "or" && (
            <div className="bg-teal-950/60 border border-teal-600/40 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs text-teal-200">
              <span>{STRINGS.odiaTtsFallbackNotice.or}</span>
              <span className="bg-teal-500/20 border border-teal-400/40 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
                Flagged for Native Review
              </span>
            </div>
          )}

          {/* SPOKEN SYSTEM PROMPT BUBBLE */}
          <div className="bg-slate-950 border-2 border-amber-500/60 rounded-2xl p-4 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-bounce text-emerald-400" : ""}`} />
                फ़ोन आवाज़ (Spoken Prompt — {lang === "or" ? "ଓଡ଼ିଆ / Odia" : "हिन्दी / Hindi"})
              </span>
              <button
                type="button"
                onClick={() => speakPrompt(promptDisplay, promptDisplay, promptRoman)}
                className="underline hover:text-amber-200 text-[11px]"
              >
                फिर से सुनें (Replay)
              </button>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white leading-snug">
              “{promptDisplay || (lang === "or" ? STRINGS.greeting.or : STRINGS.greeting.hi)}”
            </p>
            {promptRoman && (
              <p className="text-xs text-slate-400 font-mono">
                {promptRoman}
              </p>
            )}
          </div>

          {/* ERROR / VALIDATION / NOISE ALERT BANNER */}
          {errorBanner && (
            <div className="bg-rose-950/80 border-2 border-rose-500 rounded-2xl p-3.5 flex items-start gap-3 text-rose-200">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-sm font-bold leading-snug">{errorBanner}</div>
            </div>
          )}

          {/* UNVERIFIED SITE / CONTRACTOR SUGGESTION BAR ("Kya wahi Whitefield site?") */}
          {(!draft.verifiedSite || !draft.verifiedContractor) && (
            <div className="bg-yellow-950/80 border-2 border-yellow-400 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-yellow-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                  ⚠️ Unverified Name (असत्यापित नाम)
                </span>
                <span className="text-xs text-yellow-200 font-semibold">
                  Stored exactly as heard until confirmed
                </span>
              </div>
              <p className="text-base font-bold text-yellow-100">
                {!draft.verifiedSite
                  ? `सुना गया: "${draft.site}" — क्या वही ${draft.suggestedSite}?`
                  : `सुना गया: "${draft.contractor}" — क्या वही ${draft.suggestedContractor} ठेकेदार?`}
              </p>
              <div className="space-y-1.5">
                <p className="text-xs text-yellow-300 font-semibold">
                  आपके पिछले 5 काम के नाम (Last 5 Sites & Contractors — बोलें या चुनें):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(!draft.verifiedSite ? recentFiveSites : recentFiveContractors).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        const updated = !draft.verifiedSite
                          ? { ...draft, site: item, verifiedSite: true, suggestedSite: null }
                          : { ...draft, contractor: item, verifiedContractor: true, suggestedContractor: null };
                        setDraft(updated);
                        checkDuplicateOrReadBack(updated);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/50 text-yellow-100 text-xs font-bold"
                    >
                      ✓ {item}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => checkDuplicateOrReadBack(draft)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold"
                  >
                    नहीं, नया नाम ही रखें ("{!draft.verifiedSite ? draft.site : draft.contractor}")
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* THREE HIGH-CONTRAST EXTRACTED FIELD CARDS: SITE, CONTRACTOR, HOURS (+ OPTIONAL WORK TYPE) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* CARD 1: SITE */}
            <div
              className={`rounded-2xl p-4 border-2 transition ${
                !draft.verifiedSite && draft.site
                  ? "bg-yellow-950/50 border-yellow-400"
                  : draft.site
                  ? "bg-emerald-950/40 border-emerald-500/70"
                  : singleFieldTarget === "site"
                  ? "bg-amber-950/40 border-amber-400 animate-pulse"
                  : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  {lang === "or" ? STRINGS.cardSite.or : STRINGS.cardSite.hi}
                </span>
                {!draft.verifiedSite && draft.site && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-yellow-400 text-slate-950 font-black rounded">
                    UNVERIFIED
                  </span>
                )}
              </div>
              <div className="text-lg font-black text-white min-h-[28px]">
                {draft.site || (
                  <span className="text-slate-600 text-sm font-medium">
                    {lang === "or" ? STRINGS.emptyCard.or : STRINGS.emptyCard.hi}
                  </span>
                )}
              </div>
              {draft.work_type && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-md font-semibold">
                  <Hammer className="w-3 h-3" />
                  {draft.work_type}
                </div>
              )}
            </div>

            {/* CARD 2: CONTRACTOR */}
            <div
              className={`rounded-2xl p-4 border-2 transition ${
                !draft.verifiedContractor && draft.contractor
                  ? "bg-yellow-950/50 border-yellow-400"
                  : draft.contractor
                  ? "bg-emerald-950/40 border-emerald-500/70"
                  : singleFieldTarget === "contractor"
                  ? "bg-amber-950/40 border-amber-400 animate-pulse"
                  : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-teal-400" />
                  {lang === "or" ? STRINGS.cardContractor.or : STRINGS.cardContractor.hi}
                </span>
                {!draft.verifiedContractor && draft.contractor && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-yellow-400 text-slate-950 font-black rounded">
                    UNVERIFIED
                  </span>
                )}
              </div>
              <div className="text-lg font-black text-white min-h-[28px]">
                {draft.contractor || (
                  <span className="text-slate-600 text-sm font-medium">
                    {lang === "or" ? STRINGS.emptyCard.or : STRINGS.emptyCard.hi}
                  </span>
                )}
              </div>
              <div className="mt-1.5 text-[11px] text-slate-400">
                तारीख: <strong className="text-slate-200">{draft.date}</strong>
              </div>
            </div>

            {/* CARD 3: HOURS */}
            <div
              className={`rounded-2xl p-4 border-2 transition ${
                draft.hours !== null && draft.hours !== undefined
                  ? "bg-emerald-950/40 border-emerald-500/70"
                  : singleFieldTarget === "hours"
                  ? "bg-amber-950/40 border-amber-400 animate-pulse"
                  : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  {lang === "or" ? STRINGS.cardHours.or : STRINGS.cardHours.hi}
                </span>
              </div>
              <div className="text-2xl font-black text-white min-h-[28px]">
                {draft.hours !== null && draft.hours !== undefined ? (
                  <span>
                    {draft.hours} <span className="text-sm font-bold text-emerald-300">घंटे (hrs)</span>
                  </span>
                ) : (
                  <span className="text-slate-600 text-sm font-medium">
                    {lang === "or" ? STRINGS.emptyCard.or : STRINGS.emptyCard.hi}
                  </span>
                )}
              </div>
              <div className="mt-1.5 text-[11px] text-slate-400">
                सीमा: 1 से 16 घंटे (आधा दिन = 4h)
              </div>
            </div>
          </div>

          {/* GIANT SINGLE MICROPHONE BUTTON (WORKER ONLY TAPS THIS & SPEAKS) */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col items-center text-center space-y-4">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center gap-2 font-black transition-all shadow-2xl ${
                isListening || failureCount > 0
                  ? "bg-rose-600 hover:bg-rose-500 text-white ring-8 ring-rose-500/30 animate-pulse"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 ring-8 ring-amber-500/20 active:scale-95"
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-14 h-14 animate-bounce" />
                  <span className="text-sm tracking-wide">बोलिए... ({6 - (silenceSeconds % 6)}s)</span>
                </>
              ) : (
                <>
                  <Mic className="w-14 h-14" />
                  <span className="text-base">माइक दबाएं</span>
                  <span className="text-xs font-bold opacity-80">Tap & Speak</span>
                </>
              )}
            </button>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-200">
                {isListening
                  ? lang === "or"
                    ? STRINGS.listeningNow.or
                    : STRINGS.listeningNow.hi
                  : lang === "or"
                  ? STRINGS.tapMicToSpeak.or
                  : STRINGS.tapMicToSpeak.hi}
              </p>
              <p className="text-xs text-emerald-400 font-semibold">
                {lang === "or" ? STRINGS.neverSaveWithoutHaan.or : STRINGS.neverSaveWithoutHaan.hi}
              </p>
            </div>

            {/* Quick Voice Response Simulation Bar (Simulates speaking into the phone call) */}
            <div className="w-full pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>बोले जाने वाले त्वरित वाक्य (Tap to simulate speaking into mic):</span>
                <span>State: <strong className="text-amber-300">{dialogueState}</strong></span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {VOICE_RESPONSE_CHIPS.map((chip) => (
                  <button
                    key={chip.utterance}
                    type="button"
                    onClick={() => handleUtteranceInput(chip.utterance, 0.96)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow ${chip.color}`}
                  >
                    🗣️ “{lang === "or" ? chip.labelOr : chip.labelHi}”
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ALWAYS VISIBLE LIVE TRANSCRIPT & EXTRACTED JSON BAR */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">
                Live Speech Transcript (सुना गया वाक्य)
              </span>
              {lastConfidence !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full font-bold ${
                    lastConfidence >= 0.6
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  STT Confidence: {(lastConfidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-base font-bold text-amber-200 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 min-h-[38px]">
              {liveTranscript || "अभी तक कुछ नहीं बोला गया — माइक दबाएं या दाईं ओर से टेस्ट वाक्य चलाएं"}
            </p>
            <p className="text-[11px] font-mono text-slate-400 break-all">
              {llmStatusNote}
            </p>
          </div>

          {/* HELPER MODE PANEL (Opens automatically after 4 consecutive noise failures, or manually) */}
          {dialogueState === "HELPER_MODE" && (
            <form
              onSubmit={prepareHelperEntryForSpokenHaan}
              className="bg-indigo-950/70 border-2 border-indigo-400 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-200 font-black text-base">
                  <Keyboard className="w-5 h-5 text-indigo-300" />
                  <span>सहायक मोड (Helper Mode — किसी साथी से टाइप करवाएं)</span>
                </div>
                <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                  4x शोर के बाद सक्रिय
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                यहाँ साथी विवरण भर सकता है, लेकिन सेव करने के लिए मजदूर को खुद माइक पर <strong>“हाँ”</strong> बोलना होगा।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs text-indigo-300 font-bold block mb-1">जगह (Site)</label>
                  <input
                    type="text"
                    value={helperForm.site}
                    onChange={(e) => setHelperForm({ ...helperForm, site: e.target.value })}
                    className="w-full bg-slate-900 border border-indigo-500/50 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-indigo-300 font-bold block mb-1">ठेकेदार (Contractor)</label>
                  <input
                    type="text"
                    value={helperForm.contractor}
                    onChange={(e) => setHelperForm({ ...helperForm, contractor: e.target.value })}
                    className="w-full bg-slate-900 border border-indigo-500/50 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-indigo-300 font-bold block mb-1">घंटे (1-16 Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={helperForm.hours}
                    onChange={(e) => setHelperForm({ ...helperForm, hours: e.target.value })}
                    className="w-full bg-slate-900 border border-indigo-500/50 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-2.5 rounded-xl text-sm shadow"
              >
                कार्ड में भरें और मजदूर से ‘हाँ’ बुलवाएं (Prepare for Spoken ‘Haan’)
              </button>
            </form>
          )}

          {/* PROGRESS RING (47 of 90) & NOVEMBER 2026 CALENDAR WITH TODAY MARKED */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* 90-Day BOCW Progress Ring */}
            <div className="sm:col-span-5 flex items-center gap-4">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={ringRadius}
                    stroke="#1e293b"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={ringRadius}
                    stroke="#10b981"
                    strokeWidth="10"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringStrokeOffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-white">{totalDaysLogged}</span>
                  <span className="text-[10px] text-slate-400 font-bold">/ 90 दिन</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  BOCW 90-Day Target
                </span>
                <p className="text-base font-black text-white">
                  {totalDaysLogged} दिन पूरे, {remainingDays} बाकी
                </p>
                <p className="text-xs text-slate-400">
                  कल्याण बोर्ड पंजीकरण के लिए साल में 90 दिन ज़रूरी
                </p>
              </div>
            </div>

            {/* November 2026 Calendar with Today (15 Nov) Marked */}
            <div className="sm:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                  नवंबर 2026 (November 2026)
                </span>
                <span className="text-[11px] text-emerald-400">
                  ● काम दर्ज | ★ आज (15 Nov)
                </span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {novDays.map((d) => (
                  <div
                    key={d.iso}
                    title={`${d.iso}${d.isLogged ? " (Logged)" : ""}`}
                    className={`h-7 rounded-md flex items-center justify-center text-xs font-bold border ${
                      d.isToday && d.isLogged
                        ? "bg-emerald-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 font-black"
                        : d.isToday
                        ? "bg-amber-500/20 text-amber-300 border-amber-400 ring-1 ring-amber-400"
                        : d.isLogged
                        ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-950 text-slate-600 border-slate-800"
                    }`}
                  >
                    {d.dayNum}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WEEKLY SUMMARY ("Pichle hafte ka hisaab") OR ONE-PAGE WORK RECORD ("Mera record banao") */}
          {dialogueState === "WEEKLY_SUMMARY" && (
            <div className="bg-teal-950/40 border-2 border-teal-500/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-teal-200 flex items-center gap-2">
                  <History className="w-5 h-5 text-teal-400" />
                  पिछले हफ्ते का हिसाब (Last 7 Logged Days)
                </h3>
                <button
                  type="button"
                  onClick={() => setDialogueState("AWAITING_FULL_ENTRY")}
                  className="text-xs text-slate-300 underline"
                >
                  बंद करें (Close)
                </button>
              </div>
              <div className="space-y-1.5">
                {logs.slice(0, 7).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-xs"
                  >
                    <span className="font-mono text-slate-300">{item.date}</span>
                    <span className="font-bold text-white">{item.site}</span>
                    <span className="text-amber-300">ठेकेदार: {item.contractor}</span>
                    <span className="font-black text-emerald-400">{item.hours} घंटे</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dialogueState === "RECORD_VIEW" && (
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border-4 border-amber-500 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="inline-block bg-amber-100 text-amber-900 border border-amber-400 px-2.5 py-0.5 rounded text-[11px] font-black uppercase">
                    Self-reported, for verification by a labour officer
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    काम डायरी (Kaam Diary) — एक-पृष्ठ कार्य रिकॉर्ड
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={downloadPrintableRecord}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                >
                  <Download className="w-4 h-4" />
                  PDF / प्रिंट डाउनलोड करें
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 block">मजदूर का नाम:</span>
                  <strong className="text-slate-900 text-sm">Ramesh (रमेश)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">कुल कार्य दिवस:</span>
                  <strong className="text-emerald-700 text-sm">{totalDaysLogged} / 90 Days</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">कुल घंटे:</span>
                  <strong className="text-slate-900 text-sm">
                    {logs.reduce((s, l) => s + (Number(l.hours) || 0), 0)} Hours
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">गोपनीयता:</span>
                  <strong className="text-slate-900 text-xs">No Aadhaar / Phone</strong>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800 text-white sticky top-0">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Site (जगह)</th>
                      <th className="p-2">Contractor (ठेकेदार)</th>
                      <th className="p-2">Hours</th>
                      <th className="p-2">Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {logs.slice(0, 15).map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono">{l.date}</td>
                        <td className="p-2 font-semibold">
                          {l.site}{" "}
                          {!l.verifiedSite && (
                            <span className="bg-yellow-300 text-slate-900 px-1 rounded text-[10px] font-bold">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="p-2">
                          {l.contractor}{" "}
                          {!l.verifiedContractor && (
                            <span className="bg-yellow-300 text-slate-900 px-1 rounded text-[10px] font-bold">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="p-2 font-bold">{l.hours}h</td>
                        <td className="p-2">
                          {l.syncStatus === "waiting_to_sync" ? (
                            <span className="text-amber-700 font-bold">Waiting to sync</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">Synced</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ====================================================================
            RIGHT COLUMN (5 COLS): INTERACTIVE TEST PANEL WITH 5 SAMPLE UTTERANCES
            & EXPECTED EXTRACTED JSON FIELDS + EDGE-CASE TRIGGERS
        ==================================================================== */}
        <aside className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="font-extrabold text-base text-white">
                  Voice Test Panel (5 Sample Utterances)
                </h2>
                <p className="text-xs text-slate-400">
                  Click any sample to simulate speaking & compare expected vs. actual JSON
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTestDrawer((v) => !v)}
              className="text-xs text-amber-300 underline font-semibold"
            >
              {showTestDrawer ? "Hide" : "Show"}
            </button>
          </div>

          {showTestDrawer && (
            <div className="space-y-3">
              {TEST_UTTERANCES.map((sample) => (
                <div
                  key={sample.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 space-y-2 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-white">{sample.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${sample.badgeColor}`}
                    >
                      {sample.badge}
                    </span>
                  </div>

                  <p className="text-xs text-amber-200 font-medium bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    “{sample.utterance}”
                  </p>

                  <p className="text-[11px] text-slate-400">{sample.description}</p>

                  {/* Expected Extracted Fields */}
                  <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800/80 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                    <div className="text-[10px] text-slate-400 font-sans font-bold mb-0.5">
                      Expected Extracted JSON:
                    </div>
                    {JSON.stringify(sample.expected)}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleUtteranceInput(sample.utterance, sample.forcedConfidence)
                    }
                    className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-amber-300" />
                    <span>यह वाक्य बोलें (Run Sample Utterance)</span>
                  </button>
                </div>
              ))}

              {/* Additional Edge-Case Verification Shortcuts */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-bold text-slate-300">
                  Edge-Case & Voice Flow Triggers:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleUtteranceInput(
                        "Kal Whitefield site, Sharma thekedar, 8 ghante kaam karunga",
                        0.92
                      )
                    }
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-left"
                  >
                    🚫 Future Date (“Kal 8 ghante”)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUtteranceInput(
                        "Aaj Whitefield site, Sharma thekedar, zero ghante",
                        0.91
                      )
                    }
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-left"
                  >
                    🚫 0 Hours (“zero ghante”)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFailureCount(3);
                      handleUtteranceInput("[Noise] ...", 0.35);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-left"
                  >
                    🆘 Trigger 4x Noise → Helper Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang(null)}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-left"
                  >
                    🌐 First Screen (Hindi/Odia Chooser)
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}