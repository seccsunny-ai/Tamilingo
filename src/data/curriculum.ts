export type ExerciseType = "listening" | "speaking" | "mimicry" | "fill_blank";

export interface Exercise {
  id: string;
  type: ExerciseType;
  promptText: string;
  tamilAudioText: string;
  englishTranslation: string;
  phoneticBreakdown?: string[];
  options?: string[];
  correctAnswer: string;
  hint: string;
  videoReference?: {
    videoId: string;
    lessonTitle: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  iconType: "headphones" | "mic" | "star" | "book" | "trophy";
  xpReward: number;
  exercises: Exercise[];
}

export interface GuidebookSection {
  title: string;
  explanation: string;
  keyPhrases: Array<{
    phrase: string;
    translation: string;
    phonetic: string;
  }>;
}

export interface UnitGuidebook {
  title: string;
  cefrLevel: string;
  overview: string;
  sections: GuidebookSection[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  iconName: string;
  colorScheme: string;
  guidebook: UnitGuidebook;
  lessons: Lesson[];
}

export interface Section {
  id: string;
  sectionNumber: number;
  cefrLevel: string; // e.g. "A1 - Foundations", "A2 - Everyday Fluency", "B1 - Confident", "B2 - Street Master"
  title: string;
  description: string;
  badgeColor: string;
  units: Unit[];
}

export interface StoryTurn {
  speaker: string;
  speakerAvatar: string;
  tamilText: string;
  englishTranslation: string;
  question?: {
    prompt: string;
    options: string[];
    correctAnswer: string;
    hint: string;
  };
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  xpReward: number;
  turns: StoryTurn[];
}

// -------------------------------------------------------------
// SECTION 1: ROOKIE TALKER (CEFR A1 - FOUNDATIONS)
// -------------------------------------------------------------
const SECTION_1: Section = {
  id: "section-1",
  sectionNumber: 1,
  cefrLevel: "A1 - Foundations",
  title: "Rookie Talker: Street Foundations",
  description: "Essential greetings, polite requests, market bargaining, and chai stall basics.",
  badgeColor: "bg-emerald-500",
  units: [
    {
      id: "u1",
      unitNumber: 1,
      title: "First Words, Respect & Greetings",
      subtitle: "Say hello, ask how someone is doing, and thank them warmly",
      iconName: "Hand",
      colorScheme: "from-emerald-500 to-green-600",
      guidebook: {
        title: "Unit 1 Guidebook: Greetings & Politeness",
        cefrLevel: "A1",
        overview: "In Tamil, tone and warmth matter. 'Vanakkam' is universal, and adding '-nga' to verbs shows respect to elders, strangers, and guests.",
        sections: [
          {
            title: "The Polite Suffix (-nga)",
            explanation: "Tamil distinguishes between casual address (friends, kids) and respectful address. Adding '-nga' or '-eenga' immediately makes any phrase polite and welcoming.",
            keyPhrases: [
              { phrase: "Vanakkam", translation: "Hello / Greetings", phonetic: "Vuh - nuhk - kuhm" },
              { phrase: "Eppadi irukkeenga?", translation: "How are you? (polite)", phonetic: "Ep - puh - di  iruk - keen - ga" },
              { phrase: "Nalla irukken", translation: "I am doing well", phonetic: "Nuhl - luh  iruk - ken" },
              { phrase: "Romba nandri", translation: "Thank you very much", phonetic: "Rom - buh  nuhn - dree" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u1-l1",
          title: "Saying Hello & Polite Inquiries",
          description: "Master 'Vanakkam' and 'Eppadi irukkeenga?'",
          iconType: "headphones",
          xpReward: 15,
          exercises: [
            {
              id: "u1-l1-e1",
              type: "listening",
              promptText: "Listen to the greeting. What does it mean?",
              tamilAudioText: "Vanakkam",
              englishTranslation: "Hello / Greetings",
              options: ["Hello / Greetings", "Goodbye", "Thank you", "Where are you going?"],
              correctAnswer: "Hello / Greetings",
              hint: "'Vanakkam' is the universal Tamil greeting.",
            },
            {
              id: "u1-l1-e2",
              type: "mimicry",
              promptText: "Repeat after me! Say 'Vanakkam' aloud.",
              tamilAudioText: "Vanakkam",
              englishTranslation: "Hello",
              phoneticBreakdown: ["Vuh", "nuhk", "kuhm"],
              correctAnswer: "Vanakkam",
              hint: "Break into 3 smooth beats: Vuh - nuhk - kuhm.",
            },
            {
              id: "u1-l1-e3",
              type: "speaking",
              promptText: "Ask politely: 'How are you?'",
              tamilAudioText: "Eppadi irukkeenga?",
              englishTranslation: "How are you? (polite)",
              correctAnswer: "Eppadi irukkeenga",
              hint: "'Eppadi' (How) + 'irukkeenga' (are you [respectful]).",
            },
            {
              id: "u1-l1-e4",
              type: "fill_blank",
              promptText: "Fill in the missing word from what you hear:",
              tamilAudioText: "Vanakkam, eppadi irukkeenga?",
              englishTranslation: "Hello, how are you?",
              options: ["eppadi", "engey", "enna", "yaar"],
              correctAnswer: "eppadi",
              hint: "'Eppadi' means 'How'.",
            },
          ],
        },
        {
          id: "u1-l2",
          title: "I'm Fine & Big Thanks",
          description: "Respond with 'Nalla irukken' and 'Romba nandri'",
          iconType: "mic",
          xpReward: 20,
          exercises: [
            {
              id: "u1-l2-e1",
              type: "listening",
              promptText: "What is the speaker saying?",
              tamilAudioText: "Naan nalla irukken",
              englishTranslation: "I am doing well",
              options: ["I am doing well", "I am tired", "Who are you?", "Please sit down"],
              correctAnswer: "I am doing well",
              hint: "'Naan' (I) + 'nalla' (well) + 'irukken' (am).",
            },
            {
              id: "u1-l2-e2",
              type: "mimicry",
              promptText: "Repeat: 'Romba nandri' (Thank you very much)",
              tamilAudioText: "Romba nandri",
              englishTranslation: "Thank you very much",
              phoneticBreakdown: ["Rom", "buh", "nuhn", "dree"],
              correctAnswer: "Romba nandri",
              hint: "'Romba' = very / much; 'nandri' = thanks.",
            },
            {
              id: "u1-l2-e3",
              type: "speaking",
              promptText: "Say in Spoken Tamil: 'I am good'",
              tamilAudioText: "Nalla irukken",
              englishTranslation: "I am good",
              correctAnswer: "Nalla irukken",
              hint: "Nalla + irukken.",
            },
            {
              id: "u1-l2-e4",
              type: "fill_blank",
              promptText: "Select the word for 'very / a lot':",
              tamilAudioText: "Romba nalla irukku",
              englishTranslation: "It is very good",
              options: ["Romba", "Konjam", "Ippo", "Venum"],
              correctAnswer: "Romba",
              hint: "'Romba' is the ultimate spoken Tamil word for 'very'.",
            },
          ],
        },
      ],
    },
    {
      id: "u2",
      unitNumber: 2,
      title: "The Street Market & Garden Nursery",
      subtitle: "Inspired by Lesson 371: Buying plants, asking prices, and shopping",
      iconName: "ShoppingBag",
      colorScheme: "from-amber-500 to-orange-600",
      guidebook: {
        title: "Unit 2 Guidebook: Shopping & Inquiries",
        cefrLevel: "A1",
        overview: "At the market or nursery, use 'Idhu evvalavu?' (How much is this?) and 'Enakku idhu venum' (I want this).",
        sections: [
          {
            title: "Asking Prices and Quantities",
            explanation: "'Idhu' means 'this'. 'Evvalavu' means 'how much'. Put them together for instant price inquiries anywhere.",
            keyPhrases: [
              { phrase: "Idhu evvalavu?", translation: "How much is this?", phonetic: "I - dhu  ev - vuh - luh - vu" },
              { phrase: "Sila sedigal vaanga", translation: "To buy some plants", phonetic: "Si - luh  seh - di - guhl  vaan - guh" },
              { phrase: "Enakku idhu venum", translation: "I want this", phonetic: "Eh - nuhk - ku  i - dhu  veh - num" },
              { phrase: "Enakku vendaam", translation: "I don't want it", phonetic: "Eh - nuhk - ku  ven - daam" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u2-l1",
          title: "Buying Plants in a Garden",
          description: "From Lesson 371: Street conversation with a plant seller",
          iconType: "headphones",
          xpReward: 20,
          exercises: [
            {
              id: "u2-l1-e1",
              type: "listening",
              promptText: "Listen to the customer. What did they come for?",
              tamilAudioText: "Naan ippo sila sedigal vaanga vandhirukken",
              englishTranslation: "I came now to buy some plants",
              options: [
                "I came now to buy some plants",
                "I am looking for a restaurant",
                "Can you wash my car?",
                "Where is the bus stop?",
              ],
              correctAnswer: "I came now to buy some plants",
              hint: "'Sila' (some) + 'sedigal' (plants) + 'vaanga' (to buy).",
            },
            {
              id: "u2-l1-e2",
              type: "mimicry",
              promptText: "Repeat: 'Sila sedigal' (Some plants)",
              tamilAudioText: "Sila sedigal",
              englishTranslation: "Some plants",
              phoneticBreakdown: ["Si", "luh", "seh", "di", "guhl"],
              correctAnswer: "Sila sedigal",
              hint: "Sila (some) + sedigal (plants).",
            },
            {
              id: "u2-l1-e3",
              type: "speaking",
              promptText: "Ask the vendor: 'How much is this?'",
              tamilAudioText: "Idhu evvalavu?",
              englishTranslation: "How much is this?",
              correctAnswer: "Idhu evvalavu",
              hint: "'Idhu' (this) + 'evvalavu' (how much).",
            },
            {
              id: "u2-l1-e4",
              type: "fill_blank",
              promptText: "Complete the sentence with 'now':",
              tamilAudioText: "Naan ippo vandhen",
              englishTranslation: "I came now",
              options: ["ippo", "naalaikku", "netthu", "enga"],
              correctAnswer: "ippo",
              hint: "'Ippo' means 'now' in spoken Tamil.",
            },
          ],
        },
        {
          id: "u2-l2",
          title: "Want vs Don't Want (Venum / Vendaam)",
          description: "State what you need and politely refuse what you don't",
          iconType: "star",
          xpReward: 25,
          exercises: [
            {
              id: "u2-l2-e1",
              type: "listening",
              promptText: "What does this customer want?",
              tamilAudioText: "Enakku idhu venum",
              englishTranslation: "I want this",
              options: ["I want this", "I don't want this", "Where is this from?", "Give this to them"],
              correctAnswer: "I want this",
              hint: "'Enakku' (to me) + 'idhu' (this) + 'venum' (is wanted).",
            },
            {
              id: "u2-l2-e2",
              type: "speaking",
              promptText: "Say in Spoken Tamil: 'I don't want' (No thanks)",
              tamilAudioText: "Enakku vendaam",
              englishTranslation: "I don't want / No thanks",
              correctAnswer: "Enakku vendaam",
              hint: "The opposite of 'venum' is 'vendaam'.",
            },
            {
              id: "u2-l2-e3",
              type: "mimicry",
              promptText: "Repeat: 'Konjam korainga' (Please reduce the price a little)",
              tamilAudioText: "Konjam korainga",
              englishTranslation: "Reduce the price a bit (bargaining)",
              phoneticBreakdown: ["Kon", "juhm", "koh", "rain", "guh"],
              correctAnswer: "Konjam korainga",
              hint: "Crucial market phrase! Konjam (a little) + korainga (please reduce).",
            },
          ],
        },
      ],
    },
    {
      id: "u3",
      unitNumber: 3,
      title: "Chai Stall, Food & Ordering",
      subtitle: "Order tea, coffee, water, and snacks with local street confidence",
      iconName: "Coffee",
      colorScheme: "from-rose-500 to-red-600",
      guidebook: {
        title: "Unit 3 Guidebook: Ordering & Refreshments",
        cefrLevel: "A1",
        overview: "Tamil Nadu has a thriving tea stall (Chai kadai) culture. Asking for 'Oru tea' (One tea) or 'Thanni' (Water) is essential.",
        sections: [
          {
            title: "Counting & Refreshments",
            explanation: "Use 'Oru' (One) before any noun: 'Oru tea' (One tea), 'Oru coffee' (One coffee), 'Oru bottle thanni' (One bottle of water).",
            keyPhrases: [
              { phrase: "Oru tea kudunga", translation: "Please give one tea", phonetic: "Oh - ru  tea  ku - doon - ga" },
              { phrase: "Thanni venum", translation: "I need water", phonetic: "Thahn - nee  veh - num" },
              { phrase: "Saappitteengala?", translation: "Did you eat? (affectionate check-in)", phonetic: "Saap - pit - teen - guh - luh" },
              { phrase: "Romba rusiya irukku", translation: "It is very delicious", phonetic: "Rom - buh  ru - si - yuh  iruk - ku" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u3-l1",
          title: "At the Tea Shop",
          description: "Order 'Oru tea' and ask for water",
          iconType: "headphones",
          xpReward: 20,
          exercises: [
            {
              id: "u3-l1-e1",
              type: "listening",
              promptText: "What is being ordered?",
              tamilAudioText: "Oru tea kudunga",
              englishTranslation: "Please give one tea",
              options: ["Please give one tea", "Where is the tea shop?", "I don't drink tea", "Can you make coffee?"],
              correctAnswer: "Please give one tea",
              hint: "'Oru' (one) + 'kudunga' (please give).",
            },
            {
              id: "u3-l1-e2",
              type: "speaking",
              promptText: "Say in Spoken Tamil: 'I need water'",
              tamilAudioText: "Thanni venum",
              englishTranslation: "I need water",
              correctAnswer: "Thanni venum",
              hint: "'Thanni' (water) + 'venum' (needed).",
            },
            {
              id: "u3-l1-e3",
              type: "mimicry",
              promptText: "Repeat: 'Saappitteengala?' (Did you eat?)",
              tamilAudioText: "Saappitteengala?",
              englishTranslation: "Did you eat? (warmest Tamil greeting)",
              phoneticBreakdown: ["Saap", "pit", "teen", "guh", "luh"],
              correctAnswer: "Saappitteengala",
              hint: "In Tamil culture, asking 'Did you eat?' is how people express care.",
            },
          ],
        },
      ],
    },
    {
      id: "u4",
      unitNumber: 4,
      title: "Polite Imperatives & Golden Rules",
      subtitle: "Come in, sit down, and listen: Master the respectful '-nga' verbs",
      iconName: "Compass",
      colorScheme: "from-blue-500 to-indigo-600",
      guidebook: {
        title: "Unit 4 Guidebook: Politeness & Commands",
        cefrLevel: "A1",
        overview: "Never use blunt commands with strangers or elders. Transform short verbs into polite invitations with '-nga'.",
        sections: [
          {
            title: "Casual vs Respectful Pairs",
            explanation: "Vaa (Come) becomes Vaanga (Please come). Po (Go) becomes Ponga (Please go). Ukkaar (Sit) becomes Ukkaarunga (Please sit).",
            keyPhrases: [
              { phrase: "Ulla vaanga", translation: "Please come inside", phonetic: "Ul - luh  vaan - guh" },
              { phrase: "Ukkaarunga", translation: "Please sit down", phonetic: "Uk - kaa - roon - guh" },
              { phrase: "Sollunga", translation: "Please tell me / Go ahead", phonetic: "Sol - loon - guh" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u4-l1",
          title: "Welcoming a Guest",
          description: "Say 'Ulla vaanga' and 'Ukkaarunga'",
          iconType: "mic",
          xpReward: 20,
          exercises: [
            {
              id: "u4-l1-e1",
              type: "listening",
              promptText: "Listen to the polite invitation. What does it mean?",
              tamilAudioText: "Ulla vaanga, ukkaarunga",
              englishTranslation: "Please come inside, please sit",
              options: [
                "Please come inside, please sit",
                "Wait outside for five minutes",
                "Where are you coming from?",
                "Can you stand up?",
              ],
              correctAnswer: "Please come inside, please sit",
              hint: "'Ulla' (inside) + 'vaanga' (come) + 'ukkaarunga' (sit).",
            },
            {
              id: "u4-l1-e2",
              type: "speaking",
              promptText: "Say politely to a guest: 'Please come!'",
              tamilAudioText: "Vaanga!",
              englishTranslation: "Please come! (respectful)",
              correctAnswer: "Vaanga",
              hint: "'Vaanga' is the polite form of 'Vaa'.",
            },
            {
              id: "u4-l1-e3",
              type: "mimicry",
              promptText: "Repeat: 'Sollunga' (Please tell me)",
              tamilAudioText: "Sollunga",
              englishTranslation: "Please tell me / Go ahead",
              phoneticBreakdown: ["Sol", "loon", "guh"],
              correctAnswer: "Sollunga",
              hint: "Sollunga! Universally used when answering phone calls or giving someone the floor.",
            },
          ],
        },
      ],
    },
  ],
};

// -------------------------------------------------------------
// SECTION 2: EXPLORER & EVERYDAY FLUENCY (CEFR A2)
// -------------------------------------------------------------
const SECTION_2: Section = {
  id: "section-2",
  sectionNumber: 2,
  cefrLevel: "A2 - Everyday Fluency",
  title: "Explorer: Everyday Street Fluency",
  description: "The particle 'Thaan', expressing 'It depends', navigation, time urgency, and street slang.",
  badgeColor: "bg-amber-500",
  units: [
    {
      id: "u5",
      unitNumber: 5,
      title: "The Superpower Particle 'Thaan'",
      subtitle: "Inspired by Lesson 370: Native emphasis, 'Me only!', and 'Exactly!'",
      iconName: "Zap",
      colorScheme: "from-blue-600 to-indigo-700",
      guidebook: {
        title: "Unit 5 Guidebook: Mastering 'Thaan'",
        cefrLevel: "A2",
        overview: "'Thaan' is the secret ingredient of colloquial Tamil. It acts as a spotlight, emphasizing the exact word it attaches to.",
        sections: [
          {
            title: "How 'Thaan' Shifts Meaning",
            explanation: "'Naan sonnen' means 'I said'. But 'Naan thaan sonnen' means 'I was the one who said it (ME only!)'. 'Adhu thaan' means 'Exactly that!'.",
            keyPhrases: [
              { phrase: "Naan thaan sonnen", translation: "It was ME who said it", phonetic: "Naan  thaan  son - nen" },
              { phrase: "Adhu thaan!", translation: "That's exactly it! / Exactly!", phonetic: "Uh - dhu  thaan" },
              { phrase: "Innaikku thaan", translation: "Today only / Just today", phonetic: "In - naik - ku  thaan" },
              { phrase: "Ippo thaan vandhen", translation: "I just arrived right now", phonetic: "Ip - po  thaan  vuhn - dhen" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u5-l1",
          title: "Emphasis with 'Thaan'",
          description: "Learn 'Naan thaan' and 'Adhu thaan!' from Lesson 370",
          iconType: "star",
          xpReward: 25,
          exercises: [
            {
              id: "u5-l1-e1",
              type: "listening",
              promptText: "What does the speaker emphasize?",
              tamilAudioText: "Naan thaan sonnen",
              englishTranslation: "I was the one who said it (Me only)",
              options: [
                "I was the one who said it (Me only)",
                "Did someone tell you that?",
                "He told me yesterday",
                "I will say it tomorrow",
              ],
              correctAnswer: "I was the one who said it (Me only)",
              hint: "'Thaan' emphasizes 'Naan' (Me!).",
              videoReference: {
                videoId: "LP-oUkKaMHg",
                lessonTitle: "LEARN TAMIL 370 - Different meaning with thaan",
              },
            },
            {
              id: "u5-l1-e2",
              type: "mimicry",
              promptText: "Repeat: 'Adhu thaan!' (That's exactly it!)",
              tamilAudioText: "Adhu thaan!",
              englishTranslation: "That's exactly it!",
              phoneticBreakdown: ["Uh", "dhu", "Thaan"],
              correctAnswer: "Adhu thaan",
              hint: "Say it with enthusiasm: Uh-dhu Thaan!",
            },
            {
              id: "u5-l1-e3",
              type: "speaking",
              promptText: "Say in Spoken Tamil: 'Today only'",
              tamilAudioText: "Innaikku thaan",
              englishTranslation: "Today only",
              correctAnswer: "Innaikku thaan",
              hint: "'Innaikku' (today) + 'thaan'.",
            },
            {
              id: "u5-l1-e4",
              type: "fill_blank",
              promptText: "Add the emphasizing particle for 'Right now':",
              tamilAudioText: "Ippo thaan vandhen",
              englishTranslation: "I just arrived right now",
              options: ["thaan", "kooda", "mattum", "aa"],
              correctAnswer: "thaan",
              hint: "'Ippo thaan' = just now.",
            },
          ],
        },
      ],
    },
    {
      id: "u6",
      unitNumber: 6,
      title: "Nuanced Opinions - 'It Depends'",
      subtitle: "Inspired by Lesson 369: Saying 'Adhai poruthu irukku' naturally",
      iconName: "HelpCircle",
      colorScheme: "from-purple-500 to-pink-600",
      guidebook: {
        title: "Unit 6 Guidebook: Nuance & Conditions",
        cefrLevel: "A2",
        overview: "When making plans in Tamil, life is conditional. Master the phrase 'Poruthu irukku' (It depends).",
        sections: [
          {
            title: "Forming 'It Depends on X'",
            explanation: "Add '-ai poruthu irukku' to any condition. 'Nerathai poruthu irukku' (It depends on the time). 'Situation-ai poruthu irukku' (It depends on the situation).",
            keyPhrases: [
              { phrase: "Adhai poruthu irukku", translation: "It depends on that", phonetic: "Uh - dhai  po - ru - thu  i - ruk - ku" },
              { phrase: "Situation-ai poruthu irukku", translation: "It depends on the situation", phonetic: "Situation - ai  po - ru - thu  i - ruk - ku" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u6-l1",
          title: "Expressing 'It Depends'",
          description: "From Lesson 369: Sound authentic in discussions",
          iconType: "headphones",
          xpReward: 25,
          exercises: [
            {
              id: "u6-l1-e1",
              type: "listening",
              promptText: "Listen to the phrase. What is its meaning?",
              tamilAudioText: "Adhai poruthu irukku",
              englishTranslation: "It depends on that",
              options: [
                "It depends on that",
                "I agree with that",
                "That is not possible",
                "Where did you hear that?",
              ],
              correctAnswer: "It depends on that",
              hint: "'Poruthu irukku' means 'depends'.",
              videoReference: {
                videoId: "Vlx6-SP34wI",
                lessonTitle: "LEARN TAMIL 369 - How to say 'it depends'",
              },
            },
            {
              id: "u6-l1-e2",
              type: "speaking",
              promptText: "Say in Spoken Tamil: 'It depends on that'",
              tamilAudioText: "Adhai poruthu irukku",
              englishTranslation: "It depends on that",
              correctAnswer: "Adhai poruthu irukku",
              hint: "Adhai + poruthu + irukku.",
            },
            {
              id: "u6-l1-e3",
              type: "mimicry",
              promptText: "Repeat: 'Poruthu irukku' (It depends)",
              tamilAudioText: "Poruthu irukku",
              englishTranslation: "It depends",
              phoneticBreakdown: ["Poh", "ru", "thu", "I", "ruk", "ku"],
              correctAnswer: "Poruthu irukku",
              hint: "Poh-ru-thu I-ruk-ku.",
            },
          ],
        },
      ],
    },
    {
      id: "u7",
      unitNumber: 7,
      title: "Likes, Preferences & Desires",
      subtitle: "Inspired by Lesson 362: 'Pudikkum' vs 'Pudikkadhu' and similarities",
      iconName: "Heart",
      colorScheme: "from-rose-500 to-pink-600",
      guidebook: {
        title: "Unit 7 Guidebook: Likes & Dislikes",
        cefrLevel: "A2",
        overview: "In Tamil, you do not 'have likes'—things are liked *to* you. 'Enakku pudikkum' (I like it / It is liked to me).",
        sections: [
          {
            title: "Positive vs Negative Preference",
            explanation: "Pudikkum = is liked. Pudikkadhu = is NOT liked. Always address yourself as 'Enakku' (to me).",
            keyPhrases: [
              { phrase: "Enakku pudikkum", translation: "I like it", phonetic: "Eh - nuhk - ku  pu - dik - kum" },
              { phrase: "Enakku pudikkadhu", translation: "I don't like it", phonetic: "Eh - nuhk - ku  pu - dik - kaah - dhu" },
              { phrase: "Adhu madhiriye", translation: "Just like that", phonetic: "Uh - dhu  muh - dhi - ri - yeh" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u7-l1",
          title: "Talking of Likes & Dislikes",
          description: "From Lesson 362: Share your tastes and opinions",
          iconType: "star",
          xpReward: 25,
          exercises: [
            {
              id: "u7-l1-e1",
              type: "listening",
              promptText: "What does the speaker love doing?",
              tamilAudioText: "Enakku Tamil pesa romba pudikkum",
              englishTranslation: "I really like speaking Tamil",
              options: [
                "I really like speaking Tamil",
                "I find Tamil very difficult",
                "Can you teach me Tamil?",
                "Do you like to speak Tamil?",
              ],
              correctAnswer: "I really like speaking Tamil",
              hint: "'Pesa' (to speak) + 'romba pudikkum' (like very much).",
              videoReference: {
                videoId: "wBDt8oUxSbY",
                lessonTitle: "TALKING OF LIKES AND SIMILARITIES VIDEO 362",
              },
            },
            {
              id: "u7-l1-e2",
              type: "speaking",
              promptText: "Say in Spoken Tamil: 'I don't like it'",
              tamilAudioText: "Enakku pudikkadhu",
              englishTranslation: "I don't like it",
              correctAnswer: "Enakku pudikkadhu",
              hint: "Enakku + pudikkadhu.",
            },
            {
              id: "u7-l1-e3",
              type: "mimicry",
              promptText: "Repeat: 'Adhu madhiriye' (Just like that / Similarly)",
              tamilAudioText: "Adhu madhiriye",
              englishTranslation: "Just like that / Exactly like that",
              phoneticBreakdown: ["Uh", "dhu", "muh", "dhi", "ri", "yeh"],
              correctAnswer: "Adhu madhiriye",
              hint: "From Lesson 362! Used when comparing things.",
            },
          ],
        },
      ],
    },
    {
      id: "u8",
      unitNumber: 8,
      title: "Time, Speed & Daily Urgency",
      subtitle: "Inspired by Lesson 365 & 361: Now, later, tomorrow, and 'Hurry up!'",
      iconName: "Clock",
      colorScheme: "from-teal-500 to-cyan-600",
      guidebook: {
        title: "Unit 8 Guidebook: Telling Time & Urgency",
        cefrLevel: "A2",
        overview: "Master temporal markers: Ippo (now), Apram (later), Naalaikku (tomorrow), Seekiram (quickly/early).",
        sections: [
          {
            title: "Time Words in Daily Life",
            explanation: "Colloquial Tamil often drops long bookish endings. 'Ippo' is spoken for now, 'Apram' for later, and 'Seekiram' for fast/hurry.",
            keyPhrases: [
              { phrase: "Ippo ponga", translation: "Please go now", phonetic: "Ip - po  pon - guh" },
              { phrase: "Apram paarkkalaam", translation: "Let's see later / See you later", phonetic: "Up - ruhm  paar - kuhl - laam" },
              { phrase: "Seekiram vaanga", translation: "Come quickly!", phonetic: "See - ki - ruhm  vaan - guh" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u8-l1",
          title: "Now vs Later vs Tomorrow",
          description: "Organize plans and schedule meetings effortlessly",
          iconType: "headphones",
          xpReward: 20,
          exercises: [
            {
              id: "u8-l1-e1",
              type: "listening",
              promptText: "What parting phrase did the speaker use?",
              tamilAudioText: "Apram paarkkalaam",
              englishTranslation: "See you later / Let's see later",
              options: [
                "See you later / Let's see later",
                "I cannot come today",
                "Where were you yesterday?",
                "Call me immediately",
              ],
              correctAnswer: "See you later / Let's see later",
              hint: "'Apram' (later) + 'paarkkalaam' (let's meet/see).",
            },
            {
              id: "u8-l1-e2",
              type: "speaking",
              promptText: "Say urgently: 'Come quickly!' (respectful)",
              tamilAudioText: "Seekiram vaanga!",
              englishTranslation: "Come quickly!",
              correctAnswer: "Seekiram vaanga",
              hint: "'Seekiram' (quickly) + 'vaanga' (come).",
            },
            {
              id: "u8-l1-e3",
              type: "mimicry",
              promptText: "Repeat: 'Naalaikku kaalaila' (Tomorrow morning)",
              tamilAudioText: "Naalaikku kaalaila",
              englishTranslation: "Tomorrow morning",
              phoneticBreakdown: ["Naa", "laik", "ku", "Kaa", "lai", "luh"],
              correctAnswer: "Naalaikku kaalaila",
              hint: "Naalaikku (tomorrow) + kaalaila (in the morning).",
            },
          ],
        },
      ],
    },
    {
      id: "u9",
      unitNumber: 9,
      title: "Auto Rickshaw & Navigation",
      subtitle: "Direct auto drivers: Turn right, go straight, stop here!",
      iconName: "Navigation",
      colorScheme: "from-amber-600 to-yellow-600",
      guidebook: {
        title: "Unit 9 Guidebook: Street Navigation",
        cefrLevel: "A2",
        overview: "Taking an auto or taxi in Chennai or Madurai is easy when you know standard direction words.",
        sections: [
          {
            title: "Direction Commands",
            explanation: "Nerla (straight), Valadhu pakkam / Right-la (to the right), Idadhu pakkam / Left-la (to the left), Inga niruthunga (stop here).",
            keyPhrases: [
              { phrase: "Nerla ponga", translation: "Go straight", phonetic: "Ner - luh  pon - guh" },
              { phrase: "Right-la thirumbunga", translation: "Turn right", phonetic: "Right - luh  thi - room - boon - guh" },
              { phrase: "Inga niruthunga", translation: "Please stop here", phonetic: "In - guh  ni - roo - thoon - guh" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u9-l1",
          title: "Directing the Driver",
          description: "Say 'Nerla ponga' and 'Inga niruthunga'",
          iconType: "mic",
          xpReward: 20,
          exercises: [
            {
              id: "u9-l1-e1",
              type: "listening",
              promptText: "What direction is the passenger giving?",
              tamilAudioText: "Nerla ponga, signal kitta right-la thirumbunga",
              englishTranslation: "Go straight, turn right near the signal",
              options: [
                "Go straight, turn right near the signal",
                "Stop right now on the bridge",
                "Can you take a U-turn?",
                "How much is the fare?",
              ],
              correctAnswer: "Go straight, turn right near the signal",
              hint: "'Nerla' (straight) + 'Right-la thirumbunga' (turn right).",
            },
            {
              id: "u9-l1-e2",
              type: "speaking",
              promptText: "Tell the driver: 'Please stop here!'",
              tamilAudioText: "Inga niruthunga",
              englishTranslation: "Please stop here",
              correctAnswer: "Inga niruthunga",
              hint: "'Inga' (here) + 'niruthunga' (stop).",
            },
            {
              id: "u9-l1-e3",
              type: "mimicry",
              promptText: "Repeat: 'Meter podunga' (Please put on the meter)",
              tamilAudioText: "Meter podunga",
              englishTranslation: "Please turn on the meter",
              phoneticBreakdown: ["Mee", "ter", "Poh", "doon", "guh"],
              correctAnswer: "Meter podunga",
              hint: "Essential auto survival phrase!",
            },
          ],
        },
      ],
    },
  ],
};

// -------------------------------------------------------------
// SECTION 3: CONFIDENT CONVERSATIONALIST (CEFR B1)
// -------------------------------------------------------------
const SECTION_3: Section = {
  id: "section-3",
  sectionNumber: 3,
  cefrLevel: "B1 - Confident Conversationalist",
  title: "Confident: Narrative & Complex Thoughts",
  description: "Expressing conditions ('If'), feelings, past/present/future flow, and kinship banter.",
  badgeColor: "bg-purple-500",
  units: [
    {
      id: "u10",
      unitNumber: 10,
      title: "Family, Kinship & Friendly Banter",
      subtitle: "Address elders and peers with warmth: Anna, Akka, Thambi",
      iconName: "Users",
      colorScheme: "from-purple-600 to-indigo-700",
      guidebook: {
        title: "Unit 10 Guidebook: Tamil Kinship Titles",
        cefrLevel: "B1",
        overview: "In Tamil society, strangers are addressed as family members. Auto drivers and shopkeepers are 'Anna' (older brother).",
        sections: [
          {
            title: "Calling Strangers Respectfully",
            explanation: "Anna (elder brother), Akka (elder sister), Thambi (younger brother), Amma (mother/respectful woman). Calling a shopkeeper 'Anna' creates instant goodwill.",
            keyPhrases: [
              { phrase: "Anna, idhu evvalavu?", translation: "Brother, how much is this?", phonetic: "Un - nah  i - dhu  ev - vuh - luh - vu" },
              { phrase: "Namma veedu", translation: "Our home", phonetic: "Nuhm - muh  vee - du" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u10-l1",
          title: "Kinship as Social Glue",
          description: "Use 'Anna' and 'Akka' on the street effortlessly",
          iconType: "star",
          xpReward: 25,
          exercises: [
            {
              id: "u10-l1-e1",
              type: "listening",
              promptText: "How did the speaker address the vendor?",
              tamilAudioText: "Anna, konjam seekiram kudunga",
              englishTranslation: "Brother, please give it a bit quickly",
              options: [
                "Brother, please give it a bit quickly",
                "Sir, where is my bill?",
                "Can you pack two items?",
                "When will the shop open?",
              ],
              correctAnswer: "Brother, please give it a bit quickly",
              hint: "'Anna' (brother) + 'seekiram' (quickly).",
            },
            {
              id: "u10-l1-e2",
              type: "speaking",
              promptText: "Ask an elder brother on the street: 'Anna, where is this?'",
              tamilAudioText: "Anna, idhu enga irukku?",
              englishTranslation: "Brother, where is this?",
              correctAnswer: "Anna, idhu enga irukku",
              hint: "Anna + idhu + enga + irukku.",
            },
          ],
        },
      ],
    },
    {
      id: "u11",
      unitNumber: 11,
      title: "Conditional 'If' Statements",
      subtitle: "Say 'If you come, I will go' with the -aa suffix",
      iconName: "GitBranch",
      colorScheme: "from-blue-600 to-cyan-600",
      guidebook: {
        title: "Unit 11 Guidebook: The '-aa' Condition",
        cefrLevel: "B1",
        overview: "To say 'if', spoken Tamil attaches '-aa' to past stems. Vandhaa (if [you] come), Ponaa (if [you] go), Paathaa (if [you] look).",
        sections: [
          {
            title: "Conditional Rule",
            explanation: "Neenga vandhaa, naan varen = If you come, I will come. Mazhai vandhaa, pogalaam = If rain comes, we will go.",
            keyPhrases: [
              { phrase: "Neenga vandhaa", translation: "If you come", phonetic: "Neen - guh  vuhn - dhaa" },
              { phrase: "Paathaa theriyum", translation: "If you look, you will know", phonetic: "Paa - thaa  theh - ri - yum" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u11-l1",
          title: "Conditionals in Action",
          description: "Say 'Vandhaa' and 'Paathaa theriyum'",
          iconType: "headphones",
          xpReward: 25,
          exercises: [
            {
              id: "u11-l1-e1",
              type: "listening",
              promptText: "What colloquial promise is being made?",
              tamilAudioText: "Neenga vandhaa, naan kandippa varen",
              englishTranslation: "If you come, I will definitely come",
              options: [
                "If you come, I will definitely come",
                "I am leaving whether you come or not",
                "Where did you go yesterday?",
                "Will you wait for me?",
              ],
              correctAnswer: "If you come, I will definitely come",
              hint: "'Vandhaa' (if you come) + 'kandippa' (definitely).",
            },
            {
              id: "u11-l1-e2",
              type: "speaking",
              promptText: "Say in Spoken Tamil: 'If you look, you will know'",
              tamilAudioText: "Paathaa theriyum",
              englishTranslation: "If you look, you will know",
              correctAnswer: "Paathaa theriyum",
              hint: "Paathaa (if you look) + theriyum (will know).",
            },
          ],
        },
      ],
    },
    {
      id: "u12",
      unitNumber: 12,
      title: "Colloquial Lies & Street Truths",
      subtitle: "Inspired by Lesson 366: 'Poi solladheenga!' and 'Nijamava?'",
      iconName: "ShieldAlert",
      colorScheme: "from-rose-600 to-amber-600",
      guidebook: {
        title: "Unit 12 Guidebook: Banter & Truth",
        cefrLevel: "B1",
        overview: "Lesson 366 explains all the fun, colloquial vocabulary for calling someone out or questioning something unbelievable.",
        sections: [
          {
            title: "Banter Vocabulary",
            explanation: "Poi (lie), Poi solladheenga (Don't lie / No way!), Nijamava? (Really? / Is it true?), Unmai (truth).",
            keyPhrases: [
              { phrase: "Poi solladheenga!", translation: "Don't lie! / You're kidding!", phonetic: "Poi  sol - luh - dheen - guh" },
              { phrase: "Nijamava?", translation: "Really? / For real?", phonetic: "Ni - juh - muh - vaa" },
              { phrase: "Idhu unmai thaan", translation: "This is indeed the truth", phonetic: "I - dhu  un - mai  thaan" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u12-l1",
          title: "Calling Out Bluff & Expressing Shock",
          description: "From Lesson 366: Express disbelief naturally",
          iconType: "star",
          xpReward: 25,
          exercises: [
            {
              id: "u12-l1-e1",
              type: "listening",
              promptText: "What shocked reaction was given?",
              tamilAudioText: "Nijamava? Poi solladheenga!",
              englishTranslation: "Really? Don't lie / You're kidding!",
              options: [
                "Really? Don't lie / You're kidding!",
                "I believe you completely",
                "Can you repeat the story?",
                "What did he tell you?",
              ],
              correctAnswer: "Really? Don't lie / You're kidding!",
              hint: "'Nijamava' (Really?) + 'Poi solladheenga' (Don't lie).",
              videoReference: {
                videoId: "RynUBdqi3Zw",
                lessonTitle: "LEARN TAMIL 366 - Colloquial Vocabulary to Talk About Lies",
              },
            },
            {
              id: "u12-l1-e2",
              type: "speaking",
              promptText: "Say with surprise: 'Really?!' (Spoken Tamil)",
              tamilAudioText: "Nijamava?!",
              englishTranslation: "Really?! / For real?!",
              correctAnswer: "Nijamava",
              hint: "Nijam + avaa = Nijamava?!",
            },
            {
              id: "u12-l1-e3",
              type: "mimicry",
              promptText: "Repeat: 'Poi solladheenga' (Don't kid me / Don't lie)",
              tamilAudioText: "Poi solladheenga",
              englishTranslation: "Don't lie / You're kidding me",
              phoneticBreakdown: ["Poi", "Sol", "luh", "dheen", "guh"],
              correctAnswer: "Poi solladheenga",
              hint: "Poi (lie) + solladheenga (don't tell).",
            },
          ],
        },
      ],
    },
  ],
};

// -------------------------------------------------------------
// SECTION 4: STREET MASTER (CEFR B2 - COLLOQUIAL IDIOMS)
// -------------------------------------------------------------
const SECTION_4: Section = {
  id: "section-4",
  sectionNumber: 4,
  cefrLevel: "B2 - Street Master",
  title: "Street Master: Native Wit & Idioms",
  description: "Exclamations (Aiyo!, Appadiya!), cinema slang, proverbs, and effortless banter.",
  badgeColor: "bg-rose-500",
  units: [
    {
      id: "u13",
      unitNumber: 13,
      title: "Famous Exclamations & Reactions",
      subtitle: "Aiyo, Appadiya, Semma, and Che! Sound 100% native",
      iconName: "Sparkles",
      colorScheme: "from-pink-600 to-rose-700",
      guidebook: {
        title: "Unit 13 Guidebook: The Sound of Emotion",
        cefrLevel: "B2",
        overview: "Tamil speakers convey immense nuance through spontaneous exclamations. Knowing when to drop 'Aiyo' or 'Semma' is the true mark of fluency.",
        sections: [
          {
            title: "Key Exclamations",
            explanation: "'Aiyo' expresses mild frustration or sympathy. 'Semma' expresses awesomeness / peak quality. 'Appadiya?' means 'Is that so?!'.",
            keyPhrases: [
              { phrase: "Aiyo, enna aachu?", translation: "Oh dear, what happened?", phonetic: "Ai - yo  en - nuh  aa - chu" },
              { phrase: "Semma padam!", translation: "Awesome movie!", phonetic: "Sem - muh  puh - duhm" },
              { phrase: "Appadiya?!", translation: "Is that so?!", phonetic: "Up - puh - di - yaa" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u13-l1",
          title: "Mastering 'Aiyo' and 'Semma'",
          description: "Use Tamil's most iconic expressive words",
          iconType: "star",
          xpReward: 30,
          exercises: [
            {
              id: "u13-l1-e1",
              type: "listening",
              promptText: "What review did the speaker give?",
              tamilAudioText: "Idhu semma rusiya irukku!",
              englishTranslation: "This is super delicious!",
              options: [
                "This is super delicious!",
                "This food is too spicy",
                "Can you change the dish?",
                "I have eaten here before",
              ],
              correctAnswer: "This is super delicious!",
              hint: "'Semma' = awesome / top tier.",
            },
            {
              id: "u13-l1-e2",
              type: "speaking",
              promptText: "Say in Spoken Tamil: 'Oh dear, what happened?!'",
              tamilAudioText: "Aiyo, enna aachu?!",
              englishTranslation: "Oh dear, what happened?!",
              correctAnswer: "Aiyo, enna aachu",
              hint: "Aiyo + enna + aachu.",
            },
            {
              id: "u13-l1-e3",
              type: "mimicry",
              promptText: "Repeat: 'Appadiya?!' (Is that so?!)",
              tamilAudioText: "Appadiya?!",
              englishTranslation: "Is that so?!",
              phoneticBreakdown: ["Up", "puh", "di", "yaa"],
              correctAnswer: "Appadiya",
              hint: "Up-puh-di-yaa?! High pitched at the end.",
            },
          ],
        },
      ],
    },
    {
      id: "u14",
      unitNumber: 14,
      title: "Spider Web Vocabulary Technique",
      subtitle: "Inspired by Lesson 357: Expand 1 root word into 10 conversational sentences",
      iconName: "Globe",
      colorScheme: "from-emerald-600 to-teal-700",
      guidebook: {
        title: "Unit 14 Guidebook: Root Word Spider Web",
        cefrLevel: "B2",
        overview: "In Lesson 357, the teacher reveals the Spider Web method: take a core verb like 'Pesu' (Speak) and branch it into 'Pesunga', 'Pesaatheenga', 'Pesalaam', 'Pesiten'.",
        sections: [
          {
            title: "Branching Verbs",
            explanation: "Pesu (Speak) -> Pesunga (Please speak) -> Pesalaam (Let's speak) -> Pesiten (I spoke) -> Pesa mudiyum (Can speak).",
            keyPhrases: [
              { phrase: "Naan pesalaam", translation: "Let me speak / Shall I speak?", phonetic: "Naan  peh - suh - laam" },
              { phrase: "Tamil pesa mudiyum", translation: "Can speak Tamil", phonetic: "Tamil  peh - suh  mu - di - yum" },
            ],
          },
        ],
      },
      lessons: [
        {
          id: "u14-l1",
          title: "The Verb Web in Action",
          description: "From Lesson 357: Connect verb branches smoothly",
          iconType: "star",
          xpReward: 30,
          exercises: [
            {
              id: "u14-l1-e1",
              type: "listening",
              promptText: "What capability does the speaker announce?",
              tamilAudioText: "Ennala Tamil pesa mudiyum",
              englishTranslation: "I can speak Tamil (It is possible for me)",
              options: [
                "I can speak Tamil",
                "I cannot understand Tamil",
                "Please speak in English",
                "Who spoke just now?",
              ],
              correctAnswer: "I can speak Tamil",
              hint: "'Ennala' (by me) + 'pesa mudiyum' (possible to speak).",
            },
            {
              id: "u14-l1-e2",
              type: "speaking",
              promptText: "Say proudly in Spoken Tamil: 'Let's speak Tamil!'",
              tamilAudioText: "Tamil pesalaam!",
              englishTranslation: "Let's speak Tamil!",
              correctAnswer: "Tamil pesalaam",
              hint: "Tamil + pesalaam (let's speak).",
            },
          ],
        },
      ],
    },
  ],
};

export const SECTIONS: Section[] = [SECTION_1, SECTION_2, SECTION_3, SECTION_4];

// Flat list of units for quick path lookups
export const ALL_UNITS: Unit[] = SECTIONS.flatMap((s) => s.units);

// -------------------------------------------------------------
// DUOLINGO STORIES (INTERACTIVE SPOKEN NARRATIVES)
// -------------------------------------------------------------
export const STORIES: Story[] = [
  {
    id: "story-1",
    title: "At the Corner Chai Shop",
    subtitle: "Karthik orders hot tea and starts talking with Anna",
    xpReward: 30,
    turns: [
      {
        speaker: "Karthik",
        speakerAvatar: "👨",
        tamilText: "Anna, vanakkam! Oru strong tea kudunga.",
        englishTranslation: "Brother, hello! Please give me one strong tea.",
      },
      {
        speaker: "Tea Seller (Anna)",
        speakerAvatar: "☕",
        tamilText: "Vanakkam thambi! Sakkara konjam poodava, illai kammiya venuma?",
        englishTranslation: "Hello younger brother! Shall I add normal sugar, or do you want less?",
        question: {
          prompt: "What is Anna the tea seller asking Karthik?",
          options: [
            "How much sugar does he want in the tea?",
            "Whether he wants coffee instead?",
            "If he has money to pay right now?",
          ],
          correctAnswer: "How much sugar does he want in the tea?",
          hint: "'Sakkara' means sugar, and 'kammiya' means less.",
        },
      },
      {
        speaker: "Karthik",
        speakerAvatar: "👨",
        tamilText: "Sakkara kammiya thaan venum anna. Romba inipu vendaam.",
        englishTranslation: "I want less sugar only, brother. Don't want too much sweetness.",
      },
      {
        speaker: "Tea Seller (Anna)",
        speakerAvatar: "☕",
        tamilText: "Seri pa! Indhaanga, unga tea. Romba sooda irukku, paathu kudinga.",
        englishTranslation: "Alright! Here you go, your tea. It is very hot, drink carefully.",
      },
      {
        speaker: "Karthik",
        speakerAvatar: "👨",
        tamilText: "Romba nandri anna! Semma tea, romba nalla irukku.",
        englishTranslation: "Thank you very much, brother! Awesome tea, it is very good.",
      },
    ],
  },
  {
    id: "story-2",
    title: "The Garden Plant Bargain",
    subtitle: "Inspired by Lesson 371: Buying jasmine & rose pots in the nursery",
    xpReward: 35,
    turns: [
      {
        speaker: "Customer (Priya)",
        speakerAvatar: "👩",
        tamilText: "Anna, naan sila sedigal vaanga vandhirukken. Malli poo sedi irukka?",
        englishTranslation: "Brother, I came to buy some plants. Do you have jasmine plant pots?",
      },
      {
        speaker: "Gardener",
        speakerAvatar: "🌿",
        tamilText: "Irukku ma! Anga paarunga, nalla poothirukku. Idhu oru pot 150 rupees.",
        englishTranslation: "Yes we do! Look there, they have bloomed nicely. This is 150 rupees per pot.",
        question: {
          prompt: "How much is one jasmine pot according to the gardener?",
          options: [
            "150 rupees",
            "50 rupees",
            "500 rupees",
          ],
          correctAnswer: "150 rupees",
          hint: "He says: 'Oru pot 150 rupees.'",
        },
      },
      {
        speaker: "Customer (Priya)",
        speakerAvatar: "👩",
        tamilText: "Konjam korainga anna. Naan rendu pot vaanguren, 250 kudukkatuma?",
        englishTranslation: "Please reduce a bit brother. I will buy two pots, shall I give 250?",
      },
      {
        speaker: "Gardener",
        speakerAvatar: "🌿",
        tamilText: "Seri ma, ungalukku thaan indha offer! Rendu eduthukonga.",
        englishTranslation: "Alright! For you only this offer! Take two.",
      },
    ],
  },
];

// -------------------------------------------------------------
// MATCH MADNESS WORD PAIRS (TIMED SPEED MATCHING)
// -------------------------------------------------------------
export interface MatchPair {
  id: string;
  tamil: string;
  english: string;
}

export const MATCH_PAIRS: MatchPair[] = [
  { id: "1", tamil: "Vanakkam", english: "Hello / Greetings" },
  { id: "2", tamil: "Nandri", english: "Thank you" },
  { id: "3", tamil: "Romba", english: "Very / A lot" },
  { id: "4", tamil: "Ippo", english: "Now" },
  { id: "5", tamil: "Apram", english: "Later" },
  { id: "6", tamil: "Venum", english: "I want / Needed" },
  { id: "7", tamil: "Vendaam", english: "Don't want / No need" },
  { id: "8", tamil: "Thaan", english: "Only / Exactly" },
  { id: "9", tamil: "Sila", english: "Some / A few" },
  { id: "10", tamil: "Sedigal", english: "Plants" },
  { id: "11", tamil: "Thanni", english: "Water" },
  { id: "12", tamil: "Evvalavu?", english: "How much?" },
  { id: "13", tamil: "Vaanga", english: "Please come" },
  { id: "14", tamil: "Ukkaarunga", english: "Please sit down" },
  { id: "15", tamil: "Pudikkum", english: "I like it" },
  { id: "16", tamil: "Pudikkadhu", english: "I don't like it" },
  { id: "17", tamil: "Seekiram", english: "Quickly / Hurry" },
  { id: "18", tamil: "Nerla", english: "Straight" },
  { id: "19", tamil: "Nijamava?", english: "Really? / For real?" },
  { id: "20", tamil: "Semma", english: "Awesome / Peak" },
];
