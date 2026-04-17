export type WritingGuide = {
  id: string
  name: string
  description: string
  answerFormat: string
  steps: string[]
  strategies: string[]
  mistakes: string[]
}

export type WritingTaskGuides = {
  task: 'Task 1' | 'Task 2'
  taskDescription: string
  guides: WritingGuide[]
}

export const WRITING_TASK1_GUIDES: WritingGuide[] = [
  {
    id: 'bar-line',
    name: 'Bar Chart / Line Graph',
    description:
      'A bar chart or line graph shows data over time or across categories. For a line graph, you describe trends (rise, fall, fluctuate, peak, level off). For a bar chart, you compare values across categories and may also describe changes over time if multiple time points are shown.',
    answerFormat: 'At least 150 words. One report — no personal opinion, no conclusion beyond a summary of the main trend.',
    steps: [
      'Study the title, axis labels, legend, and units carefully before writing anything. Misreading the unit (e.g. "millions" vs "thousands") or axis is the most common factual error.',
      'Write an introduction that paraphrases the title of the chart — do not copy it word for word. State what the chart shows and the time period if given.',
      'Write an overview (2–3 sentences) identifying the most significant trend or comparison — the single most important thing a reader should notice. This is the most important paragraph for the examiner.',
      'Organise your body paragraphs by grouping data logically: by trend (rising vs. falling items), by time period (early vs. later), or by category. Do not describe every data point in sequence — select and group.',
      'Support your groupings with specific figures from the chart. Round numbers are acceptable (e.g. "approximately 30%" rather than "29.8%").',
    ],
    strategies: [
      'The overview is the single most important paragraph. Examiners check for it immediately — a missing overview is the most common reason Band 6 becomes Band 5.',
      'Use a range of trend vocabulary: rise → increase, grow, climb, surge; fall → decrease, decline, drop, plummet; remain stable → level off, plateau, stay constant.',
      'For line graphs, describe the overall pattern first (upward trend, downward trend, fluctuating) before mentioning specific values.',
      'Avoid listing every data point. Select significant values (highest, lowest, turning points, crossovers) to support your groupings.',
    ],
    mistakes: [
      'Copying the chart title as the introduction — paraphrase it.',
      'Omitting the overview — this is penalised heavily under Task Achievement.',
      'Including personal opinion or recommendations — Task 1 is a factual report, not an essay.',
      'Failing to group data — describing bars or lines one by one in order looks mechanical and scores low for Coherence.',
    ],
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    description:
      'A pie chart shows proportions of a whole. You describe which category is largest, which is smallest, which are similar in size, and any notable patterns. If two pie charts at different time points are given, you must compare them to describe change.',
    answerFormat: 'At least 150 words. Report — no personal opinion.',
    steps: [
      'Read the title and check whether there is one chart or two (e.g. two years, two countries). Two charts require comparison; one chart requires description.',
      'Write a paraphrased introduction stating what the pie chart(s) show.',
      'Write an overview identifying the dominant category (the largest slice) and any notable secondary pattern (e.g. two categories together account for over half).',
      'In the body, group related categories. Compare the largest and smallest. For two charts, select the categories that changed most significantly and describe the direction and approximate size of change.',
      'Use percentage language accurately: "accounted for", "represented", "made up", "constituted". Avoid saying "had" or "was" repeatedly.',
    ],
    strategies: [
      'For a single pie chart: group similar-sized segments and contrast large vs. small.',
      'For two pie charts: lead with what changed the most; note what stayed roughly the same; always compare, do not just describe each chart separately.',
      'Approximate figures are acceptable: "roughly a third", "just over a quarter", "nearly half".',
      'Avoid using "increased" or "decreased" for a single pie chart — these terms imply change over time. Use "was higher/lower than".',
    ],
    mistakes: [
      'Treating two separate pie charts as two independent descriptions rather than a comparison.',
      'Using change language ("increased", "fell") when describing a single static pie chart.',
      'Listing all segments with their percentages without any grouping or observation — this is data transfer, not a report.',
      'Failing to write an overview — same penalty as other Task 1 types.',
    ],
  },
  {
    id: 'table',
    name: 'Table',
    description:
      'A table presents data in rows and columns. Unlike a chart, all values are already exact — your task is to select and compare, not to read values from a visual. Tables often contain more data than any other Task 1 type, so selection is critical.',
    answerFormat: 'At least 150 words. Report — no opinion, no recommendations.',
    steps: [
      'Read all row and column headers carefully. Understand what each row and column represents before selecting data.',
      'Write a paraphrased introduction describing what the table shows (countries, categories, time periods).',
      'Write an overview identifying the most striking overall pattern: which row or column has the highest/lowest values overall, or what the most significant trend across the table is.',
      'In the body, select data to illustrate your overview — the highest and lowest values, the most extreme differences, any notable exceptions. Do not transcribe every cell.',
      'Group by row or column depending on what reveals the most meaningful comparison.',
    ],
    strategies: [
      'Selection is the key skill for tables — choose data that supports a meaningful comparison, not a data dump.',
      'Use comparative and superlative language: "the highest proportion", "significantly more than", "by contrast", "whereas".',
      'Check units carefully — tables often mix different units (e.g. percentages in one column, absolute numbers in another).',
    ],
    mistakes: [
      'Attempting to describe every value in the table — this is always penalised for coherence.',
      'Reporting data accurately but without any comparative language or grouping.',
      'Ignoring the overview — same penalty as other Task 1 types.',
    ],
  },
  {
    id: 'process',
    name: 'Process Diagram',
    description:
      'A process diagram shows a sequence of stages — either a manufacturing process, a natural cycle, or a technical procedure. You describe how something is made or how a cycle operates, step by step. There are no data points or trends — you describe stages and transformations.',
    answerFormat: 'At least 150 words. Factual description of the process — no data, no opinion.',
    steps: [
      'Study the diagram: count the stages, identify the start and end point, note whether it is a linear process or a cycle.',
      'Write a paraphrased introduction stating what the process shows and approximately how many stages it involves.',
      'Write an overview identifying the nature of the process: "The process consists of X stages, beginning with… and ending with…". For a cycle, note that it is cyclical.',
      'Describe each stage in sequence using passive voice where appropriate: "The material is then heated", "Water is collected", "The product is packaged".',
      'Use sequencing language to link stages: "First", "Next", "After this", "Once X has occurred", "Finally", "The process then returns to".',
    ],
    strategies: [
      'Use the passive voice for manufacturing and industrial processes — this is the expected register.',
      'Follow the arrows exactly. Do not describe stages in a different order from the diagram.',
      'For a natural cycle (e.g. water cycle, life cycle of an insect), note how the final stage connects back to the beginning.',
      'Include all stages — unlike data charts, every stage in a process diagram should be mentioned.',
    ],
    mistakes: [
      'Using active voice throughout without variation — mix active and passive appropriately.',
      'Skipping stages because they seem less important — for process diagrams, completeness is required.',
      'Failing to use sequencing language — a list of disconnected statements reads poorly.',
      'Omitting the overview — state the overall nature and number of stages.',
    ],
  },
  {
    id: 'map',
    name: 'Map',
    description:
      'A map Task 1 shows either: (a) two maps of the same place at different times (you describe changes), or (b) a single map with a plan showing proposed development (you describe the current state and the proposed changes). You describe spatial layout and changes using directional and comparative language.',
    answerFormat: 'At least 150 words. Factual description — no opinion on whether changes are good or bad.',
    steps: [
      'Study both maps carefully before writing. Identify what has been added, removed, or relocated between the two time points.',
      'Write a paraphrased introduction stating what the maps show — the location and the time period(s).',
      'Write an overview identifying the most significant overall change: "The area underwent significant development", "The town changed considerably between X and Y".',
      'Organise body paragraphs by area of the map (north, south, central) or by type of change (new buildings, demolished buildings, road changes). Do not describe the two maps separately — compare them.',
      'Use specific directional language and prepositions of place: "in the north-east", "to the south of the river", "adjacent to", "between X and Y".',
    ],
    strategies: [
      'Use spatial language precisely: "where X used to be", "in place of the old X", "the former X has been replaced by", "a new X has been constructed".',
      'Avoid saying a building or feature "moved" — say it "was demolished" and "a new X was built in its place".',
      'Do not evaluate changes ("unfortunately the park was removed") — this is a factual report.',
      'For a single map with a proposal, use future language for the proposed elements: "a car park is planned", "the road will be widened".',
    ],
    mistakes: [
      'Describing each map in isolation instead of comparing changes.',
      'Saying a feature "moved" instead of describing demolition and new construction.',
      'Using opinion language ("improved", "unfortunately") — keep it factual.',
      'Failing to write an overview — state the overall scale and direction of change.',
    ],
  },
  {
    id: 'mixed',
    name: 'Multiple Charts (Mixed)',
    description:
      'Two or more different chart types are presented together (e.g. a bar chart and a pie chart, or a line graph and a table). You describe both and, where possible, identify connections or contrasts between them in your overview.',
    answerFormat: 'At least 150 words. One unified report — do not write separate reports for each chart.',
    steps: [
      'Study all charts and understand what each shows and how they relate to each other.',
      'Write a paraphrased introduction that covers both charts — what they each show.',
      'Write a unified overview that identifies the main finding from each chart and, if possible, states how they relate (e.g. "While the bar chart shows X overall, the pie chart reveals that Y category dominates").',
      'Organise body paragraphs so that you describe each chart with its key data, but reference connections between the charts where they exist.',
      'Allocate word count proportionally — do not spend 130 words on one chart and 20 on the other.',
    ],
    strategies: [
      'The overview must address both charts — a one-chart overview is penalised.',
      'Look for the connecting insight: what does Chart B tell you that explains or adds to Chart A?',
      'Use linking phrases: "This is further illustrated by…", "In contrast, the second chart shows…", "Taken together, these charts suggest…".',
    ],
    mistakes: [
      'Writing two completely separate Task 1 reports rather than integrating them.',
      'Spending most of the word count on the more familiar chart type.',
      'Missing the connection between the charts — examiners reward synthesis.',
    ],
  },
]

export const WRITING_TASK2_GUIDES: WritingGuide[] = [
  {
    id: 'opinion',
    name: 'Opinion Essay (Agree / Disagree)',
    description:
      'You are given a statement and asked: "To what extent do you agree or disagree?" You express a clear personal opinion and support it with two or three developed arguments. A partial agreement is possible but must be clearly argued.',
    answerFormat: 'At least 250 words. Introduction + 2 body paragraphs (minimum) + conclusion. Direct, clear opinion throughout.',
    steps: [
      'Read the statement and decide your position clearly: fully agree, fully disagree, or partially agree. A vague "on the one hand… on the other hand" answer without a clear position is penalised under Task Response.',
      'Write an introduction that paraphrases the topic and states your clear position in 1–2 sentences.',
      'Plan two or three body paragraphs, each with one main argument that supports your position. Use the PEEL structure: Point → Explain → Example → Link back.',
      'Write a conclusion that restates your position and summarises your main arguments — do not introduce new ideas.',
      'Check word count — 250 words is the minimum; aim for 260–280.',
    ],
    strategies: [
      'State your position in the introduction and repeat it consistently throughout — do not appear to change your mind mid-essay.',
      'Each body paragraph must have one clear main point. Multiple ideas in one paragraph is a coherence error.',
      'Use hedging language to sound academic: "It can be argued that", "This suggests that", "In many cases". But do not hedge your own stated opinion.',
      'A partial agreement is fully acceptable — "While I broadly agree, I believe X is an exception" — but both sides must be addressed, not just mentioned.',
    ],
    mistakes: [
      'Writing a discussion essay (both sides equally) when asked for your opinion — the examiner expects your personal view.',
      'Failing to state a clear position in the introduction.',
      'Changing your position between the introduction and conclusion.',
      'Body paragraphs with no clear single argument — two unrelated points in one paragraph confuse the examiner.',
    ],
  },
  {
    id: 'discussion',
    name: 'Discussion Essay (Both Views)',
    description:
      'The question asks you to "discuss both views" and give your own opinion. You present arguments for one side, arguments for the other side, and state your own position (usually in the introduction and conclusion).',
    answerFormat: 'At least 250 words. Introduction + body paragraph (View 1) + body paragraph (View 2) + conclusion with your opinion.',
    steps: [
      'Read the question carefully — confirm it asks to "discuss both views", not just to agree/disagree.',
      'In the introduction, paraphrase the topic and briefly mention that there are two perspectives. State your personal view here (optional — some prefer to state it only in the conclusion).',
      'Write one body paragraph presenting the strongest arguments for View 1. Explain and support them.',
      'Write one body paragraph presenting the strongest arguments for View 2. Explain and support them.',
      'Write a conclusion that restates both views briefly and clearly states your own opinion.',
    ],
    strategies: [
      'Balance the two views — do not spend 80% of your essay on one side. Roughly equal body paragraph lengths signal balanced discussion.',
      'Your personal view should be consistent. If you state it in the introduction, repeat the same view in the conclusion.',
      'Use discourse markers to signal perspective shifts: "On the one hand", "On the other hand", "Proponents of this view argue that", "Those who disagree contend that".',
      'Do not write a third body paragraph arguing your personal view separately — integrate your view into the conclusion.',
    ],
    mistakes: [
      'Presenting only one view despite the question asking for both.',
      'Omitting your personal opinion — the question asks for it.',
      'Starting the conclusion with "In conclusion, there are two sides to this issue" without stating which side you support — vague conclusions are penalised.',
      'Using "I think" or "I feel" repeatedly — use varied academic hedging language.',
    ],
  },
  {
    id: 'problem-solution',
    name: 'Problem / Cause + Solution Essay',
    description:
      'The question asks you to identify the causes of a problem and suggest solutions (or, in some variants, identify problems and suggest solutions). You must cover both parts — a one-sided response (only causes, only solutions) is heavily penalised.',
    answerFormat: 'At least 250 words. Introduction + body (causes/problems) + body (solutions) + conclusion.',
    steps: [
      'Confirm the question type — "causes and solutions", "problems and solutions", or "causes and effects".',
      'Write an introduction that paraphrases the problem and states that this essay will examine its causes and propose solutions.',
      'Write one body paragraph identifying two or three causes (or problems), each briefly explained.',
      'Write one body paragraph proposing corresponding solutions. Ideally, each solution should address one of the causes identified.',
      'Write a conclusion summarising the main cause(s) and solution(s).',
    ],
    strategies: [
      'Link causes to solutions — a solution that addresses a cause you identified is more persuasive than a generic suggestion.',
      'Causes and solutions should be realistic and specific — avoid vague statements like "the government should do more".',
      'Use causal language: "One major cause is…", "This leads to…", "As a result…"; and solution language: "One effective measure would be…", "Governments could address this by…".',
      'Do not forget both parts. If the question asks for causes AND solutions and you only write causes, you will lose marks even with perfect English.',
    ],
    mistakes: [
      'Answering only one part of the question (causes only, or solutions only).',
      'Proposing solutions that do not address any of the causes discussed.',
      'Being too vague: "people should be more responsible" — solutions must be specific and arguable.',
      'Using opinion essay structure — this is an analytical essay, not an agree/disagree question.',
    ],
  },
  {
    id: 'two-part',
    name: 'Two-Part Question Essay',
    description:
      'The task asks two distinct questions (e.g. "Why is this happening? Is this a positive or negative development?"). Both questions must be fully answered. Addressing only one question is the single most common Band 5–6 Task Response error.',
    answerFormat: 'At least 250 words. Introduction + body 1 (Q1) + body 2 (Q2) + conclusion.',
    steps: [
      'Read the question carefully and underline both questions. They are distinct and both require a substantive answer.',
      'Write an introduction that paraphrases the topic and states that both questions will be addressed.',
      'Write one body paragraph per question. Each paragraph should have its own clear main argument and supporting points.',
      'Write a conclusion that briefly summarises your answer to each question.',
      'Before submitting, re-read the question and confirm both questions have been answered with approximately equal depth.',
    ],
    strategies: [
      'Treat the two questions as separate essay tasks within the same response. The word count should be roughly split between them.',
      'The second question is often an opinion ("Is this positive or negative?", "Do you think this is justified?") — answer it directly with your view.',
      'Do not merge the two questions into one body paragraph — keep them in separate paragraphs for clarity.',
    ],
    mistakes: [
      'Answering only the first question at length and addressing the second in one or two sentences.',
      'Merging the answers — the examiner cannot clearly see where Q1 ends and Q2 begins.',
      'Giving a vague answer to the opinion-type question ("This has both advantages and disadvantages") without committing to a view.',
    ],
  },
]
