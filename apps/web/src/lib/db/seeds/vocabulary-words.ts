/**
 * Seed: vocabulary_words + vocabulary_word_domains
 *
 * Run with:
 *   pnpm tsx src/lib/db/seeds/vocabulary-words.ts
 *
 * Safe to re-run — uses INSERT … ON CONFLICT DO NOTHING.
 */

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq } from 'drizzle-orm'
import * as schema from '../schema'
import type { VocabWordFamily, VocabSynonym, VocabExamples } from '../schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client, { schema })

type SeedWord = {
  word: string
  definition: string
  familyWords: VocabWordFamily
  synonyms: VocabSynonym[]
  collocations: string[]
  examples: VocabExamples
  domainNames: string[] | null
}

// ─── 100 IELTS Band 6.5 Academic Words ────────────────────────────────────────

const WORDS: SeedWord[] = [
  // ── General Academic (50 words) ──────────────────────────────────────────────
  {
    word: "impact",
    definition: "A strong effect or influence that something has on a situation or person",
    familyWords: { noun: "impact", verb: "impact", adjective: "impactful", adverb: null },
    synonyms: [
      { word: "effect", type: "synonym" },
      { word: "influence", type: "synonym" },
      { word: "repercussion", type: "synonym" },
      { word: "insignificance", type: "antonym" },
    ],
    collocations: ["profound impact", "negative impact on", "significant impact", "have an impact on", "social impact"],
    examples: {
      speaking: "The internet has had a huge impact on how we communicate with people every day.",
      writing: [
        "The proliferation of social media platforms has had a profound impact on political discourse in democratic societies.",
        "Policymakers must carefully assess the long-term impact of automation on employment before implementing sweeping reforms.",
      ],
    },
    domainNames: null,
  },
  {
    word: "significant",
    definition: "Important or large enough to have a noticeable effect or to be worth considering",
    familyWords: { noun: "significance", verb: null, adjective: "significant", adverb: "significantly" },
    synonyms: [
      { word: "substantial", type: "synonym" },
      { word: "considerable", type: "synonym" },
      { word: "notable", type: "synonym" },
      { word: "negligible", type: "antonym" },
    ],
    collocations: ["significant increase", "significant challenge", "play a significant role", "significant impact", "statistically significant"],
    examples: {
      speaking: "There has been a significant change in how young people use technology compared to ten years ago.",
      writing: [
        "A significant proportion of urban residents are exposed to dangerous levels of air pollution on a daily basis.",
        "The findings reveal a statistically significant correlation between access to quality education and long-term economic mobility.",
      ],
    },
    domainNames: null,
  },
  {
    word: "demonstrate",
    definition: "To show clearly through evidence, action, or argument that something is true or exists",
    familyWords: { noun: "demonstration", verb: "demonstrate", adjective: "demonstrable", adverb: "demonstrably" },
    synonyms: [
      { word: "illustrate", type: "synonym" },
      { word: "exhibit", type: "synonym" },
      { word: "reveal", type: "synonym" },
      { word: "conceal", type: "antonym" },
    ],
    collocations: ["demonstrate the need for", "clearly demonstrate", "demonstrate a willingness to", "demonstrate competence", "research demonstrates"],
    examples: {
      speaking: "Studies clearly demonstrate that regular exercise can help reduce stress levels significantly.",
      writing: [
        "Historical evidence demonstrates that periods of rapid technological change are consistently accompanied by significant social disruption.",
        "The experiment was designed to demonstrate that cognitive biases affect financial decision-making even among trained professionals.",
      ],
    },
    domainNames: null,
  },
  {
    word: "analyse",
    definition: "To examine something in detail in order to understand it or explain it",
    familyWords: { noun: "analysis", verb: "analyse", adjective: "analytical", adverb: "analytically" },
    synonyms: [
      { word: "examine", type: "synonym" },
      { word: "investigate", type: "synonym" },
      { word: "evaluate", type: "synonym" },
      { word: "overlook", type: "antonym" },
    ],
    collocations: ["analyse data", "critically analyse", "analyse the causes of", "analyse trends", "analyse the impact"],
    examples: {
      speaking: "It is important to analyse both the advantages and disadvantages before making a big decision.",
      writing: [
        "This essay will critically analyse the extent to which globalisation has contributed to rising economic inequality.",
        "Researchers used qualitative methods to analyse patterns of behaviour among urban youth in post-industrial communities.",
      ],
    },
    domainNames: null,
  },
  {
    word: "evaluate",
    definition: "To judge or assess the quality, importance, or value of something carefully",
    familyWords: { noun: "evaluation", verb: "evaluate", adjective: "evaluative", adverb: null },
    synonyms: [
      { word: "assess", type: "synonym" },
      { word: "appraise", type: "synonym" },
      { word: "scrutinise", type: "synonym" },
      { word: "disregard", type: "antonym" },
    ],
    collocations: ["evaluate the effectiveness of", "critically evaluate", "evaluate evidence", "evaluate performance", "evaluate outcomes"],
    examples: {
      speaking: "Before choosing a university, it is wise to evaluate the career opportunities each course can offer.",
      writing: [
        "This paper seeks to evaluate the effectiveness of international climate agreements in reducing carbon emissions.",
        "Educators must regularly evaluate teaching methodologies to ensure that pedagogical approaches remain relevant and effective.",
      ],
    },
    domainNames: null,
  },
  {
    word: "establish",
    definition: "To set up, create, or secure something on a lasting and official basis",
    familyWords: { noun: "establishment", verb: "establish", adjective: "established", adverb: null },
    synonyms: [
      { word: "found", type: "synonym" },
      { word: "institute", type: "synonym" },
      { word: "create", type: "synonym" },
      { word: "abolish", type: "antonym" },
    ],
    collocations: ["establish a framework", "establish a link between", "well-established", "establish credibility", "establish guidelines"],
    examples: {
      speaking: "Many countries have tried to establish international agreements to deal with climate change.",
      writing: [
        "It is essential to establish a robust regulatory framework before introducing autonomous vehicles to public roads.",
        "Research has established a strong link between childhood poverty and diminished academic achievement in later life.",
      ],
    },
    domainNames: null,
  },
  {
    word: "contribute",
    definition: "To give something, such as time, effort, or resources, towards a shared goal or outcome",
    familyWords: { noun: "contribution", verb: "contribute", adjective: "contributory", adverb: null },
    synonyms: [
      { word: "add to", type: "synonym" },
      { word: "facilitate", type: "synonym" },
      { word: "play a part in", type: "synonym" },
      { word: "detract from", type: "antonym" },
    ],
    collocations: ["contribute to society", "contribute significantly to", "major contributing factor", "contribute to growth", "contribute to the debate"],
    examples: {
      speaking: "Everyone has a responsibility to contribute to their local community in some way.",
      writing: [
        "Urbanisation has contributed significantly to the deterioration of air quality in developing nations over the past three decades.",
        "The report identifies several contributing factors to the rise in youth unemployment, including inadequate vocational training provision.",
      ],
    },
    domainNames: null,
  },
  {
    word: "facilitate",
    definition: "To make a process, action, or relationship easier or more achievable",
    familyWords: { noun: "facilitation", verb: "facilitate", adjective: "facilitative", adverb: null },
    synonyms: [
      { word: "enable", type: "synonym" },
      { word: "assist", type: "synonym" },
      { word: "promote", type: "synonym" },
      { word: "hinder", type: "antonym" },
    ],
    collocations: ["facilitate communication", "facilitate access to", "facilitate learning", "facilitate trade", "facilitate cooperation"],
    examples: {
      speaking: "Technology can really facilitate communication between people who live in different countries.",
      writing: [
        "Digital infrastructure plays a vital role in facilitating access to healthcare services in remote and underserved regions.",
        "International trade agreements are designed to facilitate the free movement of goods and capital across national borders.",
      ],
    },
    domainNames: null,
  },
  {
    word: "enhance",
    definition: "To improve or increase the quality, value, or attractiveness of something",
    familyWords: { noun: "enhancement", verb: "enhance", adjective: "enhanced", adverb: null },
    synonyms: [
      { word: "improve", type: "synonym" },
      { word: "boost", type: "synonym" },
      { word: "augment", type: "synonym" },
      { word: "diminish", type: "antonym" },
    ],
    collocations: ["enhance performance", "enhance quality of life", "enhance understanding", "enhance skills", "greatly enhance"],
    examples: {
      speaking: "Learning a second language can really enhance your career opportunities in today's global job market.",
      writing: [
        "Investment in early childhood education has been shown to significantly enhance long-term cognitive development and academic achievement.",
        "The government's infrastructure programme aims to enhance connectivity between rural communities and urban economic centres.",
      ],
    },
    domainNames: null,
  },
  {
    word: "fundamental",
    definition: "Of central or primary importance; forming the necessary base or core of something",
    familyWords: { noun: "fundamentals", verb: null, adjective: "fundamental", adverb: "fundamentally" },
    synonyms: [
      { word: "essential", type: "synonym" },
      { word: "core", type: "synonym" },
      { word: "integral", type: "synonym" },
      { word: "peripheral", type: "antonym" },
    ],
    collocations: ["fundamental right", "fundamental change", "fundamental principle", "play a fundamental role", "fundamental to success"],
    examples: {
      speaking: "Access to clean water is a fundamental human right that everyone deserves.",
      writing: [
        "A fundamental shift in consumer behaviour is necessary if societies are to meet their carbon reduction commitments.",
        "Education is fundamental to the development of a skilled workforce capable of competing in a knowledge-based economy.",
      ],
    },
    domainNames: null,
  },
  {
    word: "indicate",
    definition: "To point out, suggest, or show something, typically through evidence or signs",
    familyWords: { noun: "indication", verb: "indicate", adjective: "indicative", adverb: null },
    synonyms: [
      { word: "suggest", type: "synonym" },
      { word: "signal", type: "synonym" },
      { word: "imply", type: "synonym" },
      { word: "contradict", type: "antonym" },
    ],
    collocations: ["indicate a trend", "research indicates", "clearly indicate", "indicate the need for", "results indicate"],
    examples: {
      speaking: "The latest survey results indicate that most people prefer flexible working arrangements.",
      writing: [
        "Survey data indicate a growing public distrust of mainstream media, particularly among younger demographic groups.",
        "Rising unemployment figures indicate that current economic policies have failed to stimulate meaningful job creation.",
      ],
    },
    domainNames: null,
  },
  {
    word: "maintain",
    definition: "To keep something at the same level, standard, or condition over time",
    familyWords: { noun: "maintenance", verb: "maintain", adjective: null, adverb: null },
    synonyms: [
      { word: "sustain", type: "synonym" },
      { word: "preserve", type: "synonym" },
      { word: "uphold", type: "synonym" },
      { word: "neglect", type: "antonym" },
    ],
    collocations: ["maintain standards", "maintain a balance", "maintain order", "maintain relationships", "difficult to maintain"],
    examples: {
      speaking: "It can be very difficult to maintain a healthy work-life balance in a competitive job market.",
      writing: [
        "Governments have a responsibility to maintain public infrastructure to an acceptable standard through adequate and consistent funding.",
        "In order to maintain international competitiveness, industries must continuously invest in research, development, and workforce training.",
      ],
    },
    domainNames: null,
  },
  {
    word: "obtain",
    definition: "To get or acquire something, particularly through effort or a formal process",
    familyWords: { noun: null, verb: "obtain", adjective: "obtainable", adverb: null },
    synonyms: [
      { word: "acquire", type: "synonym" },
      { word: "secure", type: "synonym" },
      { word: "attain", type: "synonym" },
      { word: "relinquish", type: "antonym" },
    ],
    collocations: ["obtain a qualification", "obtain funding", "obtain permission", "obtain data", "difficult to obtain"],
    examples: {
      speaking: "Many students need to obtain additional qualifications to improve their employment prospects.",
      writing: [
        "Researchers must obtain informed consent from all participants before collecting any personal or sensitive data.",
        "Access to affordable credit allows small businesses to obtain the capital necessary for expansion and innovation.",
      ],
    },
    domainNames: null,
  },
  {
    word: "perceive",
    definition: "To become aware of or understand something through the senses or the mind",
    familyWords: { noun: "perception", verb: "perceive", adjective: "perceptive", adverb: "perceptively" },
    synonyms: [
      { word: "recognise", type: "synonym" },
      { word: "view", type: "synonym" },
      { word: "interpret", type: "synonym" },
      { word: "misunderstand", type: "antonym" },
    ],
    collocations: ["perceive as a threat", "widely perceived", "perceive a difference", "commonly perceived", "perceived benefit"],
    examples: {
      speaking: "Many people perceive social media as a negative influence on young people's mental health.",
      writing: [
        "Immigration is often perceived as a threat by those who believe it leads to increased competition for jobs and resources.",
        "The way in which risk is perceived by the public frequently differs from how scientists and experts assess it objectively.",
      ],
    },
    domainNames: null,
  },
  {
    word: "propose",
    definition: "To put forward a plan, suggestion, or idea for others to consider or act upon",
    familyWords: { noun: "proposal", verb: "propose", adjective: "proposed", adverb: null },
    synonyms: [
      { word: "suggest", type: "synonym" },
      { word: "recommend", type: "synonym" },
      { word: "advocate", type: "synonym" },
      { word: "oppose", type: "antonym" },
    ],
    collocations: ["propose a solution", "propose legislation", "as proposed by", "propose changes to", "widely proposed"],
    examples: {
      speaking: "Many experts propose that governments should invest more money in renewable energy sources.",
      writing: [
        "This essay proposes that compulsory civic education should be introduced at secondary school level to strengthen democratic participation.",
        "Several economists have proposed radical reforms to the taxation system as a means of reducing wealth inequality.",
      ],
    },
    domainNames: null,
  },
  {
    word: "require",
    definition: "To need something as essential or to make it necessary through rules or conditions",
    familyWords: { noun: "requirement", verb: "require", adjective: "required", adverb: null },
    synonyms: [
      { word: "necessitate", type: "synonym" },
      { word: "demand", type: "synonym" },
      { word: "mandate", type: "synonym" },
      { word: "permit", type: "antonym" },
    ],
    collocations: ["require attention", "require significant investment", "require a fundamental change", "legally required", "require action"],
    examples: {
      speaking: "Solving climate change requires cooperation from governments all around the world.",
      writing: [
        "Addressing the growing mental health crisis requires a fundamental restructuring of healthcare provision and public awareness campaigns.",
        "The transition to a low-carbon economy will require significant investment in green technologies and workforce retraining programmes.",
      ],
    },
    domainNames: null,
  },
  {
    word: "structure",
    definition: "The way in which parts are arranged or organised to form a coherent whole",
    familyWords: { noun: "structure", verb: "structure", adjective: "structural", adverb: "structurally" },
    synonyms: [
      { word: "framework", type: "synonym" },
      { word: "organisation", type: "synonym" },
      { word: "arrangement", type: "synonym" },
      { word: "disorder", type: "antonym" },
    ],
    collocations: ["social structure", "economic structure", "structural change", "deeply ingrained in the structure", "political structure"],
    examples: {
      speaking: "The structure of the education system varies a lot from country to country.",
      writing: [
        "The rigid hierarchical structure of many corporations limits innovation and impedes the rapid adaptation required in a competitive market.",
        "Structural inequality, rooted in historical patterns of discrimination, continues to shape access to opportunity across generations.",
      ],
    },
    domainNames: null,
  },
  {
    word: "approach",
    definition: "A particular way of dealing with or thinking about a problem or task",
    familyWords: { noun: "approach", verb: "approach", adjective: null, adverb: null },
    synonyms: [
      { word: "method", type: "synonym" },
      { word: "strategy", type: "synonym" },
      { word: "framework", type: "synonym" },
      { word: "avoidance", type: "antonym" },
    ],
    collocations: ["holistic approach", "take a different approach", "innovative approach", "a balanced approach", "adopt an approach"],
    examples: {
      speaking: "I think the best approach to learning a language is to practise speaking as often as possible.",
      writing: [
        "A holistic approach to public health must address not only physical illness but also mental and social well-being.",
        "The government's punitive approach to drug addiction has largely failed to reduce rates of substance abuse or related crime.",
      ],
    },
    domainNames: null,
  },
  {
    word: "evidence",
    definition: "Facts, information, or signs that show whether something is true or exists",
    familyWords: { noun: "evidence", verb: null, adjective: "evident", adverb: "evidently" },
    synonyms: [
      { word: "proof", type: "synonym" },
      { word: "data", type: "synonym" },
      { word: "indication", type: "synonym" },
      { word: "refutation", type: "antonym" },
    ],
    collocations: ["empirical evidence", "substantial evidence", "evidence suggests", "lack of evidence", "in light of the evidence"],
    examples: {
      speaking: "There is a lot of evidence showing that diet has a direct effect on a person's mental health.",
      writing: [
        "There is substantial empirical evidence to suggest that early intervention programmes significantly improve educational outcomes for disadvantaged children.",
        "In the absence of conclusive evidence, governments should apply the precautionary principle when making environmental policy decisions.",
      ],
    },
    domainNames: null,
  },
  {
    word: "justify",
    definition: "To show or prove that something is reasonable, necessary, or correct",
    familyWords: { noun: "justification", verb: "justify", adjective: "justifiable", adverb: "justifiably" },
    synonyms: [
      { word: "defend", type: "synonym" },
      { word: "validate", type: "synonym" },
      { word: "warrant", type: "synonym" },
      { word: "condemn", type: "antonym" },
    ],
    collocations: ["justify the means", "difficult to justify", "justify spending", "justify a decision", "morally justified"],
    examples: {
      speaking: "It is hard to justify spending billions on space exploration when so many people live in poverty.",
      writing: [
        "The government must provide transparent justification for any policy that restricts individual civil liberties in the name of national security.",
        "While cost-cutting measures may be financially justified, they rarely account for the long-term social consequences of service reductions.",
      ],
    },
    domainNames: null,
  },
  {
    word: "interpret",
    definition: "To understand and explain the meaning of something in a particular way",
    familyWords: { noun: "interpretation", verb: "interpret", adjective: "interpretive", adverb: null },
    synonyms: [
      { word: "construe", type: "synonym" },
      { word: "translate", type: "synonym" },
      { word: "explain", type: "synonym" },
      { word: "misread", type: "antonym" },
    ],
    collocations: ["interpret data", "interpret the results", "widely interpreted", "interpret a law", "correctly interpret"],
    examples: {
      speaking: "People often interpret the same piece of news in very different ways depending on their background.",
      writing: [
        "Statistical data must be interpreted carefully, as misleading visualisations can distort the conclusions drawn by the general public.",
        "How societies interpret the concept of personal freedom varies considerably across cultural, historical, and political contexts.",
      ],
    },
    domainNames: null,
  },
  {
    word: "reveal",
    definition: "To make known or show something that was previously hidden or unknown",
    familyWords: { noun: "revelation", verb: "reveal", adjective: "revealing", adverb: null },
    synonyms: [
      { word: "disclose", type: "synonym" },
      { word: "expose", type: "synonym" },
      { word: "uncover", type: "synonym" },
      { word: "conceal", type: "antonym" },
    ],
    collocations: ["reveal a disparity", "research reveals", "reveal the extent of", "reveal underlying issues", "clearly reveal"],
    examples: {
      speaking: "Recent surveys reveal that many young people feel very anxious about their future career prospects.",
      writing: [
        "The investigation revealed widespread corruption within local government, undermining public trust in democratic institutions.",
        "Longitudinal studies reveal that socioeconomic background remains a stronger predictor of educational attainment than innate ability.",
      ],
    },
    domainNames: null,
  },
  {
    word: "sustain",
    definition: "To keep something going over a period of time; to support or maintain",
    familyWords: { noun: "sustainability", verb: "sustain", adjective: "sustainable", adverb: "sustainably" },
    synonyms: [
      { word: "maintain", type: "synonym" },
      { word: "uphold", type: "synonym" },
      { word: "preserve", type: "synonym" },
      { word: "abandon", type: "antonym" },
    ],
    collocations: ["sustain growth", "sustain a loss", "difficult to sustain", "sustain momentum", "sustain life"],
    examples: {
      speaking: "It is very difficult to sustain motivation when studying for a long period of time without breaks.",
      writing: [
        "Current patterns of resource consumption are simply not sustainable and will lead to the irreversible depletion of natural reserves.",
        "Economic growth that fails to account for environmental costs cannot be sustained without severe long-term consequences for future generations.",
      ],
    },
    domainNames: null,
  },
  {
    word: "transform",
    definition: "To make a thorough or dramatic change in the form, character, or nature of something",
    familyWords: { noun: "transformation", verb: "transform", adjective: "transformative", adverb: null },
    synonyms: [
      { word: "revolutionise", type: "synonym" },
      { word: "reshape", type: "synonym" },
      { word: "overhaul", type: "synonym" },
      { word: "preserve", type: "antonym" },
    ],
    collocations: ["transform society", "radically transform", "transform the way", "transformative change", "transform an industry"],
    examples: {
      speaking: "Technology has completely transformed the way we shop, communicate, and access information.",
      writing: [
        "The digital revolution has fundamentally transformed global communication, rendering traditional media channels largely obsolete.",
        "Universal access to quality education has the potential to transform economic prospects for entire generations of disadvantaged communities.",
      ],
    },
    domainNames: null,
  },
  {
    word: "utilise",
    definition: "To make practical and effective use of something, especially resources or skills",
    familyWords: { noun: "utilisation", verb: "utilise", adjective: null, adverb: null },
    synonyms: [
      { word: "employ", type: "synonym" },
      { word: "harness", type: "synonym" },
      { word: "apply", type: "synonym" },
      { word: "waste", type: "antonym" },
    ],
    collocations: ["utilise resources", "fully utilise", "utilise technology", "utilise potential", "utilise data"],
    examples: {
      speaking: "Schools should utilise technology more effectively to help students learn at their own pace.",
      writing: [
        "Developing nations must utilise international aid strategically to build self-sufficient institutions rather than creating dependency.",
        "Modern agriculture increasingly utilises precision technology to minimise waste and maximise crop yields per hectare.",
      ],
    },
    domainNames: null,
  },
  {
    word: "assess",
    definition: "To evaluate or estimate the nature, quality, or ability of something or someone",
    familyWords: { noun: "assessment", verb: "assess", adjective: null, adverb: null },
    synonyms: [
      { word: "evaluate", type: "synonym" },
      { word: "appraise", type: "synonym" },
      { word: "gauge", type: "synonym" },
      { word: "overlook", type: "antonym" },
    ],
    collocations: ["assess the impact", "thoroughly assess", "assess risk", "assess performance", "accurately assess"],
    examples: {
      speaking: "Before making a career change, you should carefully assess your strengths and skills.",
      writing: [
        "It is difficult to accurately assess the long-term consequences of climate change given the complexity of ecological systems.",
        "Governments must continuously assess the effectiveness of public health interventions in order to allocate resources efficiently.",
      ],
    },
    domainNames: null,
  },
  {
    word: "emerge",
    definition: "To become apparent, known, or prominent; to come out from a hidden or difficult situation",
    familyWords: { noun: "emergence", verb: "emerge", adjective: "emerging", adverb: null },
    synonyms: [
      { word: "arise", type: "synonym" },
      { word: "surface", type: "synonym" },
      { word: "develop", type: "synonym" },
      { word: "disappear", type: "antonym" },
    ],
    collocations: ["emerge as a leader", "emerging economies", "patterns emerge", "emerge from crisis", "recently emerged"],
    examples: {
      speaking: "New technologies always seem to emerge and change the way we work and live.",
      writing: [
        "Emerging economies in Southeast Asia are increasingly positioned as the primary drivers of global economic growth.",
        "A new set of social challenges has emerged as a direct consequence of the rapid and largely unregulated expansion of social media.",
      ],
    },
    domainNames: null,
  },
  {
    word: "ensure",
    definition: "To make certain that something will happen or be the case",
    familyWords: { noun: null, verb: "ensure", adjective: null, adverb: null },
    synonyms: [
      { word: "guarantee", type: "synonym" },
      { word: "secure", type: "synonym" },
      { word: "safeguard", type: "synonym" },
      { word: "jeopardise", type: "antonym" },
    ],
    collocations: ["ensure compliance", "ensure access to", "ensure quality", "ensure the safety of", "measures to ensure"],
    examples: {
      speaking: "Parents need to ensure that their children have a balanced diet from a young age.",
      writing: [
        "Robust regulatory oversight is essential to ensure that corporations act in the public interest and not solely for profit.",
        "International bodies must cooperate to ensure that humanitarian aid reaches those most in need without political interference.",
      ],
    },
    domainNames: null,
  },
  {
    word: "adequate",
    definition: "Satisfactory or acceptable in quality or quantity for a particular purpose",
    familyWords: { noun: "adequacy", verb: null, adjective: "adequate", adverb: "adequately" },
    synonyms: [
      { word: "sufficient", type: "synonym" },
      { word: "satisfactory", type: "synonym" },
      { word: "acceptable", type: "synonym" },
      { word: "insufficient", type: "antonym" },
    ],
    collocations: ["adequate funding", "adequate provision of", "less than adequate", "ensure adequate access", "adequate infrastructure"],
    examples: {
      speaking: "Many low-income families struggle to find adequate housing in major cities.",
      writing: [
        "Without adequate investment in public transport infrastructure, urban congestion will continue to deteriorate in coming decades.",
        "The provision of adequate mental health services remains critically insufficient relative to the scale of demand in most developed nations.",
      ],
    },
    domainNames: null,
  },
  {
    word: "apparent",
    definition: "Clearly visible or understood; seeming real or true based on available evidence",
    familyWords: { noun: "appearance", verb: null, adjective: "apparent", adverb: "apparently" },
    synonyms: [
      { word: "evident", type: "synonym" },
      { word: "obvious", type: "synonym" },
      { word: "discernible", type: "synonym" },
      { word: "obscure", type: "antonym" },
    ],
    collocations: ["it is apparent that", "become apparent", "apparent lack of", "readily apparent", "apparent contradiction"],
    examples: {
      speaking: "It became apparent during the interview that the candidate was not prepared for the role.",
      writing: [
        "It is apparent that short-term economic priorities have consistently taken precedence over long-term environmental sustainability.",
        "The apparent contradiction between economic growth and ecological preservation lies at the heart of contemporary environmental policy debates.",
      ],
    },
    domainNames: null,
  },
  {
    word: "appropriate",
    definition: "Suitable or proper for a particular person, purpose, or situation",
    familyWords: { noun: "appropriateness", verb: "appropriate", adjective: "appropriate", adverb: "appropriately" },
    synonyms: [
      { word: "suitable", type: "synonym" },
      { word: "fitting", type: "synonym" },
      { word: "proper", type: "synonym" },
      { word: "inappropriate", type: "antonym" },
    ],
    collocations: ["appropriate measures", "appropriate response", "deemed appropriate", "appropriate level of", "culturally appropriate"],
    examples: {
      speaking: "It is important for governments to take appropriate measures to address rising levels of youth unemployment.",
      writing: [
        "Interventions must be culturally appropriate if they are to be accepted and adopted by local communities in developing nations.",
        "The court determined that a custodial sentence was appropriate given the severity and premeditated nature of the offence.",
      ],
    },
    domainNames: null,
  },
  {
    word: "crucial",
    definition: "Extremely important, especially in determining the outcome of something",
    familyWords: { noun: null, verb: null, adjective: "crucial", adverb: "crucially" },
    synonyms: [
      { word: "vital", type: "synonym" },
      { word: "critical", type: "synonym" },
      { word: "pivotal", type: "synonym" },
      { word: "trivial", type: "antonym" },
    ],
    collocations: ["crucial role", "crucial factor", "play a crucial part", "crucial step", "crucially important"],
    examples: {
      speaking: "Communication skills are crucial for success in almost any profession today.",
      writing: [
        "Early diagnosis plays a crucial role in improving survival rates for patients with life-threatening medical conditions.",
        "International cooperation is crucial if global carbon emissions are to be reduced to the levels required by climate scientists.",
      ],
    },
    domainNames: null,
  },
  {
    word: "diverse",
    definition: "Showing a wide variety; made up of many different types, forms, or people",
    familyWords: { noun: "diversity", verb: "diversify", adjective: "diverse", adverb: null },
    synonyms: [
      { word: "varied", type: "synonym" },
      { word: "heterogeneous", type: "synonym" },
      { word: "multifaceted", type: "synonym" },
      { word: "homogeneous", type: "antonym" },
    ],
    collocations: ["culturally diverse", "diverse range of", "diverse workforce", "increasingly diverse", "diverse perspectives"],
    examples: {
      speaking: "Living in a diverse city gives you the opportunity to learn about different cultures and ways of life.",
      writing: [
        "A diverse workforce brings a wider range of perspectives, which is positively correlated with organisational creativity and problem-solving capacity.",
        "Modern democracies must develop inclusive institutions capable of representing an increasingly culturally and ideologically diverse electorate.",
      ],
    },
    domainNames: null,
  },
  {
    word: "explicit",
    definition: "Stated clearly and in detail, leaving no room for ambiguity or confusion",
    familyWords: { noun: "explicitness", verb: null, adjective: "explicit", adverb: "explicitly" },
    synonyms: [
      { word: "clear", type: "synonym" },
      { word: "unambiguous", type: "synonym" },
      { word: "definitive", type: "synonym" },
      { word: "implicit", type: "antonym" },
    ],
    collocations: ["explicit consent", "explicitly state", "make explicit", "explicit reference to", "explicit instructions"],
    examples: {
      speaking: "Teachers should give explicit instructions so that students understand exactly what is expected of them.",
      writing: [
        "Data protection legislation requires organisations to obtain explicit consent from users before collecting or processing personal information.",
        "The policy document fails to make explicit the criteria by which funding decisions will be assessed and awarded.",
      ],
    },
    domainNames: null,
  },
  {
    word: "innovative",
    definition: "Introducing or using new ideas, methods, or technologies; original and creative",
    familyWords: { noun: "innovation", verb: "innovate", adjective: "innovative", adverb: "innovatively" },
    synonyms: [
      { word: "groundbreaking", type: "synonym" },
      { word: "pioneering", type: "synonym" },
      { word: "inventive", type: "synonym" },
      { word: "conventional", type: "antonym" },
    ],
    collocations: ["innovative approach", "innovative solution", "highly innovative", "innovative technology", "innovative thinking"],
    examples: {
      speaking: "Companies that invest in innovative thinking are usually the ones that survive in competitive markets.",
      writing: [
        "Governments must create regulatory environments that encourage innovative solutions to the challenges posed by climate change.",
        "The most innovative educational institutions are those that embrace experiential learning and critical thinking over rote memorisation.",
      ],
    },
    domainNames: null,
  },
  {
    word: "potential",
    definition: "Having the capacity or ability to develop, achieve, or become something in the future",
    familyWords: { noun: "potential", verb: null, adjective: "potential", adverb: "potentially" },
    synonyms: [
      { word: "capacity", type: "synonym" },
      { word: "prospect", type: "synonym" },
      { word: "promise", type: "synonym" },
      { word: "limitation", type: "antonym" },
    ],
    collocations: ["enormous potential", "realise potential", "potential benefits", "potential risks", "untapped potential"],
    examples: {
      speaking: "Renewable energy sources have enormous potential to replace fossil fuels in the coming decades.",
      writing: [
        "Artificial intelligence has the potential to revolutionise healthcare by enabling faster and more accurate diagnosis of complex conditions.",
        "Failing to invest in education leaves vast amounts of human potential untapped, with severe consequences for national productivity.",
      ],
    },
    domainNames: null,
  },
  {
    word: "valid",
    definition: "Based on sound reasoning or evidence; legally or officially acceptable",
    familyWords: { noun: "validity", verb: "validate", adjective: "valid", adverb: "validly" },
    synonyms: [
      { word: "legitimate", type: "synonym" },
      { word: "sound", type: "synonym" },
      { word: "credible", type: "synonym" },
      { word: "invalid", type: "antonym" },
    ],
    collocations: ["valid argument", "valid concern", "valid reason", "remain valid", "valid interpretation"],
    examples: {
      speaking: "Concerns about the environmental impact of fast fashion are completely valid and backed by evidence.",
      writing: [
        "While the argument against economic migration contains valid concerns, it often neglects the measurable benefits immigrants contribute to host societies.",
        "For research findings to be considered scientifically valid, they must be reproducible under consistent and controlled experimental conditions.",
      ],
    },
    domainNames: null,
  },
  {
    word: "consequence",
    definition: "A result or effect that follows from an action, event, or condition",
    familyWords: { noun: "consequence", verb: null, adjective: "consequent", adverb: "consequently" },
    synonyms: [
      { word: "outcome", type: "synonym" },
      { word: "repercussion", type: "synonym" },
      { word: "implication", type: "synonym" },
      { word: "cause", type: "antonym" },
    ],
    collocations: ["serious consequence", "as a consequence of", "face the consequences", "unintended consequence", "far-reaching consequences"],
    examples: {
      speaking: "One of the main consequences of globalisation is that local cultures can be lost or diluted.",
      writing: [
        "The long-term consequences of inadequate investment in public health infrastructure were made devastatingly clear during the COVID-19 pandemic.",
        "Short-sighted fiscal policies frequently produce unintended consequences that disproportionately harm the most economically vulnerable members of society.",
      ],
    },
    domainNames: null,
  },
  {
    word: "resolve",
    definition: "To find a satisfactory solution to a problem or dispute",
    familyWords: { noun: "resolution", verb: "resolve", adjective: "resolute", adverb: "resolutely" },
    synonyms: [
      { word: "settle", type: "synonym" },
      { word: "address", type: "synonym" },
      { word: "overcome", type: "synonym" },
      { word: "exacerbate", type: "antonym" },
    ],
    collocations: ["resolve a conflict", "resolve the issue", "difficult to resolve", "resolve through dialogue", "fail to resolve"],
    examples: {
      speaking: "Many workplace conflicts can be resolved through open and honest communication between colleagues.",
      writing: [
        "Diplomatic channels must be exhausted before military force is considered as a means of resolving international disputes.",
        "Structural inequality cannot be resolved through temporary measures; it requires a sustained and systemic overhaul of social institutions.",
      ],
    },
    domainNames: null,
  },
  {
    word: "generate",
    definition: "To produce or create something, especially a result, effect, or type of energy",
    familyWords: { noun: "generation", verb: "generate", adjective: null, adverb: null },
    synonyms: [
      { word: "produce", type: "synonym" },
      { word: "create", type: "synonym" },
      { word: "yield", type: "synonym" },
      { word: "consume", type: "antonym" },
    ],
    collocations: ["generate revenue", "generate employment", "generate debate", "generate electricity", "generate interest"],
    examples: {
      speaking: "Investing in clean energy is a great way to generate electricity without harming the environment.",
      writing: [
        "Tourism can generate significant economic benefits for developing regions, though these must be weighed against potential cultural and environmental costs.",
        "The report argues that investment in infrastructure projects will generate employment and stimulate broader economic growth in depressed regions.",
      ],
    },
    domainNames: null,
  },
  {
    word: "identify",
    definition: "To recognise and correctly name or establish the identity of something or someone",
    familyWords: { noun: "identification", verb: "identify", adjective: "identifiable", adverb: null },
    synonyms: [
      { word: "recognise", type: "synonym" },
      { word: "pinpoint", type: "synonym" },
      { word: "determine", type: "synonym" },
      { word: "overlook", type: "antonym" },
    ],
    collocations: ["identify a problem", "identify the causes", "correctly identify", "identify patterns", "identify opportunities"],
    examples: {
      speaking: "It is important to identify your weaknesses early so you can work on improving them.",
      writing: [
        "Policymakers must first identify the root causes of urban poverty before designing interventions that will have a lasting effect.",
        "The study identified several key risk factors associated with cardiovascular disease, many of which are directly related to lifestyle choices.",
      ],
    },
    domainNames: null,
  },
  {
    word: "involve",
    definition: "To include something as a necessary or integral part; to include someone in an activity",
    familyWords: { noun: "involvement", verb: "involve", adjective: "involved", adverb: null },
    synonyms: [
      { word: "entail", type: "synonym" },
      { word: "encompass", type: "synonym" },
      { word: "include", type: "synonym" },
      { word: "exclude", type: "antonym" },
    ],
    collocations: ["involve significant risk", "involve the community", "closely involved in", "actively involve", "involve a range of"],
    examples: {
      speaking: "Solving global problems like climate change involves cooperation from every country in the world.",
      writing: [
        "Effective healthcare reform necessarily involves cooperation between government bodies, medical institutions, and the broader community.",
        "Addressing food insecurity involves not only increasing agricultural output but also ensuring equitable distribution across affected populations.",
      ],
    },
    domainNames: null,
  },
  {
    word: "comprehensive",
    definition: "Including or dealing with all or nearly all aspects of something; thorough",
    familyWords: { noun: "comprehensiveness", verb: null, adjective: "comprehensive", adverb: "comprehensively" },
    synonyms: [
      { word: "thorough", type: "synonym" },
      { word: "exhaustive", type: "synonym" },
      { word: "all-encompassing", type: "synonym" },
      { word: "partial", type: "antonym" },
    ],
    collocations: ["comprehensive review", "comprehensive plan", "comprehensive approach", "comprehensive understanding", "comprehensive reform"],
    examples: {
      speaking: "We need a comprehensive plan to tackle all aspects of climate change, not just reduce emissions.",
      writing: [
        "A comprehensive approach to education reform must address funding disparities, curriculum content, and teacher training simultaneously.",
        "The government's failure to conduct a comprehensive environmental impact assessment prior to construction was widely criticised.",
      ],
    },
    domainNames: null,
  },
  {
    word: "emphasise",
    definition: "To give special importance or prominence to something when speaking or writing",
    familyWords: { noun: "emphasis", verb: "emphasise", adjective: "emphatic", adverb: "emphatically" },
    synonyms: [
      { word: "highlight", type: "synonym" },
      { word: "stress", type: "synonym" },
      { word: "underline", type: "synonym" },
      { word: "downplay", type: "antonym" },
    ],
    collocations: ["emphasise the importance of", "strongly emphasise", "it should be emphasised", "particular emphasis on", "emphasise a point"],
    examples: {
      speaking: "I would like to emphasise that regular exercise has mental as well as physical benefits.",
      writing: [
        "Proponents of free trade strongly emphasise its capacity to lift developing nations out of poverty through expanded market access.",
        "Educational research consistently emphasises the importance of early literacy as a foundation for lifelong learning and academic success.",
      ],
    },
    domainNames: null,
  },
  {
    word: "highlight",
    definition: "To draw particular attention to something, making it stand out as important",
    familyWords: { noun: "highlight", verb: "highlight", adjective: null, adverb: null },
    synonyms: [
      { word: "emphasise", type: "synonym" },
      { word: "underline", type: "synonym" },
      { word: "accentuate", type: "synonym" },
      { word: "obscure", type: "antonym" },
    ],
    collocations: ["highlight the need for", "highlight a key issue", "clearly highlight", "highlight disparities", "highlight the importance of"],
    examples: {
      speaking: "This report highlights some major problems with how governments currently deal with online misinformation.",
      writing: [
        "The pandemic has highlighted severe systemic weaknesses in the public health infrastructure of many developed nations.",
        "Recent research highlights the alarming disparity between educational outcomes for students from wealthy and low-income backgrounds.",
      ],
    },
    domainNames: null,
  },
  {
    word: "investigate",
    definition: "To carry out a systematic or formal inquiry to discover facts or information",
    familyWords: { noun: "investigation", verb: "investigate", adjective: "investigative", adverb: null },
    synonyms: [
      { word: "examine", type: "synonym" },
      { word: "probe", type: "synonym" },
      { word: "scrutinise", type: "synonym" },
      { word: "ignore", type: "antonym" },
    ],
    collocations: ["investigate the causes of", "thoroughly investigate", "investigate allegations", "independently investigate", "investigate a claim"],
    examples: {
      speaking: "Journalists play an important role in investigating corruption and holding powerful people accountable.",
      writing: [
        "This study investigates the relationship between socioeconomic deprivation and rates of criminal recidivism in post-industrial urban centres.",
        "An independent body must be established to thoroughly investigate allegations of financial misconduct within public sector organisations.",
      ],
    },
    domainNames: null,
  },
  {
    word: "overcome",
    definition: "To successfully deal with, manage, or gain control over a problem or obstacle",
    familyWords: { noun: null, verb: "overcome", adjective: null, adverb: null },
    synonyms: [
      { word: "surmount", type: "synonym" },
      { word: "conquer", type: "synonym" },
      { word: "prevail over", type: "synonym" },
      { word: "succumb to", type: "antonym" },
    ],
    collocations: ["overcome barriers", "overcome challenges", "overcome poverty", "difficult to overcome", "overcome resistance to"],
    examples: {
      speaking: "One of the main challenges for immigrants is overcoming the language barrier when they first arrive.",
      writing: [
        "Overcoming deep-rooted structural inequality requires sustained political will and a comprehensive redistribution of social and economic resources.",
        "Developing nations must overcome significant institutional and infrastructural barriers before they can fully benefit from globalisation.",
      ],
    },
    domainNames: null,
  },
  {
    word: "promote",
    definition: "To support or actively encourage the development, spread, or use of something",
    familyWords: { noun: "promotion", verb: "promote", adjective: null, adverb: null },
    synonyms: [
      { word: "advocate", type: "synonym" },
      { word: "foster", type: "synonym" },
      { word: "encourage", type: "synonym" },
      { word: "suppress", type: "antonym" },
    ],
    collocations: ["promote equality", "promote sustainable development", "promote awareness", "promote economic growth", "actively promote"],
    examples: {
      speaking: "Schools should do more to promote mental health awareness among students and teachers.",
      writing: [
        "International organisations have a responsibility to promote sustainable development practices that balance growth with environmental protection.",
        "Media literacy programmes should be promoted as a means of equipping citizens to critically evaluate news and information.",
      ],
    },
    domainNames: null,
  },
  {
    word: "acknowledge",
    definition: "To accept or admit the truth or existence of something; to express gratitude for something",
    familyWords: { noun: "acknowledgement", verb: "acknowledge", adjective: null, adverb: null },
    synonyms: [
      { word: "recognise", type: "synonym" },
      { word: "concede", type: "synonym" },
      { word: "accept", type: "synonym" },
      { word: "deny", type: "antonym" },
    ],
    collocations: ["widely acknowledged", "acknowledge the need for", "acknowledge limitations", "acknowledge the role of", "it must be acknowledged"],
    examples: {
      speaking: "It must be acknowledged that social media has both positive and negative effects on young people.",
      writing: [
        "It is widely acknowledged that income inequality has increased substantially in most developed economies since the 1980s.",
        "While the government's response was broadly effective, officials have been slow to acknowledge the disparate impact on minority communities.",
      ],
    },
    domainNames: null,
  },
  {
    word: "perspective",
    definition: "A particular attitude towards or way of thinking about a subject or problem",
    familyWords: { noun: "perspective", verb: null, adjective: null, adverb: null },
    synonyms: [
      { word: "viewpoint", type: "synonym" },
      { word: "standpoint", type: "synonym" },
      { word: "outlook", type: "synonym" },
      { word: "bias", type: "antonym" },
    ],
    collocations: ["from a broader perspective", "offer a perspective", "multiple perspectives", "put into perspective", "balanced perspective"],
    examples: {
      speaking: "Travelling abroad really helps you gain a different perspective on your own culture and society.",
      writing: [
        "To fully understand the causes of conflict, it is necessary to examine the issue from multiple historical and cultural perspectives.",
        "From an economic perspective, migration is broadly beneficial, as it addresses labour shortages and drives innovation.",
      ],
    },
    domainNames: null,
  },

  // ── Environment (10 words) ────────────────────────────────────────────────────
  {
    word: "mitigate",
    definition: "To reduce the severity, seriousness, or painfulness of something",
    familyWords: { noun: "mitigation", verb: "mitigate", adjective: null, adverb: null },
    synonyms: [
      { word: "alleviate", type: "synonym" },
      { word: "reduce", type: "synonym" },
      { word: "lessen", type: "synonym" },
      { word: "exacerbate", type: "antonym" },
    ],
    collocations: ["mitigate the effects of", "mitigate climate change", "mitigate risk", "measures to mitigate", "mitigate damage"],
    examples: {
      speaking: "There are many steps individuals can take to mitigate their impact on the environment.",
      writing: [
        "International agreements alone are insufficient to mitigate the effects of climate change without binding enforcement mechanisms.",
        "Urban planners are increasingly incorporating green spaces and tree canopies to mitigate the urban heat island effect.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Government & Society"],
  },
  {
    word: "sustainable",
    definition: "Able to be maintained over the long term without depleting natural resources or causing lasting damage",
    familyWords: { noun: "sustainability", verb: "sustain", adjective: "sustainable", adverb: "sustainably" },
    synonyms: [
      { word: "viable", type: "synonym" },
      { word: "enduring", type: "synonym" },
      { word: "eco-friendly", type: "synonym" },
      { word: "unsustainable", type: "antonym" },
    ],
    collocations: ["sustainable development", "environmentally sustainable", "sustainable energy", "sustainable agriculture", "long-term sustainability"],
    examples: {
      speaking: "Sustainable farming practices are essential if we want to protect the environment for future generations.",
      writing: [
        "The United Nations Sustainable Development Goals provide a framework for balancing economic growth with social equity and ecological preservation.",
        "Consumer demand for sustainable products has risen significantly, prompting major corporations to reconsider their supply chain and production practices.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Economy & Business"],
  },
  {
    word: "deplete",
    definition: "To reduce or use up the supply of a resource, especially until very little remains",
    familyWords: { noun: "depletion", verb: "deplete", adjective: "depleted", adverb: null },
    synonyms: [
      { word: "exhaust", type: "synonym" },
      { word: "drain", type: "synonym" },
      { word: "consume", type: "synonym" },
      { word: "replenish", type: "antonym" },
    ],
    collocations: ["deplete natural resources", "rapidly depleting", "ozone depletion", "deplete reserves", "deplete the soil"],
    examples: {
      speaking: "If we continue to deplete our natural resources at the current rate, future generations will suffer.",
      writing: [
        "Intensive agricultural practices have severely depleted soil fertility across vast areas of previously productive farmland.",
        "The rapid depletion of freshwater aquifers poses a grave threat to food security in arid and semi-arid regions globally.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Water & Natural Resources"],
  },
  {
    word: "renewable",
    definition: "Capable of being naturally replenished; not using up finite resources",
    familyWords: { noun: "renewability", verb: "renew", adjective: "renewable", adverb: null },
    synonyms: [
      { word: "sustainable", type: "synonym" },
      { word: "inexhaustible", type: "synonym" },
      { word: "clean", type: "synonym" },
      { word: "non-renewable", type: "antonym" },
    ],
    collocations: ["renewable energy", "renewable resources", "transition to renewable", "investment in renewable energy", "renewable sources"],
    examples: {
      speaking: "More governments should invest in renewable energy to reduce our dependence on oil and gas.",
      writing: [
        "The transition to renewable energy sources is both an environmental necessity and an economic opportunity for forward-thinking nations.",
        "Subsidising renewable energy infrastructure is a more fiscally responsible long-term strategy than continued investment in fossil fuel extraction.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Energy & Sustainability"],
  },
  {
    word: "exacerbate",
    definition: "To make an already bad or serious problem, situation, or feeling worse",
    familyWords: { noun: "exacerbation", verb: "exacerbate", adjective: null, adverb: null },
    synonyms: [
      { word: "worsen", type: "synonym" },
      { word: "aggravate", type: "synonym" },
      { word: "intensify", type: "synonym" },
      { word: "alleviate", type: "antonym" },
    ],
    collocations: ["exacerbate inequality", "exacerbate tensions", "exacerbate the problem", "further exacerbate", "exacerbate climate change"],
    examples: {
      speaking: "Cutting public services during a recession only exacerbates the suffering of the most vulnerable people.",
      writing: [
        "Rapid urbanisation, if poorly managed, can exacerbate existing inequalities and create severe pressure on infrastructure and public services.",
        "The widespread use of fossil fuels continues to exacerbate global warming, making the transition to clean energy increasingly urgent.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Government & Society", "Economy & Business"],
  },
  {
    word: "deteriorate",
    definition: "To become progressively worse in quality, value, or condition",
    familyWords: { noun: "deterioration", verb: "deteriorate", adjective: "deteriorating", adverb: null },
    synonyms: [
      { word: "decline", type: "synonym" },
      { word: "worsen", type: "synonym" },
      { word: "degrade", type: "synonym" },
      { word: "improve", type: "antonym" },
    ],
    collocations: ["deteriorate rapidly", "deteriorating conditions", "allow to deteriorate", "mental health deteriorates", "infrastructure deteriorates"],
    examples: {
      speaking: "Without proper maintenance, the quality of public services can quickly deteriorate.",
      writing: [
        "Air quality in major metropolitan areas continues to deteriorate as vehicle emissions and industrial pollutants exceed safe thresholds.",
        "The mental health of the workforce has visibly deteriorated in the wake of prolonged economic uncertainty and job insecurity.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Mental Health & Well-being"],
  },
  {
    word: "preserve",
    definition: "To maintain something in its original state; to keep something from being damaged or destroyed",
    familyWords: { noun: "preservation", verb: "preserve", adjective: "preserved", adverb: null },
    synonyms: [
      { word: "conserve", type: "synonym" },
      { word: "protect", type: "synonym" },
      { word: "safeguard", type: "synonym" },
      { word: "destroy", type: "antonym" },
    ],
    collocations: ["preserve the environment", "preserve biodiversity", "preserve cultural heritage", "well-preserved", "preserve a way of life"],
    examples: {
      speaking: "It is everyone's responsibility to help preserve the natural environment for future generations.",
      writing: [
        "National parks serve the dual purpose of preserving biodiversity and providing citizens with access to natural recreation spaces.",
        "Cultural policies must actively preserve minority languages and traditions that are threatened by the homogenising effects of globalisation.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Cultural Preservation"],
  },
  {
    word: "alleviate",
    definition: "To make something, especially pain or a problem, less severe or more bearable",
    familyWords: { noun: "alleviation", verb: "alleviate", adjective: null, adverb: null },
    synonyms: [
      { word: "relieve", type: "synonym" },
      { word: "ease", type: "synonym" },
      { word: "reduce", type: "synonym" },
      { word: "exacerbate", type: "antonym" },
    ],
    collocations: ["alleviate poverty", "alleviate suffering", "alleviate pressure", "measures to alleviate", "alleviate congestion"],
    examples: {
      speaking: "Investing in public transport is one of the best ways to alleviate traffic congestion in cities.",
      writing: [
        "Targeted social welfare programmes can alleviate short-term poverty, but they must be combined with structural reform to address root causes.",
        "Green urban spaces have been shown to alleviate stress and improve mental well-being among city dwellers.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Poverty & Inequality"],
  },
  {
    word: "contaminate",
    definition: "To make something impure, polluted, or dangerous by introducing harmful substances",
    familyWords: { noun: "contamination", verb: "contaminate", adjective: "contaminated", adverb: null },
    synonyms: [
      { word: "pollute", type: "synonym" },
      { word: "taint", type: "synonym" },
      { word: "poison", type: "synonym" },
      { word: "purify", type: "antonym" },
    ],
    collocations: ["contaminate water supplies", "contaminate the soil", "contaminated site", "heavily contaminated", "risk of contamination"],
    examples: {
      speaking: "Industrial waste can contaminate local water supplies and cause serious health problems for communities.",
      writing: [
        "The improper disposal of electronic waste has contaminated soil and groundwater in numerous low-income communities across South and Southeast Asia.",
        "Agricultural runoff containing pesticides and fertilisers continues to contaminate river systems, posing a serious threat to aquatic ecosystems.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Water & Natural Resources"],
  },
  {
    word: "emission",
    definition: "The production and release of a substance, especially a gas or radiation, into the environment",
    familyWords: { noun: "emission", verb: "emit", adjective: null, adverb: null },
    synonyms: [
      { word: "discharge", type: "synonym" },
      { word: "release", type: "synonym" },
      { word: "output", type: "synonym" },
      { word: "absorption", type: "antonym" },
    ],
    collocations: ["carbon emissions", "greenhouse gas emissions", "reduce emissions", "emission targets", "net-zero emissions"],
    examples: {
      speaking: "Countries need to work together to reduce carbon emissions if we want to slow down climate change.",
      writing: [
        "Achieving net-zero carbon emissions by 2050 will require transformational changes to energy, transport, and industrial sectors globally.",
        "The introduction of carbon taxation is widely regarded as one of the most effective policy mechanisms for reducing greenhouse gas emissions.",
      ],
    },
    domainNames: ["Environment & Climate Change", "Energy & Sustainability"],
  },

  // ── Technology (10 words) ─────────────────────────────────────────────────────
  {
    word: "implement",
    definition: "To put a plan, decision, or system into action in a practical way",
    familyWords: { noun: "implementation", verb: "implement", adjective: null, adverb: null },
    synonyms: [
      { word: "execute", type: "synonym" },
      { word: "deploy", type: "synonym" },
      { word: "apply", type: "synonym" },
      { word: "abandon", type: "antonym" },
    ],
    collocations: ["implement a policy", "implement changes", "successfully implement", "implement a strategy", "implement reforms"],
    examples: {
      speaking: "Governments need to implement stricter regulations on social media companies to protect users' privacy.",
      writing: [
        "The successful implementation of AI in healthcare requires not only technical infrastructure but also comprehensive staff training and ethical oversight.",
        "Policymakers face significant political challenges when attempting to implement reforms that redistribute wealth from established interests.",
      ],
    },
    domainNames: ["Technology & Innovation", "Government & Society"],
  },
  {
    word: "optimise",
    definition: "To make the best or most effective use of a situation, resource, or process",
    familyWords: { noun: "optimisation", verb: "optimise", adjective: "optimal", adverb: "optimally" },
    synonyms: [
      { word: "maximise", type: "synonym" },
      { word: "refine", type: "synonym" },
      { word: "streamline", type: "synonym" },
      { word: "impair", type: "antonym" },
    ],
    collocations: ["optimise performance", "optimise resource use", "optimise the process", "optimise efficiency", "continuously optimise"],
    examples: {
      speaking: "Businesses use data analytics to optimise their marketing strategies and reach more customers.",
      writing: [
        "Machine learning algorithms are increasingly used to optimise supply chain logistics, significantly reducing both cost and environmental impact.",
        "Urban transport networks must be carefully designed and continuously optimised to meet the evolving mobility needs of growing populations.",
      ],
    },
    domainNames: ["Technology & Innovation", "Artificial Intelligence & Automation"],
  },
  {
    word: "integrate",
    definition: "To combine different elements into a whole; to incorporate something into a larger system",
    familyWords: { noun: "integration", verb: "integrate", adjective: "integrated", adverb: null },
    synonyms: [
      { word: "incorporate", type: "synonym" },
      { word: "merge", type: "synonym" },
      { word: "combine", type: "synonym" },
      { word: "segregate", type: "antonym" },
    ],
    collocations: ["integrate technology", "fully integrated", "integrate into society", "integrate services", "social integration"],
    examples: {
      speaking: "Many companies are finding ways to integrate artificial intelligence into their daily operations.",
      writing: [
        "The challenge of integrating renewable energy into national power grids requires significant investment in storage technology and grid modernisation.",
        "Successful immigration policy must prioritise the social and economic integration of newcomers rather than merely managing entry numbers.",
      ],
    },
    domainNames: ["Technology & Innovation", "Immigration & Migration"],
  },
  {
    word: "disrupt",
    definition: "To interrupt the normal progress of something; to cause disorder or a radical change",
    familyWords: { noun: "disruption", verb: "disrupt", adjective: "disruptive", adverb: "disruptively" },
    synonyms: [
      { word: "disturb", type: "synonym" },
      { word: "destabilise", type: "synonym" },
      { word: "overturn", type: "synonym" },
      { word: "stabilise", type: "antonym" },
    ],
    collocations: ["disrupt the market", "disrupt traditional industries", "cause disruption", "digitally disruptive", "disruptive innovation"],
    examples: {
      speaking: "New technologies always disrupt traditional industries, which can be both exciting and frightening for workers.",
      writing: [
        "The rise of platform-based economies has fundamentally disrupted traditional employment models, raising serious questions about worker rights and protection.",
        "Disruptive technologies, while economically beneficial in the long term, often impose significant short-term costs on displaced workers and communities.",
      ],
    },
    domainNames: ["Technology & Innovation", "Work & Employment", "Economy & Business"],
  },
  {
    word: "proliferate",
    definition: "To increase rapidly and spread widely in number or extent",
    familyWords: { noun: "proliferation", verb: "proliferate", adjective: null, adverb: null },
    synonyms: [
      { word: "multiply", type: "synonym" },
      { word: "expand", type: "synonym" },
      { word: "spread", type: "synonym" },
      { word: "diminish", type: "antonym" },
    ],
    collocations: ["proliferate rapidly", "nuclear proliferation", "information proliferates", "misinformation proliferates", "technology proliferates"],
    examples: {
      speaking: "Social media platforms have proliferated in recent years and changed how people access news.",
      writing: [
        "The proliferation of misinformation online poses a serious threat to democratic processes and informed public debate.",
        "The rapid proliferation of consumer electronics has generated unprecedented volumes of electronic waste that are difficult and costly to recycle responsibly.",
      ],
    },
    domainNames: ["Technology & Innovation", "Social Media & Internet"],
  },
  {
    word: "streamline",
    definition: "To make a process or organisation more efficient and effective by simplifying or removing unnecessary steps",
    familyWords: { noun: "streamlining", verb: "streamline", adjective: "streamlined", adverb: null },
    synonyms: [
      { word: "simplify", type: "synonym" },
      { word: "optimise", type: "synonym" },
      { word: "modernise", type: "synonym" },
      { word: "complicate", type: "antonym" },
    ],
    collocations: ["streamline processes", "streamline operations", "streamline bureaucracy", "streamline the system", "streamline service delivery"],
    examples: {
      speaking: "Technology has helped many businesses streamline their processes and reduce unnecessary costs.",
      writing: [
        "Digital transformation has enabled public sector organisations to streamline service delivery and reduce administrative costs substantially.",
        "Regulatory reform aimed at streamlining approval processes could significantly accelerate the deployment of renewable energy infrastructure.",
      ],
    },
    domainNames: ["Technology & Innovation", "Economy & Business"],
  },
  {
    word: "automate",
    definition: "To use technology or machinery to perform tasks that were previously done by humans",
    familyWords: { noun: "automation", verb: "automate", adjective: "automated", adverb: null },
    synonyms: [
      { word: "mechanise", type: "synonym" },
      { word: "digitalise", type: "synonym" },
      { word: "computerise", type: "synonym" },
      { word: "manually operate", type: "antonym" },
    ],
    collocations: ["automate tasks", "highly automated", "automate production", "risk of automation", "automate decision-making"],
    examples: {
      speaking: "Many factories have automated their production lines, which means fewer workers are needed on the floor.",
      writing: [
        "The automation of routine cognitive tasks poses a particular threat to workers in administrative, financial, and legal sectors.",
        "As industries continue to automate, governments must design proactive reskilling programmes to prevent large-scale structural unemployment.",
      ],
    },
    domainNames: ["Technology & Innovation", "Artificial Intelligence & Automation", "Work & Employment"],
  },
  {
    word: "revolutionise",
    definition: "To change something completely and fundamentally, especially in an area of human activity",
    familyWords: { noun: "revolution", verb: "revolutionise", adjective: "revolutionary", adverb: "revolutionarily" },
    synonyms: [
      { word: "transform", type: "synonym" },
      { word: "overhaul", type: "synonym" },
      { word: "reinvent", type: "synonym" },
      { word: "preserve", type: "antonym" },
    ],
    collocations: ["revolutionise healthcare", "revolutionise the industry", "completely revolutionise", "revolutionise communication", "revolutionise education"],
    examples: {
      speaking: "Smartphones have completely revolutionised the way we communicate and access information.",
      writing: [
        "Artificial intelligence has the potential to revolutionise medical diagnosis by analysing vast datasets with a speed and accuracy beyond human capacity.",
        "The invention of the printing press revolutionised the dissemination of knowledge, fundamentally reshaping education, religion, and political power.",
      ],
    },
    domainNames: ["Technology & Innovation", "Artificial Intelligence & Automation"],
  },
  {
    word: "digitalise",
    definition: "To convert information, processes, or systems into a digital format",
    familyWords: { noun: "digitalisation", verb: "digitalise", adjective: "digitalised", adverb: null },
    synonyms: [
      { word: "digitise", type: "synonym" },
      { word: "computerise", type: "synonym" },
      { word: "modernise", type: "synonym" },
      { word: "de-digitalise", type: "antonym" },
    ],
    collocations: ["digitalise services", "digitalisation of the economy", "fully digitalised", "digitalise records", "rapid digitalisation"],
    examples: {
      speaking: "Many governments are trying to digitalise their public services to make them more accessible and efficient.",
      writing: [
        "The digitalisation of public records has improved administrative efficiency, though it raises legitimate concerns about data security and privacy.",
        "Nations that fail to digitalise their economies risk falling behind in an increasingly technology-driven global marketplace.",
      ],
    },
    domainNames: ["Technology & Innovation", "Digital Literacy & Online Learning"],
  },
  {
    word: "innovate",
    definition: "To introduce new and creative ideas, methods, or products into an industry or organisation",
    familyWords: { noun: "innovation", verb: "innovate", adjective: "innovative", adverb: "innovatively" },
    synonyms: [
      { word: "pioneer", type: "synonym" },
      { word: "create", type: "synonym" },
      { word: "invent", type: "synonym" },
      { word: "stagnate", type: "antonym" },
    ],
    collocations: ["innovate continuously", "innovate or perish", "capacity to innovate", "innovate in response to", "drive to innovate"],
    examples: {
      speaking: "Companies that refuse to innovate often fall behind their competitors and eventually fail.",
      writing: [
        "Nations that invest strategically in research and development are better positioned to innovate and maintain long-term economic competitiveness.",
        "The capacity to innovate is increasingly recognised as the primary driver of productivity growth in knowledge-based economies.",
      ],
    },
    domainNames: ["Technology & Innovation", "Economy & Business"],
  },

  // ── Economy & Business (10 words) ────────────────────────────────────────────
  {
    word: "allocate",
    definition: "To distribute resources or duties for a particular purpose in a planned way",
    familyWords: { noun: "allocation", verb: "allocate", adjective: null, adverb: null },
    synonyms: [
      { word: "distribute", type: "synonym" },
      { word: "assign", type: "synonym" },
      { word: "apportion", type: "synonym" },
      { word: "withhold", type: "antonym" },
    ],
    collocations: ["allocate resources", "allocate funding", "allocate responsibility", "allocate budget", "strategically allocate"],
    examples: {
      speaking: "Governments need to allocate more funding to public health in order to be prepared for future pandemics.",
      writing: [
        "The failure to allocate sufficient resources to preventative healthcare has placed enormous and unsustainable pressure on curative services.",
        "In times of fiscal austerity, decisions about how to allocate public spending inevitably reflect deeply contested political priorities.",
      ],
    },
    domainNames: ["Economy & Business", "Government & Society"],
  },
  {
    word: "subsidise",
    definition: "To support a person, organisation, or industry financially, typically through government funding",
    familyWords: { noun: "subsidy", verb: "subsidise", adjective: "subsidised", adverb: null },
    synonyms: [
      { word: "fund", type: "synonym" },
      { word: "support financially", type: "synonym" },
      { word: "underwrite", type: "synonym" },
      { word: "privatise", type: "antonym" },
    ],
    collocations: ["heavily subsidised", "subsidise agriculture", "government subsidy", "subsidise housing", "subsidise renewable energy"],
    examples: {
      speaking: "Many countries subsidise their farming industries to keep food prices affordable for ordinary people.",
      writing: [
        "Governments that choose to subsidise fossil fuel industries send contradictory signals to investors in renewable energy alternatives.",
        "Heavily subsidised public transport can reduce car usage significantly, thereby contributing to both congestion relief and emissions reductions.",
      ],
    },
    domainNames: ["Economy & Business", "Government & Society", "Energy & Sustainability"],
  },
  {
    word: "regulate",
    definition: "To control something by means of rules, laws, or official supervision",
    familyWords: { noun: "regulation", verb: "regulate", adjective: "regulatory", adverb: null },
    synonyms: [
      { word: "control", type: "synonym" },
      { word: "govern", type: "synonym" },
      { word: "oversee", type: "synonym" },
      { word: "deregulate", type: "antonym" },
    ],
    collocations: ["regulate the market", "heavily regulated", "regulate emissions", "regulatory framework", "regulate social media"],
    examples: {
      speaking: "It is important for governments to regulate the financial sector to prevent economic crises.",
      writing: [
        "The failure to adequately regulate the banking sector prior to 2008 contributed directly to the most severe financial crisis in decades.",
        "There is growing consensus that social media platforms must be regulated more strictly to combat the spread of harmful misinformation.",
      ],
    },
    domainNames: ["Economy & Business", "Government & Society", "Social Media & Internet"],
  },
  {
    word: "redistribute",
    definition: "To distribute something again or differently, especially to achieve greater equality",
    familyWords: { noun: "redistribution", verb: "redistribute", adjective: null, adverb: null },
    synonyms: [
      { word: "reallocate", type: "synonym" },
      { word: "rebalance", type: "synonym" },
      { word: "transfer", type: "synonym" },
      { word: "concentrate", type: "antonym" },
    ],
    collocations: ["redistribute wealth", "redistribute income", "progressive redistribution", "redistribute resources", "tax and redistribute"],
    examples: {
      speaking: "Progressive taxation is one way governments can redistribute wealth more fairly across society.",
      writing: [
        "Critics of neoliberal economics argue that free markets do not naturally redistribute wealth and require state intervention to prevent extreme inequality.",
        "Redistributive taxation policies remain deeply contested, with proponents emphasising social justice and opponents warning of disincentives to investment.",
      ],
    },
    domainNames: ["Economy & Business", "Government & Society", "Poverty & Inequality"],
  },
  {
    word: "stimulate",
    definition: "To encourage growth, activity, or interest; to cause something to function more actively",
    familyWords: { noun: "stimulation", verb: "stimulate", adjective: "stimulating", adverb: null },
    synonyms: [
      { word: "encourage", type: "synonym" },
      { word: "boost", type: "synonym" },
      { word: "invigorate", type: "synonym" },
      { word: "suppress", type: "antonym" },
    ],
    collocations: ["stimulate economic growth", "stimulate investment", "stimulate demand", "stimulate debate", "stimulate innovation"],
    examples: {
      speaking: "Governments often cut interest rates to stimulate economic growth during a recession.",
      writing: [
        "Infrastructure investment is widely regarded as one of the most effective fiscal tools available to governments seeking to stimulate economic activity.",
        "Tax incentives designed to stimulate private sector research and development have produced mixed results across different national contexts.",
      ],
    },
    domainNames: ["Economy & Business", "Government & Society"],
  },
  {
    word: "flourish",
    definition: "To grow or develop successfully; to be in a healthy, vigorous state",
    familyWords: { noun: null, verb: "flourish", adjective: "flourishing", adverb: null },
    synonyms: [
      { word: "thrive", type: "synonym" },
      { word: "prosper", type: "synonym" },
      { word: "advance", type: "synonym" },
      { word: "decline", type: "antonym" },
    ],
    collocations: ["flourish in a competitive market", "allow to flourish", "business flourishes", "creativity flourishes", "cultures flourish"],
    examples: {
      speaking: "Small businesses tend to flourish in environments where there is strong local community support.",
      writing: [
        "Entrepreneurship flourishes most effectively in societies that offer strong legal protection for intellectual property and contract rights.",
        "Diverse and inclusive organisations tend to flourish because they draw on a wider range of experiences, perspectives, and creative approaches.",
      ],
    },
    domainNames: ["Economy & Business", "Education & Learning"],
  },
  {
    word: "commercialise",
    definition: "To manage or exploit something in a way primarily focused on generating profit",
    familyWords: { noun: "commercialisation", verb: "commercialise", adjective: "commercial", adverb: "commercially" },
    synonyms: [
      { word: "monetise", type: "synonym" },
      { word: "marketise", type: "synonym" },
      { word: "exploit commercially", type: "synonym" },
      { word: "de-commercialise", type: "antonym" },
    ],
    collocations: ["commercialise research", "over-commercialised", "commercialise sport", "commercialise culture", "attempt to commercialise"],
    examples: {
      speaking: "Some people feel that sport has become too commercialised and has lost its original spirit.",
      writing: [
        "The tendency to commercialise higher education has shifted institutional priorities away from knowledge production towards market-driven outcomes.",
        "Critics argue that the commercialisation of public services systematically prioritises profit over quality and equitable access.",
      ],
    },
    domainNames: ["Economy & Business", "Education & Learning", "Arts & Culture"],
  },
  {
    word: "liberalise",
    definition: "To make laws, policies, or systems less strict or more open, particularly in trade or politics",
    familyWords: { noun: "liberalisation", verb: "liberalise", adjective: "liberal", adverb: "liberally" },
    synonyms: [
      { word: "deregulate", type: "synonym" },
      { word: "open up", type: "synonym" },
      { word: "relax", type: "synonym" },
      { word: "tighten", type: "antonym" },
    ],
    collocations: ["liberalise trade", "liberalise the economy", "liberalise immigration", "liberalise drug laws", "gradual liberalisation"],
    examples: {
      speaking: "Many economists argue that countries should liberalise their trade policies to encourage foreign investment.",
      writing: [
        "The decision to liberalise financial markets in the 1980s laid the groundwork for unprecedented economic growth but also greater systemic instability.",
        "Trade liberalisation has delivered significant aggregate gains in global prosperity, though the distribution of these benefits remains deeply unequal.",
      ],
    },
    domainNames: ["Economy & Business", "Globalization", "Government & Society"],
  },
  {
    word: "outsource",
    definition: "To obtain goods, services, or work from an external supplier rather than performing it internally",
    familyWords: { noun: "outsourcing", verb: "outsource", adjective: null, adverb: null },
    synonyms: [
      { word: "contract out", type: "synonym" },
      { word: "delegate externally", type: "synonym" },
      { word: "subcontract", type: "synonym" },
      { word: "insource", type: "antonym" },
    ],
    collocations: ["outsource labour", "offshore outsourcing", "outsource manufacturing", "outsource services", "widely outsourced"],
    examples: {
      speaking: "Many companies outsource their customer service operations to countries where labour costs are lower.",
      writing: [
        "The practice of outsourcing manufacturing to lower-wage economies, while commercially rational, has contributed to deindustrialisation in many Western nations.",
        "Outsourcing core public services to private contractors raises fundamental questions about accountability, transparency, and the public interest.",
      ],
    },
    domainNames: ["Economy & Business", "Globalization", "Work & Employment"],
  },
  {
    word: "privatise",
    definition: "To transfer ownership or control of a business or industry from the state to private hands",
    familyWords: { noun: "privatisation", verb: "privatise", adjective: "private", adverb: null },
    synonyms: [
      { word: "commercialise", type: "synonym" },
      { word: "deregulate", type: "synonym" },
      { word: "transfer to private sector", type: "synonym" },
      { word: "nationalise", type: "antonym" },
    ],
    collocations: ["privatise utilities", "privatise healthcare", "widely privatised", "privatisation of public assets", "partially privatised"],
    examples: {
      speaking: "Some people believe that privatising public transport leads to better services, while others strongly disagree.",
      writing: [
        "The privatisation of water utilities has proven deeply controversial, as critics argue that access to clean water is a fundamental human right.",
        "Evidence on the outcomes of privatising public services is mixed, with results varying considerably depending on the regulatory environment.",
      ],
    },
    domainNames: ["Economy & Business", "Government & Society"],
  },

  // ── Government & Society (10 words) ──────────────────────────────────────────
  {
    word: "legislate",
    definition: "To make or enact laws through a formal process, typically by a parliament or government body",
    familyWords: { noun: "legislation", verb: "legislate", adjective: "legislative", adverb: null },
    synonyms: [
      { word: "enact", type: "synonym" },
      { word: "pass laws", type: "synonym" },
      { word: "regulate", type: "synonym" },
      { word: "repeal", type: "antonym" },
    ],
    collocations: ["legislate against", "legislate on behalf of", "comprehensive legislation", "fail to legislate", "legislate for change"],
    examples: {
      speaking: "Governments need to legislate against discrimination in the workplace to protect all employees.",
      writing: [
        "While public awareness campaigns play a role, lasting behavioural change often requires governments to legislate against harmful practices.",
        "The complexity of digital privacy issues has led many nations to legislate in this area, though enforcement remains challenging.",
      ],
    },
    domainNames: ["Government & Society", "Crime & Punishment"],
  },
  {
    word: "prohibit",
    definition: "To formally forbid something by law, rule, or authority",
    familyWords: { noun: "prohibition", verb: "prohibit", adjective: "prohibited", adverb: null },
    synonyms: [
      { word: "ban", type: "synonym" },
      { word: "forbid", type: "synonym" },
      { word: "outlaw", type: "synonym" },
      { word: "permit", type: "antonym" },
    ],
    collocations: ["strictly prohibited", "explicitly prohibit", "prohibit discrimination", "prohibit the use of", "legally prohibited"],
    examples: {
      speaking: "Many countries prohibit the use of mobile phones while driving because of the risk of accidents.",
      writing: [
        "International law prohibits the use of chemical weapons in armed conflict, yet enforcement mechanisms remain inadequate in practice.",
        "Whether to prohibit certain forms of online speech presents democratic governments with a difficult balance between safety and civil liberties.",
      ],
    },
    domainNames: ["Government & Society", "Crime & Punishment", "Freedom of Speech & Censorship"],
  },
  {
    word: "enforce",
    definition: "To compel compliance with a law, rule, or obligation through official means",
    familyWords: { noun: "enforcement", verb: "enforce", adjective: "enforceable", adverb: null },
    synonyms: [
      { word: "implement", type: "synonym" },
      { word: "impose", type: "synonym" },
      { word: "uphold", type: "synonym" },
      { word: "undermine", type: "antonym" },
    ],
    collocations: ["enforce regulations", "difficult to enforce", "enforce a ban", "strictly enforced", "enforcement mechanism"],
    examples: {
      speaking: "It is often very difficult for governments to enforce environmental laws in remote areas.",
      writing: [
        "Environmental agreements lack credibility without clearly defined and consistently enforced penalties for non-compliance.",
        "The rule of law depends not only on the quality of legislation but on the capacity of institutions to enforce it impartially.",
      ],
    },
    domainNames: ["Government & Society", "Crime & Punishment"],
  },
  {
    word: "govern",
    definition: "To conduct the policy and affairs of a state, organisation, or community",
    familyWords: { noun: "governance", verb: "govern", adjective: "governing", adverb: null },
    synonyms: [
      { word: "administer", type: "synonym" },
      { word: "manage", type: "synonym" },
      { word: "oversee", type: "synonym" },
      { word: "mismanage", type: "antonym" },
    ],
    collocations: ["effectively govern", "principles that govern", "govern a country", "govern behaviour", "transparent governance"],
    examples: {
      speaking: "It is difficult to effectively govern a country that has very high levels of inequality.",
      writing: [
        "Transparent and accountable governance is a prerequisite for sustainable economic development and the effective delivery of public services.",
        "The principles that govern data use by private corporations must be aligned with broader societal values of privacy and individual rights.",
      ],
    },
    domainNames: ["Government & Society", "Politics & Democracy"],
  },
  {
    word: "reform",
    definition: "To make changes to something in order to improve it, especially a system, law, or institution",
    familyWords: { noun: "reform", verb: "reform", adjective: "reformed", adverb: null },
    synonyms: [
      { word: "overhaul", type: "synonym" },
      { word: "restructure", type: "synonym" },
      { word: "improve", type: "synonym" },
      { word: "preserve", type: "antonym" },
    ],
    collocations: ["reform the system", "sweeping reform", "economic reform", "social reform", "reform is needed"],
    examples: {
      speaking: "Most experts agree that meaningful reform of the prison system is necessary to reduce reoffending rates.",
      writing: [
        "Meaningful electoral reform is essential if democratic institutions are to remain representative and responsive to an increasingly diverse population.",
        "The education system requires fundamental reform to address persistent achievement gaps between students from different socioeconomic backgrounds.",
      ],
    },
    domainNames: ["Government & Society", "Education & Learning", "Crime & Punishment"],
  },
  {
    word: "abolish",
    definition: "To formally put an end to a law, system, practice, or institution",
    familyWords: { noun: "abolition", verb: "abolish", adjective: null, adverb: null },
    synonyms: [
      { word: "eliminate", type: "synonym" },
      { word: "eradicate", type: "synonym" },
      { word: "do away with", type: "synonym" },
      { word: "establish", type: "antonym" },
    ],
    collocations: ["abolish the death penalty", "abolish slavery", "call to abolish", "completely abolish", "abolish a law"],
    examples: {
      speaking: "There is a strong argument for abolishing the death penalty in every country because of the risk of executing innocent people.",
      writing: [
        "The movement to abolish the death penalty has gained significant momentum in recent decades, with over two-thirds of nations having done so.",
        "Critics argue that tuition fees should be abolished entirely, as they deter capable students from lower-income backgrounds from pursuing higher education.",
      ],
    },
    domainNames: ["Government & Society", "Crime & Punishment"],
  },
  {
    word: "restrict",
    definition: "To put a limit on or keep under control; to prevent from moving or acting freely",
    familyWords: { noun: "restriction", verb: "restrict", adjective: "restrictive", adverb: null },
    synonyms: [
      { word: "limit", type: "synonym" },
      { word: "constrain", type: "synonym" },
      { word: "curb", type: "synonym" },
      { word: "liberalise", type: "antonym" },
    ],
    collocations: ["restrict access to", "tightly restricted", "restrict freedom of", "restrict immigration", "impose restrictions on"],
    examples: {
      speaking: "Some parents choose to restrict their children's screen time to protect their health and well-being.",
      writing: [
        "Measures to restrict the consumption of sugar-laden products through taxation have shown modest but measurable public health benefits.",
        "Governments that restrict freedom of the press undermine the accountability mechanisms that are fundamental to democratic governance.",
      ],
    },
    domainNames: ["Government & Society", "Crime & Punishment", "Freedom of Speech & Censorship"],
  },
  {
    word: "deter",
    definition: "To discourage someone from doing something through fear of consequences or obstacles",
    familyWords: { noun: "deterrence", verb: "deter", adjective: "deterrent", adverb: null },
    synonyms: [
      { word: "discourage", type: "synonym" },
      { word: "prevent", type: "synonym" },
      { word: "dissuade", type: "synonym" },
      { word: "encourage", type: "antonym" },
    ],
    collocations: ["act as a deterrent", "deter crime", "deter investment", "deter potential offenders", "effectively deter"],
    examples: {
      speaking: "Harsher punishments do not necessarily deter people from committing crimes if the root causes are not addressed.",
      writing: [
        "There is limited evidence that mandatory minimum sentencing functions as an effective deterrent to violent or drug-related crime.",
        "Complex bureaucratic procedures can deter qualified applicants from disadvantaged backgrounds from accessing university funding and support.",
      ],
    },
    domainNames: ["Government & Society", "Crime & Punishment"],
  },
  {
    word: "advocate",
    definition: "To publicly recommend or support a cause, policy, or person; to argue in favour of something",
    familyWords: { noun: "advocate / advocacy", verb: "advocate", adjective: null, adverb: null },
    synonyms: [
      { word: "champion", type: "synonym" },
      { word: "endorse", type: "synonym" },
      { word: "support", type: "synonym" },
      { word: "oppose", type: "antonym" },
    ],
    collocations: ["advocate for change", "strongly advocate", "advocate a policy", "human rights advocate", "advocate on behalf of"],
    examples: {
      speaking: "Many environmental groups advocate for stricter laws to protect endangered species from illegal poaching.",
      writing: [
        "Civil society organisations play a vital role in advocating for the rights of marginalised communities that are underrepresented in formal political processes.",
        "Economists who advocate for free trade often underestimate the distributional consequences for workers in import-competing industries.",
      ],
    },
    domainNames: ["Government & Society", "Politics & Democracy"],
  },
  {
    word: "criminalise",
    definition: "To make something illegal; to treat someone as a criminal",
    familyWords: { noun: "criminalisation", verb: "criminalise", adjective: "criminalised", adverb: null },
    synonyms: [
      { word: "prohibit", type: "synonym" },
      { word: "outlaw", type: "synonym" },
      { word: "penalise", type: "synonym" },
      { word: "decriminalise", type: "antonym" },
    ],
    collocations: ["criminalise behaviour", "criminalise poverty", "criminalise dissent", "move to criminalise", "criminalisation of"],
    examples: {
      speaking: "Some people argue that it is wrong to criminalise homelessness, as it punishes people for their circumstances.",
      writing: [
        "Policies that effectively criminalise poverty by penalising survival behaviours disproportionately impact the most economically vulnerable citizens.",
        "The debate over whether to criminalise or decriminalise drug possession reflects deeper societal disagreements about personal freedom and state responsibility.",
      ],
    },
    domainNames: ["Government & Society", "Crime & Punishment", "Drug Policy & Substance Use"],
  },

  // ── Education (10 words) ──────────────────────────────────────────────────────
  {
    word: "cultivate",
    definition: "To develop or foster a quality, skill, or relationship through sustained effort and attention",
    familyWords: { noun: "cultivation", verb: "cultivate", adjective: "cultivated", adverb: null },
    synonyms: [
      { word: "develop", type: "synonym" },
      { word: "nurture", type: "synonym" },
      { word: "foster", type: "synonym" },
      { word: "neglect", type: "antonym" },
    ],
    collocations: ["cultivate skills", "cultivate a culture of", "cultivate relationships", "cultivate talent", "cultivate critical thinking"],
    examples: {
      speaking: "Good teachers do more than just teach subjects — they cultivate curiosity and a love of learning.",
      writing: [
        "Universities have a responsibility not only to transmit knowledge but to cultivate independent thinking and civic engagement in their students.",
        "Organisations that actively cultivate a culture of continuous learning are better positioned to adapt to rapid technological change.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment"],
  },
  {
    word: "acquire",
    definition: "To obtain or develop knowledge, a skill, or an asset, typically over time",
    familyWords: { noun: "acquisition", verb: "acquire", adjective: null, adverb: null },
    synonyms: [
      { word: "gain", type: "synonym" },
      { word: "obtain", type: "synonym" },
      { word: "develop", type: "synonym" },
      { word: "lose", type: "antonym" },
    ],
    collocations: ["acquire skills", "acquire knowledge", "language acquisition", "acquire experience", "acquire qualifications"],
    examples: {
      speaking: "It is never too late to acquire new skills, especially with so many online learning resources available today.",
      writing: [
        "Language acquisition in early childhood differs fundamentally from the deliberate and cognitively demanding process of learning a second language in adulthood.",
        "The ability to acquire and apply new competencies rapidly is increasingly valued in workplaces undergoing digital transformation.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment"],
  },
  {
    word: "specialise",
    definition: "To concentrate on and become expert in a particular subject, field, or activity",
    familyWords: { noun: "specialisation", verb: "specialise", adjective: "specialist", adverb: null },
    synonyms: [
      { word: "focus on", type: "synonym" },
      { word: "concentrate on", type: "synonym" },
      { word: "major in", type: "synonym" },
      { word: "generalise", type: "antonym" },
    ],
    collocations: ["specialise in a field", "highly specialised", "specialist knowledge", "specialise at postgraduate level", "niche specialisation"],
    examples: {
      speaking: "Some doctors choose to specialise in a particular area of medicine, like cardiology or oncology.",
      writing: [
        "As labour markets become increasingly sophisticated, there is growing pressure on individuals to specialise in order to remain competitive.",
        "Nations that specialise in high-value manufacturing and services tend to benefit more consistently from global trade than commodity exporters.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment", "Economy & Business"],
  },
  {
    word: "collaborate",
    definition: "To work jointly with others towards a common goal, combining skills and knowledge",
    familyWords: { noun: "collaboration", verb: "collaborate", adjective: "collaborative", adverb: "collaboratively" },
    synonyms: [
      { word: "cooperate", type: "synonym" },
      { word: "partner", type: "synonym" },
      { word: "work together", type: "synonym" },
      { word: "compete", type: "antonym" },
    ],
    collocations: ["collaborate effectively", "collaborate across borders", "collaborative approach", "collaborate on research", "collaborate to solve"],
    examples: {
      speaking: "Students who collaborate on projects often develop better communication and problem-solving skills.",
      writing: [
        "Addressing transboundary environmental challenges such as ocean pollution requires nations to collaborate within robust multilateral institutional frameworks.",
        "Academic institutions that collaborate with industry partners are better equipped to align research outputs with real-world economic and social needs.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment", "Government & Society"],
  },
  {
    word: "empower",
    definition: "To give someone the authority, confidence, or means to do something; to make stronger",
    familyWords: { noun: "empowerment", verb: "empower", adjective: "empowered", adverb: null },
    synonyms: [
      { word: "enable", type: "synonym" },
      { word: "equip", type: "synonym" },
      { word: "authorise", type: "synonym" },
      { word: "disempower", type: "antonym" },
    ],
    collocations: ["empower communities", "empower women", "empower individuals", "economically empower", "empower young people"],
    examples: {
      speaking: "Education empowers people by giving them the tools they need to improve their own lives.",
      writing: [
        "Microfinance programmes have demonstrated a capacity to economically empower women in low-income communities by providing access to capital.",
        "Digital literacy programmes in schools aim to empower students to engage critically and safely with an increasingly mediated information environment.",
      ],
    },
    domainNames: ["Education & Learning", "Gender Equality & Women's Rights", "Poverty & Inequality"],
  },
  {
    word: "aspire",
    definition: "To have a strong desire and ambition to achieve something in the future",
    familyWords: { noun: "aspiration", verb: "aspire", adjective: "aspirational", adverb: null },
    synonyms: [
      { word: "aim for", type: "synonym" },
      { word: "strive towards", type: "synonym" },
      { word: "desire", type: "synonym" },
      { word: "resign oneself", type: "antonym" },
    ],
    collocations: ["aspire to achieve", "high aspirations", "aspire to a career in", "aspire to excellence", "rising aspirations"],
    examples: {
      speaking: "Many young people aspire to work in technology because they see it as a dynamic and well-paid field.",
      writing: [
        "Education systems must inspire students to aspire to excellence while simultaneously ensuring that high-quality provision is available to all, regardless of background.",
        "The aspirations of citizens in developing nations for improved living standards create both political pressure and economic opportunity for reform.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment"],
  },
  {
    word: "motivate",
    definition: "To provide a reason or incentive that causes someone to act or engage enthusiastically",
    familyWords: { noun: "motivation", verb: "motivate", adjective: "motivated", adverb: null },
    synonyms: [
      { word: "inspire", type: "synonym" },
      { word: "incentivise", type: "synonym" },
      { word: "drive", type: "synonym" },
      { word: "discourage", type: "antonym" },
    ],
    collocations: ["intrinsically motivated", "motivate students", "motivate employees", "lack of motivation", "highly motivated"],
    examples: {
      speaking: "It can be challenging to stay motivated when learning a language because progress often feels very slow.",
      writing: [
        "Research consistently shows that intrinsically motivated learners outperform those who are driven primarily by external rewards or fear of failure.",
        "Employers who fail to adequately motivate their workforce through meaningful work, recognition, and development opportunities face high rates of staff turnover.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment"],
  },
  {
    word: "accomplish",
    definition: "To succeed in achieving or completing something, especially something difficult or significant",
    familyWords: { noun: "accomplishment", verb: "accomplish", adjective: "accomplished", adverb: null },
    synonyms: [
      { word: "achieve", type: "synonym" },
      { word: "attain", type: "synonym" },
      { word: "fulfil", type: "synonym" },
      { word: "fail", type: "antonym" },
    ],
    collocations: ["accomplish a goal", "sense of accomplishment", "remarkable accomplishment", "accomplish through collaboration", "difficult to accomplish"],
    examples: {
      speaking: "With persistence and the right support, students can accomplish things they never thought were possible.",
      writing: [
        "What nations accomplish through international cooperation often far exceeds what they could achieve through unilateral action.",
        "The report acknowledges that meaningful progress on gender equality has been accomplished in many sectors, though significant disparities persist.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment"],
  },
  {
    word: "dedicate",
    definition: "To devote time, effort, or resources entirely to a particular task, purpose, or person",
    familyWords: { noun: "dedication", verb: "dedicate", adjective: "dedicated", adverb: null },
    synonyms: [
      { word: "commit", type: "synonym" },
      { word: "devote", type: "synonym" },
      { word: "invest in", type: "synonym" },
      { word: "neglect", type: "antonym" },
    ],
    collocations: ["dedicated professionals", "dedicate resources to", "deeply dedicated", "dedicate time to", "dedication to excellence"],
    examples: {
      speaking: "Becoming fluent in a second language requires a real dedication of time and consistent daily practice.",
      writing: [
        "Governments must dedicate substantially greater resources to early childhood education if long-term gaps in cognitive development are to be reduced.",
        "The organisation has dedicated itself to providing legal representation to individuals who cannot afford private counsel.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment"],
  },
  {
    word: "pursue",
    definition: "To follow or engage in something continuously over time; to seek to achieve a goal",
    familyWords: { noun: "pursuit", verb: "pursue", adjective: null, adverb: null },
    synonyms: [
      { word: "seek", type: "synonym" },
      { word: "strive for", type: "synonym" },
      { word: "follow", type: "synonym" },
      { word: "abandon", type: "antonym" },
    ],
    collocations: ["pursue a career", "pursue higher education", "pursue a policy", "actively pursue", "pursue economic growth"],
    examples: {
      speaking: "More young people from low-income backgrounds should be encouraged to pursue higher education.",
      writing: [
        "Nations that pursue economic growth at the expense of environmental protection risk creating long-term costs that far outweigh short-term gains.",
        "The decision to pursue diplomatic rather than military solutions to international disputes reflects a commitment to multilateralism and international law.",
      ],
    },
    domainNames: ["Education & Learning", "Work & Employment", "Government & Society"],
  },
]

// ─── Seeding logic ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('Seeding vocabulary_words …')

  // Fetch all domain names → IDs up front
  const allDomains = await db
    .select({ id: schema.writingDomains.id, name: schema.writingDomains.name })
    .from(schema.writingDomains)

  const domainMap = new Map(allDomains.map((d) => [d.name, d.id]))

  for (const entry of WORDS) {
    const { domainNames, ...wordData } = entry

    // Upsert the word
    const [inserted] = await db
      .insert(schema.vocabularyWords)
      .values(wordData)
      .onConflictDoUpdate({
        target: schema.vocabularyWords.word,
        set: {
          definition: wordData.definition,
          familyWords: wordData.familyWords,
          synonyms: wordData.synonyms,
          collocations: wordData.collocations,
          examples: wordData.examples,
        },
      })
      .returning({ id: schema.vocabularyWords.id })

    const wordId = inserted.id

    // Re-sync domain mappings (delete old, insert new)
    await db
      .delete(schema.vocabularyWordDomains)
      .where(eq(schema.vocabularyWordDomains.wordId, wordId))

    if (domainNames && domainNames.length > 0) {
      const domainIds = domainNames
        .map((name) => domainMap.get(name))
        .filter((id): id is number => id !== undefined)

      if (domainIds.length > 0) {
        await db
          .insert(schema.vocabularyWordDomains)
          .values(domainIds.map((domainId) => ({ wordId, domainId })))
          .onConflictDoNothing()
      }
    }
  }

  console.log(`  ✓ ${WORDS.length} words upserted`)

  const domainLinkCount = await db
    .select()
    .from(schema.vocabularyWordDomains)

  console.log(`  ✓ Total words in DB: ${WORDS.length}`)
  console.log(`  ✓ Domain links: ${domainLinkCount.length}`)

  await client.end()
  console.log('Done.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
