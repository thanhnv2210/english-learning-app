export type ParagraphSlot = {
  name: string
  description: string
  headingHint: string  // typical heading verb/phrase for this slot in Matching Headings
}

export type ArticleStructure = {
  id: string
  name: string
  tagline: string
  frequency: 'very common' | 'common' | 'occasional'
  color: 'blue' | 'rose' | 'orange' | 'purple' | 'teal' | 'amber' | 'green'
  signalPhrases: string[]        // phrases in the opening paragraph that reveal the structure
  slots: ParagraphSlot[]         // ordered paragraph blueprint
  headingsStrategy: string       // specific Matching Headings tactic for this structure
  exampleTopics: string[]        // IELTS Academic topics that commonly use this structure
}

export const ARTICLE_STRUCTURES: ArticleStructure[] = [
  {
    id: 'problem-solution',
    name: 'Problem → Solution',
    tagline: 'Identifies a problem, explores its causes or impact, then proposes and evaluates solution(s).',
    frequency: 'very common',
    color: 'rose',
    signalPhrases: [
      '"One of the most pressing challenges facing…"',
      '"The issue of X has become a growing concern…"',
      '"X poses a significant threat to…"',
      '"Addressing this problem requires…"',
      '"Despite efforts to combat X, the situation remains…"',
    ],
    slots: [
      {
        name: 'Background / Context',
        description: 'Establishes why the topic matters — scale, history, or relevance.',
        headingHint: '"The rise of X" · "A growing concern" · "Understanding X"',
      },
      {
        name: 'Problem Statement',
        description: 'Defines the core problem precisely — what it is and who it affects.',
        headingHint: '"The problem of X" · "Why X is a crisis" · "The challenge of X"',
      },
      {
        name: 'Causes',
        description: 'Analyses the root causes or contributing factors behind the problem.',
        headingHint: '"Factors behind X" · "Why X occurs" · "The origins of X"',
      },
      {
        name: 'Effects / Consequences',
        description: 'Describes the impact — human, economic, environmental, or social.',
        headingHint: '"The impact of X" · "Consequences of X" · "The cost of X"',
      },
      {
        name: 'Solution(s)',
        description: 'Proposes one or more responses — policy, technology, behaviour change.',
        headingHint: '"Tackling X" · "Addressing the issue" · "A way forward" · "Combating X"',
      },
      {
        name: 'Evaluation / Conclusion',
        description: 'Assesses how effective the solutions are and what remains to be done.',
        headingHint: '"How effective is X?" · "Limitations of current approaches" · "The road ahead"',
      },
    ],
    headingsStrategy:
      'Scan the heading list for pairs: one "problem" heading and one "solution" heading. These almost always both appear. Headings starting with action verbs ("Tackling", "Addressing", "Combating") map to the Solution slot; headings with "impact", "consequences", or "cost" map to the Effects slot. Use this to eliminate options quickly.',
    exampleTopics: [
      'Urban air pollution',
      'Plastic waste in oceans',
      'Antibiotic resistance',
      'Water scarcity in arid regions',
      'The decline of bee populations',
    ],
  },

  {
    id: 'cause-effect',
    name: 'Cause → Effect',
    tagline: 'Traces the causal chain from one or more driving factors to their short- and long-term outcomes.',
    frequency: 'common',
    color: 'orange',
    signalPhrases: [
      '"As a result of…"',
      '"This has led to…"',
      '"Due to…, the consequences have been…"',
      '"One factor contributing to X is…"',
      '"The knock-on effects of X include…"',
    ],
    slots: [
      {
        name: 'Introduction',
        description: 'Introduces the phenomenon or trend being explained.',
        headingHint: '"The phenomenon of X" · "An unexpected trend" · "X: an overview"',
      },
      {
        name: 'Primary Cause(s)',
        description: 'Explains the main driving factor(s) with evidence.',
        headingHint: '"The main driver of X" · "Why X happens" · "The root cause"',
      },
      {
        name: 'Secondary / Contributing Causes',
        description: 'Adds further factors that intensify or complicate the primary cause.',
        headingHint: '"Further contributing factors" · "Compounding the problem" · "Additional pressures"',
      },
      {
        name: 'Immediate Effects',
        description: 'Describes the direct, short-term consequences.',
        headingHint: '"Immediate consequences" · "The first impact" · "Short-term effects of X"',
      },
      {
        name: 'Long-term / Wider Effects',
        description: 'Covers the broader or delayed impacts on society, environment, or economy.',
        headingHint: '"Long-term implications" · "The wider impact" · "A lasting legacy"',
      },
      {
        name: 'Conclusion',
        description: 'Summarises the causal chain and may suggest ways to break it.',
        headingHint: '"Breaking the cycle" · "Looking ahead" · "What must change"',
      },
    ],
    headingsStrategy:
      'Cause and Effect structures often have headings that use contrast — e.g., one heading describes a phenomenon and the next describes its outcome. Look for headings with "result", "consequence", "impact", "lead to", or "stem from". Pair them mentally before reading the paragraphs. The introduction paragraph rarely has a strong heading — "An overview of X" or "The phenomenon of X" is the giveaway.',
    exampleTopics: [
      'The causes of obesity',
      'Why languages become extinct',
      'Effects of social media on mental health',
      'Climate change and coastal erosion',
      'Economic migration and its impact on host countries',
    ],
  },

  {
    id: 'scientific-discovery',
    name: 'Scientific Discovery / Research Study',
    tagline: 'Follows the arc of an investigation — context, hypothesis, method, findings, and implications.',
    frequency: 'very common',
    color: 'blue',
    signalPhrases: [
      '"Researchers at [university] have found…"',
      '"A study published in [journal] suggests…"',
      '"Scientists have long sought to understand…"',
      '"The experiment revealed…"',
      '"Further investigation showed…"',
    ],
    slots: [
      {
        name: 'Background / Knowledge Gap',
        description: 'Explains what was known before, and why a gap in knowledge existed.',
        headingHint: '"What scientists knew" · "A long-standing mystery" · "The question of X"',
      },
      {
        name: 'Hypothesis / Research Question',
        description: 'States what the researchers set out to prove or disprove.',
        headingHint: '"Testing the theory" · "A bold hypothesis" · "Setting out to prove X"',
      },
      {
        name: 'Methodology',
        description: 'Describes how the study was designed and conducted.',
        headingHint: '"How the research was conducted" · "The experimental approach" · "Designing the study"',
      },
      {
        name: 'Findings / Results',
        description: 'Presents what the study discovered — the data and observations.',
        headingHint: '"What the data showed" · "Surprising results" · "The key finding" · "An unexpected discovery"',
      },
      {
        name: 'Analysis / Interpretation',
        description: 'Explains what the results mean and how they fit into existing knowledge.',
        headingHint: '"Making sense of the results" · "What this means for X" · "Interpreting the evidence"',
      },
      {
        name: 'Implications / Future Research',
        description: 'Discusses the broader significance and what still needs to be explored.',
        headingHint: '"The road ahead" · "Wider applications" · "Future directions" · "Unanswered questions"',
      },
    ],
    headingsStrategy:
      'This structure is highly predictable. The Methodology paragraph is the easiest to identify — its heading will reference "how", "approach", "design", or "conduct". Findings headings use "discover", "reveal", "show", or "find". Implications headings use "mean", "suggest", "application", or "future". Lock these in first, then use remaining options for Background and Hypothesis.',
    exampleTopics: [
      'Memory and sleep research',
      'The discovery of a new species',
      'Gut microbiome and health',
      'How languages are processed in the brain',
      'The effects of music on plant growth',
    ],
  },

  {
    id: 'historical-evolution',
    name: 'Historical Evolution / Chronological',
    tagline: 'Traces how a subject developed or transformed across time, from origins to the present.',
    frequency: 'common',
    color: 'purple',
    signalPhrases: [
      '"In the early days of X…"',
      '"X has a long and complex history…"',
      '"The origins of X can be traced to…"',
      '"Over the following decades…"',
      '"The turning point came when…"',
    ],
    slots: [
      {
        name: 'Origins',
        description: 'Describes how and where the subject first appeared or was invented.',
        headingHint: '"The origins of X" · "How X began" · "The birth of X" · "Early X"',
      },
      {
        name: 'Early Development',
        description: 'Covers the first phase of growth, adoption, or change.',
        headingHint: '"The first steps" · "Early growth" · "X takes shape" · "The spread of X"',
      },
      {
        name: 'Key Turning Point',
        description: 'A pivotal moment, discovery, or event that changed everything.',
        headingHint: '"A pivotal moment" · "The revolution in X" · "X transformed" · "A new era"',
      },
      {
        name: 'Further Development',
        description: 'Follows progress after the turning point through additional phases.',
        headingHint: '"X evolves further" · "Continued progress" · "Building on success" · "The next stage"',
      },
      {
        name: 'Modern Form',
        description: 'Describes the subject as it exists today.',
        headingHint: '"X today" · "The modern form" · "X in the 21st century" · "The current state"',
      },
      {
        name: 'Legacy / Significance',
        description: 'Reflects on why the historical journey matters now.',
        headingHint: '"The lasting legacy" · "Why X still matters" · "The significance of X"',
      },
    ],
    headingsStrategy:
      'Time-marker words in the paragraph are your anchor — paragraphs with "today", "now", or "currently" match "modern form" headings; paragraphs with "initially", "first", or "originally" match "origins" headings. In Matching Headings, this structure often tricks test-takers into choosing a heading that matches a detail rather than the paragraph\'s main function. Always ask: "What is the primary TIME PHASE of this paragraph?"',
    exampleTopics: [
      'The history of cinema',
      'The development of aviation',
      'How medicine has evolved',
      'The rise of the internet',
      'The evolution of urban planning',
    ],
  },

  {
    id: 'comparison-contrast',
    name: 'Comparison / Contrast',
    tagline: 'Places two or more subjects side-by-side on multiple dimensions to reveal similarities and differences.',
    frequency: 'common',
    color: 'teal',
    signalPhrases: [
      '"While X…, Y…"',
      '"In contrast to X, Y…"',
      '"Both X and Y share…"',
      '"Unlike X, Y…"',
      '"The key distinction between X and Y lies in…"',
    ],
    slots: [
      {
        name: 'Introduction',
        description: 'Presents the two (or more) subjects and the reason for comparing them.',
        headingHint: '"X versus Y" · "Comparing X and Y" · "Two approaches to Z"',
      },
      {
        name: 'Dimension 1',
        description: 'Compares subjects on the first criterion (e.g., cost, speed, effectiveness).',
        headingHint: 'Uses the criterion as the heading noun: "The cost of X and Y" · "Speed: a comparison"',
      },
      {
        name: 'Dimension 2',
        description: 'Compares subjects on the second criterion.',
        headingHint: 'Same pattern — heading names the criterion, not the subject: "Accessibility" · "Environmental impact"',
      },
      {
        name: 'Dimension 3',
        description: 'Compares subjects on the third criterion.',
        headingHint: '"Social implications" · "Long-term sustainability" · "Cultural differences"',
      },
      {
        name: 'Synthesis / Verdict',
        description: 'Draws an overall conclusion — which is better, more effective, or more suited.',
        headingHint: '"Which is better?" · "The clear winner" · "A balanced assessment" · "Making a choice"',
      },
    ],
    headingsStrategy:
      'In Comparison articles, most headings will name an abstract criterion rather than one of the subjects. If you see headings like "Cost", "Reliability", "Cultural impact", these map to the Dimension slots. The Introduction and Verdict paragraphs are easiest — one is at the start (general context) and one at the end (judgment). Lock these first, then distribute criterion-based headings to middle paragraphs by matching the paragraph\'s topic.',
    exampleTopics: [
      'Traditional vs online education',
      'Eastern and Western approaches to medicine',
      'Nuclear vs renewable energy',
      'Urban vs rural living',
      'Individual vs collective responsibility for the environment',
    ],
  },

  {
    id: 'argument-rebuttal',
    name: 'Argument → Counter-argument → Rebuttal',
    tagline: 'Presents a position, acknowledges the opposing view, then systematically defends the original stance.',
    frequency: 'common',
    color: 'amber',
    signalPhrases: [
      '"It is often argued that…"',
      '"Proponents of X claim…"',
      '"Critics, however, contend…"',
      '"Despite these objections…"',
      '"Nevertheless, the evidence suggests…"',
    ],
    slots: [
      {
        name: 'Introduction / Thesis',
        description: 'States the topic and clearly signals the author\'s position.',
        headingHint: '"The case for X" · "In defence of X" · "Why X matters" · "A strong argument for X"',
      },
      {
        name: 'Main Argument(s)',
        description: 'Presents the author\'s core claims with supporting evidence.',
        headingHint: '"The evidence for X" · "Why X works" · "Supporting X" · "The benefits of X"',
      },
      {
        name: 'Acknowledgement',
        description: 'Fairly recognises the strongest opposing viewpoints.',
        headingHint: '"The opposing view" · "Critics of X" · "Arguments against X" · "Challenges to X"',
      },
      {
        name: 'Rebuttal',
        description: 'Dismantles the counter-argument with logic, evidence, or qualification.',
        headingHint: '"Why these objections fail" · "Addressing the criticism" · "The flaws in the opposing argument"',
      },
      {
        name: 'Conclusion',
        description: 'Restates and reinforces the original position in light of the full debate.',
        headingHint: '"The final verdict" · "A justified conclusion" · "X remains the best option"',
      },
    ],
    headingsStrategy:
      'This structure\'s Matching Headings trap is the Acknowledgement paragraph — it sounds like the author supports the opposite view, but the heading should reflect "the opposing view" or "criticism", not the author\'s stance. Look for hedging language ("it is claimed", "some argue") to identify this slot. Rebuttal paragraphs always follow immediately after — look for "however", "nevertheless", "despite this" in the opening line.',
    exampleTopics: [
      'The benefits of space exploration',
      'Should zoos be abolished?',
      'Genetically modified foods: safe or dangerous?',
      'The role of technology in education',
      'Is economic growth compatible with environmental protection?',
    ],
  },

  {
    id: 'classificatory',
    name: 'General → Specific (Classificatory)',
    tagline: 'Moves from a broad overview into distinct categories, types, or examples, each examined in detail.',
    frequency: 'occasional',
    color: 'green',
    signalPhrases: [
      '"There are several types of X…"',
      '"X can be classified into…"',
      '"Among the most notable forms of X…"',
      '"This category includes…"',
      '"A further example is…"',
    ],
    slots: [
      {
        name: 'Overview',
        description: 'Introduces the broad topic and signals that categories/types will follow.',
        headingHint: '"An introduction to X" · "X: an overview" · "The many forms of X" · "Defining X"',
      },
      {
        name: 'Category / Type 1',
        description: 'Describes the first subdivision in depth with examples.',
        headingHint: 'Usually names the category: "The [adjective] type" · "Category A: X" · "The most common form"',
      },
      {
        name: 'Category / Type 2',
        description: 'Describes the second subdivision in depth with examples.',
        headingHint: '"A less common but important variant" · "The second type" · "Category B"',
      },
      {
        name: 'Category / Type 3',
        description: 'Describes a third or further subdivision.',
        headingHint: '"Yet another form" · "A specialised category" · "The rarest type"',
      },
      {
        name: 'Comparative Significance',
        description: 'Reflects on which categories matter most and why, or how they relate.',
        headingHint: '"Which type is most important?" · "Comparing the categories" · "The most significant form"',
      },
    ],
    headingsStrategy:
      'Classificatory articles are straightforward for Matching Headings once you identify the structure. The Overview paragraph is easy — its heading will be the most general. Each subsequent heading will name a specific type or category. The trap is confusing a "type" heading with the "significance" heading — always check whether the paragraph is describing one category in isolation or comparing multiple categories. Comparison language ("most", "greater", "unlike the others") signals the Significance slot.',
    exampleTopics: [
      'Types of renewable energy',
      'Forms of animal communication',
      'The classification of rocks',
      'Categories of memory',
      'Varieties of market economy',
    ],
  },
]
